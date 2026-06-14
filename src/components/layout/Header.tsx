import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/app-preview", label: "The App" },
  { href: "/#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-100 px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 rounded-2xl border border-[rgba(241,91,80,0.2)] bg-[rgba(8,10,14,0.75)] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-2xl md:flex-row md:py-3.5">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-reflux-accent to-[#c43d35] text-sm font-black text-white shadow-[0_0_20px_rgba(241,91,80,0.4)] transition-transform group-hover:scale-105">
            R
          </span>
          <span className="logo-glow text-xl font-extrabold tracking-tight gradient-text md:text-2xl">
            REFLUX TWEAKS
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link text-sm">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="https://discord.gg/xGpHKY8AAC" variant="discord" external>
            Discord
          </Button>
          <Button
            href="https://app.refluxtweaks.com?plan=lifetime"
            variant="primary"
            showIcon
            external
          >
            Get App
          </Button>
        </div>
      </div>
    </header>
  );
}
