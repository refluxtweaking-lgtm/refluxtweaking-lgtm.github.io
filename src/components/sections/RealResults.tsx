"use client";

import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ResultMetricChart, type ResultMetric } from "./ResultMetricChart";

const results: ResultMetric[] = [
  {
    label: "Fortnite FPS",
    before: 280,
    after: 332,
    unit: "FPS",
    delta: "+52 FPS",
    color: "text-reflux-accent",
    stroke: "#F15B50",
    fill: "from-reflux-accent to-reflux-accent-light",
    gain: "82%",
  },
  {
    label: "Input Latency",
    before: 21,
    after: 15,
    unit: "ms",
    delta: "-6 ms",
    color: "text-reflux-green",
    stroke: "#5DDE86",
    fill: "from-reflux-green/80 to-reflux-green",
    gain: "71%",
  },
  {
    label: "1% Lows",
    before: 170,
    after: 220,
    unit: "FPS",
    delta: "+50 FPS",
    color: "text-reflux-purple",
    stroke: "#B392F0",
    fill: "from-reflux-purple/80 to-reflux-purple",
    gain: "78%",
  },
];

export function RealResults() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(false);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!wasVisibleRef.current) {
            wasVisibleRef.current = true;
            setAnimate(true);
          }
        } else {
          wasVisibleRef.current = false;
          setAnimate(false);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="results" ref={sectionRef} className="section-glow-wrap py-20 md:py-24">
      <SectionHeader
        eyebrow="Real Results"
        title={
          <>
            Measured gains. <span className="gradient-text">Not simulated.</span>
          </>
        }
        subtitle="Gray squiggly line on top = before. Smooth colored line on bottom = after."
      />

      <GlowCard className="mx-auto max-w-5xl overflow-hidden" hover={false}>
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-reflux-border/60 bg-gradient-to-r from-[#0c0e12] via-reflux-card/50 to-transparent p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-reflux-muted uppercase">Test System</p>
            <p className="text-sm text-reflux-muted">Same hardware, before & after REFLUX Pro</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["RTX 4070", "Ryzen 7 7800X3D", "32GB DDR5"].map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-reflux-accent/30 bg-reflux-accent/10 px-4 py-2 text-sm font-semibold text-white"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className={`grid w-full gap-5 lg:grid-cols-3 ${animate ? "results-charts-active" : ""}`}>
          {results.map((metric) => (
            <ResultMetricChart key={metric.label} metric={metric} animate={animate} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-reflux-muted">
          Results vary by hardware. REFLUX creates a restore point before every change.
        </p>
      </GlowCard>
    </section>
  );
}
