"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AmbientFpsGraph, LatencyMiniChart, PingTrail } from "@/components/charts/AmbientChart";

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

        <FlowIn delay={80} className="mb-12 md:mb-16">
          <AmbientFpsGraph active className="min-h-[160px] md:min-h-[240px] lg:min-h-[280px]" />
        </FlowIn>

        <div className="grid grid-cols-1 divide-white/8 border-t border-white/8 pt-12 md:grid-cols-2 md:divide-x md:pt-16">
          <FlowIn className="px-0 pb-10 md:px-8 md:pb-0">
            <h3 className="mb-8 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Improve ping & bufferbloat
            </h3>
            <div className="relative">
              <span
                className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[8rem] font-black leading-none text-white/[0.03] md:text-[10rem]"
                aria-hidden="true"
              >
                A+
              </span>
              <div className="relative space-y-6">
                <PingTrail variant="before" ms={64} />
                <PingTrail variant="after" ms={18} />
              </div>
            </div>
          </FlowIn>

          <FlowIn delay={100} className="px-0 pt-10 md:px-8 md:pt-0">
            <h3 className="mb-8 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Reduce input lag & latency
            </h3>
            <LatencyMiniChart active />
          </FlowIn>
        </div>
      </div>
    </section>
  );
}
