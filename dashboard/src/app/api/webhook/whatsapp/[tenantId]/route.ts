import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  extractMessages,
  markAsRead,
  sendWhatsAppText,
  verifyWebhookSignature,
  type InboundWebhook,
} from "@/lib/whatsapp";
import { processInboundMessage } from "@/lib/ai/process-message";

/**
 * GET — Meta webhook verification handshake.
 * Meta sends `?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`
 * We echo the challenge back if the verify token matches.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await ctx.params;
  const sp = req.nextUrl.searchParams;
  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");

  // Make sure the tenant exists (sanity check; we don't actually need the row here)
  let tenant: { id: string } | null = null;
  try {
    tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
  } catch {
    // Invalid UUID format etc.
    return new NextResponse("Tenant not found", { status: 404 });
  }
  if (!tenant) {
    return new NextResponse("Tenant not found", { status: 404 });
  }

  if (
    mode === "subscribe" &&
    token === process.env.META_WEBHOOK_VERIFY_TOKEN &&
    challenge
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * POST — inbound message events from Meta.
 * We respond 200 IMMEDIATELY (Meta retries otherwise), and process in the
 * background via Next 16 `after()`.
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await ctx.params;
  const rawBody = await req.text();

  // Verify HMAC signature (no-op if META_APP_SECRET is unset)
  if (
    !verifyWebhookSignature({
      rawBody,
      signatureHeader: req.headers.get("x-hub-signature-256"),
    })
  ) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: InboundWebhook;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const events = extractMessages(payload);

  // Schedule processing AFTER the response is sent. Meta only cares about the 200.
  after(async () => {
    for (const { phoneNumberId, contact, message } of events) {
      try {
        // Find the tenant whose phone_number_id matches; falls back to URL tenantId.
        let tenant = await prisma.tenant.findFirst({
          where: { phone_number_id: phoneNumberId },
        });
        if (!tenant) {
          tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        }
        if (!tenant) {
          console.error(
            `[webhook] No tenant found for phone_number_id=${phoneNumberId} (URL tenant=${tenantId})`,
          );
          continue;
        }

        // Only handle text messages for v1
        if (message.type !== "text" || !message.text?.body) {
          console.log(`[webhook] Skipping non-text message type=${message.type}`);
          continue;
        }

        // Mark as read (best-effort)
        if (tenant.whatsapp_token) {
          await markAsRead({
            phoneNumberId,
            accessToken: tenant.whatsapp_token,
            messageId: message.id,
          });
        }

        // Process via Claude + save + update lead
        const result = await processInboundMessage({
          tenantId: tenant.id,
          customerPhone: `+${message.from}`,
          customerName: contact?.profile?.name,
          inboundText: message.text.body,
        });

        if (!result.ok) {
          console.error(`[webhook] Processing failed: ${result.error}`);
          continue;
        }

        // Send the AI reply back via WhatsApp Cloud API
        if (!tenant.whatsapp_token) {
          console.warn(
            `[webhook] Tenant ${tenant.id} has no whatsapp_token — skipping send. Reply was: ${result.reply}`,
          );
          continue;
        }
        await sendWhatsAppText({
          phoneNumberId,
          accessToken: tenant.whatsapp_token,
          toPhone: message.from,
          text: result.reply,
        });
      } catch (e) {
        console.error("[webhook] Unhandled error processing message:", e);
      }
    }
  });

  return new NextResponse("ok", { status: 200 });
}
