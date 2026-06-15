import { createKeyAuthLicense, type KeyAuthPlan } from "@/lib/keyauth";
import { sendLicenseEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export type DeliverLicenseResult =
  | { ok: true; key: string; emailed: boolean; stored: boolean }
  | { ok: false; error: string };

/**
 * Issues a KeyAuth license, stores it in Supabase, and emails it to the buyer.
 * Never throws — callers can always continue after a failure.
 */
export async function deliverLicense(
  email: string,
  plan: KeyAuthPlan,
  options?: { appVersion?: string },
): Promise<DeliverLicenseResult> {
  try {
    const buyerEmail = normalizeBuyerEmail(email);
    const license = await createKeyAuthLicense(plan, options?.appVersion);
    if (!license.ok) {
      return { ok: false, error: license.error };
    }

    let stored = false;
    const admin = createAdminClient();
    if (admin) {
      const row: Record<string, string | null> = {
        email: buyerEmail,
        plan,
        license_key: license.key,
        status: "active",
        created_at: new Date().toISOString(),
      };
      if (options?.appVersion) {
        row.app_version = options.appVersion;
      }

      const { error } = await admin.from("licenses").insert(row);
      if (error) {
        console.error("[license-delivery] Supabase insert failed:", error.message);
      } else {
        stored = true;
      }
    } else {
      console.warn("[license-delivery] Supabase admin not configured — license not stored.");
    }

    const emailed = await sendLicenseEmail(buyerEmail, plan, license.key);
    return { ok: true, key: license.key, emailed, stored };
  } catch (err) {
    const message = err instanceof Error ? err.message : "License delivery failed";
    return { ok: false, error: message };
  }
}
