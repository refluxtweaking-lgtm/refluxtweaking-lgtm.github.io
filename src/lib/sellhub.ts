import { createHmac, timingSafeEqual } from "crypto";
import type { PlanName } from "@/lib/purchase-store";
import type { ProPlanId } from "@/data/downloads";
import { maskPurchaseIdentity } from "@/lib/mask-purchase-identity";

export const SELLHUB_CHECKOUT_PLANS: Record<
  ProPlanId,
  { label: string; tagline: string; price: string }
> = {
  monthly: {
    label: "REFLUX PRO Monthly",
    tagline: "Full power, low commitment — cancel anytime",
    price: "6.99",
  },
  yearly: {
    label: "REFLUX PRO Yearly",
    tagline: "Pay once a year, save vs monthly",
    price: "54.99",
  },
  lifetime: {
    label: "REFLUX PRO Lifetime",
    tagline: "One payment. Every tweak. Forever.",
    price: "89.99",
  },
};

export type SellHubCheckoutResult =
  | { ok: true; checkoutUrl: string; id: string }
  | { ok: false; error: string };

export type SellHubCheckoutOptions = {
  email?: string;
};

type SellHubPlanIds = {
  productId: string;
  variantId: string;
};

function sellhubApiBase() {
  return process.env.SELLHUB_API_BASE_URL?.trim() || "https://store.sellhub.cx/api";
}

function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
}

function sellhubCurrency() {
  return process.env.SELLHUB_CURRENCY?.trim().toLowerCase() || "usd";
}

function planIds(plan: ProPlanId): SellHubPlanIds | null {
  const productId = process.env[`SELLHUB_PRODUCT_${plan.toUpperCase()}` as const]?.trim();
  const variantId = process.env[`SELLHUB_VARIANT_${plan.toUpperCase()}` as const]?.trim();
  if (!productId || !variantId) return null;
  return { productId, variantId };
}

export function sellhubCheckoutUrl(sessionId: string): string {
  const template = process.env.SELLHUB_CHECKOUT_URL_TEMPLATE?.trim();
  if (template) {
    return template.replaceAll("{sessionId}", sessionId).replaceAll("{id}", sessionId);
  }

  const storeUrl = process.env.SELLHUB_STORE_URL?.trim().replace(/\/$/, "");
  if (storeUrl) {
    return `${storeUrl}/payment/${sessionId}`;
  }

  return `https://checkout.sellhub.cx/payment/${sessionId}`;
}

function checkoutReturnUrl(siteUrl: string, plan: ProPlanId) {
  return `${siteUrl}/pricing?checkout=success&plan=${plan}`;
}

function extractSessionId(data: Record<string, unknown>): string | null {
  const session = data.session as Record<string, unknown> | undefined;
  if (typeof session?.id === "string" && session.id) return session.id;
  if (typeof data.id === "string" && data.id) return data.id;
  return null;
}

