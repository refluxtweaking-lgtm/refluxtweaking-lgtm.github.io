import { NextResponse } from "next/server";

export const runtime = "nodejs";

function healthAuthorized(request: Request): boolean {
  const secret = process.env.CHECKOUT_HEALTH_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const header = request.headers.get("authorization")?.trim() ?? "";
  return header === `Bearer ${secret}`;
}

/** Ops health check — hidden in production unless CHECKOUT_HEALTH_SECRET is set. */
export async function GET(request: Request) {
  if (!healthAuthorized(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    checkout: {
      provider: "sellhub",
      apiKeyConfigured: Boolean(process.env.SELLHUB_API_KEY?.trim()),
      webhookSecretConfigured: Boolean(process.env.SELLHUB_WEBHOOK_SECRET?.trim()),
      plansConfigured: {
        monthly: Boolean(
          process.env.SELLHUB_PRODUCT_MONTHLY?.trim() &&
            process.env.SELLHUB_VARIANT_MONTHLY?.trim(),
        ),
        yearly: Boolean(
          process.env.SELLHUB_PRODUCT_YEARLY?.trim() &&
            process.env.SELLHUB_VARIANT_YEARLY?.trim(),
        ),
        lifetime: Boolean(
          process.env.SELLHUB_PRODUCT_LIFETIME?.trim() &&
            process.env.SELLHUB_VARIANT_LIFETIME?.trim(),
        ),
      },
    },
    licenseDelivery: {
      keyAuthSellerKeyConfigured: Boolean(process.env.KEYAUTH_SELLER_KEY?.trim()),
      resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
      resendFromEmailConfigured: Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
      supabaseServiceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
      downloadSecretConfigured: Boolean(process.env.LICENSE_DOWNLOAD_SECRET?.trim()),
      ready:
        Boolean(process.env.KEYAUTH_SELLER_KEY?.trim()) &&
        Boolean(process.env.RESEND_API_KEY?.trim()) &&
        Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
      updateDispatchSecretConfigured: Boolean(process.env.LICENSE_UPDATE_SECRET?.trim()),
    },
  });
}
