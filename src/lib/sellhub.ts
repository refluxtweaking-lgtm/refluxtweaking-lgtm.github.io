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

function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
}

function sellhubCurrency() {
  return process.env.SELLHUB_CURRENCY?.trim().toLowerCase() || "usd";
}

function variantIdForPlan(plan: ProPlanId): string | null {
  const variantId = process.env[`SELLHUB_VARIANT_${plan.toUpperCase()}` as const]?.trim();
  return variantId || null;
}

function productIdFromEnv(plan: ProPlanId): string | null {
  return (
    process.env[`SELLHUB_PRODUCT_${plan.toUpperCase()}` as const]?.trim() ||
    process.env.SELLHUB_PRODUCT_ID?.trim() ||
    null
  );
}

function planIds(plan: ProPlanId): SellHubPlanIds | null {
  const variantId = variantIdForPlan(plan);
  const productId = productIdFromEnv(plan);
  if (!variantId || !productId) return null;
  return { productId, variantId };
}

function sellhubCatalogBases(): string[] {
  const bases = new Set<string>();
  const storeUrl = process.env.SELLHUB_STORE_URL?.trim().replace(/\/$/, "");
  if (storeUrl) bases.add(`${storeUrl}/api`);
  bases.add("https://dash.sellhub.cx/api/sellhub");
  bases.add("https://store.sellhub.cx/api");
  return [...bases];
}

async function fetchSellHubJson(apiKey: string, url: string): Promise<Record<string, unknown> | null> {
  for (const authorization of [apiKey, `Basic ${apiKey}`]) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: authorization },
        cache: "no-store",
      });
      if (!response.ok) continue;
      return (await response.json()) as Record<string, unknown>;
    } catch {
      continue;
    }
  }
  return null;
}

function extractVariants(data: Record<string, unknown>): Record<string, unknown>[] {
  const dataNode = data.data as Record<string, unknown> | undefined;
  const variants = dataNode?.variants ?? data.variants;

  if (Array.isArray(variants)) {
    return variants.filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"));
  }

  if (variants && typeof variants === "object") {
    return Object.entries(variants as Record<string, Record<string, unknown>>).map(([key, value]) => ({
      ...value,
      id: value.id ?? key,
    }));
  }

  return [];
}

function variantProductId(variant: Record<string, unknown>): string | null {
  for (const key of ["productId", "product_id", "parentProductId", "parentId"]) {
    const value = variant[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Resolve the store's product ID for a variant using the SellHub API. */
export async function lookupSellHubPlanIds(
  apiKey: string,
  variantId: string,
): Promise<SellHubPlanIds | null> {
  const normalizedVariantId = variantId.trim();
  if (!normalizedVariantId) return null;

  for (const base of sellhubCatalogBases()) {
    const byId = await fetchSellHubJson(
      apiKey,
      `${base}/products/variants?id=${encodeURIComponent(normalizedVariantId)}`,
    );
    if (byId) {
      for (const variant of extractVariants(byId)) {
        const productId = variantProductId(variant);
        const id = typeof variant.id === "string" ? variant.id : normalizedVariantId;
        if (productId) return { productId, variantId: id };
      }
    }
  }

  for (const base of sellhubCatalogBases()) {
    const productsData = await fetchSellHubJson(apiKey, `${base}/products`);
    if (!productsData) continue;

    const products =
      (productsData.data as { products?: Record<string, unknown>[] } | undefined)?.products ?? [];
    for (const product of products) {
      if (!product || typeof product !== "object") continue;
      const productId = typeof product.id === "string" ? product.id : null;
      if (!productId) continue;

      const variantsData = await fetchSellHubJson(
        apiKey,
        `${base}/products/variants?productId=${encodeURIComponent(productId)}`,
      );
      if (!variantsData) continue;

      for (const variant of extractVariants(variantsData)) {
        const id = typeof variant.id === "string" ? variant.id : "";
        if (id.toLowerCase() === normalizedVariantId.toLowerCase()) {
          return { productId, variantId: id };
        }
      }
    }
  }

  return null;
}

async function resolvePlanIds(plan: ProPlanId, apiKey: string): Promise<SellHubPlanIds | null> {
  const variantId = variantIdForPlan(plan);
  if (!variantId) return null;

  const fromApi = await lookupSellHubPlanIds(apiKey, variantId);
  if (fromApi) return fromApi;

  return planIds(plan);
}

function sellhubStoreUrl(): string | null {
  return process.env.SELLHUB_STORE_URL?.trim().replace(/\/$/, "") || null;
}

/** SellHub exposes checkout via variant embeds — not /embed/checkout/{sessionId}. */
export function sellhubVariantEmbedUrl(plan: ProPlanId): string | null {
  const storeUrl = sellhubStoreUrl();
  const variantId = variantIdForPlan(plan);
  if (!storeUrl || !variantId) return null;
  return `${storeUrl}/embed/variant/${variantId}`;
}

function isSellHubVariantEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.toLowerCase().endsWith(".sellhub.cx") &&
      parsed.pathname.includes("/embed/variant/")
    );
  } catch {
    return false;
  }
}