export async function createSellHubCheckout(
  plan: ProPlanId,
  options: SellHubCheckoutOptions = {},
): Promise<SellHubCheckoutResult> {
  const apiKey = process.env.SELLHUB_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "Checkout is not configured yet" };
  }

  const ids = planIds(plan);
  if (!ids) {
    return { ok: false, error: `SellHub product IDs are not configured for ${plan}` };
  }

  const email = options.email?.trim();
  if (!email) {
    return { ok: false, error: "Buyer email is required" };
  }

  const planConfig = SELLHUB_CHECKOUT_PLANS[plan];
  const siteUrl = siteBaseUrl();

  const body = {
    email,
    currency: sellhubCurrency(),
    returnUrl: checkoutReturnUrl(siteUrl, plan),
    cartBundles: [],
    methodName: "",
    bundleIds: [],
    customFieldValues: [],
    cart: {
      items: [
        {
          id: ids.productId,
          coupon: "",
          name: planConfig.label,
          variant: {
            id: ids.variantId,
            name: planConfig.label,
            price: planConfig.price,
          },
          quantity: 1,
          addons: [],
        },
      ],
      bundles: [],
    },
  };

  try {
    const response = await fetch(`${sellhubApiBase()}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json()) as Record<string, unknown> & {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      const reason =
        (typeof data.message === "string" && data.message) ||
        (typeof data.error === "string" && data.error) ||
        `HTTP ${response.status}`;
      console.error("[SellHub] create checkout failed:", reason, data);
      return { ok: false, error: reason };
    }

    const sessionId = extractSessionId(data);
    if (!sessionId) {
      console.error("[SellHub] missing session id:", data);
      return { ok: false, error: "SellHub did not return a checkout session" };
    }

    return { ok: true, checkoutUrl: sellhubCheckoutUrl(sessionId), id: sessionId };
  } catch {
    return { ok: false, error: "Could not reach SellHub" };
  }
}

export type SellHubWebhookPayload = {
  event?: string;
  data?: Record<string, unknown>;
  order?: Record<string, unknown>;
  email?: string;
  customer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    city?: string;
    region?: string;
    state?: string;
  };
  items?: Array<{
    variant?: { id?: string };
    variantId?: string;
  }>;
};

function safeEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export function verifySellHubSignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  const computedHex = createHmac("sha256", secret).update(rawBody).digest("hex");
  const computedBase64 = createHmac("sha256", secret).update(rawBody).digest("base64");

  if (safeEqual(computedHex, signature) || safeEqual(computedBase64, signature)) {
    return true;
  }

  const normalized = signature.replace(/^sha256=/i, "");
  return safeEqual(computedHex, normalized) || safeEqual(computedBase64, normalized);
}

function variantToPlan(variantId: string): PlanName | null {
  const normalized = variantId.trim().toLowerCase();
  const mappings: Array<[string | undefined, PlanName]> = [
    [process.env.SELLHUB_VARIANT_MONTHLY?.trim().toLowerCase(), "Monthly"],
    [process.env.SELLHUB_VARIANT_YEARLY?.trim().toLowerCase(), "Yearly"],
    [process.env.SELLHUB_VARIANT_LIFETIME?.trim().toLowerCase(), "Lifetime"],
  ];

  for (const [envVariant, plan] of mappings) {
    if (envVariant && envVariant === normalized) return plan;
  }

  return null;
}

function collectVariantIds(payload: SellHubWebhookPayload): string[] {
  const ids: string[] = [];
  const buckets = [payload.items, payload.data?.items, payload.order?.items];

  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) continue;
    for (const item of bucket) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const variant = record.variant as { id?: string } | undefined;
      if (typeof variant?.id === "string") ids.push(variant.id);
      if (typeof record.variantId === "string") ids.push(record.variantId);
    }
  }

  return ids;
}

export function planFromSellHubPayload(payload: SellHubWebhookPayload): PlanName | null {
  for (const variantId of collectVariantIds(payload)) {
    const plan = variantToPlan(variantId);
    if (plan) return plan;
  }

  const data = payload.data;
  if (data && typeof data === "object") {
    const nested = data as SellHubWebhookPayload;
    for (const variantId of collectVariantIds(nested)) {
      const plan = variantToPlan(variantId);
      if (plan) return plan;
    }
  }

  return null;
}

function readEmail(payload: SellHubWebhookPayload): string {
  const candidates = [
    payload.email,
    payload.customer?.email,
    payload.data?.email,
    (payload.data?.customer as { email?: string } | undefined)?.email,
    payload.order?.email,
    (payload.order?.customer as { email?: string } | undefined)?.email,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

export function buyerEmailFromSellHubPayload(payload: SellHubWebhookPayload): string {
  return readEmail(payload);
}

export function orderIdFromSellHubPayload(payload: SellHubWebhookPayload): string {
  const candidates = [
    payload.data?.id,
    payload.data?.orderId,
    payload.order?.id,
    payload.order?.orderId,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
}

export function customerLabelFromSellHubPayload(payload: SellHubWebhookPayload): string {
  const email = readEmail(payload);
  if (email) return maskPurchaseIdentity(email);

  const customer = payload.customer ?? (payload.data?.customer as SellHubWebhookPayload["customer"]);
  const first = customer?.firstName?.trim();
  const last = customer?.lastName?.trim();
  const name = [first, last].filter(Boolean).join(" ");
  return name ? maskPurchaseIdentity(name) : "Customer";
}

export function customerLocationFromSellHubPayload(payload: SellHubWebhookPayload): string {
  const customer = payload.customer ?? (payload.data?.customer as SellHubWebhookPayload["customer"]);
  const billing =
    (payload.data?.billingAddress as { city?: string; state?: string; country?: string } | undefined) ??
    (payload.order?.billingAddress as { city?: string; state?: string; country?: string } | undefined);

  const city = customer?.city?.trim() || billing?.city?.trim();
  const region = customer?.region?.trim() || customer?.state?.trim() || billing?.state?.trim();
  const country = customer?.country?.trim() || billing?.country?.trim();

  if (city && region) return `${city}, ${region}`;
  if (city && country) return `${city}, ${country}`;
  if (region && country) return `${region}, ${country}`;
  return country || "Unknown";
}
