/** Served from /public/downloads/ after syncing the electron-builder output. */
export const REFLUX_FREE_DOWNLOAD = {
  href: "/downloads/REFLUX-FREE-Setup.exe",
  filename: "REFLUX-FREE-Setup.exe",
  label: "REFLUX FREE",
} as const;

export const REFLUX_PRO_APP_URL = "https://app.refluxtweaks.com";

export function proCheckoutUrl(plan: "monthly" | "yearly" | "lifetime") {
  return `${REFLUX_PRO_APP_URL}?plan=${plan}`;
}
