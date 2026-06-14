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
  extracted_data: z.object({
    budget: z.string().optional(),
    area: z.string().optional(),
    bedrooms: z.number().int().optional(),
    purpose: z.enum(["buy", "rent"]).optional(),
    timeline: z.string().optional(),
    product: z.string().optional(),
    variant: z.string().optional(),
    quantity: z.number().int().optional(),
    address: z.string().optional(),
    service: z.string().optional(),
    preferred_date: z.string().optional(),
    name: z.string().optional(),
    city: z.string().optional(),
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
When replying:
- Keep replies short — 1 to 3 sentences for most messages.
- Reply in the SAME language the customer uses. Detect from their message: English, Urdu, Roman Urdu, or mixed.
- Never invent facts about the business, prices, or inventory. If you don't know, say so and offer to connect them with a human.
- Build rapport — greet, use their name if known, be helpful.
- Ask one qualifying question at a time. Don't interrogate.

When updating extracted_data:
- Only include fields the customer has explicitly mentioned (in this turn or earlier).
- Never guess.

When scoring (hot_score 0–100):
- 0–25: just-browsing, no concrete needs given
- 26–50: some requirements given, exploring options
- 51–75: clear requirements + budget OR timeline
- 76–100: ready to buy/visit/book this week, urgency signals

Set handoff_to_human=true when:
- Customer wants to schedule a meeting/visit/call NOW
- Customer has a complex objection, complaint, or off-topic urgent matter
- Customer asks something you cannot answer truthfully
- Customer says they're ready to close/buy/pay
`;

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
};

export function buildSystemPrompt(args: BuildPromptArgs): string {
  const customerLine =
    args.customerName || args.customerCity
      ? `\nCustomer details so far: ${[args.customerName, args.customerCity]
          .filter(Boolean)
          .join(", ")}.`
      : "";

  return [
    `You are ${args.aiPersonaName}, a ${args.aiTone} sales assistant for ${args.businessName}, a ${industryLabel[args.industry] ?? args.industry} business.`,
    "",
    args.customSystemPrompt?.trim() || args.industrySystemPrompt,
    "",
    `Default language preference: ${args.language}.`,
    customerLine,
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
