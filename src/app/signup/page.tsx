import { SiteShell } from "@/components/layout/SiteShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { AccountsDisabledNotice } from "@/components/auth/AccountsDisabledNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up – REFLUX TWEAKS",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      {isSupabaseConfigured() ? (
        <AuthForm mode="signup" />
      ) : (
        <AccountsDisabledNotice />
      )}
    </SiteShell>
  );
}
