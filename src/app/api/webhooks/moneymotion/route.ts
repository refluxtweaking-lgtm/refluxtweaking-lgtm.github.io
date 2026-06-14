import { NextResponse } from "next/server";
import { addPurchase, type PlanName } from "@/lib/purchase-store";
import {
  customerLabel,
  customerLocation,
  planFromMoneyMotionPayload,
  verifyMoneyMotionSignature,
  type MoneyMotionWebhookPayload,
} from "@/lib/moneymotion";
import { createKeyAuthLicense, type KeyAuthPlan } from "@/lib/keyauth";
import { sendLicenseEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PLAN_TO_KEYAUTH: Record<PlanName, KeyAuthPlan> = {
  Monthly: "monthly",
  Yearly: "yearly",
  Lifetime: "lifetime",
};

/**
 * Issues a KeyAuth license, stores it in Supabase, and emails it to the buyer.
 * Never throws — returns whether a license was successfully issued so the
 * webhook can always reply 200 (a failure here must not trigger retries).
 */
async function deliverLicense(
  email: string,
  plan: PlanName,
): Promise<boolean> {
  try {
    const keyauthPlan = PLAN_TO_KEYAUTH[plan];
    const license = await createKeyAuthLicense(keyauthPlan);
    if (!license.ok) {
      console.error("[webhook] KeyAuth license generation skipped/failed:", license.error);
      return false;
    }

    console.log(`[webhook] KeyAuth license generated for ${email} (${keyauthPlan}).`);

    const admin = createAdminClient();
    if (admin) {
      const { error } = await admin.from("licenses").insert({
        email,
        plan: keyauthPlan,
        license_key: license.key,
        status: "active",
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error("[webhook] Supabase license insert failed:", error.message);
      } else {
        console.log("[webhook] License stored in Supabase.");
      }
    } else {
      console.warn("[webhook] Supabase admin not configured — license not stored.");
    }

    const emailed = await sendLicenseEmail(email, keyauthPlan, license.key);
    console.log(`[webhook] License email ${emailed ? "sent" : "skipped/failed"} for ${email}.`);

    return true;
  } catch (err) {
    console.error("[webhook] License delivery threw:", err);
    return false;
  }
}

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
    licenseIssued = await deliverLicense(buyerEmail, plan);
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
