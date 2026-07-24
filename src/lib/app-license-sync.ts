import { createAdminClient } from "@/lib/supabase/admin";
import { notifyLicenseUpdateFireAndForget } from "@/lib/reflux-licenses-update";

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

/** Resolve an active license that is already unlocked on this device HWID. */
export async function fetchLicenseByKeyAndHwid(
  licenseKey: string,
  hwid: string,
): Promise<LicenseRow | null> {
  const admin = createAdminClient();
  const key = licenseKey?.trim();
  const device = hwid?.trim();
  if (!admin || !key || !device || device.length < 8) return null;

  const { data, error } = await admin
    .from("licenses")
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .eq("status", "active")
    .eq("license_key", key)
    .maybeSingle();

  if (error) {
    console.error("[app-sync] License key lookup failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as LicenseRow;
  if (!row.activated_hwid || row.activated_hwid !== device) return null;
  if (row.access_expires_at) {
    const exp = Date.parse(row.access_expires_at);
    if (Number.isFinite(exp) && exp < Date.now()) return null;
  }
  return row;
}

export function buildSyncResponse(license: LicenseRow, hwid: string): AppSyncPayload {
  if (license.plan === "lifetime") {
    const sameDevice = license.activated_hwid === hwid;
    const allowed = sameDevice && !!license.activated_hwid;
    return {
      allowed,
      isLifetime: true,
      ...(allowed ? { licenseKey: license.license_key } : {}),
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

  if (sameDevice && license.activated_at) {
    const activatedAt = new Date(license.activated_at).getTime();
    const accessExpiresAt = license.access_expires_at
      ? new Date(license.access_expires_at).getTime()
      : activatedAt + duration;
    const secondsRemaining = Math.max(0, Math.floor((accessExpiresAt - Date.now()) / 1000));
    const allowed = secondsRemaining > 0;

    return {
      allowed,
      expired: secondsRemaining <= 0,
      needsActivation: false,
      ...(allowed ? { licenseKey: license.license_key } : {}),
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

  if (!sameDevice || !license.activated_hwid) {
    return {
      allowed: false,
      needsActivation: true,
      plan: license.plan,
      status: license.status,
      isLifetime: false,
      reason: license.activated_hwid && !sameDevice ? "hwid_mismatch" : "not_activated",
    };
  }

  const accessExpiresAt = new Date(license.access_expires_at!).getTime();
  const activatedAt = license.activated_at
    ? new Date(license.activated_at).getTime()
    : accessExpiresAt - duration;
  const secondsRemaining = Math.max(0, Math.floor((accessExpiresAt - Date.now()) / 1000));
  const allowed = secondsRemaining > 0;

  return {
    allowed,
    expired: secondsRemaining <= 0,
    needsActivation: false,
    ...(allowed ? { licenseKey: license.license_key } : {}),
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

/** Include license key only after password auth (login), not on token-only sync. */
export function sanitizeSyncForClient(
  sync: AppSyncPayload,
  options?: { afterPasswordAuth?: boolean; licenseKey?: string },
): AppSyncPayload {
  if (sync.allowed) return sync;
  if (options?.afterPasswordAuth && options.licenseKey) {
    return { ...sync, licenseKey: options.licenseKey };
  }
  const { licenseKey: _omit, ...rest } = sync;
  return rest;
}

export async function resyncLicenseAccess(
  email: string,
  hwid: string,
  localKey?: string,
): Promise<AppSyncPayload> {
  const license = await fetchActiveLicense(email);
  if (!license) return { allowed: false, noLicense: true };

  const sync = buildSyncResponse(license, hwid);
  if (sync.expired) {
    notifyLicenseUpdateFireAndForget({
      event: "expired",
      licenseKey: license.license_key,
      email,
      plan: license.plan,
      hwid,
      accessExpiresAt: sync.accessExpiresAt,
      activatedAt: sync.activatedAt,
      source: "resyncLicenseAccess",
    });
  } else if (sync.allowed) {
    notifyLicenseUpdateFireAndForget({
      event: "session",
      licenseKey: license.license_key,
      email,
      plan: license.plan,
      hwid,
      accessExpiresAt: sync.accessExpiresAt,
      activatedAt: sync.activatedAt,
      source: "resyncLicenseAccess",
    });
  }
  return sync;
}

export async function markLicenseActivated(
  email: string,
  licenseKey: string,
  hwid: string,
): Promise<AppSyncPayload | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: existing, error: lookupError } = await admin
    .from("licenses")
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .eq("license_key", licenseKey.trim())
    .ilike("email", email.trim())
    .eq("status", "active")
    .maybeSingle();

  if (lookupError) {
    console.error("[app-sync] Activation lookup failed:", lookupError.message);
    return null;
  }

  if (!existing) return null;

  if (existing.activated_hwid && existing.activated_hwid !== hwid) {
    return buildSyncResponse(existing as LicenseRow, hwid);
  }

  // Same PC signing in again (new app version, re-login, etc.) — never reset the countdown.
  if (existing.activated_hwid === hwid) {
    return buildSyncResponse(existing as LicenseRow, hwid);
  }

  const now = new Date();
  const plan = String(existing.plan || "monthly").trim().toLowerCase();
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
    .eq("id", existing.id)
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[app-sync] Activation update failed:", error.message);
    return null;
  }

  if (!data) return null;
  const sync = buildSyncResponse(data as LicenseRow, hwid);
  notifyLicenseUpdateFireAndForget({
    event: "activated",
    licenseKey: (data as LicenseRow).license_key,
    email,
    plan: (data as LicenseRow).plan,
    hwid,
    accessExpiresAt: sync.accessExpiresAt,
    activatedAt: sync.activatedAt,
    source: "markLicenseActivated",
  });
  return sync;
}

/** Move an active license to the current PC (one device at a time). Keeps remaining countdown. */
export async function transferLicenseToDevice(
  email: string,
  hwid: string,
): Promise<AppSyncPayload | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const license = await fetchActiveLicense(email);
  if (!license) return { allowed: false, noLicense: true };

  const plan = license.plan.trim().toLowerCase();
  const now = new Date();

  if (plan !== "lifetime" && license.access_expires_at) {
    const expiresMs = new Date(license.access_expires_at).getTime();
    if (expiresMs <= Date.now()) {
      return buildSyncResponse(license, hwid);
    }
  }

  const duration = PLAN_DURATION_MS[plan] ?? PLAN_DURATION_MS.monthly;
  const activatedAt = license.activated_at ? new Date(license.activated_at) : now;
  const accessExpiresAt =
    plan === "lifetime"
      ? null
      : license.access_expires_at
        ? new Date(license.access_expires_at)
        : new Date(activatedAt.getTime() + duration);

  const { data, error } = await admin
    .from("licenses")
    .update({
      activated_at: activatedAt.toISOString(),
      activated_hwid: hwid,
      access_expires_at: accessExpiresAt?.toISOString() ?? null,
    })
    .eq("id", license.id)
    .select(
      "id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[app-sync] Device transfer failed:", error.message);
    return null;
  }

  if (!data) return null;
  const sync = buildSyncResponse(data as LicenseRow, hwid);
  notifyLicenseUpdateFireAndForget({
    event: "transferred",
    licenseKey: (data as LicenseRow).license_key,
    email,
    plan: (data as LicenseRow).plan,
    hwid,
    accessExpiresAt: sync.accessExpiresAt,
    activatedAt: sync.activatedAt,
    source: "transferLicenseToDevice",
  });
  return sync;
}
