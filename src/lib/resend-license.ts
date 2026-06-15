import { sendLicenseEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export type ResendLicenseResult =
  | {
      ok: true;
      email: string;
      plan: string;
      licenseId: string;
      emailed: boolean;
      dryRun?: boolean;
    }
  | { ok: false; error: string };

/**
 * Re-sends the purchase email for a buyer's latest active license.
 * Does not issue a new key — only emails the existing one from Supabase.
 */
export async function resendLicenseEmail(options: {
  email: string;
  dryRun?: boolean;
}): Promise<ResendLicenseResult> {
  const buyerEmail = normalizeBuyerEmail(options.email);
  if (!buyerEmail) {
    return { ok: false, error: "A valid email address is required." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin is not configured." };
  }

  const { data, error } = await admin
    .from("licenses")
    .select("id, email, plan, license_key, status")
    .ilike("email", buyerEmail)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[resend-license] Supabase query failed:", error.message);
    return { ok: false, error: "Could not look up license for this email." };
  }

  if (!data?.license_key) {
    return { ok: false, error: "No active license found for this email." };
  }

  if (options.dryRun) {
    return {
      ok: true,
      email: buyerEmail,
      plan: data.plan,
      licenseId: data.id,
      emailed: false,
      dryRun: true,
    };
  }

  const emailed = await sendLicenseEmail(buyerEmail, data.plan, data.license_key);
  if (!emailed) {
    return { ok: false, error: "Email could not be sent. Check Resend configuration and logs." };
  }

  return {
    ok: true,
    email: buyerEmail,
    plan: data.plan,
    licenseId: data.id,
    emailed: true,
  };
}
