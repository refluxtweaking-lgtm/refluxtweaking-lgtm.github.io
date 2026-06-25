import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resendLicenseEmail } from "@/lib/resend-license";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export const runtime = "nodejs";

/** Re-email the signed-in user's latest active license key. */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Accounts are not configured." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ success: false, message: "Log in to resend your license email." }, { status: 401 });
  }

  const result = await resendLicenseEmail({ email: normalizeBuyerEmail(user.email) });
  if (!result.ok) {
    return NextResponse.json({ success: false, message: result.error }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `License email sent to ${result.email}.`,
    emailed: result.emailed,
  });
}
