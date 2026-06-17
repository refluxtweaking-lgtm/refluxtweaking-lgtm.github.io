"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { FlowIn } from "@/components/ui/FlowIn";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const indicators: {
  icon: IconName;
  text: string;
  sub: string;
  featured?: boolean;
}[] = [
  { icon: "bolt", text: `${PRODUCT_LIMITS.freeTweaks} free tweaks`, sub: "No card needed", featured: true },
  { icon: "chat", text: "Discord community", sub: "Help when you need it" },
  { icon: "disk", text: "Restore points", sub: "Before every change" },
  { icon: "undo", text: "Fully reversible", sub: "Undo any tweak" },
  { icon: "shield", text: "No malware", sub: "Clean & transparent" },
  { icon: "sparkle", text: "Zero bloat", sub: "Runs only when you open it" },
];

export function TrustIndicators() {
  return (
    <section className="section-flow section-band">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((item, index) => (
          <FlowIn
            key={item.text}
            delay={index * 70}
            className={item.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
          >
            <div
              className={`trust-bento-card flex h-full items-center gap-4 rounded-2xl border border-white/10 p-5 sm:p-6 ${
                item.featured
                  ? "trust-bento-featured flex-col items-start justify-end sm:min-h-[220px] lg:min-h-[260px]"
                  : "bg-white/[0.03] backdrop-blur-sm"
              }`}
            >
              <span
                className={`icon-chip flex shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] ${
                  item.featured ? "h-14 w-14" : "h-11 w-11"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={item.featured ? 26 : 20}
                  className={item.featured ? "text-reflux-accent" : "text-reflux-calm"}
                  glow
                />
              </span>
              <div className="min-w-0">
                <div className={`font-bold text-white ${item.featured ? "text-xl md:text-2xl" : ""}`}>
                  {item.text}
                </div>
                <div className={`mt-1 text-reflux-muted ${item.featured ? "text-sm md:text-base" : "text-sm"}`}>
                  {item.sub}
                </div>
                {item.featured && (
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#9aa5b8]">
                    Start optimizing in minutes — download, detect your hardware, apply tweaks.
                  </p>
                )}
              </div>
            </div>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
