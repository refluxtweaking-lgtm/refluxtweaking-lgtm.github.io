import { NextResponse } from "next/server";
import { resendLicenseEmail } from "@/lib/resend-license";

export const runtime = "nodejs";

type ResendRequestBody = {
  email?: string;
  dryRun?: boolean;
};

function resolveSecret(): string | null {
  return (
    process.env.LICENSE_RESEND_SECRET?.trim() ||
    process.env.LICENSE_UPDATE_SECRET?.trim() ||
    null
  );
}

function isAuthorized(request: Request, secret: string): boolean {
  const header =
    request.headers.get("authorization")?.trim() ??
    request.headers.get("x-license-resend-secret")?.trim() ??
    request.headers.get("x-license-update-secret")?.trim() ??
    "";

  if (header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim() === secret;
  }

  return header === secret;
}

/** Protected endpoint — re-email an existing active license key to a buyer. */
export async function POST(request: Request) {
  const secret = resolveSecret();
  if (!secret) {
    return NextResponse.json({ error: "License resend is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ResendRequestBody;
  try {
    body = (await request.json()) as ResendRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  const result = await resendLicenseEmail({
    email,
    dryRun: body.dryRun,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
