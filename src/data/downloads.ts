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

/** Served from /public/downloads/ after syncing the PRO electron-builder output. */
export const REFLUX_PRO_DOWNLOAD = {
  href: "/downloads/REFLUX-PRO-Setup.exe",
  filename: "REFLUX-PRO-Setup.exe",
  label: "REFLUX PRO",
} as const;

export function proDownloadUrl(siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com") {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${REFLUX_PRO_DOWNLOAD.href}`;
}

export type ProPlanId = "monthly" | "yearly" | "lifetime";

export function proCheckoutUrl(plan: ProPlanId) {
  return `/checkout/${plan}`;
}
