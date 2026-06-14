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
  compact?: boolean;
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
  compact = false,
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
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-xl border border-[rgba(241,91,80,0.3)] bg-gradient-to-b from-[#0c0e12] to-[#080a0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.3)] sm:rounded-2xl ${
        compact ? "p-2.5 sm:p-4" : "p-3 sm:p-5"
      }`}
    >
      <div className={`w-full border-b border-reflux-border/60 ${compact ? "pb-1.5" : "pb-2 sm:pb-3"}`}>
        {visual}
      </div>
      <div
        className={`text-center font-extrabold tabular-nums transition-all duration-300 ${valueColor} ${
          compact ? "mt-2 text-2xl sm:text-3xl" : "mt-3 text-3xl sm:mt-4 sm:text-4xl"
        }`}
      >
        {display}
      </div>
      <div className={`text-center font-medium text-reflux-muted ${compact ? "text-[10px] sm:text-xs" : "mt-1 text-xs sm:text-sm"}`}>
        {unit}
      </div>
      {!compact && (
        <div className="mt-2 hidden min-h-[36px] text-center text-xs leading-relaxed text-[#6B7A8A] sm:mt-3 sm:block sm:min-h-[48px]">
          {description}
        </div>
      )}
      <div className={`h-1 w-full overflow-hidden rounded-full bg-reflux-border ${compact ? "mt-2" : "mt-3 h-1.5"}`}>
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
