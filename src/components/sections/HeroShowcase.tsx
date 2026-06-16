"use client";

import { AppPreviewMock } from "@/components/app/AppPreviewMock";
import { Icon } from "@/components/ui/Icon";

const metrics = [
  { id: "fps", label: "Avg FPS", value: "+52", icon: "bolt" as const },
  { id: "lat", label: "Latency", value: "-6 ms", icon: "target" as const },
  { id: "low", label: "1% Lows", value: "+50", icon: "chart" as const },
];

export function HeroShowcase() {
  return (
    <div className="hero-showcase mx-auto w-full max-w-xl lg:max-w-none">
      <div className="hero-device-shell relative overflow-hidden rounded-[24px] p-px">
        <div className="hero-device-inner overflow-hidden rounded-[23px] bg-[#0a0d13]">
          <div className="flex items-center justify-between border-b border-white/6 bg-[#0e1118] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] font-medium tracking-wide text-reflux-muted">
              App preview
            </span>
          </div>

          <AppPreviewMock hero autoPlay />
        </div>
      </div>

      <div className="hero-metrics-bar mt-3 grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.025] px-2 py-2.5 text-center sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 sm:text-left"
          >
            <span className="icon-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] sm:h-9 sm:w-9">
              <Icon name={metric.icon} size={15} className="text-reflux-calm" />
            </span>
            <div className="min-w-0">
              <div className="text-[9px] font-semibold tracking-wide text-reflux-muted uppercase">
                {metric.label}
              </div>
              <div className="text-sm font-bold tabular-nums text-reflux-green sm:text-base">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
