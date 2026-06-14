import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/middleware";

const BLOCKED_PATTERNS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/wp-/i,
  /^\/wpadmin/i,
  /^\/phpmyadmin/i,
  /^\/administrator/i,
  /^\/\.well-known\/acme-challenge\/\.\./i,
  /\.\./,
  /\.php$/i,
  /\.asp$/i,
  /\.aspx$/i,
];

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.cloudflare.steamstatic.com https://shared.fastly.steamstatic.com https://cdn.akamai.steamstatic.com https://cdn2.unrealengine.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // Safety net: Supabase auth confirmation links can land on "/" with a
  // ?code=... param (when the project's Site URL points at the root). Forward
  // it to the real callback route so the session exchange still completes.
  if (pathname === "/" && searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const response = isSupabaseConfigured()
    ? await updateSession(request)
    : NextResponse.next();

  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|downloads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|exe)$).*)",
  ],
};
