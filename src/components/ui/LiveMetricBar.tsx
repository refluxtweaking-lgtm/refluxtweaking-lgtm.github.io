"use client";

interface LiveMetricBarProps {
  label: string;
  value: string;
  /** 0–100 fill level */
  fill: number;
  color: string;
  glow?: string;
  delay?: number;
  className?: string;
}

export function LiveMetricBar({
  label,
  value,
  fill,
  color,
  glow = "rgba(255, 107, 91, 0.45)",
  delay = 0,
  className = "",
}: LiveMetricBarProps) {
  const clamped = Math.min(100, Math.max(4, fill));

  return (
    <div className={`live-metric-bar ${className}`}>
      {(label || value) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label ? (
            <span className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase sm:text-[11px]">
              {label}
            </span>
          ) : (
            <span />
          )}
          {value ? (
            <span className="text-sm font-extrabold tabular-nums text-white sm:text-base">{value}</span>
          ) : null}
        </div>
      )}
      <div className="live-bar-track relative h-2.5 overflow-hidden rounded-full sm:h-3">
        <div
          className="live-bar-fill absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${clamped}%`,
            background: color,
            boxShadow: `0 0 14px ${glow}`,
            animationDelay: `${delay}s`,
          }}
        />
        <div
          className="live-bar-shine pointer-events-none absolute inset-y-0 w-1/3 rounded-full"
          style={{ animationDelay: `${delay + 0.4}s` }}
        />
      </div>
    </div>
  );
}

interface LiveEqualizerProps {
  bars?: number;
  color?: string;
  className?: string;
}

/** Mini oscilloscope-style bars for network / activity visuals */
export function LiveEqualizer({
  bars = 12,
  color = "#ff6b5b",
  className = "",
}: LiveEqualizerProps) {
  return (
    <div className={`live-eq flex h-full items-end justify-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="live-eq-bar w-[5px] rounded-full sm:w-[6px]"
          style={{
            background: color,
            animationDelay: `${i * 0.12}s`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      ))}
    </div>
  );
}

interface FpsCompareBarProps {
  before: number;
  after: number;
  max?: number;
}

export function FpsCompareBar({ before, after, max = 300 }: FpsCompareBarProps) {
  const beforePct = (before / max) * 100;
  const afterPct = (after / max) * 100;

  return (
    <div className="fps-compare space-y-3">
      <div>
        <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider text-reflux-muted uppercase">
          <span>Before</span>
          <span className="tabular-nums text-[#8b95a8]">{before} FPS</span>
        </div>
        <div className="live-bar-track h-3 overflow-hidden rounded-full">
          <div
            className="fps-bar-before h-full rounded-full bg-[#3d4658]"
            style={{ width: `${beforePct}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider uppercase">
          <span className="text-reflux-green">After REFLUX</span>
          <span className="tabular-nums font-extrabold text-reflux-green">{after} FPS</span>
        </div>
        <div className="live-bar-track h-3 overflow-hidden rounded-full">
          <div
            className="fps-bar-after live-bar-fill h-full rounded-full bg-gradient-to-r from-reflux-accent to-reflux-green"
            style={{ width: `${afterPct}%`, boxShadow: "0 0 16px rgba(93, 222, 134, 0.5)" }}
          />
        </div>
      </div>
    </div>
  );
}
