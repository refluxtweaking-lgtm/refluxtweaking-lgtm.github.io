import { RESULT_CHART } from "./resultChartPaths";

export interface ResultMetric {
  label: string;
  before: number;
  after: number;
  unit: string;
  delta: string;
  color: string;
  stroke: string;
  fill: string;
  gain: string;
}

interface ResultMetricChartProps {
  metric: ResultMetric;
  animate: boolean;
}

export function ResultMetricChart({ metric, animate }: ResultMetricChartProps) {
  const { width, height, midline, before, after } = RESULT_CHART;
  const drawClass = animate ? "result-line-draw" : "result-line-done";

  return (
    <div className="result-metric-card overflow-hidden rounded-2xl border border-reflux-border/80 bg-[#080a0d] p-5 sm:p-6">
      <p className="mb-3 text-sm font-bold tracking-wide text-reflux-muted uppercase">{metric.label}</p>

      <div className="mb-4 overflow-hidden rounded-xl border border-reflux-border/50 bg-[#0a0c10]">
        <div className="relative px-3 py-3 sm:px-4 sm:py-4">
          <div className="absolute top-3 bottom-3 left-3 z-10 flex w-14 flex-col justify-between text-[9px] font-bold uppercase sm:left-4">
            <span className="text-reflux-muted">Before</span>
            <span className={metric.color}>After</span>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="ml-12 h-[130px] w-full sm:ml-14 sm:h-[140px]"
            role="img"
            aria-label={`${metric.label}: before ${metric.before} ${metric.unit}, after ${metric.after} ${metric.unit}`}
          >
            <rect x="0" y="0" width={width} height={midline - 2} fill="rgba(95,106,122,0.06)" rx="4" />
            <rect x="0" y={midline + 2} width={width} height={height - midline - 2} fill="rgba(241,91,80,0.04)" rx="4" />
            <line
              x1="0"
              y1={midline}
              x2={width}
              y2={midline}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={height * ratio}
                x2={width}
                y2={height * ratio}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            <path
              d={`${after} L ${width} ${height} L 0 ${height} Z`}
              fill={metric.stroke}
              opacity="0.1"
              className={animate ? "result-area-after" : undefined}
            />

            <path
              d={before}
              className={`result-line result-line-before ${drawClass}`}
            />
            <path
              d={after}
              className={`result-line result-line-after ${drawClass} result-line-draw-delayed`}
              style={{ stroke: metric.stroke }}
            />
          </svg>

          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-bold tracking-wider uppercase">
            <span className="flex items-center gap-1.5 text-reflux-muted">
              <span className="inline-block h-0.5 w-5 rounded bg-[#5F6A7A]" />
              Unstable
            </span>
            <span className={`flex items-center gap-1.5 ${metric.color}`}>
              <span className="inline-block h-0.5 w-5 rounded" style={{ backgroundColor: metric.stroke }} />
              Stable
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-end gap-2 text-center">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Before</div>
          <div className="mt-1 text-base font-bold text-[#5a6578] line-through tabular-nums sm:text-lg">
            {metric.before}
            <span className="ml-0.5 text-[10px] font-medium">{metric.unit}</span>
          </div>
        </div>
        <div className={`text-lg font-extrabold sm:text-xl ${metric.color}`}>{metric.delta}</div>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-accent uppercase">After</div>
          <div className={`mt-1 text-base font-extrabold tabular-nums sm:text-lg ${metric.color}`}>
            {metric.after}
            <span className="ml-0.5 text-[10px] font-medium text-reflux-muted">{metric.unit}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-reflux-border">
        <div
          className={`result-gain-bar h-full rounded-full bg-gradient-to-r ${metric.fill}`}
          style={{ "--result-gain": metric.gain } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
