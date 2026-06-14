"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { DiskCleanupMock } from "../DiskCleanupMock";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SlideHeading } from "./SlideHeading";
import type { SlideProps } from "./types";

const benefits: { icon: IconName; title: string; desc: string }[] = [
  { icon: "rocket", title: "Faster boot", desc: "Less junk at startup" },
  { icon: "disk", title: "More disk space", desc: "Recover 10+ GB typical" },
  { icon: "target", title: "Smoother games", desc: "No shader cache bloat" },
  { icon: "bolt", title: "Less stutter", desc: "Clean temp & cache files" },
];

export function SystemCleanupSlide({ isActive = false }: SlideProps) {
  return (
    <GlowCard centered className="w-full">
      <SlideHeading icon="broom" title="System Cleanup" />
      <p className="mb-5 max-w-lg text-center text-reflux-muted">
        Windows Disk Cleanup only runs when <em>you</em> remember. REFLUX automates it — temp
        files, shader caches, update leftovers, and DirectX bloat gone in seconds. Your PC
        literally has more room to breathe.
      </p>

      <DiskCleanupMock isActive={isActive} />

      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group flex flex-col items-center rounded-xl border border-reflux-border bg-reflux-card/60 px-3 py-3 text-center transition-all hover:border-reflux-accent/30"
          >
            <span className="icon-chip mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-reflux-accent/25 bg-black/30">
              <Icon name={b.icon} size={20} />
            </span>
            <div className="text-sm font-semibold">{b.title}</div>
            <div className="text-[11px] text-reflux-muted">{b.desc}</div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-[#C0C8D2]">
        One click. No digging through Windows settings. REFLUX handles it.
      </p>
    </GlowCard>
  );
}
