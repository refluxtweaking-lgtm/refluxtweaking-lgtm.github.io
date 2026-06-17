import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { SlideHeading } from "./SlideHeading";
import { PRODUCT_LIMITS } from "@/data/tweaks";

import type { SlideProps } from "./types";

const timeline = [
  { label: "Restore point created", state: "done" as const, time: "Before any change" },
  { label: "Tweaks applied", state: "active" as const, time: `${PRODUCT_LIMITS.totalTweaksLabel} optimizations` },
  { label: "One‑click revert ready", state: "ready" as const, time: "Anytime, zero risk" },
];

export function SafeReversibleSlide(_props: SlideProps) {
  return (
    <GlowCard centered hover={false} className="slide-tight w-full !p-3 sm:!p-5">
      <SlideHeading icon="shield" title="Safe & Reversible" />
      <p className="mb-2 hidden max-w-lg text-center text-sm text-reflux-muted sm:mb-3 sm:block">
        REFLUX creates a Windows System Restore point <em>before</em> it touches anything. Roll
        back in one click if you don&apos;t like a change.
      </p>

      <div className="mx-auto w-full max-w-md rounded-xl border border-reflux-border bg-[#0c0e12] p-2.5 sm:rounded-2xl sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-reflux-muted sm:text-xs">
            Restore Timeline
          </span>
          <span className="flex items-center gap-1 rounded-md bg-reflux-green/15 px-1.5 py-0.5 text-[9px] font-bold text-reflux-green sm:gap-1.5 sm:px-2 sm:text-[10px]">
            <span className="h-1 w-1 animate-pulse rounded-full bg-reflux-green sm:h-1.5 sm:w-1.5" />
            Protected
          </span>
        </div>

        <div className="relative space-y-2 pl-6 sm:space-y-2.5 sm:pl-7">
          <span className="absolute left-[8px] top-1.5 bottom-1.5 w-px bg-gradient-to-b from-reflux-green/60 via-reflux-accent/50 to-reflux-purple/50 sm:left-[10px]" />
          {timeline.map((step) => (
            <div key={step.label} className="relative flex items-start gap-2">
              <span
                className={`absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full border sm:-left-7 sm:h-5 sm:w-5 ${
                  step.state === "done"
                    ? "border-reflux-green/50 bg-reflux-green/15"
                    : step.state === "active"
                      ? "border-reflux-accent/50 bg-reflux-accent/15"
                      : "border-reflux-purple/50 bg-reflux-purple/15"
                }`}
              >
                {step.state === "done" ? (
                  <Icon name="check" size={11} strokeWidth={2.6} className="text-reflux-green" />
                ) : step.state === "ready" ? (
                  <Icon name="undo" size={11} className="text-reflux-purple" />
                ) : (
                  <Icon name="bolt" size={11} />
                )}
              </span>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#d8dee8] sm:text-sm">{step.label}</div>
                <div className="text-[10px] text-reflux-muted sm:text-[11px]">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}
