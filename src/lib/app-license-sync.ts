import { createAdminClient } from "@/lib/supabase/admin";

export type AppPlan = "monthly" | "yearly" | "lifetime";

const PLAN_DURATION_MS: Record<string, number> = {
  monthly: 30 * 24 * 60 * 60 * 1000,
  yearly: 365 * 24 * 60 * 60 * 1000,
};

export type LicenseRow = {
  id: string;
  email: string;
  plan: string;
  license_key: string;
  status: string;
  created_at: string;
  activated_at: string | null;
  activated_hwid: string | null;
  access_expires_at: string | null;
};

export type AppSyncPayload = {
  allowed: boolean;
  expired?: boolean;
  noLicense?: boolean;
  needsActivation?: boolean;
  reason?: string;
  licenseKey?: string;
  plan?: string;
  status?: string;
  isLifetime?: boolean;
  accessExpiresAt?: number | null;
  activatedAt?: number | null;
  secondsRemaining?: number | null;
  daysLeft?: number | null;
  isLastDay?: boolean;
};

export async function fetchActiveLicense(email: string): Promise<LicenseRow | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("licenses")
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .eq("status", "active")
    .ilike("email", email.trim())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[app-sync] License lookup failed:", error.message);
    return null;
  }

  return data as LicenseRow | null;
}

export function buildSyncResponse(license: LicenseRow, hwid: string): AppSyncPayload {
  if (license.plan === "lifetime") {
    const sameDevice = license.activated_hwid === hwid;
    return {
      allowed: sameDevice && !!license.activated_hwid,
      isLifetime: true,
      licenseKey: license.license_key,
      plan: license.plan,
      status: license.status,
      needsActivation: !sameDevice || !license.activated_hwid,
      accessExpiresAt: null,
      activatedAt: license.activated_at ? new Date(license.activated_at).getTime() : null,
      secondsRemaining: null,
      daysLeft: null,
    };
  }

  const duration = PLAN_DURATION_MS[license.plan] ?? PLAN_DURATION_MS.monthly;
  const sameDevice = license.activated_hwid === hwid;

  if (!sameDevice || !license.access_expires_at) {
    return {
      allowed: false,
      needsActivation: true,
      licenseKey: license.license_key,
      plan: license.plan,
      status: license.status,
      isLifetime: false,
      reason: license.activated_hwid && !sameDevice ? "hwid_mismatch" : "not_activated",
    };
  }

  const accessExpiresAt = new Date(license.access_expires_at).getTime();
  const activatedAt = license.activated_at
    ? new Date(license.activated_at).getTime()
    : accessExpiresAt - duration;
  const secondsRemaining = Math.max(0, Math.floor((accessExpiresAt - Date.now()) / 1000));

  return {
    allowed: secondsRemaining > 0,
    expired: secondsRemaining <= 0,
    needsActivation: false,
    licenseKey: license.license_key,
    plan: license.plan,
    status: license.status,
    isLifetime: false,
    accessExpiresAt,
    activatedAt,
    secondsRemaining,
    daysLeft: Math.ceil(secondsRemaining / 86400),
    isLastDay: secondsRemaining <= 86400,
  };
}

export async function resyncLicenseAccess(
  email: string,
  hwid: string,
  localKey?: string,
): Promise<AppSyncPayload> {
  const license = await fetchActiveLicense(email);
  if (!license) return { allowed: false, noLicense: true };

  if (localKey && localKey.trim() !== license.license_key) {
    const admin = createAdminClient();
    if (admin && license.activated_hwid === hwid) {
      await admin
        .from("licenses")
        .update({
          activated_at: null,
          activated_hwid: null,
          access_expires_at: null,
        })
        .eq("id", license.id);
      license.activated_at = null;
      license.activated_hwid = null;
      license.access_expires_at = null;
    }
  }

  return buildSyncResponse(license, hwid);
}

export async function markLicenseActivated(
  email: string,
  licenseKey: string,
  hwid: string,
  plan: string,
): Promise<AppSyncPayload | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const now = new Date();
  const duration = PLAN_DURATION_MS[plan] ?? PLAN_DURATION_MS.monthly;
  const accessExpiresAt =
    plan === "lifetime" ? null : new Date(now.getTime() + duration);

  const { data, error } = await admin
    .from("licenses")
    .update({
      activated_at: now.toISOString(),
      activated_hwid: hwid,
      access_expires_at: accessExpiresAt?.toISOString() ?? null,
    })
    .eq("license_key", licenseKey.trim())
    .ilike("email", email.trim())
    .eq("status", "active")
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[app-sync] Activation update failed:", error.message);
    return null;
  }

  if (!data) return null;
  return buildSyncResponse(data as LicenseRow, hwid);
}
