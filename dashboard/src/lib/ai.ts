import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-2.0-flash-lite";

/**
 * Structured response Gemini returns on every WhatsApp turn.
 * Single call gives us the customer-facing reply AND the structured lead data.
 */
export const AssistantReplySchema = z.object({
  reply: z.string(),
  // Gemini returns null for fields it doesn't have values for (since responseSchema
  // marks them nullable). Use .nullish() so null AND missing both validate.
  extracted_data: z.object({
    budget: z.string().nullish(),
    area: z.string().nullish(),
    bedrooms: z.number().int().nullish(),
    purpose: z.enum(["buy", "rent"]).nullish(),
    timeline: z.string().nullish(),
    product: z.string().nullish(),
    variant: z.string().nullish(),
    quantity: z.number().int().nullish(),
    address: z.string().nullish(),
    service: z.string().nullish(),
    preferred_date: z.string().nullish(),
    name: z.string().nullish(),
    city: z.string().nullish(),
  }),
  lead_status: z.enum(["new", "qualifying", "warm", "hot", "cold"]),
  hot_score: z.number().int().min(0).max(100),
  handoff_to_human: z.boolean(),
});

export type AssistantReply = z.infer<typeof AssistantReplySchema>;

/**
 * Gemini's expected JSON schema (OpenAPI 3 subset, not full JSON Schema).
 * Mirrors AssistantReplySchema above.
 */
const GEMINI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description:
        "The WhatsApp message to send to the customer. Natural conversational text in the same language the customer used. Keep it short — 1–3 sentences for most replies.",
    },
    extracted_data: {
      type: Type.OBJECT,
      description:
        "Information explicitly mentioned by the customer. Omit fields with no real value — never invent.",
      properties: {
        budget: { type: Type.STRING, nullable: true },
        area: { type: Type.STRING, nullable: true },
        bedrooms: { type: Type.INTEGER, nullable: true },
        purpose: { type: Type.STRING, enum: ["buy", "rent"], nullable: true },
        timeline: { type: Type.STRING, nullable: true },
        product: { type: Type.STRING, nullable: true },
        variant: { type: Type.STRING, nullable: true },
        quantity: { type: Type.INTEGER, nullable: true },
        address: { type: Type.STRING, nullable: true },
        service: { type: Type.STRING, nullable: true },
        preferred_date: { type: Type.STRING, nullable: true },
        name: { type: Type.STRING, nullable: true },
        city: { type: Type.STRING, nullable: true },
      },
    },
    lead_status: {
      type: Type.STRING,
      enum: ["new", "qualifying", "warm", "hot", "cold"],
      description:
        "Current qualification stage. 'hot' = ready to act this week.",
    },
    hot_score: {
      type: Type.INTEGER,
      description:
        "0–100 score of qualification + urgency. Budget revealed +20, timeline +20, specific requirements +10, ready-to-act signals +30.",
    },
    handoff_to_human: {
      type: Type.BOOLEAN,
      description:
        "True if the conversation needs the human owner's attention.",
    },
  },
  required: [
    "reply",
    "extracted_data",
    "lead_status",
    "hot_score",
    "handoff_to_human",
  ],
};

const industryLabel: Record<string, string> = {
  real_estate: "real estate brokerage",
  ecommerce: "online store",
  healthcare: "healthcare clinic",
};

