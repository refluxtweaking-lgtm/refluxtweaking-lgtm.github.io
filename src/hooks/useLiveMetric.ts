"use client";

import { useEffect, useState } from "react";

interface UseLiveMetricOptions {
  isActive: boolean;
  min: number;
  max: number;
  intervalMs?: number;
  decimals?: number;
  suffix?: string;
}

export function useLiveMetric({
  isActive,
  min,
  max,
  intervalMs = 1200,
  decimals = 0,
  suffix = "",
}: UseLiveMetricOptions) {
  const midpoint = (min + max) / 2;
  const [value, setValue] = useState(midpoint);

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      setValue((prev) => {
        const drift = (Math.random() - 0.5) * (max - min) * 0.25;
        const next = prev + drift;
        return Math.min(max, Math.max(min, next));
      });
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [isActive, min, max, intervalMs]);

  const formatted =
    decimals > 0
      ? `${value.toFixed(decimals)}${suffix}`
      : `${Math.round(value)}${suffix}`;

  return { value, formatted };
}
