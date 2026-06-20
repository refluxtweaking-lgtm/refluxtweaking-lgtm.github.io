import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

type LicenseAccessRow = {
  id: string;
  plan: string;
  status: string;
  access_expires_at: string | null;
  activated_at: string | null;
};

function isLicenseDownloadAllowed(license: LicenseAccessRow): boolean {
  if (license.status.toLowerCase() !== "active") return false;

  const plan = license.plan.trim().toLowerCase();
  if (plan === "lifetime") return true;

  // Not yet activated — buyer can still download the installer.
  if (!license.activated_at || !license.access_expires_at) return true;

  const expiresMs = new Date(license.access_expires_at).getTime();
  if (Number.isNaN(expiresMs)) return true;

  return expiresMs > Date.now();
}

export async function emailHasActiveProLicense(email: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const normalized = normalizeBuyerEmail(email);
  const { data, error } = await admin
    .from("licenses")
    .select("id, plan, status, access_expires_at, activated_at")
    .eq("email", normalized)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[pro-download] License lookup failed:", error.message);
    return false;
  }

  const rows = (data as LicenseAccessRow[] | null) ?? [];
  return rows.some(isLicenseDownloadAllowed);
}

export function isProLicenseCurrentlyValid(license: LicenseAccessRow): boolean {
  return isLicenseDownloadAllowed(license);
}
