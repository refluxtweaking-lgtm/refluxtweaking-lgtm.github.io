import { NextResponse } from "next/server";
import { addPurchase, type PlanName } from "@/lib/purchase-store";
import {
  customerLabel,
  customerLocation,
  planFromMoneyMotionPayload,
  verifyMoneyMotionSignature,
  type MoneyMotionWebhookPayload,
} from "@/lib/moneymotion";
import { deliverLicense } from "@/lib/license-delivery";
import type { KeyAuthPlan } from "@/lib/keyauth";

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
    endpoint: "moneymotion-webhook",
    message: "Webhook is live. MoneyMotion sends POST requests here after checkout.",
  });
}

export async function POST(request: Request) {
  const secret = process.env.MONEYMOTION_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-webhook-signature") ?? request.headers.get("x-signature") ?? "";

  if (!verifyMoneyMotionSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: MoneyMotionWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MoneyMotionWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event !== "checkout_session:complete") {
    return NextResponse.json({ ok: true, ignored: payload.event ?? "unknown" });
  }

  const plan = planFromMoneyMotionPayload(payload);
  if (!plan) {
    return NextResponse.json({ error: "Could not determine plan" }, { status: 422 });
  }

  await addPurchase({
    user: customerLabel(payload),
    plan,
    location: customerLocation(payload),
  });

  const buyerEmail =
    (typeof payload.checkoutSession?.metadata?.email === "string"
      ? payload.checkoutSession.metadata.email.trim()
      : "") || payload.customer?.email?.trim() || "";

  let licenseIssued = false;
  if (buyerEmail) {
    const keyauthPlan = PLAN_TO_KEYAUTH[plan];
    const delivered = await deliverLicense(buyerEmail, keyauthPlan);
    licenseIssued = delivered.ok;
    if (!delivered.ok) {
      console.error("[webhook] License delivery failed:", delivered.error);
    } else {
      console.log(
        `[webhook] License delivered for ${buyerEmail} (${keyauthPlan}) — emailed=${delivered.emailed}, stored=${delivered.stored}.`,
      );
    }
  } else {
    console.warn("[webhook] No buyer email on payload — skipping license delivery.");
  }

  return NextResponse.json({
    ok: true,
    sessionId: payload.checkoutSession?.id ?? null,
    plan,
    licenseIssued,
  });
}
