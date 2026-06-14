import "server-only";
import crypto from "crypto";

const GRAPH_API_VERSION = "v23.0";

/**
 * Send a plain-text WhatsApp message via Meta Cloud API.
 * Per-tenant credentials are required — global env vars are not used here.
 */
export async function sendWhatsAppText(args: {
  phoneNumberId: string;
  accessToken: string;
  toPhone: string;
  text: string;
}) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${args.phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: args.toPhone,
      type: "text",
      text: { body: args.text },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`WhatsApp send failed (${res.status}): ${errBody}`);
  }

  return res.json() as Promise<{
    messaging_product: "whatsapp";
    contacts: { input: string; wa_id: string }[];
    messages: { id: string }[];
  }>;
}

/**
 * Mark an incoming message as read on the customer's WhatsApp.
 * Optional but improves UX — shows the blue ticks.
 */
export async function markAsRead(args: {
  phoneNumberId: string;
  accessToken: string;
  messageId: string;
}) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${args.phoneNumberId}/messages`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: args.messageId,
    }),
  }).catch(() => {
    /* ignore — read receipts are best-effort */
  });
}

/**
 * Verify the Meta webhook signature using the app secret.
 * Returns true if the signature matches (or if no app secret is configured).
 */
export function verifyWebhookSignature(args: {
  rawBody: string;
  signatureHeader: string | null;
}): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    // No app secret configured — skip verification (warn in dev).
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[whatsapp] META_APP_SECRET not set — skipping signature verification. Set it before going to production.",
      );
    }
    return true;
  }
  if (!args.signatureHeader) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(args.rawBody, "utf8")
    .digest("hex")}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(args.signatureHeader),
    );
  } catch {
    return false;
  }
}

/* ────────────────── Inbound webhook payload types ────────────────── */

export type InboundMessage = {
  from: string; // E.164 phone, no leading +
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
};

export type InboundContact = {
  wa_id: string;
  profile?: { name?: string };
};

export type InboundWebhook = {
  object: "whatsapp_business_account";
  entry: Array<{
    id: string;
    changes: Array<{
      field: "messages";
      value: {
        messaging_product: "whatsapp";
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: InboundContact[];
        messages?: InboundMessage[];
      };
    }>;
  }>;
};

/**
 * Flatten the Meta webhook envelope into the (phone_number_id, contact, message) tuples we care about.
 */
export function extractMessages(payload: InboundWebhook): Array<{
  phoneNumberId: string;
  contact: InboundContact | undefined;
  message: InboundMessage;
}> {
  const out: ReturnType<typeof extractMessages> = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const phoneNumberId = change.value.metadata.phone_number_id;
      const contacts = change.value.contacts ?? [];
      for (const message of change.value.messages ?? []) {
        const contact = contacts.find((c) => c.wa_id === message.from);
        out.push({ phoneNumberId, contact, message });
      }
    }
  }
  return out;
}
