import Link from "next/link";

const footerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare Tweaks" },
  { href: "/app-preview", label: "The App" },
  { href: "/banner", label: "Banner" },
  { href: "/#faq", label: "FAQ" },
  { href: "https://discord.gg/xGpHKY8AAC", label: "Discord", external: true },
  { href: "mailto:refluxtweaking@gmail.com", label: "Contact", external: true },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-[rgba(241,91,80,0.15)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-reflux-accent/50 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1200px] px-5 py-14">
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <div className="mb-2 text-2xl font-extrabold gradient-text">REFLUX TWEAKS</div>
            <p className="max-w-sm text-sm text-reflux-muted">
              30 free tweaks · 100+ with Pro. Lower ping, higher FPS, cleaner PC.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-reflux-border/60 bg-reflux-card/40 px-4 py-2 text-sm font-medium text-reflux-muted transition-all hover:border-reflux-accent/40 hover:text-reflux-accent"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-reflux-border/60 bg-reflux-card/40 px-4 py-2 text-sm font-medium text-reflux-muted transition-all hover:border-reflux-accent/40 hover:text-reflux-accent"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
        <p className="text-center text-xs text-[#5F6A7A]">
          © 2026 REFLUX TWEAKS. All rights reserved. Safe · Reversible · No background processes.
        </p>
      </div>
    </footer>
  );
}
