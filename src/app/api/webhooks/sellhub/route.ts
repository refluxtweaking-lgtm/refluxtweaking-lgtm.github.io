import { NextResponse } from "next/server";
import { addPurchase, type PlanName } from "@/lib/purchase-store";
import {
  buyerEmailFromSellHubPayload,
  customerLabelFromSellHubPayload,
  customerLocationFromSellHubPayload,
  orderIdFromSellHubPayload,
  isSellHubWebhookAuthorized,
  planFromSellHubPayload,
  type SellHubWebhookPayload,
} from "@/lib/sellhub";
import { deliverLicense } from "@/lib/license-delivery";
import type { KeyAuthPlan } from "@/lib/keyauth";
import { claimCheckoutSession } from "@/lib/checkout-idempotency";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export const runtime = "nodejs";

const PLAN_TO_KEYAUTH: Record<PlanName, KeyAuthPlan> = {
  Monthly: "monthly",
  Yearly: "yearly",
  Lifetime: "lifetime",
};

/** Browsers open webhooks with GET — return OK so setup/health checks don't look broken. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "sellhub-webhook",
    message: "Webhook is live. SellHub sends POST requests here after checkout.",
  });
}

export async function POST(request: Request) {
  const secret = process.env.SELLHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();

  if (!isSellHubWebhookAuthorized(request, rawBody, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: SellHubWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SellHubWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event ?? (payload.data?.event as string | undefined);
  if (
    event &&
    event !== "order.created" &&
    event !== "order.completed" &&
    event !== "order.paid"
  ) {
    return NextResponse.json({ ok: true, ignored: event });
  }

  const plan = planFromSellHubPayload(payload);
  if (!plan) {
    return NextResponse.json({ error: "Could not determine plan" }, { status: 422 });
  }

  await addPurchase({
    user: customerLabelFromSellHubPayload(payload),
    plan,
    location: customerLocationFromSellHubPayload(payload),
  });

  const buyerEmail = normalizeBuyerEmail(buyerEmailFromSellHubPayload(payload));
  const orderId = orderIdFromSellHubPayload(payload);

  let licenseIssued = false;
  if (buyerEmail) {
    const keyauthPlan = PLAN_TO_KEYAUTH[plan];
    const claimed = await claimCheckoutSession(orderId, buyerEmail, keyauthPlan);
    if (!claimed) {
      console.log(`[sellhub-webhook] Duplicate order ignored: ${orderId}`);
      return NextResponse.json({
        ok: true,
        orderId: orderId || null,
        plan,
        licenseIssued: false,
        duplicate: true,
      });
    }

    const delivered = await deliverLicense(buyerEmail, keyauthPlan);
    licenseIssued = delivered.ok;
    if (!delivered.ok) {
      console.error("[sellhub-webhook] License delivery failed:", delivered.error);
    } else {
      console.log(
        `[sellhub-webhook] License delivered for ${buyerEmail} (${keyauthPlan}) — emailed=${delivered.emailed}, stored=${delivered.stored}.`,
      );
    }
  } else {
    console.warn("[sellhub-webhook] No buyer email on payload — skipping license delivery.");
  }

  return NextResponse.json({
    ok: true,
    orderId: orderId || null,
    plan,
    licenseIssued,
  });
}
