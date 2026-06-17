"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { FlowIn } from "@/components/ui/FlowIn";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const indicators: {
  icon: IconName;
  text: string;
  sub: string;
  accent: string;
  iconBg: string;
  glow: string;
}[] = [
  {
    icon: "bolt",
    text: `${PRODUCT_LIMITS.freeTweaks} free tweaks`,
    sub: "No card needed — start in minutes",
    accent: "border-reflux-accent/45",
    iconBg: "border-reflux-accent/40 bg-reflux-accent/20 text-reflux-accent",
    glow: "shadow-[0_0_40px_-10px_rgba(255,107,91,0.55)]",
  },
  {
    icon: "chat",
    text: "Discord community",
    sub: "Help when you need it",
    accent: "border-reflux-discord/45",
    iconBg: "border-reflux-discord/40 bg-reflux-discord/20 text-reflux-discord",
    glow: "shadow-[0_0_40px_-10px_rgba(88,101,242,0.5)]",
  },
  {
    icon: "disk",
    text: "Restore points",
    sub: "Before every change",
    accent: "border-reflux-calm/45",
    iconBg: "border-reflux-calm/40 bg-reflux-calm/20 text-reflux-calm",
    glow: "shadow-[0_0_40px_-10px_rgba(94,196,239,0.5)]",
  },
  {
    icon: "undo",
    text: "Fully reversible",
    sub: "Undo any tweak",
    accent: "border-reflux-green/45",
    iconBg: "border-reflux-green/40 bg-reflux-green/20 text-reflux-green",
    glow: "shadow-[0_0_40px_-10px_rgba(78,232,138,0.45)]",
  },
  {
    icon: "shield",
    text: "No malware",
    sub: "Clean & transparent",
    accent: "border-reflux-purple/45",
    iconBg: "border-reflux-purple/40 bg-reflux-purple/20 text-reflux-purple",
    glow: "shadow-[0_0_40px_-10px_rgba(183,148,246,0.45)]",
  },
  {
    icon: "sparkle",
    text: "Zero bloat",
    sub: "Runs only when you open it",
    accent: "border-[#ff9f43]/45",
    iconBg: "border-[#ff9f43]/40 bg-[#ff9f43]/20 text-[#ff9f43]",
    glow: "shadow-[0_0_40px_-10px_rgba(255,159,67,0.45)]",
  },
];

export function TrustIndicators() {
  return (
    <section className="section-flow section-band">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((item, index) => (
          <FlowIn key={item.text} delay={index * 60}>
            <div
              className={`trust-bento-card trust-card-pop flex h-full min-h-[120px] items-center gap-4 rounded-2xl border bg-white/[0.05] p-5 backdrop-blur-md sm:p-6 ${item.accent} ${item.glow}`}
            >
              <span
                className={`icon-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}
              >
                <Icon name={item.icon} size={22} glow />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-white md:text-lg">{item.text}</div>
                <div className="mt-1 text-sm leading-snug text-[#a8b4c8]">{item.sub}</div>
              </div>
            </div>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
