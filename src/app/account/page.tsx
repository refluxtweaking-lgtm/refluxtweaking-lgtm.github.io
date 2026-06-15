import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { LicenseKeyBox } from "@/components/auth/LicenseKeyBox";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { REFLUX_PRO_DOWNLOAD } from "@/data/downloads";
import { normalizeBuyerEmail } from "@/lib/normalize-email";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Account – REFLUX TWEAKS",
  robots: { index: false },
};

type LicenseRow = {
  id: string;
  email: string;
  plan: string;
  license_key: string;
  status: string;
  created_at: string;
};

function planLabel(plan: string) {
  const value = plan.trim().toLowerCase();
  if (value === "monthly") return "REFLUX PRO Monthly";
  if (value === "yearly") return "REFLUX PRO Yearly";
  if (value === "lifetime") return "REFLUX PRO Lifetime";
  return `REFLUX PRO ${plan}`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let licenses: LicenseRow[] = [];
  if (user.email) {
    const accountEmail = normalizeBuyerEmail(user.email);
    const { data } = await supabase
      .from("licenses")
      .select("id, email, plan, license_key, status, created_at")
      .ilike("email", accountEmail)
      .order("created_at", { ascending: false });
    licenses = (data as LicenseRow[] | null) ?? [];
  }

  const activeLicenses = licenses.filter((license) => license.status.toLowerCase() === "active");

  return (
    <SiteShell mainClassName="py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Your account</h1>
            <p className="mt-1 text-sm text-reflux-muted">
              Signed in as <span className="font-medium text-white">{user.email}</span>
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl border border-reflux-border/60 bg-transparent px-4 py-2 text-sm font-semibold text-reflux-muted transition-all hover:border-reflux-accent/40 hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>

        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">
          Your license keys
        </h2>

        {activeLicenses.length === 0 ? (
          <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8 text-center shadow-[0_0_60px_rgba(241,91,80,0.08)]">
            {licenses.length === 0 ? (
              <>
                <p className="text-sm text-reflux-text">No licenses yet.</p>
                <p className="mt-2 text-sm text-reflux-muted">
                  Grab a plan to unlock REFLUX PRO — your key shows up here automatically after purchase.
                </p>
                <Link
                  href="/pricing"
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-reflux-accent hover:shadow-[0_0_24px_rgba(241,91,80,0.4)]"
                >
                  View plans
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-reflux-text">No active license.</p>
                <p className="mt-2 text-sm text-reflux-muted">
                  Purchase a new plan or check your email for the latest update key.
                </p>
                <Link
                  href="/pricing"
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-reflux-accent hover:shadow-[0_0_24px_rgba(241,91,80,0.4)]"
                >
                  View plans
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-6 shadow-[0_0_60px_rgba(241,91,80,0.08)]">
              <h3 className="text-lg font-bold text-white">Download REFLUX PRO</h3>
              <p className="mt-2 text-sm text-reflux-muted">
                Install the desktop app, then paste your active license key below when prompted.
              </p>
              <a
                href={REFLUX_PRO_DOWNLOAD.href}
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-reflux-accent hover:shadow-[0_0_24px_rgba(241,91,80,0.4)]"
              >
                Download {REFLUX_PRO_DOWNLOAD.label}
              </a>
            </div>
            {licenses.map((license) => (
              <div
                key={license.id}
                className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-6 shadow-[0_0_60px_rgba(241,91,80,0.08)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{planLabel(license.plan)}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      license.status.toLowerCase() === "active"
                        ? "border-reflux-accent/40 bg-[rgba(241,91,80,0.12)] text-reflux-accent"
                        : "border-reflux-border/60 bg-white/5 text-reflux-muted"
                    }`}
                  >
                    {license.status}
                  </span>
                </div>
                <LicenseKeyBox licenseKey={license.license_key} />
                <p className="mt-3 text-xs text-reflux-muted">
                  Purchased {formatDate(license.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-reflux-muted">
          {activeLicenses.length > 0
            ? "Install REFLUX PRO, paste your key when prompted, and your access countdown starts on activation day."
            : "Purchase a plan to unlock REFLUX PRO and get your license key here."}
        </p>
      </div>
    </SiteShell>
  );
}
