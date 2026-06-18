"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AmbientFpsGraph, LatencyMiniChart } from "@/components/charts/AmbientChart";

export function NetworkProofSection() {
  return (
    <section id="network-proof" className="proof-section network-proof-section py-12 md:py-16">
      <div className="proof-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4">
        <FlowIn className="mb-4 md:mb-6">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-reflux-accent uppercase">
            Measured on real hardware
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Boost your FPS.
            <br />
            <span className="gradient-text">Eliminate stutters.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-reflux-muted">
            Red line = your PC before REFLUX. Coral line = same game, same session, tweaks applied.
            No fake numbers — the graph shows what actually happened over 10 seconds.
          </p>
        </FlowIn>

        <FlowIn delay={80} className="mb-12 md:mb-14">
          <AmbientFpsGraph className="min-h-[200px] md:min-h-[280px] lg:min-h-[320px]" />
        </FlowIn>

        <FlowIn delay={120} className="pt-12 md:pt-14">
          <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Cut input lag
          </h3>
          <p className="mb-6 max-w-xl text-sm text-reflux-muted md:text-base">
            Lower is better here — the coral line hugging the bottom means your clicks register faster.
          </p>
          <div className="mx-auto max-w-3xl">
            <LatencyMiniChart />
          </div>
        </FlowIn>
      </div>
    </section>
  );
}
