import { NextResponse } from "next/server";
import { addPurchase } from "@/lib/purchase-store";
import {
  customerLabel,
  customerLocation,
  planFromMoneyMotionPayload,
  verifyMoneyMotionSignature,
  type MoneyMotionWebhookPayload,
} from "@/lib/moneymotion";

export const runtime = "nodejs";

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

  // License delivery (KeyAuth, email, etc.) can be added here later.

  return NextResponse.json({
    ok: true,
    sessionId: payload.checkoutSession?.id ?? null,
    plan,
  });
}
