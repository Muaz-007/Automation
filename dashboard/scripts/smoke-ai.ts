/* Quick smoke test: verify Gemini API key + structured output work. */
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "\n✗ GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey and add to .env.local",
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  const r = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: "Assalam o alaikum bhai, kya haal hai?" }] }],
    config: {
      systemInstruction:
        "You are a friendly assistant. Return a short greeting in the same language and detect the user's language.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          language_detected: { type: Type.STRING },
        },
        required: ["greeting", "language_detected"],
      },
    },
  });

  if (!r.text) {
    console.error("\n✗ No text in response.");
    process.exit(1);
  }
  const parsed = JSON.parse(r.text);
  console.log("\n✓ Gemini API working");
  console.log("  greeting:         ", parsed.greeting);
  console.log("  language_detected:", parsed.language_detected);
  console.log("  tokens:           ", `in=${r.usageMetadata?.promptTokenCount ?? "?"} out=${r.usageMetadata?.candidatesTokenCount ?? "?"}`);
}

main().catch((e) => {
  console.error("\n✗ Smoke test failed:", e.message ?? e);
  process.exit(1);
});
