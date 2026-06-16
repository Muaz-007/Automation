import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  buildSystemPrompt,
  generateReply,
  type ConversationTurn,
} from "@/lib/ai";
import { fireN8nEvent, type N8nEventType } from "@/lib/n8n";

const HISTORY_LIMIT = 20;

/**
 * Compute a new lead status using both the AI's suggestion and rule-based heuristics.
 * Never demotes a 'won' lead.
 */
function reconcileStatus(
  current: string | undefined,
  aiStatus: "new" | "qualifying" | "warm" | "hot" | "cold",
  hotScore: number,
  hotThreshold: number,
): "new" | "qualifying" | "warm" | "hot" | "cold" | "won" | "lost" {
  if (current === "won" || current === "lost") {
    return current as "won" | "lost";
  }
  // The tenant-configured hot threshold overrides the AI's status guess —
  // any score >= threshold is hot, regardless of what the AI labeled it.
  if (hotScore >= hotThreshold) return "hot";
  return aiStatus;
}

type ProcessArgs = {
  tenantId: string;
  customerPhone: string;
  customerName?: string;
  inboundText: string;
};

type ProcessResult =
  | { ok: true; reply: string; leadId: string; customerId: string }
  | { ok: false; error: string };

/**
 * The brain of the WhatsApp pipeline.
 * 1. Find or create the customer for this tenant
 * 2. Append the inbound message to conversation history
 * 3. Build the cached system prompt
 * 4. Call Gemini with last N messages
 * 5. Save the AI reply
 * 6. Upsert the lead with extracted data + score
 * 7. Return the reply text (caller is responsible for sending it via WhatsApp)
 */
