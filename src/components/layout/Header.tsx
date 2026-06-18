"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeaderAuth } from "./HeaderAuth";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";

const navLinks = [
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
    <header className="sticky top-0 z-100 px-4 py-4 md:px-6 md:py-5">
      <div className="relative mx-auto max-w-[1280px]">
        <div
          className={`header-shell flex min-h-[72px] items-center justify-between gap-5 rounded-2xl border px-5 py-4 backdrop-blur-xl md:min-h-[76px] md:gap-6 md:px-7 md:py-4 ${
            scrolled ? "header-shell-scrolled" : ""
          }`}
        >
          <Link
            href="/"
            className="header-brand group flex shrink-0 items-center gap-2.5 sm:gap-3"
            onClick={closeMenu}
            aria-label="REFLUX TWEAKS home"
          >
            <Image
              src="/favicon.ico"
              alt=""
              width={40}
              height={40}
              className="header-brand-icon h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10"
              priority
            />
            <span className="font-display whitespace-nowrap text-lg font-extrabold tracking-tight sm:text-xl md:text-2xl">
              <span className="gradient-text">REFLUX</span>
              <span className="text-white/85"> TWEAKS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-x-7 md:flex xl:gap-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link header-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3.5 md:flex md:gap-4">
            <HeaderAuth className="header-auth-btn" />
            <Button
              href="https://discord.gg/xGpHKY8AAC"
              variant="discord"
              external
              className="header-action-btn !px-6 !py-3 !text-[15px]"
            >
              Discord
            </Button>
            <Button
              href={REFLUX_FREE_DOWNLOAD.href}
              download={REFLUX_FREE_DOWNLOAD.filename}
              variant="primary"
              showIcon
              className="header-action-btn !px-6 !py-3 !text-[15px]"
            >
              Get App
            </Button>
          </div>

          <button
            type="button"
            className="icon-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/30 bg-reflux-accent/10 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} strokeWidth={2} />
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-label="Close menu"
            />

            <div
              id="mobile-nav"
              className="animate-fade-in-up absolute top-[calc(100%+8px)] right-0 left-0 z-[95] overflow-hidden rounded-2xl border border-reflux-accent/20 bg-black/95 shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_32px_rgba(255,77,61,0.12)] backdrop-blur-2xl md:hidden"
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
