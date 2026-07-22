import { SiteShell } from "@/components/layout/SiteShell";
import { RedeemLicenseForm } from "@/components/auth/RedeemLicenseForm";
import { AccountsDisabledNotice } from "@/components/auth/AccountsDisabledNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem License – REFLUX TWEAKS",
  robots: { index: false },
};

export default function RedeemPage() {
  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-md">
        {isSupabaseConfigured() ? <RedeemLicenseForm /> : <AccountsDisabledNotice />}
        <p className="mt-6 text-center text-sm text-reflux-muted">
          Prefer an account?{" "}
          <Link href="/login" className="font-semibold text-reflux-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
