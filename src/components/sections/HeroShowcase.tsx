"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0e12] shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#101318] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-reflux-muted uppercase">
            REFLUX PRO
          </span>
        </div>

        <AppPreviewMock hero autoPlay />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {[
          { label: "Before", value: "187 FPS", tone: "text-reflux-muted" },
          { label: "After", value: "239 FPS", tone: "text-reflux-green" },
          { label: "Gain", value: "+52 FPS", tone: "text-reflux-accent" },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-white/[0.08] bg-[#12151c] px-2 py-3 text-center sm:px-3"
          >
            <div className="text-[10px] font-medium tracking-wide text-reflux-muted uppercase">{row.label}</div>
            <div className={`mt-1 text-sm font-semibold tabular-nums sm:text-base ${row.tone}`}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
