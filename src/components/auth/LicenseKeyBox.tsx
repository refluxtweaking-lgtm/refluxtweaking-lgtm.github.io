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
      className={`group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
        copied ? "reflux-glow-interactive-active" : "reflux-glow-interactive hover:-translate-y-0.5"
      }`}
    >
      <code className="reflux-metric break-all text-sm text-reflux-accent">{licenseKey}</code>
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-reflux-muted group-hover:text-white">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
