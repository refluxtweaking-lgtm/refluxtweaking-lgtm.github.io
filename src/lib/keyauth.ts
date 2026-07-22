export type KeyAuthPlan = "monthly" | "yearly" | "lifetime";

export type KeyAuthResult = { ok: true; key: string } | { ok: false; error: string };

const PLAN_EXPIRY_DAYS: Record<KeyAuthPlan, number> = {
  monthly: 30,
  yearly: 365,
  lifetime: 3650,
};

function sellerKeyOrError(): { ok: true; sellerKey: string } | { ok: false; error: string } {
  const sellerKey = process.env.KEYAUTH_SELLER_KEY?.trim();
  if (!sellerKey) return { ok: false, error: "KeyAuth not configured" };
  return { ok: true, sellerKey };
}

/**
 * Generates a single license key via the KeyAuth Seller API.
 * Degrades gracefully: returns { ok:false } instead of throwing when the
 * seller key is missing or KeyAuth is unreachable.
 */
export async function createKeyAuthLicense(
  plan: KeyAuthPlan,
  appVersion?: string,
): Promise<KeyAuthResult> {
  const auth = sellerKeyOrError();
  if (!auth.ok) return auth;

  const days = PLAN_EXPIRY_DAYS[plan];
  const versionSuffix = appVersion?.trim() ? ` v${appVersion.trim()}` : "";
  const note = encodeURIComponent(`REFLUX PRO ${plan}${versionSuffix}`);
  const url =
    `https://keyauth.win/api/seller/?sellerkey=${auth.sellerKey}` +
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

/** Deletes a license key in KeyAuth so replaced keys stop working after an update blast. */
export async function deleteKeyAuthLicense(licenseKey: string): Promise<KeyAuthResult> {
  const auth = sellerKeyOrError();
  if (!auth.ok) return auth;

  const key = licenseKey.trim();
  if (!key) return { ok: false, error: "Missing license key" };

  const url =
    `https://keyauth.win/api/seller/?sellerkey=${auth.sellerKey}` +
    `&type=del&format=JSON&key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (data.success) return { ok: true, key };
    return { ok: false, error: data.message || "KeyAuth did not delete the key" };
  } catch {
    return { ok: false, error: "Could not reach KeyAuth" };
  }
}

export type KeyAuthVerifyResult =
  | { ok: true; key: string; message?: string }
  | { ok: false; error: string };

/** Seller API: confirm a license key exists in KeyAuth (keys created outside Supabase). */
export async function verifyKeyAuthLicenseExists(licenseKey: string): Promise<KeyAuthVerifyResult> {
  const auth = sellerKeyOrError();
  if (!auth.ok) return auth;

  const key = licenseKey.trim();
  if (!key) return { ok: false, error: "Missing license key" };

  const url =
    `https://keyauth.win/api/seller/?sellerkey=${auth.sellerKey}` +
    `&type=verify&format=JSON&key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (data.success) {
      return { ok: true, key, message: data.message };
    }
    return { ok: false, error: data.message || "License key not found in KeyAuth" };
  } catch {
    return { ok: false, error: "Could not reach KeyAuth" };
  }
}
