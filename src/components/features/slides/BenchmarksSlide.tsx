"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { GpuVisual } from "../hardware/GpuVisual";
import { CpuVisual } from "../hardware/CpuVisual";
import { RamVisual } from "../hardware/RamVisual";
import { LiveBenchmarkCard } from "../hardware/LiveBenchmarkCard";
import { useLiveMetric } from "@/hooks/useLiveMetric";
import { SlideHeading } from "./SlideHeading";
import type { SlideProps } from "./types";

export function BenchmarksSlide({ isActive = false }: SlideProps) {
  const ram = useLiveMetric({
    isActive,
    min: 28.4,
    max: 31.8,
    intervalMs: 1400,
    decimals: 1,
    suffix: " GB",
  });

  const ramFillPercent = ((ram.value - 28) / 4) * 100;

  return (
    <GlowCard centered hover={false} className="slide-tight w-full !p-3 sm:!p-5">
      <SlideHeading icon="chart" title="Live Benchmarks" />
      <p className="mb-2 hidden text-center text-sm text-reflux-muted sm:mb-3 sm:block">
        Real‑time hardware analysis for the ultimate gaming insight.
      </p>

      <div className="-mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-0.5 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0">
        <div className="w-[72%] shrink-0 snap-center sm:w-full">
          <LiveBenchmarkCard
            isActive={isActive}
            type="gpu"
            unit="FPS (GPU)"
            description="Scans your graphics card's clock speeds, VRAM, and rendering pipeline to predict maximum frames."
            visual={<GpuVisual compact />}
            min={128}
            max={165}
            valueColor="text-reflux-accent"
            compact
          />
        </div>

        <div className="w-[72%] shrink-0 snap-center sm:w-full">
          <LiveBenchmarkCard
            isActive={isActive}
            type="cpu"
            unit="CPU Usage"
            description="Probes each core's frequency, temperature, and load to gauge processing headroom."
            visual={<CpuVisual compact />}
            min={72}
            max={99}
            suffix="%"
            valueColor="text-reflux-green"
            compact
          />
        </div>

        <div className="flex w-[72%] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-[rgba(241,91,80,0.35)] bg-[#0c0e12] p-2.5 sm:w-full sm:rounded-2xl sm:p-4">
          <div className="w-full border-b border-reflux-border/60 pb-1.5 sm:pb-2">
            <RamVisual fillPercent={ramFillPercent} compact />
          </div>
          <div className="mt-2 text-center text-2xl font-extrabold tabular-nums text-reflux-purple transition-all duration-300 sm:mt-3 sm:text-3xl">
            {ram.formatted}
          </div>
          <div className="text-center text-[10px] font-medium text-reflux-muted sm:text-xs">Free RAM</div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-reflux-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-reflux-purple/70 to-reflux-purple transition-all duration-500"
              style={{ width: `${ramFillPercent}%` }}
            />
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
