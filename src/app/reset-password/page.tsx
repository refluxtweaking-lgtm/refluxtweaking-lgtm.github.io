import { SiteShell } from "@/components/layout/SiteShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AccountsDisabledNotice } from "@/components/auth/AccountsDisabledNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password – REFLUX TWEAKS",
  robots: { index: false },
};

export default async function ResetPasswordPage() {
  let hasSession = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasSession = Boolean(user);
  }

  return (
    <SiteShell mainClassName="flex min-h-[80vh] items-center justify-center py-16">
      {isSupabaseConfigured() ? (
        <ResetPasswordForm hasSession={hasSession} />
      ) : (
        <AccountsDisabledNotice />
      )}
    </SiteShell>
  );
}
