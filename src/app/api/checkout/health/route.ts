import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Public health check — confirms payment + license delivery env vars (never exposes secrets). */
export async function GET() {
  const apiKey = process.env.MONEYMOTION_API_KEY?.trim();
  const sandbox = process.env.MONEYMOTION_SANDBOX === "true";

  return NextResponse.json({
    checkout: {
      apiKeyConfigured: Boolean(apiKey),
      keyPrefix: apiKey ? apiKey.slice(0, 7) + "..." : null,
      sandbox,
      webhookSecretConfigured: Boolean(process.env.MONEYMOTION_WEBHOOK_SECRET?.trim()),
    },
    licenseDelivery: {
      keyAuthSellerKeyConfigured: Boolean(process.env.KEYAUTH_SELLER_KEY?.trim()),
      resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
      resendFromEmailConfigured: Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
      supabaseServiceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
      ready:
        Boolean(process.env.KEYAUTH_SELLER_KEY?.trim()) &&
        Boolean(process.env.RESEND_API_KEY?.trim()) &&
        Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
      updateDispatchSecretConfigured: Boolean(process.env.LICENSE_UPDATE_SECRET?.trim()),
    },
  });
}
