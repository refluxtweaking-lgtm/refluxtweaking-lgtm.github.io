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
  /^\/private(\/|$)/i,
  /^\/\.well-known\/acme-challenge\/\.\./i,
  /\.\./,
  /\.php$/i,
  /\.asp$/i,
  /\.aspx$/i,
];

const BLOCKED_PATHS = new Set(["/downloads/REFLUX-PRO-Setup.exe", "/downloads/REFLUX-PRO-v1.0-Setup.exe"]);

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

function applySecurityHeaders(response: NextResponse) {
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

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(pathname)) || BLOCKED_PATHS.has(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname === "/" && searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const session = isSupabaseConfigured()
    ? await updateSession(request)
    : { response: NextResponse.next(), user: null };

  if (pathname.startsWith("/account") && isSupabaseConfigured() && !session.user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(session.response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|downloads/REFLUX-FREE-Setup.exe|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
