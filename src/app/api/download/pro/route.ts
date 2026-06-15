import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { REFLUX_PRO_DOWNLOAD } from "@/data/downloads";
import { emailHasActiveProLicense } from "@/lib/pro-download-access";
import { verifyProDownloadToken } from "@/lib/pro-download-token";
import { createClient } from "@/lib/supabase/server";
import { normalizeBuyerEmail } from "@/lib/normalize-email";

export const runtime = "nodejs";

const INSTALLER_PATH = path.join(
  process.cwd(),
  "private",
  "downloads",
  REFLUX_PRO_DOWNLOAD.filename,
);

async function resolveBuyerEmail(request: Request): Promise<string | null> {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (token) {
    const verified = verifyProDownloadToken(token);
    if (verified?.email) return verified.email;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ? normalizeBuyerEmail(user.email) : null;
}

export async function GET(request: Request) {
  const email = await resolveBuyerEmail(request);
  if (!email) {
    return NextResponse.json(
      { error: "Sign in or use the download link from your purchase email." },
      { status: 401 },
    );
  }

  const allowed = await emailHasActiveProLicense(email);
  if (!allowed) {
    return NextResponse.json(
      { error: "No active REFLUX PRO license found for this account." },
      { status: 403 },
    );
  }

  try {
    const buffer = await readFile(INSTALLER_PATH);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${REFLUX_PRO_DOWNLOAD.filename}"`,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "REFLUX PRO installer not found." }, { status: 404 });
  }
}
