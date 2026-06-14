"use client";

import { useState } from "react";

export function LicenseKeyBox({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable; ignore.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Click to copy"
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.85)] px-4 py-3 text-left transition-colors hover:border-reflux-accent/50"
    >
      <code className="break-all font-mono text-sm text-reflux-accent">{licenseKey}</code>
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-reflux-muted group-hover:text-white">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
