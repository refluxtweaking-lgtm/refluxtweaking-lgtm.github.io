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

export function proCheckoutUrl(plan: "monthly" | "yearly" | "lifetime") {
  return `${REFLUX_PRO_APP_URL}?plan=${plan}`;
}
