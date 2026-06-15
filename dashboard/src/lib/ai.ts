import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

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
Your job is to handle MOST customer questions independently using the inventory and business context above. Only ask for human help when truly necessary.

When replying:
- ALWAYS check the "Available inventory" section first. If the customer's question can be answered from it (prices, availability, sizes, locations, packages, etc.), answer directly — quote the exact details from the inventory.
- If something is not in the inventory, say so honestly. Don't invent facts, prices, sizes, or availability that aren't listed.
- Keep replies short — 1 to 3 sentences for most messages.
- Reply in the SAME language the customer uses. Detect from their message: English, Urdu, Roman Urdu, or mixed.
- Build rapport — greet, use their name if known, be helpful and concise.
- Ask one qualifying question at a time. Don't interrogate.
- Proactively suggest relevant items from inventory when the customer's intent matches (e.g. budget + area → suggest matching properties; symptom → suggest matching service).

When updating extracted_data:
- Only include fields the customer has explicitly mentioned (in this turn or earlier).
- Never guess.

When scoring (hot_score 0–100):
- 0–25: just-browsing, no concrete needs given
- 26–50: some requirements given, exploring options
- 51–75: clear requirements + budget OR timeline
- 76–100: ready to buy/visit/book this week, urgency signals

Set handoff_to_human=true ONLY when:
- Customer wants to schedule a confirmed visit/call/appointment and a human needs to coordinate logistics.
- Customer has a complaint, refund, or contractual issue you cannot resolve from inventory.
- Customer says they're ready to close, pay, or sign — and a human should take over the deal.
- Customer asks for something genuinely not in the inventory and worth a human follow-up.

Do NOT hand off for: simple price questions, "is this in stock?", availability checks, info already in inventory, or basic FAQs — handle those yourself.
`;

export type InventoryItemForPrompt = {
  name: string;
  external_id?: string | null;
  category?: string | null;
  price_pkr?: number | null;
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
  max = 60,
): string {
  if (items.length === 0) return "";

  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  const lines: string[] = ["## Available inventory", ""];

  for (const it of visible) {
    const head: string[] = [`- **${it.name}**`];
    if (it.external_id) head.push(`(${it.external_id})`);
    if (it.price_pkr != null) {
      head.push(`— Rs. ${it.price_pkr.toLocaleString("en-PK")}`);
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
  customSystemPrompt?: string | null;
  customerName?: string | null;
  customerCity?: string | null;
  inventory?: InventoryItemForPrompt[];
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
      ? formatInventory(args.inventory)
      : "_No inventory items have been added yet. If the customer asks about specific products/properties/services, set handoff_to_human=true._";

  return [
    `You are ${args.aiPersonaName}, a ${args.aiTone} sales assistant for ${args.businessName}, a ${industryLabel[args.industry] ?? args.industry} business.`,
    "",
    args.customSystemPrompt?.trim() || args.industrySystemPrompt,
    "",
    `Default language preference: ${args.language}.`,
    customerLine,
    "",
    inventoryBlock,
    "",
    baseInstructions,
  ].join("\n");
}

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

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

  const response = await ai.models.generateContent({
    model: MODEL,
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
