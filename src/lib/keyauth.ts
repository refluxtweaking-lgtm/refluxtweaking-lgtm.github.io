export type KeyAuthPlan = "monthly" | "yearly" | "lifetime";

export type KeyAuthResult = { ok: true; key: string } | { ok: false; error: string };

const PLAN_EXPIRY_DAYS: Record<KeyAuthPlan, number> = {
  monthly: 30,
  yearly: 365,
  lifetime: 3650,
};

/**
 * Generates a single license key via the KeyAuth Seller API.
 * Degrades gracefully: returns { ok:false } instead of throwing when the
 * seller key is missing or KeyAuth is unreachable.
 */
export async function createKeyAuthLicense(plan: KeyAuthPlan): Promise<KeyAuthResult> {
  const sellerKey = process.env.KEYAUTH_SELLER_KEY?.trim();
  if (!sellerKey) {
    return { ok: false, error: "KeyAuth not configured" };
  }

  const days = PLAN_EXPIRY_DAYS[plan];
  const note = encodeURIComponent(`REFLUX PRO ${plan}`);
  const url =
    `https://keyauth.win/api/seller/?sellerkey=${sellerKey}` +
    `&type=add&format=JSON&expiry=${days}&mask=******-******-******` +
    `&level=1&amount=1&owner=REFLUX&character=2&note=${note}`;

  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      key?: string;
      keys?: string[];
    };

    const key =
      (typeof data.key === "string" && data.key) ||
      (Array.isArray(data.keys) && typeof data.keys[0] === "string" && data.keys[0]) ||
      "";

    if (data.success && key) {
      return { ok: true, key };
    }

    return { ok: false, error: data.message || "KeyAuth did not return a key" };
  } catch {
    return { ok: false, error: "Could not reach KeyAuth" };
  }
}
