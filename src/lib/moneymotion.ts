import { createHmac, timingSafeEqual } from "crypto";
import type { PlanName } from "@/lib/purchase-store";
import type { ProPlanId } from "@/data/downloads";

export const MONEYMOTION_PLAN_PRICES_CENTS = {
  monthly: 699,
  yearly: 5499,
  lifetime: 8999,
} as const;

export const MONEYMOTION_CHECKOUT_PLANS: Record<
  ProPlanId,
  { label: string; tagline: string; total: string }
> = {
  monthly: {
    label: "REFLUX PRO Monthly",
    tagline: "Full power, low commitment — cancel anytime",
    total: "6.99",
  },
  yearly: {
    label: "REFLUX PRO Yearly",
    tagline: "Pay once a year, save vs monthly",
    total: "54.99",
  },
  lifetime: {
    label: "REFLUX PRO Lifetime",
    tagline: "One payment. Every tweak. Forever.",
    total: "89.99",
  },
};

export type MoneyMotionCheckoutResult =
  | { ok: true; checkoutUrl: string; id: string }
  | { ok: false; error: string };

function moneyMotionApiBase() {
  if (process.env.MONEYMOTION_API_BASE_URL) return process.env.MONEYMOTION_API_BASE_URL;
  return process.env.MONEYMOTION_SANDBOX === "true"
    ? "https://api.sandbox.moneymotion.io"
    : "https://api.moneymotion.io";
}

function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
}

export async function createMoneyMotionCheckout(plan: ProPlanId): Promise<MoneyMotionCheckoutResult> {
  const apiKey = process.env.MONEYMOTION_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Checkout is not configured yet" };
  }

  const planConfig = MONEYMOTION_CHECKOUT_PLANS[plan];
  const siteUrl = siteBaseUrl();

  const body = {
    description: planConfig.label,
    total: planConfig.total,
    successUrl: `${siteUrl}/pricing?checkout=success&plan=${plan}`,
    failureUrl: `${siteUrl}/pricing?checkout=failed&plan=${plan}`,
    cancelUrl: `${siteUrl}/pricing?checkout=cancelled&plan=${plan}`,
    metadata: { plan },
    lineItems: [
      {
        name: planConfig.label,
        description: planConfig.tagline,
        price: planConfig.total,
        quantity: 1,
      },
    ],
    accentColor: {
      lightMode: "#f15b50",
      darkMode: "#e8453a",
    },
  };

  try {
    const response = await fetch(`${moneyMotionApiBase()}/createCheckoutSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "x-currency": "USD",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json()) as {
      checkoutUrl?: string;
      id?: string;
      errors?: string[];
      message?: string;
    };

    if (!response.ok) {
      const reason = data.errors?.join(", ") || data.message || `HTTP ${response.status}`;
      return { ok: false, error: reason };
    }

    if (!data.checkoutUrl) {
      return { ok: false, error: "MoneyMotion did not return a checkout URL" };
    }

    return { ok: true, checkoutUrl: data.checkoutUrl, id: data.id ?? "" };
  } catch {
    return { ok: false, error: "Could not reach MoneyMotion" };
  }
}

export type MoneyMotionEvent =
  | "checkout_session:new"
  | "checkout_session:complete"
  | "checkout_session:refunded"
  | "checkout_session:expired"
  | "checkout_session:disputed";

export type MoneyMotionWebhookPayload = {
  event?: MoneyMotionEvent | string;
  checkoutSession?: {
    id?: string;
    status?: string;
    totalInCents?: number;
    metadata?: Record<string, unknown>;
  };
  customer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    city?: string;
    region?: string;
  };
};

export function verifyMoneyMotionSignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  const computed = createHmac("sha512", secret).update(rawBody).digest("base64");

  try {
    const computedBuf = Buffer.from(computed);
    const signatureBuf = Buffer.from(signature);
    if (computedBuf.length !== signatureBuf.length) return false;
    return timingSafeEqual(computedBuf, signatureBuf);
  } catch {
    return false;
  }
}

export function planFromMoneyMotionPayload(payload: MoneyMotionWebhookPayload): PlanName | null {
  const metadataPlan = payload.checkoutSession?.metadata?.plan;
  if (typeof metadataPlan === "string") {
    const value = metadataPlan.toLowerCase();
    if (value === "monthly" || value === "yearly" || value === "lifetime") {
      return value === "monthly" ? "Monthly" : value === "yearly" ? "Yearly" : "Lifetime";
    }
  }

  const cents = payload.checkoutSession?.totalInCents;
  if (cents === MONEYMOTION_PLAN_PRICES_CENTS.monthly) return "Monthly";
  if (cents === MONEYMOTION_PLAN_PRICES_CENTS.yearly) return "Yearly";
  if (cents === MONEYMOTION_PLAN_PRICES_CENTS.lifetime) return "Lifetime";

  return null;
}

export function customerLabel(payload: MoneyMotionWebhookPayload): string {
  const email = payload.customer?.email?.trim();
  if (email) return email.split("@")[0] || "Customer";

  const first = payload.customer?.firstName?.trim();
  const last = payload.customer?.lastName?.trim();
  const name = [first, last].filter(Boolean).join(" ");
  return name || "Customer";
}

export function customerLocation(payload: MoneyMotionWebhookPayload): string {
  const city = payload.customer?.city?.trim();
  const region = payload.customer?.region?.trim();
  const country = payload.customer?.country?.trim();

  if (city && region) return `${city}, ${region}`;
  if (city && country) return `${city}, ${country}`;
  if (region && country) return `${region}, ${country}`;
  return country || "Unknown";
}
