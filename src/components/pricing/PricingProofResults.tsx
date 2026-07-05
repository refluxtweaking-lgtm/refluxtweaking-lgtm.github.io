"use client";

import { useMemo } from "react";
import { FlowIn } from "@/components/ui/FlowIn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  PRICING_PROOF,
  PRICING_PROOF_FPS_AFTER,
  PRICING_PROOF_FPS_BEFORE,
  PRICING_PROOF_PING_AFTER,
  PRICING_PROOF_PING_BEFORE,
} from "@/data/pricing-proof";
import {
  buildJaggedPathFromSeries,
  buildSmoothPathFromSeries,
} from "@/components/sections/resultChartPaths";

const CHART_W = 320;
const CHART_H = 72;

function seriesToYs(values: number[], min: number, max: number) {
  const pad = 10;
  const usable = CHART_H - pad * 2;
  return values.map((v) => CHART_H - pad - ((v - min) / (max - min)) * usable);
}

function ProofMetricBlock({
  title,
  unit,
  before,
  after,
  gain,
  gainDetail,
  footnote,
  beforeSeries,
  afterSeries,
  chartMin,
  chartMax,
  beforeColor,
  afterColor,
}: {
  title: string;
  unit: string;
  before: { label: string; note: string };
  after: { label: string; note: string };
  gain: string;
  gainDetail: string;
  footnote?: string;
  beforeSeries: number[];
  afterSeries: number[];
  chartMin: number;
  chartMax: number;
  beforeColor: string;
  afterColor: string;
}) {
  const beforePath = useMemo(
    () => buildJaggedPathFromSeries(seriesToYs(beforeSeries, chartMin, chartMax), CHART_W),
    [beforeSeries, chartMin, chartMax],
  );
  const afterPath = useMemo(
    () => buildSmoothPathFromSeries(seriesToYs(afterSeries, chartMin, chartMax), CHART_W),
    [afterSeries, chartMin, chartMax],
  );

  return (
    <div className="pricing-proof-metric">
      <div className="pricing-proof-metric-head">
        <h3 className="pricing-proof-metric-title">{title}</h3>
        <span className="pricing-proof-metric-gain reflux-metric">{gain}</span>
      </div>
      <p className="pricing-proof-metric-detail">{gainDetail}</p>

      <div className="pricing-proof-compare-row">
        <div className="pricing-proof-stat pricing-proof-stat--before">
          <span className="pricing-proof-stat-tag">Before REFLUX</span>
          <span className="pricing-proof-stat-value reflux-metric">
            {before.label}
            <span className="pricing-proof-stat-unit">{unit}</span>
          </span>
          <span className="pricing-proof-stat-note">{before.note}</span>
        </div>

        <div className="pricing-proof-arrow" aria-hidden="true">
          <Icon name="arrowRight" size={22} strokeWidth={2.4} glow={false} className="text-reflux-accent" />
        </div>

        <div className="pricing-proof-stat pricing-proof-stat--after">
          <span className="pricing-proof-stat-tag">With REFLUX PRO</span>
          <span className="pricing-proof-stat-value reflux-metric">
            {after.label}
            <span className="pricing-proof-stat-unit">{unit}</span>
          </span>
          <span className="pricing-proof-stat-note">{after.note}</span>
        </div>
      </div>

      <div className="pricing-proof-charts">
        <div className="pricing-proof-chart pricing-proof-chart--before">
          <span className="pricing-proof-chart-label">Stock Windows</span>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="pricing-proof-chart-svg" aria-hidden="true">
            <path d={beforePath} fill="none" stroke={beforeColor} strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="pricing-proof-chart pricing-proof-chart--after">
          <span className="pricing-proof-chart-label">REFLUX PRO</span>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="pricing-proof-chart-svg" aria-hidden="true">
            <path
              d={`${afterPath} L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`}
              fill={afterColor}
              fillOpacity="0.12"
            />
            <path d={afterPath} fill="none" stroke={afterColor} strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {footnote ? <p className="pricing-proof-footnote">{footnote}</p> : null}
    </div>
  );
}

export function PricingProofResults() {
  const { fps, ping, game, settings, context, meshNote } = PRICING_PROOF;

  return (
    <section className="pricing-proof-section relative overflow-hidden">
      <div className="proof-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative">
        <FlowIn>
          <p className="fps-proof-eyebrow mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-reflux-accent uppercase">
            <span className="fps-proof-eyebrow-dot" aria-hidden="true" />
            Proven on a real rig — not a mockup
          </p>
          <h2 className="font-display max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.65rem] lg:leading-[1.06]">
            I ran <span className="gradient-text">{game}</span> before and after REFLUX.
            <span className="block text-white/90">The numbers sold me on PRO.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-reflux-text-soft">{context}</p>
        </FlowIn>

        <div className="pricing-proof-spec-band">
          <span className="fps-proof-spec-tag">{game}</span>
          <span className="fps-proof-spec-item">{settings}</span>
          <span className="fps-proof-spec-sep" aria-hidden="true" />
          <span className="fps-proof-spec-item fps-proof-spec-item--accent">In-game overlay</span>
          <span className="fps-proof-spec-sep fps-proof-spec-sep--hide-mobile" aria-hidden="true" />
          <span className="fps-proof-spec-item fps-proof-spec-item--hide-mobile">Same PC · same lobby</span>
        </div>

        <FlowIn delay={60}>
          <div className="pricing-proof-grid">
            <ProofMetricBlock
              title="Frame rate"
              unit=" FPS"
              before={fps.before}
              after={fps.after}
              gain={fps.gainLabel}
              gainDetail={fps.gainDetail}
              beforeSeries={PRICING_PROOF_FPS_BEFORE}
              afterSeries={PRICING_PROOF_FPS_AFTER}
              chartMin={100}
              chartMax={150}
              beforeColor="#ff6b5b"
              afterColor="#5ec4ef"
            />
            <ProofMetricBlock
              title="Ping"
              unit=" ms"
              before={ping.before}
              after={ping.after}
              gain={ping.gainLabel}
              gainDetail={ping.gainDetail}
              footnote={`${meshNote} ${ping.spikeNote}.`}
              beforeSeries={PRICING_PROOF_PING_BEFORE}
              afterSeries={PRICING_PROOF_PING_AFTER}
              chartMin={0}
              chartMax={800}
              beforeColor="#c084fc"
              afterColor="#5dde86"
            />
          </div>
        </FlowIn>

        <FlowIn delay={100}>
          <div className="pricing-proof-cta-band">
            <div>
              <p className="pricing-proof-cta-kicker">What you&apos;re buying</p>
              <p className="pricing-proof-cta-copy">
                The full tweak library, network pack, and game scanner that turned this session around — not just
                the free starter set.
              </p>
            </div>
            <Button href="#pricing-cards" variant="primary" large className="btn-angular shrink-0">
              See PRO plans
            </Button>
          </div>
        </FlowIn>
      </div>
    </section>
  );
}
