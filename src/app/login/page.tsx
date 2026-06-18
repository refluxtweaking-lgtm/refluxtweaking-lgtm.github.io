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
  searchParams: Promise<{ checkEmail?: string; passwordUpdated?: string; error?: string; next?: string }>;
}) {
  const { checkEmail, passwordUpdated, error, next } = await searchParams;

  let notice: string | null = null;
  if (checkEmail) {
    notice = "Account created. Check your email to confirm, then log in.";
  } else if (passwordUpdated) {
    notice = "Password updated. Log in with your new password.";
  } else if (error === "auth") {
    notice = "That link expired or is invalid. Try logging in or reset your password.";
  }

  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      {isSupabaseConfigured() ? (
        <AuthForm
          mode="login"
          notice={notice}
          next={next}
        />
      ) : (
        <AccountsDisabledNotice />
      )}
    </SiteShell>
  );
}
