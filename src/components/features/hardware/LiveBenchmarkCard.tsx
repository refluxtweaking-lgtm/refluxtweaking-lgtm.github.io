"use client";

import { useLiveMetric } from "@/hooks/useLiveMetric";

interface LiveBenchmarkCardProps {
  isActive: boolean;
  type: "gpu" | "cpu" | "ram";
  unit: string;
  description: string;
  visual: React.ReactNode;
  min: number;
  max: number;
  decimals?: number;
  suffix?: string;
  valueColor: string;
  formatValue?: (value: number) => string;
}

export function LiveBenchmarkCard({
  isActive,
  type,
  unit,
  description,
  visual,
  min,
  max,
  decimals = 0,
  suffix = "",
  valueColor,
  formatValue,
}: LiveBenchmarkCardProps) {
  const { value, formatted } = useLiveMetric({
    isActive,
    min,
    max,
    intervalMs: type === "gpu" ? 800 : type === "cpu" ? 1000 : 1500,
    decimals,
    suffix,
  });

  const display = formatValue ? formatValue(value) : formatted;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.3)] bg-gradient-to-b from-[#0c0e12] to-[#080a0d] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="w-full border-b border-reflux-border/60 pb-3">{visual}</div>
      <div className={`mt-4 text-center text-4xl font-extrabold tabular-nums transition-all duration-300 ${valueColor}`}>
        {display}
      </div>
      <div className="mt-1 text-center text-sm font-medium text-reflux-muted">{unit}</div>
      <div className="mt-3 min-h-[48px] text-center text-xs leading-relaxed text-[#6B7A8A]">
        {description}
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-reflux-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            type === "gpu"
              ? "bg-gradient-to-r from-reflux-accent to-reflux-accent-light"
              : type === "cpu"
                ? "bg-gradient-to-r from-reflux-green/70 to-reflux-green"
                : "bg-gradient-to-r from-reflux-purple/70 to-reflux-purple"
          }`}
          style={{
            width: `${type === "ram" ? ((value - min) / (max - min)) * 100 : (value / max) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
