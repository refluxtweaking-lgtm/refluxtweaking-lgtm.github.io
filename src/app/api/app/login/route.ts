import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAppSyncToken } from "@/lib/app-sync-token";
import { resyncLicenseAccess } from "@/lib/app-license-sync";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Accounts are not configured." }, { status: 503 });
  }

  let body: { email?: string; password?: string; hwid?: string; localKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const hwid = body.hwid?.trim();

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
  }
  if (!hwid || hwid.length < 8) {
    return NextResponse.json({ success: false, message: "Device verification failed." }, { status: 400 });
  }

  const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email) {
    const raw = error?.message?.toLowerCase() ?? "";
    let message = "Invalid email or password.";
    if (raw.includes("confirm") || raw.includes("verified") || raw.includes("verification")) {
      message = "Confirm your email at refluxtweaks.com first, then try again.";
    } else if (raw.includes("invalid") || raw.includes("credentials")) {
      message = "Invalid email or password.";
    } else if (error?.message) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 401 });
  }

  const token = createAppSyncToken(data.user.email);
  if (!token) {
    return NextResponse.json({ success: false, message: "App sync is not configured." }, { status: 503 });
  }

  const sync = await resyncLicenseAccess(data.user.email, hwid, body.localKey);

  return NextResponse.json({
    success: true,
    token,
    email: data.user.email,
    sync,
  });
}
