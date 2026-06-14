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
      <p className="mb-6 text-center text-reflux-muted">
        Real‑time hardware analysis for the ultimate gaming insight.
      </p>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.35)] bg-[#0c0e12] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_20px_rgba(241,91,80,0.08)]">
          <div className="w-full border-b border-reflux-border/60 pb-3">
            <RamVisual fillPercent={ramFillPercent} />
          </div>
          <div className="mt-4 text-center text-4xl font-extrabold tabular-nums text-reflux-purple transition-all duration-300">
            {ram.formatted}
          </div>
          <div className="mt-1 text-center text-sm font-medium text-reflux-muted">Free RAM</div>
          <div className="mt-3 min-h-[48px] text-center text-xs leading-relaxed text-[#6B7A8A]">
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

      <p className="mt-6 text-center text-sm text-reflux-muted">
        Benchmark scores are normalized against thousands of similar systems – see exactly
        where your rig stands.
      </p>
    </GlowCard>
  );
}
