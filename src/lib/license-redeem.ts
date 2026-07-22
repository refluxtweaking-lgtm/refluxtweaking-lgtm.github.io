import { createAdminClient } from "@/lib/supabase/admin";
import { isProLicenseCurrentlyValid } from "@/lib/pro-download-access";
import { createProDownloadToken } from "@/lib/pro-download-token";
import { isClaimReason } from "@/lib/license-claim-reasons";

export type RedeemLicenseResult =
  | {
      ok: true;
      plan: string;
      status: string;
      activated: boolean;
      accessExpiresAt: string | null;
      isLifetime: boolean;
      validNow: boolean;
      downloadToken: string | null;
      message: string;
    }
  | { ok: false; error: string };

export async function redeemLicenseKey(input: {
  licenseKey: string;
  reason: string;
  note?: string;
}): Promise<RedeemLicenseResult> {
  const key = String(input.licenseKey || "").trim();
  const reasonRaw = String(input.reason || "").trim().toLowerCase();
  const note = String(input.note || "").trim().slice(0, 280);

  if (!key || key.length < 8) {
    return { ok: false, error: "Enter a valid license key." };
  }
  if (!isClaimReason(reasonRaw)) {
    return { ok: false, error: "Select how you got this license key." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "License lookup is temporarily unavailable." };
  }

  const { data, error } = await admin
    .from("licenses")
    .select("id, email, plan, license_key, status, activated_at, access_expires_at")
    .eq("license_key", key)
    .maybeSingle();

  if (error) {
    console.error("[redeem] lookup failed:", error.message);
    return { ok: false, error: "Could not verify that license key." };
  }
  if (!data) {
    return { ok: false, error: "That license key was not found." };
  }

  const validNow = isProLicenseCurrentlyValid({
    id: data.id,
    plan: data.plan,
    status: data.status,
    access_expires_at: data.access_expires_at,
    activated_at: data.activated_at,
  });

  if (String(data.status).toLowerCase() !== "active") {
    return { ok: false, error: "This license is not active." };
  }
  if (!validNow) {
    return {
      ok: false,
      error: "This license has expired. Renew at refluxtweaks.com/pricing.",
    };
  }

  const { error: claimError } = await admin.from("license_key_claims").insert({
    license_id: data.id,
    license_key: key,
    reason: reasonRaw,
    note: note || null,
  });
  if (claimError) {
    console.error("[redeem] claim insert failed:", claimError.message);
  }

  const plan = String(data.plan || "").trim().toLowerCase();
  const isLifetime = plan === "lifetime";
  const downloadToken = data.email ? createProDownloadToken(String(data.email)) : null;

  return {
    ok: true,
    plan: String(data.plan || "pro"),
    status: String(data.status || "active"),
    activated: Boolean(data.activated_at),
    accessExpiresAt: data.access_expires_at,
    isLifetime,
    validNow: true,
    downloadToken,
    message: isLifetime
      ? "Lifetime key verified. Download PRO and paste this key in the app."
      : data.activated_at && data.access_expires_at
        ? "Key verified. Your remaining access time is shown below — download PRO and paste this key in the app."
        : "Key verified. Time starts when you first activate it in the PRO app on your PC.",
  };
}
