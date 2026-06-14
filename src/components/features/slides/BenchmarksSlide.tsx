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
    <GlowCard centered className="w-full">
      <SlideHeading icon="chart" title="Live Benchmarks" />
      <p className="mb-3 text-center text-sm text-reflux-muted sm:mb-4 md:mb-6">
        Real‑time hardware analysis for the ultimate gaming insight.
      </p>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <LiveBenchmarkCard
          isActive={isActive}
          type="gpu"
          unit="FPS (GPU)"
          description="Scans your graphics card's clock speeds, VRAM, and rendering pipeline to predict maximum frames."
          visual={<GpuVisual />}
          min={128}
          max={165}
          valueColor="text-reflux-accent"
        />

        <LiveBenchmarkCard
          isActive={isActive}
          type="cpu"
          unit="CPU Usage"
          description="Probes each core's frequency, temperature, and load to gauge processing headroom."
          visual={<CpuVisual />}
          min={72}
          max={99}
          suffix="%"
          valueColor="text-reflux-green"
        />

        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.35)] bg-[#0c0e12] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_20px_rgba(241,91,80,0.08)] sm:p-5">
          <div className="w-full border-b border-reflux-border/60 pb-2 sm:pb-3">
            <RamVisual fillPercent={ramFillPercent} />
          </div>
          <div className="mt-3 text-center text-3xl font-extrabold tabular-nums text-reflux-purple transition-all duration-300 sm:mt-4 sm:text-4xl">
            {ram.formatted}
          </div>
          <div className="mt-1 text-center text-xs font-medium text-reflux-muted sm:text-sm">Free RAM</div>
          <div className="mt-2 hidden min-h-[36px] text-center text-xs leading-relaxed text-[#6B7A8A] sm:mt-3 sm:block sm:min-h-[48px]">
            Reads current memory timings, CAS latency, and free capacity to ensure smooth
            multitasking.
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-reflux-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-reflux-purple/70 to-reflux-purple transition-all duration-500"
              style={{ width: `${ramFillPercent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-reflux-muted sm:mt-5 sm:text-sm">
        Benchmark scores are normalized against thousands of similar systems – see exactly
        where your rig stands.
      </p>
    </GlowCard>
  );
}
