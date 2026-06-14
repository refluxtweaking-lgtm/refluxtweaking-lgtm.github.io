"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { LatencyChart } from "../LatencyChart";
import { LiveAppIndicator } from "@/components/ui/LiveAppIndicator";
import { PurchasePopups } from "@/components/ui/PurchasePopups";
import { Icon } from "@/components/ui/Icon";
import { SlideHeading } from "./SlideHeading";
import type { SlideProps } from "./types";

const networkTweaks = [
  { name: "Nagle's Algorithm", desc: "Stops TCP from buffering small packets" },
  { name: "Network Throttling", desc: "Removes Windows multimedia bandwidth cap" },
  { name: "QoS Prioritization", desc: "Game packets jump the queue" },
  { name: "NIC Interrupt Mod", desc: "Faster response from your network card" },
];

export function LatencySlide({ isActive = false }: SlideProps) {
  return (
    <>
      <PurchasePopups isActive={isActive} />
      <GlowCard centered className="w-full">
        <LiveAppIndicator isActive={isActive} />

        <SlideHeading icon="globe" title="Low‑Latency Network" />
        <p className="mb-4 max-w-lg text-center text-reflux-muted">
          Windows ships with settings that <strong className="text-white">add 40–80ms</strong> of
          hidden latency. REFLUX strips them out at the driver and registry level — that&apos;s why
          your ping drops without changing your ISP.
        </p>

        <div className="mb-5 grid w-full max-w-lg grid-cols-2 gap-2">
          {networkTweaks.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-reflux-border bg-reflux-card/80 px-3 py-2 text-left"
            >
              <div className="text-xs font-semibold text-reflux-accent">{t.name}</div>
              <div className="text-[11px] text-reflux-muted">{t.desc}</div>
            </div>
          ))}
        </div>

        {isActive && <LatencyChart key="latency-chart" />}

        <div className="mt-5 flex flex-wrap justify-center gap-6 text-center">
          <div>
            <div className="text-2xl font-extrabold text-[#5F6A7A] line-through">85 ms</div>
            <div className="text-xs text-reflux-muted">Before REFLUX</div>
          </div>
          <Icon name="arrowRight" size={28} className="text-reflux-muted" glow={false} />
          <div>
            <div className="text-2xl font-extrabold text-reflux-accent">18 ms</div>
            <div className="text-xs text-reflux-muted">After REFLUX</div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-reflux-muted">
          Real‑time packet prioritization & low‑level tweaks — applied in one click.
        </p>
      </GlowCard>
    </>
  );
}
