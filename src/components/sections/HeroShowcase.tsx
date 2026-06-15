"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { Icon } from "@/components/ui/Icon";

const metrics = [
  { id: "fps", label: "Avg FPS", value: "+52", icon: "bolt" as const, tone: "text-reflux-green" },
  { id: "lat", label: "Latency", value: "-6 ms", icon: "target" as const, tone: "text-reflux-green" },
  { id: "low", label: "1% Lows", value: "+50 FPS", icon: "chart" as const, tone: "text-reflux-green" },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase mx-auto w-full max-w-xl lg:max-w-none">
      <div className="hero-device-shell relative overflow-hidden rounded-[28px] p-[1px]">
        <div className="hero-device-inner overflow-hidden rounded-[27px] bg-[#06080b]">
          <div className="flex items-center justify-between border-b border-white/6 bg-[#0a0c10] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-reflux-muted uppercase">
              Live preview
            </span>
          </div>

          <AppPreviewMock hero autoPlay />
        </div>
      </div>

      <div className="hero-metrics-bar mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-3 text-center backdrop-blur-sm sm:flex-row sm:px-3 sm:py-3.5 sm:text-left"
          >
            <span className="icon-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-reflux-accent/25 bg-reflux-accent/10 sm:h-10 sm:w-10">
              <Icon name={metric.icon} size={16} />
            </span>
            <div className="min-w-0">
              <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase sm:text-[10px]">
                {metric.label}
              </div>
              <div className={`text-sm font-extrabold tabular-nums sm:text-base ${metric.tone}`}>{metric.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
