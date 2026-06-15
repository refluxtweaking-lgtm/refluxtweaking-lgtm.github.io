import { NextResponse } from "next/server";
import { sendLicenseUpdates } from "@/lib/license-updates";

export const runtime = "nodejs";

type UpdateRequestBody = {
  version?: string;
  notes?: string;
  dryRun?: boolean;
  email?: string;
};

function isAuthorized(request: Request): boolean {
  const secret = process.env.LICENSE_UPDATE_SECRET?.trim();
  if (!secret) return false;

  const header =
    request.headers.get("authorization")?.trim() ??
    request.headers.get("x-license-update-secret")?.trim() ??
    "";

  if (header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim() === secret;
  }

  return header === secret;
}

/** Protected endpoint for sending update emails + replacement license keys. */
export async function POST(request: Request) {
  if (!process.env.LICENSE_UPDATE_SECRET?.trim()) {
    return NextResponse.json({ error: "License update dispatch is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: UpdateRequestBody;
  try {
    body = (await request.json()) as UpdateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const version = body.version?.trim();
  if (!version) {
    return NextResponse.json({ error: "version is required." }, { status: 400 });
  }

  const summary = await sendLicenseUpdates({
    version,
    notes: body.notes,
    dryRun: body.dryRun,
    email: body.email,
  });

  return NextResponse.json({
    ...summary,
    results: summary.results.map(({ newKey: _removed, ...result }) => result),
  });
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
