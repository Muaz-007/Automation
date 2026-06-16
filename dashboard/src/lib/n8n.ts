import "server-only";

/**
 * Fire an event to the n8n workflow engine.
 *
 * Configure via:
 *   N8N_WEBHOOK_URL    — Production URL of your Webhook trigger node
 *   N8N_WEBHOOK_SECRET — Optional shared secret sent as `x-whatsapp-automate-secret` header
 *
 * If N8N_WEBHOOK_URL is empty, this is a no-op (silent skip). That way development
 * and tenants that don't use n8n yet are unaffected.
 *
 * Errors are logged but never thrown — failure here must not break the user-facing
 * WhatsApp reply path.
 */
export type N8nEventType =
  | "lead.created"
  | "lead.hot"
  | "lead.handoff"
  | "lead.won";

export type N8nEventPayload = {
  type: N8nEventType;
  tenant_id: string;
  lead_id: string;
  customer_id: string;
  customer: {
    phone: string;
    name: string | null;
    city: string | null;
  };
  lead: {
    status: string;
    hot_score: number;
    source: string | null;
    extracted_data: Record<string, unknown>;
  };
  last_message?: string;
  handoff_reason?: string;
  timestamp: string;
};

export async function fireN8nEvent(
  payload: Omit<N8nEventPayload, "timestamp">,
): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return; // not configured — skip silently

  const body: N8nEventPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  const secret = process.env.N8N_WEBHOOK_SECRET;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) headers["x-whatsapp-automate-secret"] = secret;

  // 4-second timeout so n8n issues don't slow down the WhatsApp reply path
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(
        `[n8n] event ${payload.type} returned ${res.status}: ${await res.text().catch(() => "")}`,
      );
    }
  } catch (e) {
    console.warn(
      `[n8n] event ${payload.type} failed:`,
      e instanceof Error ? e.message : e,
    );
  } finally {
    clearTimeout(timeout);
  }
}
