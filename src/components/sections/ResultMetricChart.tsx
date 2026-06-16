import { RESULT_CHART, type ResultChartId } from "./resultChartPaths";

export interface ResultMetric {
  id: ResultChartId;
  label: string;
  game?: string;
  before: number;
  after: number;
  unit: string;
  delta: string;
  color: string;
  stroke: string;
  fill: string;
  gain: string;
  hint: string;
}

interface ResultMetricChartProps {
  metric: ResultMetric;
  animate: boolean;
  large?: boolean;
}

export function ResultMetricChart({ metric, animate, large = false }: ResultMetricChartProps) {
  const { width, height, midline } = RESULT_CHART;
  const paths = RESULT_CHART[metric.id];
  const drawClass = animate ? "result-line-draw" : "result-line-done";

  return (
    <div className="result-metric-card">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-reflux-muted uppercase">{metric.label}</p>
          {metric.game && <p className="mt-0.5 text-sm text-reflux-muted/80">{metric.game}</p>}
        </div>
        <p className="text-[11px] font-medium text-reflux-muted">{metric.hint}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-[#0a0d13]">
        <div className="relative px-3 py-4 sm:px-5 sm:py-5">
          <div className="absolute top-4 bottom-4 left-3 z-10 flex w-12 flex-col justify-between text-[10px] font-bold uppercase sm:left-5">
            <span className="text-reflux-muted">Before</span>
            <span className={metric.color}>After</span>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className={`ml-10 w-full sm:ml-12 ${large ? "h-[160px] sm:h-[180px]" : "h-[130px] sm:h-[140px]"}`}
            role="img"
            aria-label={`${metric.label}: before ${metric.before} ${metric.unit}, after ${metric.after} ${metric.unit}`}
            preserveAspectRatio="none"
          >
            <rect x="0" y="0" width={width} height={midline - 2} fill="rgba(95,106,122,0.07)" rx="6" />
            <rect
              x="0"
              y={midline + 2}
              width={width}
              height={height - midline - 2}
              fill="rgba(255,255,255,0.02)"
              rx="6"
            />
            <line
              x1="0"
              y1={midline}
              x2={width}
              y2={midline}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="6 5"
            />

            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={height * ratio}
                x2={width}
                y2={height * ratio}
                stroke="rgba(255,255,255,0.035)"
                strokeWidth="1"
              />
            ))}

            <path
              d={`${paths.after} L ${width} ${height} L 0 ${height} Z`}
              fill={metric.stroke}
              opacity="0.09"
              className={animate ? "result-area-after" : undefined}
            />

            <path d={paths.before} className={`result-line result-line-before ${drawClass}`} />
            <path
              d={paths.after}
              className={`result-line result-line-after ${drawClass} result-line-draw-delayed`}
              style={{ stroke: metric.stroke }}
            />
          </svg>

          <div className="mt-3 flex items-center justify-center gap-5 text-[10px] font-bold tracking-wider uppercase">
            <span className="flex items-center gap-2 text-reflux-muted">
              <span className="inline-block h-0.5 w-6 rounded bg-[#8b95a8]" />
              Unstable line
            </span>
            <span className={`flex items-center gap-2 ${metric.color}`}>
              <span className="inline-block h-0.5 w-6 rounded" style={{ backgroundColor: metric.stroke }} />
              Stable line
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 items-end gap-3 text-center">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-muted uppercase">Before</div>
          <div className="mt-1 text-lg font-bold text-[#5a6578] line-through tabular-nums sm:text-xl">
            {metric.before}
            <span className="ml-0.5 text-xs font-medium">{metric.unit}</span>
          </div>
        </div>
        <div className={`text-xl font-extrabold sm:text-2xl ${metric.color}`}>{metric.delta}</div>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-reflux-accent uppercase">After</div>
          <div className={`mt-1 text-lg font-extrabold tabular-nums sm:text-xl ${metric.color}`}>
            {metric.after}
            <span className="ml-0.5 text-xs font-medium text-reflux-muted">{metric.unit}</span>
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
