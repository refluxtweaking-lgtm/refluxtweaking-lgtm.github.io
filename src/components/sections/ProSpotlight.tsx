"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { PRODUCT_LIMITS } from "@/data/tweaks";

const premiumFeatures = [
  { icon: "optimizer" as const, title: "Smart Optimizer", desc: `${PRODUCT_LIMITS.totalTweaksLabel} safe tweaks tuned to your detected CPU + GPU combo.` },
  { icon: "games" as const, title: "Game Scanner", desc: "Auto-find Steam & Epic titles with per-game optimize profiles." },
  { icon: "bios" as const, title: "BIOS Guides", desc: "Firmware tuning walkthroughs matched to your hardware vendor." },
  { icon: "bolt" as const, title: "Advanced Tools", desc: "Quick commands, PowerShell runner, and pro-only tweak suites." },
  { icon: "internet" as const, title: "Network Suite", desc: "TCP tuning, DNS flush, bufferbloat fixes — measured in-app." },
  { icon: "shield" as const, title: "Priority Support", desc: "Discord help when you need a hand with your setup." },
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
              <span className="gradient-text">full potential.</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-reflux-muted md:text-base">
              Pro adds the full tweak library, game-mode suites, and network tools — one upgrade when free isn&apos;t enough.
            </p>
          </div>
          <Button href="#pricing" variant="secondary" large>
            View pricing
          </Button>
        </FlowIn>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr_1fr]">
          <FlowIn delay={60} className="pro-spotlight-card rounded-2xl border border-white/10 bg-[#0e1118] p-5">
            <div className="mb-3 text-xs font-bold tracking-wider text-reflux-muted uppercase">OS Tweaks</div>
            <div className="space-y-2">
              {["Disable Hidden Power Savings", "Disable C-States", "High Performance Plan"].map((t) => (
                <div key={t} className="flex items-center justify-between rounded-lg border border-white/8 bg-black/25 px-3 py-2">
                  <span className="text-xs font-medium text-white/90">{t}</span>
                  <div className="h-4 w-7 rounded-full bg-reflux-accent/80">
                    <div className="ml-3.5 mt-0.5 h-3 w-3 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-reflux-accent">
              <span>⚠</span> Review before applying
            </div>
          </FlowIn>

          <FlowIn delay={120} className="pro-spotlight-center relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-reflux-accent/25 bg-[#0a0c12] p-8">
            <div className="optimizer-ring-glow pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="optimizer-ring relative flex h-44 w-44 items-center justify-center rounded-full border border-reflux-accent/30 md:h-52 md:w-52">
              <div className="optimizer-ring-inner absolute inset-2 rounded-full border border-reflux-calm/20" />
              <button
                type="button"
                className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/15 bg-[#0d1018]/90 shadow-[0_0_40px_rgba(255,107,91,0.35)] backdrop-blur-sm transition-transform hover:scale-105 md:h-32 md:w-32"
              >
                <AppIcon name="bolt" size={28} />
                <span className="mt-1 text-sm font-extrabold text-white">Activate</span>
              </button>
            </div>
            <div className="mt-6 text-center">
              <div className="font-bold text-white">REFLUX Game Mode</div>
              <p className="mt-1 text-xs text-reflux-muted">One click — max FPS & lowest latency profile</p>
            </div>
          </FlowIn>

          <FlowIn delay={180} className="pro-spotlight-card rounded-2xl border border-white/10 bg-[#0e1118] p-5">
            <div className="mb-3 text-xs font-bold tracking-wider text-reflux-muted uppercase">Network Priority</div>
            <div className="space-y-2">
              {["Fortnite", "CS2", "Valorant", "Apex"].map((game, i) => (
                <div key={game} className="flex items-center justify-between rounded-lg border border-white/8 bg-black/25 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <AppIcon name="games" size={14} glow={false} />
                    <span className="text-xs font-semibold text-white">{game}</span>
                  </div>
                  <div
                    className={`h-4 w-7 rounded-full ${i < 3 ? "bg-reflux-accent shadow-[0_0_8px_rgba(255,107,91,0.5)]" : "bg-reflux-border"}`}
                  >
                    {i < 3 && <div className="ml-3.5 mt-0.5 h-3 w-3 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </FlowIn>
        </div>

        <FlowIn delay={220} className="mt-10">
          <div className="pro-features-grid overflow-hidden rounded-2xl border border-white/10">
            {premiumFeatures.map((f, i) => (
              <div
                key={f.title}
                className={`pro-feature-cell flex gap-3 border-white/8 p-5 ${i < premiumFeatures.length - 1 ? "border-b md:border-b-0" : ""} ${i % 2 === 0 ? "md:border-r" : ""} ${i < 4 ? "md:border-b" : ""}`}
              >
                <AppIcon name={f.icon} size={20} className="shrink-0 mt-0.5" />
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
