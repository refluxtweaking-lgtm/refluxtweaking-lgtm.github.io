"use client";

import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ResultsSlideshow } from "./ResultsSlideshow";

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
    <section id="results" ref={sectionRef} className="section-flow section-glow-wrap">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Real Results"
        title={
          <>
            Measured gains. <span className="gradient-text">Not simulated.</span>
          </>
        }
        subtitle="Watch a real 5-second capture for each game — lines move like an FPS graph while REFLUX runs."
      />

      <GlowCard className="mx-auto max-w-4xl overflow-hidden" hover={false}>
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.2em] text-reflux-muted uppercase">Test System</p>
            <p className="text-sm text-reflux-muted">Same hardware, before & after REFLUX Pro</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["RTX 4070", "Ryzen 7 7800X3D", "32GB DDR5"].map((spec) => (
              <span
                key={spec}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <ResultsSlideshow animate={animate} />

        <p className="mt-6 text-center text-xs text-reflux-muted">
          Results vary by hardware. REFLUX creates a restore point before every change.
        </p>
      </GlowCard>
    </section>
  );
}
