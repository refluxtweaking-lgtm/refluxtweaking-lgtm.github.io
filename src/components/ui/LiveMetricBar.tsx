"use client";

import { useEffect, useRef, useState } from "react";

interface LiveMetricBarProps {
  label: string;
  value: string;
  /** 0–100 fill level */
  fill: number;
  color: string;
  glow?: string;
  delay?: number;
  className?: string;
  /** Pause RAF animation when off-screen */
  active?: boolean;
}

export function LiveMetricBar({
  label,
  value,
  fill,
  color,
  glow = "rgba(255, 107, 91, 0.45)",
  delay = 0,
  className = "",
  active = true,
}: LiveMetricBarProps) {
  const target = Math.min(100, Math.max(4, fill));
  const [width, setWidth] = useState(4);
  const [shineX, setShineX] = useState(-1.2);
  const [glowAlpha, setGlowAlpha] = useState(0.88);
  const widthRef = useRef(4);
  const readyAt = useRef(performance.now() + delay * 1000);

  useEffect(() => {
    widthRef.current = 4;
    setWidth(4);
    readyAt.current = performance.now() + delay * 1000;
  }, [target, delay]);

  useEffect(() => {
    if (!active) return;

    let raf = 0;

    const frame = (now: number) => {
      if (now >= readyAt.current) {
        widthRef.current += (target - widthRef.current) * 0.16;
        const t = now / 1000;
        const breathe = 1 + Math.sin(t * 4.8) * 0.012;
        setWidth(Math.min(100, widthRef.current * breathe));
        setGlowAlpha(0.84 + Math.sin(t * 3.6) * 0.1);

        const elapsed = now - readyAt.current;
        const shinePhase = (elapsed % 2000) / 2000;
        setShineX(shinePhase * 3.2 - 1.2);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, delay, active]);

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
          className="live-bar-fill-smooth absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 14px ${glow}`,
            opacity: glowAlpha,
            willChange: "width, opacity",
          }}
        />
        <div
          className="live-bar-shine-smooth pointer-events-none absolute inset-y-0 w-1/3 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent)",
            transform: `translateX(${shineX * 100}%)`,
            willChange: "transform",
          }}
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
