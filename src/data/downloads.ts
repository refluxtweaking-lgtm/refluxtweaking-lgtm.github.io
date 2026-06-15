import { createProDownloadToken } from "@/lib/pro-download-token";

/** Served from /public/downloads/ after syncing the electron-builder output. */
export const REFLUX_FREE_DOWNLOAD = {
  href: "/downloads/REFLUX-FREE-Setup.exe",
  filename: "REFLUX-FREE-Setup.exe",
  label: "REFLUX FREE",
} as const;

export const REFLUX_BRAND_BANNER = {
  href: "/downloads/REFLUX-Banner-2048x1152.png",
  downloadHref: "/api/download/banner",
  filename: "REFLUX-Banner-2048x1152.png",
  label: "REFLUX Banner",
  width: 2048,
  height: 1152,
} as const;

export const REFLUX_PRO_APP_URL = "https://app.refluxtweaks.com";

/** Gated download — served only via /api/download/pro after purchase verification. */
export const REFLUX_PRO_DOWNLOAD = {
  href: "/api/download/pro",
  filename: "REFLUX-PRO-Setup.exe",
  label: "REFLUX PRO",
} as const;

export function proDownloadUrl(
  buyerEmail?: string,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com",
) {
  const base = siteUrl.replace(/\/$/, "");

  if (buyerEmail?.trim()) {
    const token = createProDownloadToken(buyerEmail.trim());
    if (token) return `${base}${REFLUX_PRO_DOWNLOAD.href}?token=${encodeURIComponent(token)}`;
  }

  return `${base}${REFLUX_PRO_DOWNLOAD.href}`;
}

export type ProPlanId = "monthly" | "yearly" | "lifetime";

export function proCheckoutUrl(plan: ProPlanId) {
  return `/checkout/${plan}`;
}
