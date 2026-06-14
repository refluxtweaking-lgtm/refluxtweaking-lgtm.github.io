import { SiteShell } from "@/components/layout/SiteShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { AccountsDisabledNotice } from "@/components/auth/AccountsDisabledNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In – REFLUX TWEAKS",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string }>;
}) {
  const { checkEmail } = await searchParams;

  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      {isSupabaseConfigured() ? (
        <AuthForm
          mode="login"
          notice={
            checkEmail
              ? "Account created. Check your email to confirm, then log in."
              : null
          }
        />
      ) : (
        <AccountsDisabledNotice />
      )}
    </SiteShell>
  );
}
