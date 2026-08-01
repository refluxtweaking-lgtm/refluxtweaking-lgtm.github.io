"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AmbientFpsGraph } from "@/components/charts/AmbientChart";
import { InputLagProof } from "@/components/sections/InputLagProof";

export function NetworkProofSection() {
  return (
    <section id="network-proof" className="proof-section network-proof-section py-14 md:py-20">
      <div className="proof-section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4">
        <FlowIn className="mb-8 md:mb-10">
          <p className="fps-proof-eyebrow mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-reflux-accent uppercase">
            <span className="fps-proof-eyebrow-dot" aria-hidden="true" />
            Real hardware, not a render mock
          </p>
          <h2 className="font-display max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.85rem] lg:leading-[1.05]">
            Even a weak laptop
            <span className="gradient-text"> stops stuttering.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-reflux-text-soft">
            We benchmarked on a tired 2018 budget machine — integrated graphics, 8 GB RAM, stock Windows.
            Same Fortnite session. REFLUX on vs off.
          </p>
        </FlowIn>

        <FlowIn delay={80}>
          <AmbientFpsGraph />
        </FlowIn>

        <FlowIn delay={120} className="mt-16 border-t border-white/[0.06] pt-14 md:mt-20 md:pt-16">
          <p className="fps-proof-eyebrow mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-reflux-accent uppercase">
            <span className="fps-proof-eyebrow-dot fps-proof-eyebrow-dot--calm" aria-hidden="true" />
            Input path, not a line graph
          </p>
          <h3 className="max-w-2xl text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-[2.15rem]">
            Your clicks shouldn&apos;t wait
            <span className="gradient-text"> on Windows.</span>
          </h3>
          <p className="mt-3 mb-10 max-w-2xl text-sm leading-relaxed text-reflux-text-soft md:text-base">
            REFLUX removes the hidden queues between your mouse and the game — timer slack, TCP buffering,
            compositor overhead. One click applies the tweaks that actually matter.
          </p>
          <InputLagProof />
        </FlowIn>
      </div>
    </section>
  );
}
