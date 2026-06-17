"use client";

import { FlowIn } from "@/components/ui/FlowIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppIcon, AppIconChip } from "@/components/ui/AppIcon";
import { APP_NAV_MODULES } from "@/data/app-icons";

export function AppModules() {
  return (
    <section id="app-modules" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Will it work on MY rig?"
        title={
          <>
            Every tool. <span className="gradient-text">One sidebar.</span>
          </>
        }
        subtitle="Same icons you get in the desktop app — CPU, GPU, games, network, cleanup, debloat, and more. Matched to what you actually have installed."
      />

      <div className="mx-auto max-w-6xl">
        <FlowIn>
          <div className="app-sidebar-preview mb-8 overflow-hidden rounded-2xl border border-reflux-accent/25 bg-[#0a0c10] shadow-[0_0_60px_-20px_rgba(255,107,91,0.45)]">
            <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d0f14] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] font-semibold tracking-wide text-reflux-muted uppercase">
                REFLUX — navigation
              </span>
            </div>
            <div className="flex">
              <aside className="flex w-full flex-wrap gap-1 border-r border-white/6 bg-[#080a0d] p-3 sm:w-56 sm:flex-col sm:flex-nowrap">
                {APP_NAV_MODULES.map((mod, i) => (
                  <div
                    key={mod.label}
                    className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors ${
                      i === 0
                        ? "bg-reflux-accent/12 text-white shadow-[inset_0_0_0_1px_rgba(255,107,91,0.35)]"
                        : "text-reflux-muted hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <AppIconChip name={mod.icon} size={16} chipSize={32} active={i === 0} />
                    <span className="hidden sm:inline">{mod.label}</span>
                  </div>
                ))}
              </aside>
              <div className="hidden flex-1 p-6 sm:block">
                <div className="mb-2 flex items-center gap-2">
                  <AppIcon name="home" size={22} />
                  <span className="text-lg font-bold text-white">Home</span>
                  <span className="badge-pill badge-live text-[10px]">Live</span>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-reflux-muted">
                  Detects Intel, AMD & NVIDIA on launch — then surfaces matched CPU, GPU, and RAM tweak pages
                  automatically. No guessing which settings apply to your rig.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(["cpu", "gpu", "ram", "internet"] as const).map((icon) => (
                    <span
                      key={icon}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/90 uppercase"
                    >
                      <AppIcon name={icon} size={14} glow={false} />
                      {icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FlowIn>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {APP_NAV_MODULES.map((mod, i) => (
            <FlowIn key={mod.label} delay={i * 40}>
              <div className="module-card group h-full rounded-2xl border border-white/10 bg-[#12151c] p-4 transition-all hover:border-reflux-accent/35 hover:bg-[#151922] hover:shadow-[0_0_32px_-12px_rgba(255,107,91,0.4)]">
                <AppIconChip name={mod.icon} size={20} chipSize={44} className="mb-3 group-hover:border-reflux-accent/40" />
                <div className="font-bold text-white">{mod.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-reflux-muted">{mod.desc}</div>
              </div>
            </FlowIn>
          ))}
        </div>
      </div>
    </section>
  );
}
