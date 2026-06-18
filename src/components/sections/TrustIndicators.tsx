"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { trustObjections } from "@/data/reflux-highlights";

export function TrustIndicators() {
  return (
    <section className="section-flow section-band">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Your doubts, answered"
        title={
          <>
            Every worry has a <span className="gradient-text">real answer.</span>
          </>
        }
        subtitle="Skeptical? Good. Here's the proof behind each thing people ask before they download."
      />

      <div className="mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trustObjections.map((item, index) => (
          <FlowIn key={item.objection} delay={index * 50}>
            <div className="trust-bento-card reflux-glow-box group flex h-full flex-col p-5">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl reflux-glow-readable border border-reflux-accent/35 bg-reflux-accent/15 shadow-[0_0_20px_-4px_rgba(255,107,91,0.5)] transition-transform group-hover:scale-105">
                  <AppIcon name={item.icon} size={20} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="text-[10px] font-bold tracking-wider text-reflux-accent uppercase">
                    You might think…
                  </div>
                  <div className="font-semibold text-white">&ldquo;{item.objection}&rdquo;</div>
                </div>
              </div>
              <div className="mt-auto reflux-glow-box reflux-glow-box-sm px-3 py-2.5">
                <div className="text-[10px] font-bold tracking-wider text-reflux-accent uppercase">Proof</div>
                <div className="text-sm font-semibold text-white/90">{item.proof}</div>
              </div>
            </div>
          </FlowIn>
        ))}
      </div>
    </section>
  );
}
