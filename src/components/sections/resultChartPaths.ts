export type ResultChartId = "fps" | "latency" | "lows";

export const CHART_WIDTH = 480;
export const CHART_HEIGHT = 128;
export const CHART_MIDLINE = 64;
export const LIVE_POINTS = 40;
export const LIVE_DURATION_MS = 5000;
export const LIVE_TICK_MS = 90;

export interface LiveChartConfig {
  beforeBand: [number, number];
  afterBand: [number, number];
  beforeSpikeChance: number;
  beforeSpikeSize: number;
  beforeDrift: number;
  afterDrift: number;
  afterNoise: number;
}

export const LIVE_CHART_CONFIG: Record<ResultChartId, LiveChartConfig> = {
  fps: {
    beforeBand: [10, 46],
    afterBand: [74, 84],
    beforeSpikeChance: 0.14,
    beforeSpikeSize: 22,
    beforeDrift: 11,
    afterDrift: 2.2,
    afterNoise: 1.1,
  },
  latency: {
    beforeBand: [12, 44],
    afterBand: [70, 80],
    beforeSpikeChance: 0.16,
    beforeSpikeSize: 18,
    beforeDrift: 9,
    afterDrift: 1.8,
    afterNoise: 0.9,
  },
  lows: {
    beforeBand: [8, 50],
    afterBand: [72, 82],
    beforeSpikeChance: 0.18,
    beforeSpikeSize: 26,
    beforeDrift: 13,
    afterDrift: 2.4,
    afterNoise: 1.2,
  },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function buildPathFromSeries(yValues: number[], width = CHART_WIDTH) {
  return yValues
    .map((y, i) => {
      const x = (i / (yValues.length - 1)) * width;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function seedRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function initBeforeSeries(config: LiveChartConfig, seed: number): number[] {
  const rand = seedRandom(seed);
  const mid = (config.beforeBand[0] + config.beforeBand[1]) / 2;
  const series: number[] = [];
  let current = mid;

  for (let i = 0; i < LIVE_POINTS; i++) {
    const spike = rand() < config.beforeSpikeChance ? config.beforeSpikeSize * rand() : 0;
    const drift = (rand() - 0.5) * config.beforeDrift;
    current = clamp(current + drift + spike * (rand() > 0.5 ? 1 : -1), config.beforeBand[0], config.beforeBand[1]);
    series.push(current);
  }

  return series;
}

export function initAfterSeries(config: LiveChartConfig, seed: number): number[] {
  const rand = seedRandom(seed + 991);
  const mid = (config.afterBand[0] + config.afterBand[1]) / 2;
  const series: number[] = [];
  let current = mid;

  for (let i = 0; i < LIVE_POINTS; i++) {
    current = clamp(current + (rand() - 0.5) * config.afterNoise, config.afterBand[0], config.afterBand[1]);
    series.push(current);
  }

  return series;
}

export function nextBeforePoint(prev: number, config: LiveChartConfig, rand: () => number) {
  const spike = rand() < config.beforeSpikeChance ? config.beforeSpikeSize * (0.5 + rand() * 0.5) : 0;
  const direction = rand() > 0.45 ? 1 : -1;
  return clamp(prev + (rand() - 0.5) * config.beforeDrift + spike * direction, config.beforeBand[0], config.beforeBand[1]);
}

export function nextAfterPoint(prev: number, config: LiveChartConfig, rand: () => number) {
  return clamp(prev + (rand() - 0.5) * config.afterDrift + (rand() - 0.5) * config.afterNoise, config.afterBand[0], config.afterBand[1]);
}

export function jitterReadout(target: number, spread: number, rand: () => number, decimals = 0) {
  const delta = (rand() - 0.5) * spread * 2;
  const value = target + delta;
  return decimals > 0 ? Math.round(value * 10) / 10 : Math.round(value);
}
