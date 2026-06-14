import Link from "next/link";

export function AccountsDisabledNotice() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8 text-center shadow-[0_0_60px_rgba(241,91,80,0.08)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">Accounts aren&apos;t enabled yet</h1>
        <p className="mt-4 text-sm leading-relaxed text-reflux-muted">
          User accounts are still being set up. You can still grab the free download or a PRO plan in
          the meantime — your license key will be emailed to you after purchase.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-reflux-accent hover:shadow-[0_0_24px_rgba(241,91,80,0.4)]"
          >
            View pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-reflux-border/60 bg-transparent px-5 py-2.5 text-sm font-semibold text-reflux-muted transition-all hover:border-reflux-accent/40 hover:text-white"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