const baseInstructions = `\
You are a real human sales/support representative for this business. Act like one — friendly, knowledgeable, and genuinely trying to help close the deal yourself. NEVER refer to yourself as an AI, bot, or assistant. NEVER tell the customer you are connecting them to "an agent", "our team", or "a representative" unless one of the strict handoff conditions below is met.

Your role:
- Qualify the lead through conversation, like a salesperson would on WhatsApp.
- Share matching options from the inventory proactively.
- Build rapport, answer questions, and move the customer toward a clear next step.
- Only escalate to a human owner when the conversation genuinely requires it (see strict list below).

Greeting behavior (IMPORTANT):
- If the customer's message is JUST a greeting with no specific intent — e.g. "hi", "hello", "salaam", "assalam-o-alaikum", "hey", "kya haal hai", "kaise ho", "good morning", "yo" — respond with a warm greeting + introduce yourself briefly + ask an OPEN question like "Main aap ki kaise help kar sakta/sakti hoon?" or "How can I help you today?".
- DO NOT jump into industry-specific qualifying questions (budget, area, symptoms, products) on a pure greeting. Let the customer reveal their intent first.
- Industry-specific questions (e.g. "buy or rent?", "which product?", "what symptom?") are only asked AFTER the customer expresses they're looking for something.

When replying:
- ALWAYS check the "Available inventory" section first. If the customer's question can be answered from it (prices, availability, sizes, locations, packages, etc.), answer directly — quote the exact details from the inventory.
- When a customer states requirements (budget + area, product + size, service + date), immediately suggest 1–3 specific matching items from inventory. Don't ask more clarifying questions until they've seen options.
- If something is not in the inventory, say so honestly. Don't invent facts, prices, sizes, or availability that aren't listed.
- Keep replies short — 1 to 3 sentences for most messages. Conversational, not formal.
- Reply in the SAME language the customer uses. Detect from their message: English, Urdu, Roman Urdu, or mixed.
- Use the customer's name if known.
- Ask one qualifying question at a time. Don't interrogate. Don't list 5 follow-up questions.
- Sound like a real person on WhatsApp — short sentences, occasional emojis if tone allows, no formal "Dear Customer" openings.

What a good salesperson does (mimic this):
1. Customer states need → you confirm understanding + show 1–2 matching options from inventory + ask ONE follow-up that narrows down ("which phase do you prefer?", "what's your timeline?").
2. Customer asks follow-up → you answer from inventory, then keep nudging toward decision ("want me to send more details?", "would you like to see this in person?").
3. Customer signals readiness ("haan I'm interested", "send me address", "kab dekh sakte hain") → THEN you can hand off for logistics.

When updating extracted_data:
- Only include fields the customer has explicitly mentioned (in this turn or earlier).
- Never guess.

When scoring (hot_score 0–100):
- 0–25: just-browsing, no concrete needs given
- 26–50: some requirements given, exploring options
- 51–75: clear requirements + budget OR timeline
- 76–100: ready to buy/visit/book this week, urgency signals

Set handoff_to_human=true ONLY when ALL of these are true:
- The customer has explicitly asked to speak to a human, OR is ready to schedule a confirmed in-person visit/call/appointment that needs human logistics coordination, OR is ready to pay/sign/close a deal.
- AND you have already exchanged at least 2-3 turns trying to help yourself.

NEVER hand off on the first message just because a customer stated their requirements. Stating requirements = you should respond with matching inventory options and a qualifying follow-up. That is your JOB.

Examples of when NOT to hand off (handle yourself):
- "I want a 3-bed apartment in DHA, budget 80 lakh" → Show 2 matching properties from inventory + ask which phase they prefer.
- "Do you have black hoodie size M?" → Check inventory, confirm stock + price + ask if they want to order.
- "Saturday ko appointment chahiye" → Check available slots from inventory + offer specific times.
- "Tell me about your services" → Briefly describe top 2-3 from inventory.

Examples of when TO hand off (after handling yourself first):
- Customer says: "okay I want to visit Phase 6 property tomorrow at 4 PM" → handoff for logistics.
- Customer says: "I'll take it, how do I pay?" → handoff for closing.
- Customer says: "I want to speak to the owner directly" → handoff immediately.
- Customer has a complaint about a past transaction → handoff.
`;

export type InventoryItemForPrompt = {
  name: string;
  external_id?: string | null;
  category?: string | null;
  price?: number | null;
  status?: string | null;
  description?: string | null;
  data?: Record<string, unknown> | null;
};

/**
 * Format inventory items as a compact markdown block for the system prompt.
 * Skips empty fields. Cap items to keep token usage reasonable.
 */
export function formatInventory(
  items: InventoryItemForPrompt[],
  currency = "USD",
  max = 60,
): string {
  if (items.length === 0) return "";

  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  const lines: string[] = ["## Available inventory", ""];

  for (const it of visible) {
    const head: string[] = [`- **${it.name}**`];
    if (it.external_id) head.push(`(${it.external_id})`);
    if (it.price != null) {
      head.push(`— ${formatCurrency(it.price, currency)}`);
    }
    if (it.category) head.push(`· ${it.category}`);
    if (it.status) head.push(`· ${it.status}`);
    lines.push(head.join(" "));

    if (it.description) {
      lines.push(`  ${it.description}`);
    }

    if (it.data && typeof it.data === "object") {
      const extras: string[] = [];
      for (const [k, v] of Object.entries(it.data)) {
        if (v === null || v === undefined || v === "") continue;
        extras.push(`${k}: ${v}`);
      }
      if (extras.length > 0) {
        lines.push(`  ${extras.join(" | ")}`);
      }
    }
    lines.push("");
  }

  if (overflow > 0) {
    lines.push(
      `_…and ${overflow} more items not shown. Ask the customer to narrow down by category or filter if they want options beyond the above._`,
    );
  }

  return lines.join("\n");
}

export type BuildPromptArgs = {
  businessName: string;
  industry: "real_estate" | "ecommerce" | "healthcare";
  industrySystemPrompt: string;
  aiPersonaName: string;
  aiTone: "formal" | "friendly" | "casual";
  language: "english" | "urdu" | "roman_urdu" | "mixed";
  currency?: string;
  timezone?: string;
  customSystemPrompt?: string | null;
  customerName?: string | null;
  customerCity?: string | null;
  inventory?: InventoryItemForPrompt[];

  // Business identity (optional but used for richer context)
  businessDescription?: string | null;
  businessWebsite?: string | null;

  // AI response style
  greetingMessage?: string | null;
  responseLength?: "short" | "medium" | "long" | string;
  useEmojis?: boolean;
};

