"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthActionState = { error: string } | null;

function readEmail(formData: FormData) {
  return String(formData.get("email") ?? "").trim();
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
}

function readCredentials(formData: FormData) {
  const email = readEmail(formData);
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

function safeRedirectPath(next: string | null | undefined) {
  const value = next?.trim();
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
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

  redirect(safeRedirectPath(String(formData.get("next") ?? "")));
}

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Accounts aren't enabled yet. Please try again later." };
  }

  const email = readEmail(formData);
  if (!email) {
    return { error: "Enter the email on your account." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/forgot-password?sent=1");
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Accounts aren't enabled yet. Please try again later." };
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your reset link expired. Request a new one from the login page." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?passwordUpdated=1");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
