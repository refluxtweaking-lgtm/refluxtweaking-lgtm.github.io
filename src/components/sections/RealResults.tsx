"use client";

import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { ResultsSlideshow } from "./ResultsSlideshow";

const testSpecs = [
  { label: "RTX 4070", vendor: "nvidia" as const },
  { label: "Ryzen 7 7800X3D", vendor: "amd" as const },
  { label: "32GB DDR5", vendor: "ram" as const },
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
    <section id="results" ref={sectionRef} className="section-flow section-glow-wrap">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Does it actually work?"
        title={
          <>
            Measured gains. <span className="gradient-text">Not simulated.</span>
          </>
        }
        subtitle="Live 5-second captures on the same rig — before on top, after on bottom."
      />

      <GlowCard className="mx-auto max-w-4xl overflow-hidden" hover={false}>
        <div className="reflux-glow-box mb-6 flex flex-col gap-4 rounded-xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.2em] text-reflux-accent uppercase">Test System</p>
            <p className="text-sm text-reflux-text-soft">Same hardware, before &amp; after REFLUX Pro</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {testSpecs.map((spec) => (
              <span
                key={spec.label}
                className="reflux-glow-interactive inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white"
              >
                <VendorLogo vendor={spec.vendor} size={22} />
                {spec.label}
              </span>
            ))}
          </div>
        </div>

        <ResultsSlideshow animate={animate} />

        <p className="reflux-glow-readable mt-6 rounded-xl px-4 py-3 text-center text-xs text-reflux-text-soft">
          Results vary by hardware. REFLUX creates a restore point before every change.
        </p>
      </GlowCard>
    </section>
  );
}
