"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import type { AppIconName } from "@/data/app-icons";

export function AppPreviewHomePanel() {
  const demoExpires = useMemo(() => Date.now() + 29 * 86400000 + 5 * 3600000, []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, demoExpires - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="space-y-3">
      <div
        className="reflux-glow-box rounded-xl p-4"
        style={{
          borderColor: "rgba(255, 77, 61, 0.35)",
          boxShadow: "0 0 36px -12px rgba(255, 77, 61, 0.45)",
        }}
      >
        <div className="mb-1 text-[10px] font-bold tracking-[0.18em] text-reflux-accent uppercase">PRO access countdown</div>
        <div aria-live="polite" className="reflux-metric text-3xl font-extrabold text-white sm:text-4xl">
          {days}d {hours}h {minutes}m {seconds}s
        </div>
        <p className="mt-2 text-[11px] text-reflux-text-soft">Live timer — starts when you activate your license key in the app.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "CPU", val: "24%", color: "#5DDE86", name: "Intel i7-13700K" },
          { label: "GPU", val: "31%", color: "#F15B50", name: "RTX 4070" },
          { label: "RAM", val: "56%", color: "#B392F0", name: "32 GB Total" },
        ].map((stat) => (
          <div key={stat.label} className="reflux-glow-box reflux-glow-box-sm rounded-xl p-2.5">
            <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{stat.label}</div>
            <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ color: stat.color }}>
              {stat.val}
            </div>
            <div className="mt-1 truncate text-[9px] text-reflux-muted">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="reflux-glow-box rounded-xl p-3">
        <div className="mb-2 text-[10px] font-bold text-white">Performance Monitor</div>
        <svg viewBox="0 0 240 56" className="h-14 w-full" aria-hidden="true">
          <polyline
            fill="none"
            stroke="#F15B50"
            strokeWidth="2"
            points="0,42 20,38 40,35 60,28 80,32 100,22 120,18 140,24 160,14 180,16 200,10 220,12 240,8"
          />
          <polygon
            fill="rgba(241,91,80,0.15)"
            points="0,56 0,42 20,38 40,35 60,28 80,32 100,22 120,18 140,24 160,14 180,16 200,10 220,12 240,8 240,56"
          />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Clean RAM", "Optimize Network", "Apply Tweaks"].map((action) => (
          <span
            key={action}
            className="rounded-lg border border-reflux-accent/30 bg-reflux-accent/10 px-2.5 py-1.5 text-[10px] font-bold text-reflux-accent"
          >
            {action}
          </span>
        ))}
      </div>
    </div>
  );
}

function OptimizerHwChip({
  accent,
  kind,
  name,
  sub,
  vendor,
}: {
  accent: string;
  kind: string;
  name: string;
  sub: string;
  vendor: "intel" | "nvidia" | "amd" | "ram";
}) {
  return (
    <div
      className="reflux-glow-box flex min-w-[140px] flex-1 items-center gap-3 rounded-xl p-3"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
        boxShadow: `0 0 28px -10px ${accent}, inset 3px 0 0 ${accent}`,
      }}
    >
      <VendorLogo vendor={vendor} size={36} className="shrink-0" />
      <div className="min-w-0">
        <div className="text-[9px] font-bold tracking-wider uppercase" style={{ color: accent }}>
          {kind}
        </div>
        <div className="truncate text-xs font-bold text-white">{name}</div>
        <div className="text-[10px] text-reflux-muted">{sub}</div>
      </div>
    </div>
  );
}

export function AppPreviewOptimizerPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AppIcon name="optimizer" size={20} />
        <div>
          <div className="text-sm font-bold text-white">Smart Optimizer</div>
          <div className="text-[11px] text-reflux-muted">Matched to your detected hardware</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <OptimizerHwChip accent="#0071C5" kind="Processor" name="Intel Core i7-13700K" sub="Matched profile" vendor="intel" />
        <OptimizerHwChip accent="#76B900" kind="Graphics" name="NVIDIA RTX 4070" sub="Matched profile" vendor="nvidia" />
      </div>
      {[
        "Max Gaming Performance Suite",
        "Full Network Stack Reset",
        "Aggressive RAM Cleanup",
      ].map((cmd, i) => (
        <div key={cmd} className="reflux-glow-box rounded-xl p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-reflux-accent/15 text-[10px] font-bold text-reflux-accent">
              {i + 1}
            </span>
            <span className="text-xs font-bold text-white">{cmd}</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md border border-white/10 px-2 py-1 text-[9px] font-semibold text-reflux-muted">Copy</span>
            <span className="reflux-glow-interactive rounded-md px-2 py-1 text-[9px] font-bold text-reflux-accent">Run</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const sampleTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, tag: "Network", icon: "internet" as AppIconName },
  { name: "High Performance Power Plan", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "Disable Core Parking", on: true, tag: "CPU", icon: "cpu" as AppIconName },
  { name: "QoS Packet Prioritization", on: false, tag: "Network", icon: "internet" as AppIconName },
];

export const networkTweaks = [
  { name: "Disable Nagle's Algorithm", on: true, desc: "Cuts micro-delays on small game packets" },
  { name: "Flush DNS Cache", on: true, desc: "Clears stale resolver entries" },
  { name: "Optimize TCP/IP Stack", on: true, desc: "Tunes Windows network defaults" },
  { name: "Reset Winsock Catalog", on: false, desc: "Repairs broken socket bindings" },
];

export function AppPreviewTweaksPanel() {
  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AppIcon name="optimizer" size={20} />
          <div>
            <div className="text-sm font-bold text-white">Optimizer</div>
            <div className="text-[11px] text-reflux-muted">
              {PRODUCT_LIMITS.freeTweaks} free · {PRODUCT_LIMITS.totalTweaksLabel} pro
            </div>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-gradient-to-r from-reflux-accent to-[#c43d35] px-3 py-1.5 text-[10px] font-bold text-white shadow-[0_0_16px_rgba(241,91,80,0.35)] sm:px-4 sm:py-2 sm:text-xs"
        >
          Apply All
        </button>
      </div>
      {sampleTweaks.map((tweak) => (
        <div
          key={tweak.name}
          className="flex items-center justify-between gap-3 rounded-xl border border-reflux-border/50 bg-[#0f1217]/90 px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <AppIcon name={tweak.icon} size={16} glow={false} className="shrink-0 opacity-80" />
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold sm:text-sm">{tweak.name}</div>
              <div className="mt-0.5 text-[10px] text-reflux-muted">{tweak.tag}</div>
            </div>
          </div>
          <div
            className={`relative h-5 w-9 shrink-0 rounded-full sm:h-6 sm:w-11 ${tweak.on ? "bg-reflux-accent shadow-[0_0_10px_rgba(241,91,80,0.45)]" : "bg-reflux-border"}`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform sm:h-5 sm:w-5 ${tweak.on ? "translate-x-4 sm:translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
