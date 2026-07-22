import { NextResponse } from "next/server";
import { redeemLicenseKey } from "@/lib/license-redeem";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { licenseKey?: string; reason?: string; note?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = await redeemLicenseKey({
    licenseKey: body.licenseKey || "",
    reason: body.reason || "",
    note: body.note || "",
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