export async function processInboundMessage(
  args: ProcessArgs,
): Promise<ProcessResult> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: args.tenantId },
  });
  if (!tenant) {
    return { ok: false, error: `Tenant ${args.tenantId} not found` };
  }

  const template = await prisma.industryTemplate.findUnique({
    where: { industry: tenant.industry },
  });
  if (!template) {
    return {
      ok: false,
      error: `No industry template for ${tenant.industry}`,
    };
  }

  // 1. Find or create the customer
  const customer = await prisma.customer.upsert({
    where: {
      tenant_id_phone: { tenant_id: tenant.id, phone: args.customerPhone },
    },
    create: {
      tenant_id: tenant.id,
      phone: args.customerPhone,
      name: args.customerName ?? null,
    },
    update:
      args.customerName && !args.customerName.startsWith("+")
        ? { name: args.customerName }
        : {},
  });

  // 2. Save the inbound message
  await prisma.conversation.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customer.id,
      role: "user",
      message: args.inboundText,
    },
  });

  // 3. Fetch inventory items so the AI can answer from real data
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { tenant_id: tenant.id },
    orderBy: { created_at: "desc" },
    take: 80,
    select: {
      name: true,
      external_id: true,
      category: true,
      price: true,
      status: true,
      description: true,
      data: true,
    },
  });

  // 4. Build the prompt + load history
  const systemPrompt = buildSystemPrompt({
    businessName: tenant.business_name,
    industry: tenant.industry,
    industrySystemPrompt: template.system_prompt,
    aiPersonaName: tenant.ai_persona_name ?? "Assistant",
    aiTone: tenant.ai_tone,
    language: tenant.language,
    currency: tenant.currency,
    timezone: tenant.timezone,
    customSystemPrompt: tenant.system_prompt,
    customerName: customer.name,
    customerCity: customer.city,
    businessDescription: tenant.business_description,
    businessWebsite: tenant.business_website,
    greetingMessage: tenant.greeting_message,
    responseLength: tenant.response_length,
    useEmojis: tenant.use_emojis,
    inventory: inventoryItems.map((i) => ({
      ...i,
      data:
        i.data && typeof i.data === "object" && !Array.isArray(i.data)
          ? (i.data as Record<string, unknown>)
          : null,
    })),
  });

  const recent = await prisma.conversation.findMany({
    where: { tenant_id: tenant.id, customer_id: customer.id },
    orderBy: { created_at: "desc" },
    take: HISTORY_LIMIT + 1, // +1 because the just-saved inbound is in this list
  });

  // Exclude the just-saved inbound from history (it becomes "new message")
  // and reverse to chronological order
  const inboundId = recent[0]?.id;
  const history: ConversationTurn[] = recent
    .filter((m) => m.id !== inboundId)
    .reverse()
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.message,
    }));

  // 4. Call Gemini
  let result;
  try {
    result = await generateReply({
      systemPrompt,
      history,
      newMessage: args.inboundText,
    });
  } catch (e) {
    console.error("[ai] Gemini call failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // 5. Save the AI reply
  await prisma.conversation.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customer.id,
      role: "assistant",
      message: result.reply,
      metadata: {
        lead_status: result.lead_status,
        hot_score: result.hot_score,
        handoff_to_human: result.handoff_to_human,
      },
    },
  });

  // 6. Upsert lead + merge extracted data
  const existing = await prisma.lead.findFirst({
    where: { tenant_id: tenant.id, customer_id: customer.id },
    orderBy: { created_at: "desc" },
  });

  const merged: Prisma.InputJsonValue = {
    ...((existing?.extracted_data as Record<string, unknown> | null) ?? {}),
    ...Object.fromEntries(
      Object.entries(result.extracted_data).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  } as Prisma.InputJsonValue;

  const status = reconcileStatus(
    existing?.status,
    result.lead_status,
    Math.max(existing?.hot_score ?? 0, result.hot_score),
    tenant.hot_lead_threshold,
  );
  const now = new Date();

  let lead;
  if (existing) {
    lead = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        status,
        hot_score: Math.max(existing.hot_score, result.hot_score),
        extracted_data: merged,
        last_message_at: now,
      },
    });
  } else {
    lead = await prisma.lead.create({
      data: {
        tenant_id: tenant.id,
        customer_id: customer.id,
        status,
        hot_score: result.hot_score,
        source: "WhatsApp",
        extracted_data: merged,
        last_message_at: now,
      },
    });
  }

  // Update the customer name if AI extracted it
  if (result.extracted_data.name && !customer.name) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { name: result.extracted_data.name },
    });
  }
  if (result.extracted_data.city && !customer.city) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { city: result.extracted_data.city },
    });
  }

  // 7. Fire events to n8n (best-effort, never blocks reply on failure)
  const baseEvent = {
    tenant_id: tenant.id,
    lead_id: lead.id,
    customer_id: customer.id,
    customer: {
      phone: customer.phone,
      name: customer.name,
      city: customer.city,
    },
    lead: {
      status: lead.status,
      hot_score: lead.hot_score,
      source: lead.source,
      extracted_data: merged as Record<string, unknown>,
    },
  };

  // Only fire events the tenant has opted into. Code is the source of truth —
  // the n8n filter node is now redundant for these but harmless.
  const eventsToFire: N8nEventType[] = [];
  if (!existing && tenant.notify_on_created) {
    eventsToFire.push("lead.created");
  }
  if (
    existing?.status !== "hot" &&
    status === "hot" &&
    tenant.notify_on_hot
  ) {
    eventsToFire.push("lead.hot");
  }
  if (
    existing?.status !== "won" &&
    status === "won" &&
    tenant.notify_on_won
  ) {
    eventsToFire.push("lead.won");
  }
  if (result.handoff_to_human && tenant.notify_on_handoff) {
    eventsToFire.push("lead.handoff");
  }

  await Promise.all(
    eventsToFire.map((type) =>
      fireN8nEvent({
        ...baseEvent,
        type,
        last_message: args.inboundText,
        handoff_reason: result.handoff_to_human
          ? "AI marked handoff_to_human=true"
          : undefined,
      }),
    ),
  );

  return {
    ok: true,
    reply: result.reply,
    leadId: lead.id,
    customerId: customer.id,
  };
}
