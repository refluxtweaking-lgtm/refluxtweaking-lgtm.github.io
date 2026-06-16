import { SiteShell } from "@/components/layout/SiteShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AccountsDisabledNotice } from "@/components/auth/AccountsDisabledNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password – REFLUX TWEAKS",
  robots: { index: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      {isSupabaseConfigured() ? (
        <ForgotPasswordForm sent={Boolean(sent)} />
      ) : (
        <AccountsDisabledNotice />
      )}
    </SiteShell>
  );
}
