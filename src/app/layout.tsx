import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const refluxBody = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-reflux-body",
  display: "swap",
});

const refluxDisplay = Outfit({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-reflux-display",
  display: "swap",
});

const refluxMetric = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-reflux-metric",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.refluxtweaks.com";
const SITE_TITLE = "REFLUX TWEAKS – Windows Gaming Optimizer";
const SITE_DESCRIPTION =
  "Windows gaming optimizer built for your specs. Detects your CPU and GPU, applies proven tweaks, and keeps every change reversible — free desktop app.";

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
    <html lang="en" className="bg-black">
      <body
        className={`${refluxBody.variable} ${refluxDisplay.variable} ${refluxMetric.variable} bg-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
