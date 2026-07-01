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
            Measured gains. <span className="headline-accent">Not simulated.</span>
          </>
        }
        subtitle="Live 5-second captures on the same rig. Before on top, after on bottom."
      />

      <GlowCard className="mx-auto max-w-4xl overflow-hidden" hover={false}>
        <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.06] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.2em] text-reflux-accent uppercase">Test System</p>
            <p className="text-sm text-reflux-text-soft">Same hardware, before &amp; after REFLUX PRO</p>
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

        <div className="reflux-warning mt-6 flex items-start gap-3 rounded-xl px-4 py-3.5 sm:px-5" role="alert">
          <svg
            viewBox="0 0 24 24"
            width={22}
            height={22}
            className="reflux-warning-icon mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 2 1.5 21h21L12 2zm0 4.2 7.35 12.8H4.65L12 6.2zM11 10v5h2v-5h-2zm0 7v2h2v-2h-2z"
            />
          </svg>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-amber-400 uppercase">Warning</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/90">
              Results vary by hardware. REFLUX creates a restore point before every change.
            </p>
          </div>
        </div>
      </GlowCard>
    </section>
  );
}
