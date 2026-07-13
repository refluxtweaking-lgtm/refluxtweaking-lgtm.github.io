import { createProDownloadToken } from "@/lib/pro-download-token";
import appReleases from "../../public/app-releases.json";

/** Served from /public/downloads/ after syncing the electron-builder output. */
export const REFLUX_FREE_DOWNLOAD = {
  href: "/downloads/REFLUX-FREE-Setup.exe",
  filename: "REFLUX-FREE-Setup.exe",
  version: appReleases.free.version,
  label: appReleases.free.label || `REFLUX FREE v${appReleases.free.version}`,
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
  /** Stable private filename used by the download API (installer artifact name). */
  filename: "REFLUX-PRO-v1.0-Setup.exe",
  version: appReleases.pro.version,
  label: appReleases.pro.label || `REFLUX PRO v${appReleases.pro.version}`,
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