export function buildSystemPrompt(args: BuildPromptArgs): string {
  const customerLine =
    args.customerName || args.customerCity
      ? `\nCustomer details so far: ${[args.customerName, args.customerCity]
          .filter(Boolean)
          .join(", ")}.`
      : "";

  const inventoryBlock =
    args.inventory && args.inventory.length > 0
      ? formatInventory(args.inventory, args.currency ?? "USD")
      : "_No inventory items have been added yet. If the customer asks about specific products/properties/services, set handoff_to_human=true._";

  // Business identity context (optional)
  const businessContext: string[] = [];
  if (args.businessDescription?.trim()) {
    businessContext.push(`About the business: ${args.businessDescription.trim()}`);
  }
  if (args.businessWebsite?.trim()) {
    businessContext.push(`Website: ${args.businessWebsite.trim()}`);
  }

  // Custom greeting override
  const greetingLine = args.greetingMessage?.trim()
    ? `When the customer's first message is a greeting, use this exact opening: "${args.greetingMessage.trim()}"`
    : "";

  // Response-style hints
  const lengthHint =
    args.responseLength === "short"
      ? "Keep replies EXTREMELY short — 1 sentence maximum. Be terse and direct."
      : args.responseLength === "long"
        ? "Replies can be detailed when needed — 3-5 sentences with helpful context."
        : "Keep replies short — 1 to 3 sentences for most messages.";

  const emojiHint = args.useEmojis
    ? "Use emojis naturally where appropriate (1-2 per message max, e.g. 👍 ✅ 🏠 etc.). Don't overdo it."
    : "Do NOT use emojis in replies. Keep tone professional and text-only.";

  const styleBlock = `Response style:\n- ${lengthHint}\n- ${emojiHint}`;

  return [
    `You are ${args.aiPersonaName}, a ${args.aiTone} sales assistant for ${args.businessName}, a ${industryLabel[args.industry] ?? args.industry} business.`,
    "",
    businessContext.join("\n"),
    "",
    args.customSystemPrompt?.trim() || args.industrySystemPrompt,
    "",
    `Default language preference: ${args.language}.`,
    customerLine,
    "",
    inventoryBlock,
    "",
    styleBlock,
    "",
    greetingLine,
    "",
    baseInstructions,
  ]
    .filter((s) => s.trim() !== "" || s === "")
    .join("\n");
}

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Returns true for transient errors worth retrying — overload, rate limit, or
 * transient network/server failures. Permanent errors (bad API key, invalid
 * schema, etc.) should NOT retry.
 */
function isRetryableGeminiError(e: unknown): boolean {
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
  return (
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded") ||
    msg.includes("high demand") ||
    msg.includes("500") ||
    msg.includes("internal") ||
    msg.includes("deadline") ||
    msg.includes("timeout") ||
    msg.includes("429")
  );
}

/**
 * Call Gemini's generateContent with retries on transient overload errors.
 * Tries the primary model with exponential backoff, then falls back to a
 * secondary model (gemini-2.0-flash-lite by default) for the final attempt.
 */
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  baseParams: {
    contents: unknown;
    config: unknown;
  },
): Promise<Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>> {
  const attempts: Array<{ model: string; delayMs: number }> = [
    { model: PRIMARY_MODEL, delayMs: 0 },
    { model: PRIMARY_MODEL, delayMs: 1500 },
    { model: PRIMARY_MODEL, delayMs: 3500 },
    { model: FALLBACK_MODEL, delayMs: 500 },
  ];

  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    const { model, delayMs } = attempts[i];
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    try {
      return await ai.models.generateContent({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(baseParams as any),
        model,
      });
    } catch (e) {
      lastError = e;
      if (!isRetryableGeminiError(e)) throw e;
      console.warn(
        `[ai] Gemini ${model} attempt ${i + 1}/${attempts.length} failed:`,
        e instanceof Error ? e.message : e,
      );
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError));
}

/**
 * Call Gemini with structured JSON output.
 * Returns the parsed reply + extracted data + scoring.
 */
export async function generateReply(args: {
  systemPrompt: string;
  history: ConversationTurn[];
  newMessage: string;
}): Promise<AssistantReply> {
  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey and add it to .env.local",
    );
  }

  // Gemini uses "user" and "model" roles (not "assistant")
  const contents = [
    ...args.history.map((t) => ({
      role: t.role === "assistant" ? "model" : "user",
      parts: [{ text: t.content }],
    })),
    { role: "user", parts: [{ text: args.newMessage }] },
  ];

  const response = await callGeminiWithRetry(ai, {
    contents,
    config: {
      systemInstruction: args.systemPrompt,
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error(
      `Gemini returned empty response. finishReason=${response.candidates?.[0]?.finishReason ?? "unknown"}`,
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Gemini returned invalid JSON: ${e instanceof Error ? e.message : e}. Raw: ${text.slice(0, 200)}`,
    );
  }

  const result = AssistantReplySchema.safeParse(parsedJson);
  if (!result.success) {
    throw new Error(
      `Gemini response failed schema validation: ${result.error.message}`,
    );
  }
  return result.data;
}
