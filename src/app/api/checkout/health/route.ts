import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Public health check — confirms Vercel has the API key loaded (never exposes the key). */
export async function GET() {
  const apiKey = process.env.MONEYMOTION_API_KEY?.trim();
  const sandbox = process.env.MONEYMOTION_SANDBOX === "true";

  return NextResponse.json({
    apiKeyConfigured: Boolean(apiKey),
    keyPrefix: apiKey ? apiKey.slice(0, 7) + "..." : null,
    sandbox,
    webhookSecretConfigured: Boolean(process.env.MONEYMOTION_WEBHOOK_SECRET?.trim()),
  });
}
