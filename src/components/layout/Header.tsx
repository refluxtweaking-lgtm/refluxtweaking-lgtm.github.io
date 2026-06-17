"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeaderAuth } from "./HeaderAuth";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

const navLinks = [
  { href: "/#app-gallery", label: "The App" },
  { href: "/#features", label: "Features" },
  { href: "/#why-reflux", label: "Why REFLUX" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-100 px-4 py-3 md:px-6">
      <div className="relative mx-auto max-w-[1200px]">
        <div
          className={`header-shell flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[rgba(12,15,22,0.88)] px-4 py-3 md:px-5 md:py-3.5 ${
            scrolled ? "header-shell-scrolled" : ""
          }`}
        >
          <Link href="/" className="group flex min-w-0 items-center" onClick={closeMenu}>
            <span className="truncate text-lg font-extrabold tracking-tight gradient-text sm:text-xl md:text-2xl">
              REFLUX TWEAKS
            </span>
          </Link>

          <nav className="hidden items-center gap-x-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <HeaderAuth />
            <Button href="https://discord.gg/xGpHKY8AAC" variant="discord" external>
              Discord
            </Button>
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              showIcon
            >
              Get App
            </Button>
          </div>

          <button
            type="button"
            className="icon-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/30 bg-reflux-accent/10 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={22} strokeWidth={2} />
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-label="Close menu"
            />

            <div
              id="mobile-nav"
              className="animate-fade-in-up absolute top-[calc(100%+8px)] right-0 left-0 z-[95] overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.25)] bg-[rgba(8,10,14,0.95)] shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(241,91,80,0.12)] backdrop-blur-2xl md:hidden"
            >
              <nav className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-4 py-3.5 text-[15px] font-medium text-[#c0c8d2] transition-colors hover:bg-reflux-accent/10 hover:text-reflux-accent"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 border-t border-reflux-border/50 p-4">
                <HeaderAuth className="w-full" onNavigate={closeMenu} />
                <Button
                  href="https://discord.gg/xGpHKY8AAC"
                  variant="discord"
                  external
                  className="w-full"
                  onClick={closeMenu}
                >
                  Discord
                </Button>
                <Button
                  href={REFLUX_FREE_DOWNLOAD.href}
                  download={REFLUX_FREE_DOWNLOAD.filename}
                  variant="primary"
                  showIcon
                  className="w-full"
                  onClick={closeMenu}
                >
                  Get App
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
