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
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Your account</h1>
            <p className="mt-2 text-sm text-reflux-text-soft">
              Signed in as{" "}
              <span className="reflux-glow-readable inline-block rounded-lg px-2 py-0.5 font-medium text-white">
                {user.email}
              </span>
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="reflux-glow-interactive inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-reflux-muted hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>

        <h2 className="reflux-glow-readable mb-4 inline-block rounded-full px-3 py-1 text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">
          Your license keys
        </h2>

        {activeLicenses.length === 0 ? (
          <div className="reflux-glow-box rounded-2xl p-8 text-center">
            {licenses.length === 0 ? (
              <>
                <p className="text-sm text-reflux-text">No licenses yet.</p>
                <p className="mt-2 text-sm text-reflux-text-soft">
                  Grab a plan to unlock REFLUX PRO — your key shows up here automatically after purchase.
                </p>
                <Link
                  href="/pricing"
                  className="reflux-glow-interactive mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white hover:text-white"
                >
                  View plans
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-reflux-text">No active license.</p>
                <p className="mt-2 text-sm text-reflux-text-soft">
                  Purchase a new plan or check your email for the latest update key.
                </p>
                <Link
                  href="/pricing"
                  className="reflux-glow-interactive mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white hover:text-white"
                >
                  View plans
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="reflux-glow-box rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white">Download REFLUX PRO</h3>
              <p className="mt-2 text-sm text-reflux-text-soft">
                Install the desktop app, then paste your active license key below when prompted.
              </p>
              <a
                href={REFLUX_PRO_DOWNLOAD.href}
                className="reflux-glow-interactive mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white hover:text-white"
              >
                Download {REFLUX_PRO_DOWNLOAD.label}
              </a>
            </div>
            {licenses.map((license) => (
              <div key={license.id} className="reflux-glow-box rounded-2xl p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{planLabel(license.plan)}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      license.status.toLowerCase() === "active"
                        ? "reflux-glow-interactive-active text-reflux-accent"
                        : "reflux-glow-readable text-reflux-muted"
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

        <p className="reflux-glow-readable mt-8 rounded-xl px-4 py-3 text-center text-xs text-reflux-text-soft">
          {activeLicenses.length > 0
            ? "Install REFLUX PRO, paste your key when prompted, and your access countdown starts on activation day."
            : "Purchase a plan to unlock REFLUX PRO and get your license key here."}
        </p>
      </div>
    </SiteShell>
  );
}
