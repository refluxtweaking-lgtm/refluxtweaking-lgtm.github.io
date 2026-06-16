import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
const SITE_TITLE = "REFLUX TWEAKS – Windows Gaming Optimizer";
const SITE_DESCRIPTION =
  `${PRODUCT_LIMITS.freeTweaks} free tweaks · ${PRODUCT_LIMITS.totalTweaksLabel} with Pro — lower latency, higher frames, and a cleaner rig with one click.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/web-icon.ico", sizes: "any" },
      { url: "/web-icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/web-icon.ico",
    apple: "/web-icon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "REFLUX TWEAKS",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "REFLUX TWEAKS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} antialiased`}>{children}</body>
    </html>
  );
}