function extractCheckoutUrl(data: Record<string, unknown>, fallbackUrl: string): string {
  const buckets = [data, data.session as Record<string, unknown> | undefined];
  for (const bucket of buckets) {
    if (!bucket || typeof bucket !== "object") continue;
    for (const key of ["checkoutUrl", "checkout_url", "url", "redirectUrl", "redirect_url"]) {
      const value = bucket[key];
      if (typeof value === "string" && isSellHubVariantEmbedUrl(value)) return value;
      if (typeof value === "string" && value.includes("moneymotion.io/checkout/")) return value;
    }
  }

  return fallbackUrl;
}

async function processCheckoutAtEndpoint(
  apiBase: string,
  apiKey: string,
  sessionId: string,
  methodName: string,
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string }> {
  const authAttempts = [apiKey, `Basic ${apiKey}`];

  for (const authorization of authAttempts) {
    const response = await fetch(`${apiBase}/processCheckout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({ id: sessionId, methodName }),
      cache: "no-store",
    });

    const data = (await response.json()) as Record<string, unknown>;
    if (response.ok) return { ok: true, data };

    if (response.status === 401 && authorization === apiKey) continue;
    return { ok: false, error: parseSellHubError(data, response.status) };
  }

  return { ok: false, error: "Unauthorized" };
}

function sellhubPaymentMethod(): string {
  return process.env.SELLHUB_PAYMENT_METHOD?.trim() || "stripe";
}

function extractMoneyMotionCheckoutUrl(data: Record<string, unknown>): string | null {
  const buckets = [data, data.session as Record<string, unknown> | undefined];
  for (const bucket of buckets) {
    if (!bucket || typeof bucket !== "object") continue;
    for (const key of ["checkoutUrl", "checkout_url", "url", "redirectUrl", "redirect_url"]) {
      const value = bucket[key];
      if (typeof value === "string" && value.includes("moneymotion.io/checkout/")) {
        return value;
      }
    }
  }
  return null;
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

function sellhubCheckoutEndpoints(): string[] {
  const storeUrl = process.env.SELLHUB_STORE_URL?.trim().replace(/\/$/, "");
  if (storeUrl) return [`${storeUrl}/api`];

  const configured = process.env.SELLHUB_API_BASE_URL?.trim();
  if (configured) return [configured.replace(/\/$/, "")];

  return ["https://store.sellhub.cx/api"];
}

function parseSellHubError(data: Record<string, unknown>, status: number): string {
  const errors = data.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const messages = errors
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object" && "message" in entry) {
          return String((entry as { message?: unknown }).message ?? "");
        }
        return "";
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join(", ");
  }

  if (typeof data.message === "string" && data.message) return data.message;
  if (typeof data.error === "string" && data.error) return data.error;

  return `HTTP ${status}`;
}

function buildCheckoutBody(
  ids: SellHubPlanIds,
  planConfig: (typeof SELLHUB_CHECKOUT_PLANS)[ProPlanId],
  email: string,
  plan: ProPlanId,
  siteUrl: string,
) {
  return {
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
          name: "",
          variant: {
            id: ids.variantId,
            name: "",
            price: "0.00",
          },
          quantity: 1,
          addons: [],
        },
      ],
      bundles: [],
    },
  };
}

async function createCheckoutAtEndpoint(
  apiBase: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string; status: number }> {
  const authAttempts = [apiKey, `Basic ${apiKey}`];

  for (const authorization of authAttempts) {
    const response = await fetch(`${apiBase}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (response.ok && (data.status === "success" || extractSessionId(data))) {
      return { ok: true, data };
    }

    if (response.status === 401 && authorization === apiKey) {
      continue;
    }

    return {
      ok: false,
      error: parseSellHubError(data, response.status),
      status: response.status,
    };
  }

  return { ok: false, error: "Unauthorized", status: 401 };
}

export async function createSellHubCheckout(
  plan: ProPlanId,
  options: SellHubCheckoutOptions = {},
): Promise<SellHubCheckoutResult> {
  const storeUrl = sellhubStoreUrl();
  if (!storeUrl) {
    return { ok: false, error: "SELLHUB_STORE_URL is not configured" };
  }

  const variantEmbedUrl = sellhubVariantEmbedUrl(plan);
  if (!variantEmbedUrl) {
    return { ok: false, error: `SellHub variant ID is not configured for ${plan}` };
  }

  const email = options.email?.trim();
  if (!email) {
    return { ok: false, error: "Buyer email is required" };
  }

  const apiKey = process.env.SELLHUB_API_KEY?.trim();
  if (!apiKey) {
    return { ok: true, checkoutUrl: variantEmbedUrl, id: variantIdForPlan(plan) ?? "" };
  }

  const ids = await resolvePlanIds(plan, apiKey);
  if (!ids) {
    return { ok: true, checkoutUrl: variantEmbedUrl, id: variantIdForPlan(plan) ?? "" };
  }

  const planConfig = SELLHUB_CHECKOUT_PLANS[plan];
  const siteUrl = siteBaseUrl();
  const body = buildCheckoutBody(ids, planConfig, email, plan, siteUrl);

  try {
    let lastError = "SellHub checkout failed";

    for (const apiBase of sellhubCheckoutEndpoints()) {
      const result = await createCheckoutAtEndpoint(apiBase, apiKey, body);
      if (!result.ok) {
        lastError = result.error;
        console.error("[SellHub] create checkout failed:", apiBase, result.error);
        if (result.status === 401) continue;
        continue;
      }

      const sessionId = extractSessionId(result.data);
      if (!sessionId) {
        lastError = "SellHub did not return a checkout session";
        continue;
      }

      const directUrl = extractMoneyMotionCheckoutUrl(result.data);
      if (directUrl) {
        return { ok: true, checkoutUrl: directUrl, id: sessionId };
      }

      const processed = await processCheckoutAtEndpoint(
        apiBase,
        apiKey,
        sessionId,
        sellhubPaymentMethod(),
      );
      if (processed.ok) {
        const processedUrl = extractMoneyMotionCheckoutUrl(processed.data);
        if (processedUrl) {
          return { ok: true, checkoutUrl: processedUrl, id: sessionId };
        }
      } else {
        console.warn("[SellHub] processCheckout failed:", processed.error);
      }

      return {
        ok: true,
        checkoutUrl: extractCheckoutUrl(result.data, variantEmbedUrl),
        id: sessionId,
      };
    }

    console.warn("[SellHub] API checkout failed, using variant embed fallback:", lastError);
    return { ok: true, checkoutUrl: variantEmbedUrl, id: ids.variantId };
  } catch {
    return { ok: true, checkoutUrl: variantEmbedUrl, id: ids.variantId };
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

function readWebhookSecret(request: Request): string {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("secret")?.trim();
  if (fromQuery) return fromQuery;

  return (
    request.headers.get("x-webhook-secret")?.trim() ??
    request.headers.get("x-sellhub-secret")?.trim() ??
    ""
  );
}

/** Accept signed webhooks or a shared secret in the URL/header (variant delivery webhooks). */
export function isSellHubWebhookAuthorized(
  request: Request,
  rawBody: string,
  secret: string,
): boolean {
  if (!secret) return false;

  const signature =
    request.headers.get("signature") ??
    request.headers.get("x-signature") ??
    request.headers.get("x-webhook-signature") ??
    request.headers.get("x-sellhub-signature") ??
    "";

  if (signature && verifySellHubSignature(rawBody, signature, secret)) {
    return true;
  }

  const providedSecret = readWebhookSecret(request);
  return Boolean(providedSecret && safeEqual(providedSecret, secret));
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

const VARIANT_ID_KEYS = ["variantId", "variant_id", "productVariantId", "product_variant_id"];
const EMAIL_KEYS = ["email", "buyerEmail", "buyer_email", "customerEmail", "customer_email"];

function deepFindString(node: unknown, keys: string[]): string {
  if (!node || typeof node !== "object") return "";

  if (Array.isArray(node)) {
    for (const entry of node) {
      const found = deepFindString(entry, keys);
      if (found) return found;
    }
    return "";
  }

  const record = node as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  const variant = record.variant;
  if (variant && typeof variant === "object") {
    const variantId = (variant as { id?: string }).id;
    if (typeof variantId === "string" && variantId.trim()) return variantId.trim();
  }

  for (const value of Object.values(record)) {
    const found = deepFindString(value, keys);
    if (found) return found;
  }

  return "";
}

function collectVariantIds(payload: SellHubWebhookPayload): string[] {
  const ids = new Set<string>();
  const buckets = [
    payload,
    payload.data,
    payload.order,
    payload.items,
    payload.data?.items,
    payload.order?.items,
    payload.data?.order,
    (payload.data?.order as { items?: unknown } | undefined)?.items,
    payload.data?.invoice,
    (payload.data?.invoice as { items?: unknown } | undefined)?.items,
  ];

  for (const bucket of buckets) {
    if (!bucket) continue;
    const found = deepFindString(bucket, VARIANT_ID_KEYS);
    if (found) ids.add(found);
  }

  return [...ids];
}

function planFromQueryParam(planParam: string | null): PlanName | null {
  switch (planParam?.trim().toLowerCase()) {
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    case "lifetime":
      return "Lifetime";
    default:
      return null;
  }
}

/** Resolve plan from webhook URL (?plan=monthly) or SellHub payload variant IDs. */
export function planFromSellHubWebhook(request: Request, payload: SellHubWebhookPayload): PlanName | null {
  const url = new URL(request.url);
  const fromQuery = planFromQueryParam(url.searchParams.get("plan"));
  if (fromQuery) return fromQuery;

  for (const variantId of collectVariantIds(payload)) {
    const plan = variantToPlan(variantId);
    if (plan) return plan;
  }

  return null;
}

export function planFromSellHubPayload(payload: SellHubWebhookPayload): PlanName | null {
  for (const variantId of collectVariantIds(payload)) {
    const plan = variantToPlan(variantId);
    if (plan) return plan;
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
    deepFindString(payload, EMAIL_KEYS),
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
    payload.data?.invoiceId,
    payload.order?.id,
    payload.order?.orderId,
    deepFindString(payload, ["orderId", "order_id", "invoiceId", "invoice_id", "id"]),
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
}

const IGNORED_SELLHUB_EVENTS = new Set([
  "coupon.created",
  "coupon.updated",
  "coupon.deleted",
  "inventory.updated",
  "product.updated",
]);

export function shouldProcessSellHubWebhookEvent(event: string | undefined): boolean {
  if (!event) return true;
  if (IGNORED_SELLHUB_EVENTS.has(event)) return false;
  return true;
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
