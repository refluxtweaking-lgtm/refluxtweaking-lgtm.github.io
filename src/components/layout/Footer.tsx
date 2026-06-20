import Link from "next/link";
import Image from "next/image";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { legalNav } from "@/data/legal";
import { Button } from "@/components/ui/Button";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

const footerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare Tweaks" },
  { href: "/app-preview", label: "The App" },
  { href: "/#faq", label: "FAQ" },
  { href: "https://discord.gg/xGpHKY8AAC", label: "Discord", external: true },
  { href: "mailto:refluxtweaking@gmail.com?subject=REFLUX%20Support", label: "Contact", external: true },
];

export function Footer() {
  return (
    <footer className="footer-shell relative mt-24 border-t border-reflux-accent/15">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-reflux-accent/60 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
        <div className="mb-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image src="/favicon.ico" alt="" width={36} height={36} className="rounded-lg" />
              <span className="text-2xl font-extrabold gradient-text-static">REFLUX TWEAKS</span>
            </div>
            <p className="max-w-md text-base leading-relaxed text-reflux-muted">
              {PRODUCT_LIMITS.freeTweaks} free tweaks · {PRODUCT_LIMITS.totalTweaksLabel} with Pro. Lower ping, higher FPS, cleaner PC — one desktop app.
            </p>
            <div className="mt-6">
              <Button
                href={REFLUX_FREE_DOWNLOAD.href}
                download={REFLUX_FREE_DOWNLOAD.filename}
                variant="primary"
                showIcon
              >
                Download Free
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reflux-glow-interactive rounded-xl px-4 py-3 text-sm font-medium text-reflux-muted transition-all hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="reflux-glow-interactive rounded-xl px-4 py-3 text-sm font-medium text-reflux-muted transition-all hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/5 pt-8 text-center text-xs text-reflux-muted">
          {legalNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-reflux-accent">
              {item.label}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-reflux-muted">
          © 2026 REFLUX TWEAKS. All rights reserved. Safe · Reversible · No background processes.
        </p>
      </div>
    </footer>
  );
}
