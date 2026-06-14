import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { SlideHeading } from "./SlideHeading";

import type { SlideProps } from "./types";

const timeline = [
  { label: "Restore point created", state: "done" as const, time: "Before any change" },
  { label: "Tweaks applied", state: "active" as const, time: "130+ optimizations" },
  { label: "One‑click revert ready", state: "ready" as const, time: "Anytime, zero risk" },
];

export function SafeReversibleSlide(_props: SlideProps) {
  return (
    <GlowCard centered className="w-full">
      <SlideHeading icon="shield" title="Safe & Reversible" />
      <p className="mb-6 max-w-lg text-center text-reflux-muted">
        REFLUX creates a Windows System Restore point <em>before</em> it touches anything. If you
        don&apos;t like a change, roll the whole thing back in one click.
      </p>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-reflux-border bg-[#0c0e12] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-reflux-muted">
            Restore Timeline
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-reflux-green/15 px-2 py-0.5 text-[10px] font-bold text-reflux-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
            Protected
          </span>
        </div>

        <div className="relative space-y-4 pl-7">
          <span className="absolute left-[10px] top-2 bottom-2 w-px bg-gradient-to-b from-reflux-green/60 via-reflux-accent/50 to-reflux-purple/50" />
          {timeline.map((step) => (
            <div key={step.label} className="relative flex items-start gap-3">
              <span
                className={`absolute -left-7 flex h-5 w-5 items-center justify-center rounded-full border ${
                  step.state === "done"
                    ? "border-reflux-green/50 bg-reflux-green/15"
                    : step.state === "active"
                      ? "border-reflux-accent/50 bg-reflux-accent/15"
                      : "border-reflux-purple/50 bg-reflux-purple/15"
                }`}
              >
                {step.state === "done" ? (
                  <Icon name="check" size={12} strokeWidth={2.6} className="text-reflux-green" />
                ) : step.state === "ready" ? (
                  <Icon name="undo" size={12} className="text-reflux-purple" />
                ) : (
                  <Icon name="bolt" size={12} />
                )}
              </span>
              <div className="text-left">
                <div className="text-sm font-semibold text-[#d8dee8]">{step.label}</div>
                <div className="text-[11px] text-reflux-muted">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-[#C0C8D2]">
        One‑click revert to a previous state. Zero risk.
      </p>
    </GlowCard>
  );
}
