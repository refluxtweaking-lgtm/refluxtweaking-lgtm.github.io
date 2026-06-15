"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthActionState = { error: string } | null;

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
}

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Accounts aren't enabled yet. Please try again later." };
  }

  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Enter both an email and a password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) {
    return { error: error.message };
  }

  // When email confirmation is disabled in Supabase, signUp returns an active
  // session and the user is logged in immediately — send them to their account.
  // When confirmation is enabled, there's no session yet, so tell them to check
  // their inbox.
  if (data.session) {
    redirect("/account");
  }

  redirect("/login?checkEmail=1");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Accounts aren't enabled yet. Please try again later." };
  }

  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Enter both an email and a password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/account");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
