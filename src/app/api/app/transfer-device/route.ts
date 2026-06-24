import { NextResponse } from "next/server";
import { verifyAppSyncToken } from "@/lib/app-sync-token";
import { transferLicenseToDevice, sanitizeSyncForClient } from "@/lib/app-license-sync";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { token?: string; hwid?: string };
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

  const sync = await transferLicenseToDevice(session.email, hwid);
  if (!sync) {
    return NextResponse.json({ success: false, message: "Could not move license to this PC." }, { status: 500 });
  }

  if (sync.expired) {
    return NextResponse.json({
      success: false,
      expired: true,
      message: "Your license period has ended. Renew at refluxtweaks.com.",
      sync: sanitizeSyncForClient(sync),
    });
  }

  if (sync.noLicense) {
    return NextResponse.json({
      success: false,
      noLicense: true,
      message: "No active license on your account.",
      sync: sanitizeSyncForClient(sync),
    });
  }

  return NextResponse.json({ success: true, transferred: true, sync: sanitizeSyncForClient(sync) });
}
