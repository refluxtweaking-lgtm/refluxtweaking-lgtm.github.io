"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { FlowIn } from "@/components/ui/FlowIn";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const indicators: { icon: IconName; text: string; sub: string }[] = [
  { icon: "bolt", text: `${PRODUCT_LIMITS.freeTweaks} free tweaks`, sub: "No card needed — start in minutes" },
  { icon: "chat", text: "Discord community", sub: "Help when you need it" },
  { icon: "disk", text: "Restore points", sub: "Before every change" },
  { icon: "undo", text: "Fully reversible", sub: "Undo any tweak" },
  { icon: "shield", text: "No malware", sub: "Clean & transparent" },
  { icon: "sparkle", text: "Zero bloat", sub: "Runs only when you open it" },
];

export function TrustIndicators() {
  return (
    <section className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((item, index) => (
          <FlowIn key={item.text} delay={index * 50}>
            <div className="trust-card flex h-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#12151c] p-5 transition-colors hover:border-white/[0.14] hover:bg-[#151922] sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <Icon name={item.icon} size={20} className="text-reflux-accent" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">{item.text}</div>
                <div className="mt-0.5 text-sm leading-snug text-reflux-muted">{item.sub}</div>
              </div>
            </div>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
