"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { LatencyMiniChart, PingTrail } from "@/components/charts/AmbientChart";

export function NetworkProofSection() {
  return (
    <section id="network-proof" className="proof-section network-proof-section border-y border-white/6 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-white/8 md:grid-cols-2 md:divide-x">
        <FlowIn className="px-4 pb-10 md:px-8 md:pb-0">
          <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Improve ping & bufferbloat
          </h3>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-reflux-muted md:text-base">
            Tune TCP, DNS, and network stack settings so inputs stay responsive — measured in-app before you queue.
          </p>
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

        <FlowIn delay={100} className="px-4 pt-10 md:px-8 md:pt-0">
          <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Reduce input lag & latency
          </h3>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-reflux-muted md:text-base">
            Kill background noise, free CPU cycles, and cut click-to-shot delay — the stuff you feel, not just benchmark numbers.
          </p>
          <LatencyMiniChart active />
        </FlowIn>
      </div>
    </section>
  );
}
