import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, legalNav } from "@/data/legal";

interface LegalDocumentProps {
  title: string;
  children: React.ReactNode;
}

export function LegalDocument({ title, children }: LegalDocumentProps) {
  return (
    <SiteShell mainClassName="py-16">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-reflux-muted">
          Last updated {LEGAL_LAST_UPDATED}
        </p>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Legal documents">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="reflux-glow-interactive rounded-full px-3 py-1.5 text-xs font-semibold text-reflux-muted hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <article className="reflux-glow-box legal-prose mt-8 space-y-6 rounded-2xl p-6 text-sm leading-relaxed text-reflux-text-soft md:p-8">
          {children}
        </article>

        <p className="mt-8 text-center text-xs text-reflux-muted">
          Questions?{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-reflux-accent hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </SiteShell>
  );
}
