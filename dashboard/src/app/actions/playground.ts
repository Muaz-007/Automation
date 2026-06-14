"use server";

import { requireTenant } from "@/lib/dal";
import { processInboundMessage } from "@/lib/ai/process-message";
import { revalidatePath } from "next/cache";

export type PlaygroundResponse =
  | { ok: true; reply: string; leadId: string; customerId: string }
  | { ok: false; error: string };

/**
 * Test the AI pipeline without sending anything over WhatsApp.
 * Uses a fake test customer phone for the current tenant so playground messages
 * are isolated from real WhatsApp conversations.
 */
export async function sendPlaygroundMessage(
  message: string,
  testPhone: string,
): Promise<PlaygroundResponse> {
  const tu = await requireTenant();

  if (!message.trim()) return { ok: false, error: "Message is empty." };

  const result = await processInboundMessage({
    tenantId: tu.tenant_id,
    customerPhone: testPhone,
    customerName: "Playground Tester",
    inboundText: message.trim(),
  });

  revalidatePath("/leads", "page");
  revalidatePath("/conversations", "page");
  return result;
}

export async function resetPlaygroundConversation(testPhone: string) {
  const tu = await requireTenant();
  const { prisma } = await import("@/lib/prisma");

  const customer = await prisma.customer.findUnique({
    where: {
      tenant_id_phone: { tenant_id: tu.tenant_id, phone: testPhone },
    },
  });
  if (!customer) return;

  await prisma.conversation.deleteMany({
    where: { tenant_id: tu.tenant_id, customer_id: customer.id },
  });
  await prisma.lead.deleteMany({
    where: { tenant_id: tu.tenant_id, customer_id: customer.id },
  });
  await prisma.customer.delete({ where: { id: customer.id } });

  revalidatePath("/playground", "page");
  revalidatePath("/leads", "page");
}
