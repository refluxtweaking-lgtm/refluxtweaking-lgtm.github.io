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
    beforeSpikeChance: 0.05,
    beforeSpikeSize: 10,
    beforeDrift: 5,
    afterDrift: 1.6,
    afterNoise: 0.7,
  },
  latency: {
    beforeBand: [12, 44],
    afterBand: [70, 80],
    beforeSpikeChance: 0.06,
    beforeSpikeSize: 8,
    beforeDrift: 4,
    afterDrift: 1.2,
    afterNoise: 0.5,
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
  return buildSmoothPathFromSeries(yValues, width);
}

/** Catmull-Rom style cubic bezier — no sharp corners between points */
export function buildSmoothPathFromSeries(yValues: number[], width = CHART_WIDTH) {
  const n = yValues.length;
  if (n < 2) return `M 0 ${(yValues[0] ?? 0).toFixed(2)}`;

  const xs = yValues.map((_, i) => (i / (n - 1)) * width);
  const tension = 6;
  let d = `M ${xs[0].toFixed(2)} ${yValues[0].toFixed(2)}`;

  for (let i = 0; i < n - 1; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = i + 1;
    const i3 = Math.min(n - 1, i + 2);

    const cp1x = xs[i1] + (xs[i2] - xs[i0]) / tension;
    const cp1y = yValues[i1] + (yValues[i2] - yValues[i0]) / tension;
    const cp2x = xs[i2] - (xs[i3] - xs[i1]) / tension;
    const cp2y = yValues[i2] - (yValues[i3] - yValues[i1]) / tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xs[i2].toFixed(2)} ${yValues[i2].toFixed(2)}`;
  }

  return d;
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
