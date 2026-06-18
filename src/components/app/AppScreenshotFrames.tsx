"use client";

import { GameImage } from "@/components/games/GameImage";
import { Icon } from "@/components/ui/Icon";
import { VendorLogo } from "@/components/ui/VendorLogo";
import { PRODUCT_LIMITS } from "@/data/tweaks";
import { appGalleryItems } from "@/data/reflux-highlights";

type GalleryId = (typeof appGalleryItems)[number]["id"];

const STEAM = (id: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`;

function BrandPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="reflux-glow-box reflux-glow-box-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
      style={{
        borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
        boxShadow: `0 0 20px -6px ${color}`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

function HwChip({
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
      className="reflux-glow-box flex min-w-[140px] flex-1 items-center gap-3 p-3"
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

export function AppScreenshotFrame({ id }: { id: GalleryId }) {
  if (id === "detect") {
    return (
      <div className="space-y-3 p-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-reflux-green shadow-[0_0_8px_#5dde86]" />
            Live Hardware Detection
          </div>
          <BrandPill label="Intel + NVIDIA" color="#0099FF" />
        </div>
        <p className="text-[11px] leading-relaxed text-reflux-muted">
          REFLUX scanned your PC and matched tweaks to your exact build.
        </p>
        <div className="flex flex-wrap gap-2">
          <HwChip accent="#0071C5" kind="Processor" name="Intel Core i7-13700K" sub="5200 MHz · 16 Cores" vendor="intel" />
          <HwChip accent="#76B900" kind="Graphics" name="NVIDIA RTX 4070" sub="12 GB VRAM · 551.86" vendor="nvidia" />
          <HwChip accent="#7c3aed" kind="Memory" name="32 GB RAM" sub="18 GB used · 32 GB total" vendor="ram" />
        </div>
        <div className="reflux-glow-box p-3">
          <div className="mb-2 text-[10px] font-bold tracking-wide text-reflux-accent uppercase">Your custom profile</div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {["Intel CPU profile", "NVIDIA GPU profile", "Network stack", "Memory tuning"].map((item) => (
              <div
                key={item}
                className="reflux-glow-box reflux-glow-box-sm flex items-center justify-between px-2.5 py-2 text-[10px] font-semibold text-white"
              >
                {item}
                <Icon name="arrowRight" size={12} className="text-reflux-accent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "dashboard") {
    return (
      <div className="space-y-3 p-1">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "CPU", val: "24%", color: "#5DDE86", name: "Intel i7-13700K" },
            { label: "GPU", val: "31%", color: "#F15B50", name: "RTX 4070" },
            { label: "RAM", val: "56%", color: "#B392F0", name: "32 GB Total" },
          ].map((s) => (
            <div key={s.label} className="reflux-glow-box reflux-glow-box-sm p-2.5">
              <div className="text-[9px] font-bold tracking-wider text-reflux-muted uppercase">{s.label}</div>
              <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ color: s.color }}>
                {s.val}
              </div>
              <div className="mt-1 truncate text-[9px] text-reflux-muted">{s.name}</div>
            </div>
          ))}
        </div>
        <div className="reflux-glow-box p-3">
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
          {["Clean RAM", "Optimize Network", "Optimize Graphics"].map((a) => (
            <span
              key={a}
              className="rounded-lg border border-reflux-accent/30 bg-reflux-accent/10 px-2.5 py-1.5 text-[10px] font-bold text-reflux-accent"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (id === "tweaks") {
    const rows = [
      { name: "Disable Nagle's Algorithm", tag: "Network", on: true },
      { name: "NVIDIA Reflex Low Latency", tag: "NVIDIA", on: true },
      { name: "Disable Core Parking", tag: "CPU", on: true },
      { name: "QoS Packet Prioritization", tag: "Network", on: false, pro: true },
    ];
    return (
      <div className="space-y-2 p-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">GPU Tweaks</div>
            <div className="text-[10px] text-reflux-muted">
              {PRODUCT_LIMITS.freeTweaks} free · {PRODUCT_LIMITS.totalTweaksLabel} pro
            </div>
          </div>
          <span className="rounded-lg reflux-glow-interactive border border-reflux-accent/30 bg-reflux-accent/10 px-2.5 py-1.5 text-[10px] font-bold text-reflux-accent">
            Apply All Free
          </span>
        </div>
        {rows.map((row) => (
          <div
            key={row.name}
            className="reflux-glow-box reflux-glow-box-sm flex items-center justify-between gap-2 px-3 py-2.5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-semibold text-white">{row.name}</span>
                {row.pro && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold text-reflux-accent bg-reflux-accent/10">
                    PRO
                  </span>
                )}
              </div>
              <div className="text-[10px] text-reflux-muted">{row.tag}</div>
            </div>
            <div
              className={`relative h-5 w-9 shrink-0 rounded-full ${row.on ? "bg-reflux-accent" : "bg-reflux-border"}`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${row.on ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "games") {
    const games = [
      { sources: [STEAM(730)], alt: "CS2", title: "Counter-Strike 2" },
      { sources: [STEAM(1172470)], alt: "Apex", title: "Apex Legends" },
      { sources: [STEAM(1091500)], alt: "Cyberpunk", title: "Cyberpunk 2077" },
    ];
    return (
      <div className="grid grid-cols-3 gap-2 p-1">
        {games.map((game) => (
          <div key={game.alt} className="reflux-glow-interactive relative overflow-hidden rounded-xl">
            <div className="aspect-[460/215]">
              <GameImage
                sources={game.sources}
                alt={game.alt}
                fallbackTitle={game.alt}
                fallbackSubtitle="Steam"
                fallbackGradient="from-slate-800 to-black"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-2 pt-6">
              <button
                type="button"
                className="w-full rounded-lg border border-reflux-accent/50 bg-black/50 py-1 text-[9px] font-bold text-reflux-accent backdrop-blur-sm"
              >
                Optimize
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "network") {
    const tweaks = [
      { name: "Disable Nagle's Algorithm", on: true, desc: "Cuts micro-delays on small packets" },
      { name: "Flush DNS Cache", on: true, desc: "Clears stale resolver entries" },
      { name: "Optimize TCP/IP Stack", on: true, desc: "Tunes Windows network defaults" },
      { name: "Reset Winsock Catalog", on: false, desc: "Repairs broken socket bindings" },
    ];
    return (
      <div className="space-y-2 p-1">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-reflux-accent/15 text-reflux-accent">
              <Icon name="globe" size={12} />
            </span>
            Network tweaks
          </div>
          <span className="text-[10px] font-semibold text-reflux-muted">4 available</span>
        </div>
        {tweaks.map((tweak) => (
          <div
            key={tweak.name}
            className="reflux-glow-interactive flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white">{tweak.name}</div>
              <div className="text-[9px] text-reflux-muted">{tweak.desc}</div>
            </div>
            <div
              className={`relative h-5 w-9 shrink-0 rounded-full ${tweak.on ? "bg-reflux-accent" : "bg-white/15"}`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md ${tweak.on ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      <div className="flex flex-wrap gap-2">
        <HwChip accent="#0071C5" kind="Processor" name="Intel Core i7" sub="Matched profile" vendor="intel" />
        <HwChip accent="#76B900" kind="Graphics" name="NVIDIA RTX 4070" sub="Matched profile" vendor="nvidia" />
      </div>
      {[
        "Max Gaming Performance Suite",
        "Full Network Stack Reset",
        "Aggressive RAM Cleanup",
      ].map((cmd, i) => (
        <div key={cmd} className="reflux-glow-box p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-reflux-accent/15 text-[10px] font-bold text-reflux-accent">
              {i + 1}
            </span>
            <span className="text-xs font-bold text-white">{cmd}</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md border border-white/10 px-2 py-1 text-[9px] font-semibold text-reflux-muted">
              Copy
            </span>
          <span className="rounded-md reflux-glow-interactive px-2 py-1 text-[9px] font-bold text-reflux-accent">
              Run
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
