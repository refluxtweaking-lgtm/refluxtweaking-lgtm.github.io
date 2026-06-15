"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { Icon } from "@/components/ui/Icon";

const floatingStats = [
  { id: "fps", label: "Avg FPS", value: "+52", unit: "", icon: "bolt" as const, pos: "top-6 -left-4 md:-left-8", delay: "0s" },
  { id: "lat", label: "Latency", value: "-6", unit: "ms", icon: "target" as const, pos: "top-1/3 -right-2 md:-right-6", delay: "0.4s" },
  { id: "low", label: "1% Lows", value: "+50", unit: "FPS", icon: "chart" as const, pos: "bottom-16 -left-2 md:-left-4", delay: "0.8s" },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="hero-showcase-glow pointer-events-none absolute -inset-8 rounded-[40px] opacity-80" aria-hidden="true" />
      <div className="hero-showcase-ring pointer-events-none absolute -inset-px rounded-[28px]" aria-hidden="true" />

      <div className="hero-showcase-tilt relative">
        <div className="hero-scanlines pointer-events-none absolute inset-0 z-10 rounded-[24px]" aria-hidden="true" />
        <AppPreviewMock hero autoPlay />

        {floatingStats.map((stat) => (
          <div
            key={stat.id}
            className={`hero-float-card absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0c10]/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(241,91,80,0.12)] backdrop-blur-md ${stat.pos}`}
            style={{ animationDelay: stat.delay }}
          >
            <span className="icon-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/30 bg-reflux-accent/10">
              <Icon name={stat.icon} size={18} />
            </span>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">{stat.label}</div>
              <div className="text-lg font-extrabold tabular-nums text-reflux-green">
                {stat.value}
                {stat.unit && <span className="ml-0.5 text-xs font-semibold text-reflux-muted">{stat.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
