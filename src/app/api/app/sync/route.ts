import { NextResponse } from "next/server";
import { verifyAppSyncToken } from "@/lib/app-sync-token";
import { markLicenseActivated, resyncLicenseAccess } from "@/lib/app-license-sync";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    token?: string;
    hwid?: string;
    localKey?: string;
    licenseKey?: string;
    markActivated?: boolean;
    plan?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const session = body.token ? verifyAppSyncToken(body.token) : null;
  if (!session) {
    return NextResponse.json({ success: false, message: "Session expired. Log in again." }, { status: 401 });
  }

  const hwid = body.hwid?.trim();
  if (!hwid || hwid.length < 8) {
    return NextResponse.json({ success: false, message: "Device verification failed." }, { status: 400 });
  }

  if (body.markActivated && body.licenseKey && body.plan) {
    const sync = await markLicenseActivated(session.email, body.licenseKey, hwid, body.plan);
    if (!sync) {
      return NextResponse.json({ success: false, message: "Could not record activation." }, { status: 500 });
    }
    return NextResponse.json({ success: true, sync });
  }

  const sync = await resyncLicenseAccess(session.email, hwid, body.localKey);
  return NextResponse.json({ success: true, sync });
}
