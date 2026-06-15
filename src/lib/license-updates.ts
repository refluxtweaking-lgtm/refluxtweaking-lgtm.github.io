import { createKeyAuthLicense, deleteKeyAuthLicense, type KeyAuthPlan } from "@/lib/keyauth";
import { sendLicenseUpdateEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export type LicenseRow = {
  id: string;
  email: string;
  plan: string;
  license_key: string;
  status: string;
  created_at: string;
  app_version?: string | null;
};

export type LicenseUpdateSummary = {
  version: string;
  dryRun: boolean;
  totalRecipients: number;
  sent: number;
  skipped: number;
  failed: number;
  results: Array<{
    email: string;
    plan: KeyAuthPlan;
    status: "sent" | "skipped" | "failed";
    reason?: string;
    newKey?: string;
  }>;
};

function normalizePlan(plan: string): KeyAuthPlan | null {
  const value = plan.trim().toLowerCase();
  if (value === "monthly" || value === "yearly" || value === "lifetime") return value;
  return null;
}

function pickLatestLicensePerEmail(rows: LicenseRow[]): LicenseRow[] {
  const byEmail = new Map<string, LicenseRow>();
  for (const row of rows) {
    const existing = byEmail.get(row.email);
    if (!existing || new Date(row.created_at).getTime() > new Date(existing.created_at).getTime()) {
      byEmail.set(row.email, row);
    }
  }
  return [...byEmail.values()];
}

async function alreadySentVersion(email: string, version: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const { data, error } = await admin
    .from("license_update_dispatches")
    .select("id")
    .eq("email", email)
    .eq("version", version)
    .maybeSingle();

  if (error) {
    if (error.message.includes("license_update_dispatches")) {
      console.warn("[license-updates] Dispatch table missing — dedup disabled until schema is applied.");
      return false;
    }
    console.error("[license-updates] Dispatch lookup failed:", error.message);
    return false;
  }

  return Boolean(data);
}

async function recordDispatch(email: string, version: string, licenseId: string | null) {
  const admin = createAdminClient();
  if (!admin) return;

  const { error } = await admin.from("license_update_dispatches").insert({
    email,
    version,
    license_id: licenseId,
  });

  if (error) {
    console.error("[license-updates] Failed to record dispatch:", error.message);
  }
}

async function replaceLicensesForEmail(
  email: string,
  plan: KeyAuthPlan,
  newKey: string,
  version: string,
): Promise<{ licenseId: string | null; revoked: number }> {
  const admin = createAdminClient();
  if (!admin) return { licenseId: null, revoked: 0 };

  const { data: existing, error: fetchError } = await admin
    .from("licenses")
    .select("id, license_key")
    .eq("email", email)
    .eq("status", "active");

  if (fetchError) {
    console.error("[license-updates] Failed to load active licenses:", fetchError.message);
  }

  let revoked = 0;
  for (const row of existing ?? []) {
    const deleted = await deleteKeyAuthLicense(row.license_key);
    if (deleted.ok) revoked += 1;
  }

  if ((existing ?? []).length > 0) {
    const { error: replaceError } = await admin
      .from("licenses")
      .update({ status: "replaced", replaced_at: new Date().toISOString() })
      .eq("email", email)
      .eq("status", "active");

    if (replaceError) {
      console.error("[license-updates] Failed to mark old licenses replaced:", replaceError.message);
    }
  }

  const { data: inserted, error: insertError } = await admin
    .from("licenses")
    .insert({
      email,
      plan,
      license_key: newKey,
      status: "active",
      app_version: version,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[license-updates] Failed to insert replacement license:", insertError.message);
    return { licenseId: null, revoked };
  }

  return { licenseId: inserted?.id ?? null, revoked };
}

export async function sendLicenseUpdates(options: {
  version: string;
  notes?: string;
  dryRun?: boolean;
  email?: string;
}): Promise<LicenseUpdateSummary> {
  const version = options.version.trim();
  const dryRun = Boolean(options.dryRun);
  const notes = options.notes?.trim() || undefined;

  const summary: LicenseUpdateSummary = {
    version,
    dryRun,
    totalRecipients: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    results: [],
  };

  if (!version) {
    summary.results.push({
      email: options.email ?? "*",
      plan: "monthly",
      status: "failed",
      reason: "Version is required.",
    });
    summary.failed = 1;
    return summary;
  }

  const admin = createAdminClient();
  if (!admin) {
    summary.results.push({
      email: options.email ?? "*",
      plan: "monthly",
      status: "failed",
      reason: "Supabase admin is not configured.",
    });
    summary.failed = 1;
    return summary;
  }

  let query = admin
    .from("licenses")
    .select("id, email, plan, license_key, status, created_at, app_version")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (options.email?.trim()) {
    query = query.eq("email", options.email.trim());
  }

  const { data, error } = await query;
  if (error) {
    summary.results.push({
      email: options.email ?? "*",
      plan: "monthly",
      status: "failed",
      reason: error.message,
    });
    summary.failed = 1;
    return summary;
  }

  const recipients = pickLatestLicensePerEmail((data as LicenseRow[] | null) ?? []);
  summary.totalRecipients = recipients.length;

  for (const recipient of recipients) {
    const plan = normalizePlan(recipient.plan);
    if (!plan) {
      summary.failed += 1;
      summary.results.push({
        email: recipient.email,
        plan: "monthly",
        status: "failed",
        reason: `Unknown plan "${recipient.plan}".`,
      });
      continue;
    }

    if (await alreadySentVersion(recipient.email, version)) {
      summary.skipped += 1;
      summary.results.push({
        email: recipient.email,
        plan,
        status: "skipped",
        reason: `Already sent version ${version}.`,
      });
      continue;
    }

    if (dryRun) {
      summary.skipped += 1;
      summary.results.push({
        email: recipient.email,
        plan,
        status: "skipped",
        reason: "Dry run — no email sent.",
      });
      continue;
    }

    const license = await createKeyAuthLicense(plan, version);
    if (!license.ok) {
      summary.failed += 1;
      summary.results.push({
        email: recipient.email,
        plan,
        status: "failed",
        reason: license.error,
      });
      continue;
    }

    const replaced = await replaceLicensesForEmail(recipient.email, plan, license.key, version);
    const emailed = await sendLicenseUpdateEmail(recipient.email, plan, license.key, version, notes);

    if (!emailed) {
      summary.failed += 1;
      summary.results.push({
        email: recipient.email,
        plan,
        status: "failed",
        reason: "Email delivery failed.",
        newKey: license.key,
      });
      continue;
    }

    await recordDispatch(recipient.email, version, replaced.licenseId);
    summary.sent += 1;
    summary.results.push({
      email: recipient.email,
      plan,
      status: "sent",
      reason:
        replaced.revoked > 0
          ? `Issued new key and revoked ${replaced.revoked} previous key(s).`
          : "Issued new key.",
      newKey: license.key,
    });
  }

  return summary;
}
