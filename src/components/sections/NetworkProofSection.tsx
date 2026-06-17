"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AmbientFpsGraph, LatencyMiniChart } from "@/components/charts/AmbientChart";

export function NetworkProofSection() {
  return (
    <section id="network-proof" className="proof-section network-proof-section py-12 md:py-16">
      <div className="proof-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4">
        <FlowIn className="mb-6 md:mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Boost your FPS.
            <br />
            <span className="gradient-text">Eliminate stutters.</span>
          </h2>
        </FlowIn>

        <FlowIn delay={80} className="mb-12 md:mb-14">
          <AmbientFpsGraph active className="min-h-[160px] md:min-h-[240px] lg:min-h-[280px]" />
        </FlowIn>

        <FlowIn delay={120} className="border-t border-white/8 pt-12 md:pt-14">
          <h3 className="mb-6 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Reduce input lag & latency
          </h3>
          <div className="mx-auto max-w-3xl">
            <LatencyMiniChart active />
          </div>
        </FlowIn>
      </div>
    </section>
  );
}
