"use client";

import { useState } from "react";
import { AppScreenshotFrame } from "@/components/app/AppScreenshotFrames";
import { AppIcon } from "@/components/ui/AppIcon";
import { FlowIn } from "@/components/ui/FlowIn";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { appGalleryItems } from "@/data/reflux-highlights";
import { REFLUX_FREE_DOWNLOAD } from "@/data/downloads";
import { Button } from "@/components/ui/Button";

type GalleryId = (typeof appGalleryItems)[number]["id"];

export function AppGallery() {
  const [active, setActive] = useState<GalleryId>("detect");
  const current = appGalleryItems.find((item) => item.id === active) ?? appGalleryItems[0];

  return (
    <section id="app-gallery" className="section-flow">
      <div className="section-flow-divider" aria-hidden="true" />
      <SectionHeader
        eyebrow="Show me the app"
        title={
          <>
            See <span className="gradient-text">REFLUX</span> in action
          </>
        }
        subtitle="Real desktop screens — live detection, vendor-matched tweaks, game scanner, and one-click optimizers. This is what you download."
      />

      <div className="mx-auto max-w-6xl">
        <FlowIn>
          <div className="app-gallery-tabs mb-5 flex gap-2 overflow-x-auto pb-1">
            {appGalleryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`app-gallery-tab inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  active === item.id
                    ? "border-reflux-accent/50 bg-reflux-accent/12 text-white shadow-[0_0_24px_rgba(241,91,80,0.2)]"
                    : "border-white/10 bg-white/[0.03] text-reflux-muted hover:border-reflux-accent/25 hover:text-white"
                }`}
              >
                <AppIcon name={item.icon} size={16} glow={active === item.id} />
                {item.label}
              </button>
            ))}
          </div>
        </FlowIn>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <FlowIn delay={80}>
            <div className="app-gallery-copy sticky top-28">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-reflux-green/25 bg-reflux-green/10 px-3 py-1 text-[11px] font-bold text-reflux-green uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
                Desktop app preview
              </div>
              <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {current.title}
              </h3>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-reflux-muted md:text-base">
                {current.caption}
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "Custom icons & glowy UI — not a web wrapper",
                  "Detects Intel, AMD & NVIDIA automatically",
                  "Restore points before risky tweaks",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-[#c4ccd8]">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-reflux-green" />
                    {line}
                  </li>
                ))}
              </ul>
              <Button
                href={REFLUX_FREE_DOWNLOAD.href}
                download={REFLUX_FREE_DOWNLOAD.filename}
                variant="primary"
                showIcon
              >
                Try the free app
              </Button>
            </div>
          </FlowIn>

          <FlowIn delay={120}>
            <div className="app-gallery-stage relative">
              <div className="app-gallery-glow pointer-events-none absolute inset-0 scale-105 rounded-[28px] blur-3xl" aria-hidden="true" />
              <div className="app-gallery-device relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0e12] shadow-[0_20px_56px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-white/8 bg-[#0b0e15] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-reflux-muted uppercase">
                    REFLUX — {current.label}
                  </span>
                </div>
                <div className="min-h-[320px] bg-gradient-to-b from-[#0c0e12] to-[#080a0d] p-4 sm:p-5">
                  <AppScreenshotFrame id={active} />
                </div>
              </div>
              <div className="app-gallery-thumbs mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {appGalleryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={`inline-flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center text-[10px] font-bold transition-all sm:text-[11px] ${
                      active === item.id
                        ? "border-reflux-accent/40 bg-reflux-accent/10 text-reflux-accent"
                        : "border-white/8 bg-white/[0.02] text-reflux-muted hover:text-white"
                    }`}
                  >
                    <AppIcon name={item.icon} size={14} glow={active === item.id} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </FlowIn>
        </div>
      </div>
    </section>
  );
}
