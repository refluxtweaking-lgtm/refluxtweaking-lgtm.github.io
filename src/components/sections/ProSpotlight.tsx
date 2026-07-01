"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const premiumFeatures = [
  { icon: "optimizer" as const, title: "Smart Optimizer", desc: `${PRODUCT_LIMITS.totalTweaksLabel} tweaks with one-click suites in the app.` },
  { icon: "games" as const, title: "Game Scanner", desc: "Find installed games and optimize per title." },
  { icon: "internet" as const, title: "Network Priority", desc: "Per-game QoS in the Games tab. Toggle traffic priority live." },
  { icon: "bios" as const, title: "BIOS Guides", desc: "Step-by-step firmware tuning guides." },
  { icon: "cleanup" as const, title: "Cleanup & Debloat", desc: "Temp cleanup, vacuum, and Windows debloat tools." },
  { icon: "shield" as const, title: "Restore Points", desc: "Backup before tweaks. Revert anytime." },
];

export function ProSpotlight() {
  return (
    <section id="pro-spotlight" className="pro-spotlight-section section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4">
        <FlowIn className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Unlock your PC&apos;s{" "}
              <span className="headline-accent">full potential.</span>
            </h2>
          </div>
          <Button href="#pricing" variant="secondary" large>
            View pricing
          </Button>
        </FlowIn>

        <FlowIn delay={80}>
          <div className="pro-features-grid gap-0 overflow-visible">
            {premiumFeatures.map((f) => (
              <div key={f.title} className="pro-feature-cell flex gap-3 p-5">
                <AppIcon name={f.icon} size={20} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-white">{f.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-reflux-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FlowIn>
      </div>
    </section>
  );
}
