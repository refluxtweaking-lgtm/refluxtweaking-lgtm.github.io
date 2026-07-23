import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { LicenseKeyBox } from "@/components/auth/LicenseKeyBox";
import { LicenseAccessStatus } from "@/components/auth/LicenseAccessStatus";
import { ProDownloadButton } from "@/components/auth/ProDownloadButton";
import { ResendLicenseEmailButton } from "@/components/auth/ResendLicenseEmailButton";
import { DiscordUsernameCard } from "@/components/auth/DiscordUsernameCard";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isProLicenseCurrentlyValid } from "@/lib/pro-download-access";
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
  activated_at: string | null;
  activated_hwid: string | null;
  access_expires_at: string | null;
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
      .select("id, email, plan, license_key, status, created_at, activated_at, activated_hwid, access_expires_at")
      .ilike("email", accountEmail)
      .order("created_at", { ascending: false });
    licenses = (data as LicenseRow[] | null) ?? [];
  }

  const activeLicenses = licenses.filter(
    (license) =>
      license.status.toLowerCase() === "active" &&
      isProLicenseCurrentlyValid({
        id: license.id,
        plan: license.plan,
        status: license.status,
        access_expires_at: license.access_expires_at,
        activated_at: license.activated_at,
      }),
  );
  const expiredLicenses = licenses.filter(
    (license) =>
      license.status.toLowerCase() === "active" &&
      license.activated_at &&
      license.access_expires_at &&
      license.plan.trim().toLowerCase() !== "lifetime" &&
      new Date(license.access_expires_at).getTime() <= Date.now(),
  );

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

        <div className="mb-6">
          <Link
            href="/"
            className="reflux-glow-interactive inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-reflux-muted hover:text-white"
          >
            ← Back to home
          </Link>
        </div>

        <h2 className="reflux-glow-readable mb-4 inline-block rounded-full px-3 py-1 text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">
          Your license keys
        </h2>

        {activeLicenses.length > 0 ? <DiscordUsernameCard /> : null}

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
                Install the desktop app and sign in with this account. Enter your license key once — it binds to your PC and unlocks automatically after that.
              </p>
              <ProDownloadButton />
            </div>
            {activeLicenses.map((license) => (
              <div key={license.id} className="reflux-glow-box rounded-2xl p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{planLabel(license.plan)}</h3>
                  <span className="reflux-glow-interactive-active rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-reflux-accent">
                    {license.status}
                  </span>
                </div>
                <LicenseAccessStatus
                  plan={license.plan}
                  activatedAt={license.activated_at}
                  accessExpiresAt={license.access_expires_at}
                />
                <LicenseKeyBox licenseKey={license.license_key} />
                <ResendLicenseEmailButton />
                <p className="mt-3 text-xs text-reflux-muted">
                  {license.activated_hwid
                    ? "Activated on your PC — this key cannot be reused on another device."
                    : "Not activated yet — paste this key in REFLUX PRO on the PC you want to use."}
                </p>
                <p className="mt-1 text-xs text-reflux-muted">
                  Purchased {formatDate(license.created_at)}
                </p>
              </div>
            ))}
            {expiredLicenses.map((license) => (
              <div key={`expired-${license.id}`} className="reflux-glow-box rounded-2xl border border-red-500/20 p-6 opacity-90">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{planLabel(license.plan)}</h3>
                  <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-300">
                    Expired
                  </span>
                </div>
                <LicenseAccessStatus
                  plan={license.plan}
                  activatedAt={license.activated_at}
                  accessExpiresAt={license.access_expires_at}
                />
                <Link
                  href="/pricing"
                  className="reflux-glow-interactive mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgba(255,77,61,0.28)] to-[rgba(255,77,61,0.12)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Renew plan
                </Link>
              </div>
            ))}
          </div>
        )}

        <p className="reflux-glow-readable mt-8 rounded-xl px-4 py-3 text-center text-xs text-reflux-text-soft">
          {activeLicenses.length > 0
            ? "Your license is tied to this account email. We also email your key after purchase — use the button above if you need it resent."
            : "Purchase a plan while signed in with this email — your license key is emailed and saved here automatically."}
        </p>
      </div>
    </SiteShell>
  );
}
