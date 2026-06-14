import { NextResponse } from "next/server";
import { addPurchase, normalizePlan } from "@/lib/purchase-store";

export async function POST(request: Request) {
  const secret = process.env.PURCHASE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const user = typeof payload.user === "string" ? payload.user : typeof payload.username === "string" ? payload.username : "";
  const planRaw = typeof payload.plan === "string" ? payload.plan : "";
  const location =
    typeof payload.location === "string"
      ? payload.location
      : typeof payload.country === "string"
        ? payload.country
        : "Unknown";

  if (!user.trim()) {
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  }

  const plan = normalizePlan(planRaw);
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const purchase = await addPurchase({ user, plan, location });
  if (!purchase) {
    return NextResponse.json({ error: "Purchase store unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, id: purchase.id });
}
