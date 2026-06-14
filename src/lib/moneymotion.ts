import { createHash, createHmac, timingSafeEqual } from "crypto";
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

export type MoneyMotionCheckoutOptions = {
  userIp?: string;
  email?: string;
};

function directCheckoutLink(plan: ProPlanId): string | undefined {
  const links: Record<ProPlanId, string | undefined> = {
    monthly: process.env.MONEYMOTION_LINK_MONTHLY,
    yearly: process.env.MONEYMOTION_LINK_YEARLY,
    lifetime: process.env.MONEYMOTION_LINK_LIFETIME,
  };
  const url = links[plan]?.trim();
  return url?.startsWith("http") ? url : undefined;
}

function extractCheckoutUrl(data: Record<string, unknown>): string | null {
  if (typeof data.checkoutUrl === "string" && data.checkoutUrl) {
    return data.checkoutUrl;
  }

  const id = data.id ?? data.checkoutSessionId;
  if (typeof id === "string" && id) {
    return `https://moneymotion.io/checkout/${id}`;
  }

  const result = data.result as Record<string, unknown> | undefined;
  const json = (result?.data as Record<string, unknown> | undefined)?.json as
    | Record<string, unknown>
    | undefined;
  const sessionId = json?.checkoutSessionId;
  if (typeof sessionId === "string" && sessionId) {
    return `https://moneymotion.io/checkout/${sessionId}`;
  }

  return null;
}

function checkoutFingerprint(userIp: string, plan: ProPlanId) {
  return createHash("sha256").update(`${userIp}:${plan}:refluxtweaks`).digest("hex").slice(0, 32);
}

function checkoutUrls(siteUrl: string, plan: ProPlanId) {
  return {
    success: `${siteUrl}/pricing?checkout=success&plan=${plan}`,
    failure: `${siteUrl}/pricing?checkout=failed&plan=${plan}`,
    cancel: `${siteUrl}/pricing?checkout=cancelled&plan=${plan}`,
  };
}

async function parseMoneyMotionResponse(response: Response) {
  const data = (await response.json()) as Record<string, unknown> & {
    errors?: string[];
    message?: string;
  };
  return data;
}

async function createViaRestCheckoutSession(
  apiKey: string,
  plan: ProPlanId,
  options: MoneyMotionCheckoutOptions,
): Promise<MoneyMotionCheckoutResult> {
  const planConfig = MONEYMOTION_CHECKOUT_PLANS[plan];
  const siteUrl = siteBaseUrl();
  const urls = checkoutUrls(siteUrl, plan);
  const userIp = options.userIp ?? "0.0.0.0";
  const email = options.email?.trim();

  const body: Record<string, unknown> = {
    description: planConfig.label,
    total: planConfig.total,
    successUrl: urls.success,
    failureUrl: urls.failure,
    cancelUrl: urls.cancel,
    metadata: { plan, ...(email ? { email } : {}) },
    ...(email ? { userEmail: email } : {}),
    userIp,
    userFingerprint: checkoutFingerprint(userIp, plan),
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

  const data = await parseMoneyMotionResponse(response);

  if (!response.ok) {
    const reason = data.errors?.join(", ") || data.message || `HTTP ${response.status}`;
    console.error("[MoneyMotion] REST createCheckoutSession failed:", reason, data);
    return { ok: false, error: reason };
  }

  const checkoutUrl = extractCheckoutUrl(data);
  if (!checkoutUrl) {
    console.error("[MoneyMotion] REST missing checkout URL:", data);
    return { ok: false, error: "MoneyMotion did not return a checkout URL" };
  }

  const id =
    (typeof data.id === "string" && data.id) ||
    (typeof data.checkoutSessionId === "string" && data.checkoutSessionId) ||
    "";

  return { ok: true, checkoutUrl, id };
}

async function createViaTrpcCheckoutSession(
  apiKey: string,
  plan: ProPlanId,
  options: MoneyMotionCheckoutOptions = {},
): Promise<MoneyMotionCheckoutResult> {
  const planConfig = MONEYMOTION_CHECKOUT_PLANS[plan];
  const siteUrl = siteBaseUrl();
  const urls = checkoutUrls(siteUrl, plan);
  const email = options.email?.trim();

  const body = {
    json: {
      description: planConfig.label,
      urls,
      userInfo: { email: email || "checkout@refluxtweaks.com" },
      lineItems: [
        {
          name: planConfig.label,
          description: planConfig.tagline,
          pricePerItemInCents: MONEYMOTION_PLAN_PRICES_CENTS[plan],
          quantity: 1,
        },
      ],
      metadata: { plan, ...(email ? { email } : {}) },
    },
  };

  const response = await fetch(`${moneyMotionApiBase()}/checkoutSessions.createCheckoutSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "x-currency": "USD",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseMoneyMotionResponse(response);

  if (!response.ok) {
    const reason = data.errors?.join(", ") || data.message || `HTTP ${response.status}`;
    console.error("[MoneyMotion] tRPC createCheckoutSession failed:", reason, data);
    return { ok: false, error: reason };
  }

  const checkoutUrl = extractCheckoutUrl(data);
  if (!checkoutUrl) {
    console.error("[MoneyMotion] tRPC missing checkout URL:", data);
    return { ok: false, error: "MoneyMotion did not return a checkout URL" };
  }

  const id =
    (typeof data.id === "string" && data.id) ||
    (typeof data.checkoutSessionId === "string" && data.checkoutSessionId) ||
    "";

  return { ok: true, checkoutUrl, id };
}

export async function createMoneyMotionCheckout(
  plan: ProPlanId,
  options: MoneyMotionCheckoutOptions = {},
): Promise<MoneyMotionCheckoutResult> {
  const directLink = directCheckoutLink(plan);
  if (directLink) {
    return { ok: true, checkoutUrl: directLink, id: "" };
  }

  const apiKey = process.env.MONEYMOTION_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "Checkout is not configured yet" };
  }

  try {
    const restResult = await createViaRestCheckoutSession(apiKey, plan, options);
    if (restResult.ok) return restResult;

    console.warn("[MoneyMotion] REST failed, trying tRPC fallback:", restResult.error);
    return await createViaTrpcCheckoutSession(apiKey, plan, options);
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
    metadata?: { plan?: string; email?: string } & Record<string, unknown>;
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
