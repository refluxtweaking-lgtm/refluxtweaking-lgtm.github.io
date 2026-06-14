import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "REFLUX TWEAKS – Windows Gaming Optimizer",
  description:
    "30 free tweaks · 100+ with Pro — lower latency, higher frames, and a cleaner rig with one click.",
  icons: {
    icon: [
      { url: "/web-icon.ico", sizes: "any" },
      { url: "/web-icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/web-icon.ico",
    apple: "/web-icon.png",
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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
