"use client";

import { useState } from "react";

const tabs = ["Tweaks", "Games", "Network", "Cleanup", "Benchmarks"] as const;

const sampleTweaks = [
  { name: "Disable Nagle's Algorithm", on: true },
  { name: "High Performance Power Plan", on: true },
  { name: "Disable Core Parking", on: true },
  { name: "QoS Packet Prioritization", on: false },
  { name: "Shader Cache Cleanup", on: true },
];

export function AppPreviewMock() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Tweaks");

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.35)] bg-[#080a0d] shadow-[0_0_60px_rgba(241,91,80,0.12),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
      <div className="flex items-center gap-2 border-b border-reflux-border/80 bg-[#0a0b0e] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-reflux-muted">REFLUX PRO — Unlocked</span>
      </div>

      <div className="flex items-center justify-between border-b border-reflux-border/60 bg-gradient-to-r from-[#0c0e12] to-[#0a0b0e] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-reflux-accent to-[#c43d35] text-xs font-black text-white">
            R
          </span>
          <span className="text-lg font-extrabold gradient-text">REFLUX PRO</span>
          <span className="badge-pill badge-live text-[10px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-reflux-green" />
            RUNNING
          </span>
        </div>
        <span className="hidden text-xs text-reflux-muted sm:inline">v2.4.1 · Administrator</span>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-reflux-border/40 bg-[#0a0c10] px-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === tab
                ? "border-reflux-accent text-reflux-accent"
                : "border-transparent text-reflux-muted hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[280px] bg-gradient-to-b from-[#0c0e12] to-[#080a0d] p-6">
        {activeTab === "Tweaks" && (
          <div className="space-y-2.5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">130+ Optimizations</span>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-reflux-accent to-[#c43d35] px-4 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(241,91,80,0.4)]"
              >
                Apply All
              </button>
            </div>
            {sampleTweaks.map((tweak) => (
              <div
                key={tweak.name}
                className="flex items-center justify-between rounded-xl border border-reflux-border/60 bg-[#0f1217]/80 px-4 py-3 backdrop-blur-sm"
              >
                <span className="text-sm">{tweak.name}</span>
                <div
                  className={`relative h-6 w-11 rounded-full transition-colors ${tweak.on ? "bg-reflux-accent shadow-[0_0_12px_rgba(241,91,80,0.5)]" : "bg-reflux-border"}`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${tweak.on ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Games" && (
          <div className="grid grid-cols-3 gap-3">
            {["Fortnite", "Apex", "Cyberpunk"].map((g) => (
              <div
                key={g}
                className="overflow-hidden rounded-xl border border-reflux-border/60 bg-[#0f1217] p-3 text-center"
              >
                <div className="mb-2 aspect-video rounded-lg bg-gradient-to-br from-reflux-accent/30 via-reflux-purple/20 to-reflux-discord/20" />
                <div className="text-xs font-bold">{g}</div>
                <button
                  type="button"
                  className="mt-2 w-full rounded-lg border border-reflux-accent/30 bg-reflux-accent/15 py-1.5 text-[10px] font-bold text-reflux-accent"
                >
                  Optimize
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Network" && (
          <div className="py-6 text-center">
            <div className="text-6xl font-extrabold gradient-text">18 ms</div>
            <div className="mt-2 text-sm text-reflux-muted">
              Current latency <span className="text-reflux-green">(was 85 ms)</span>
            </div>
            <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-reflux-border">
              <div className="h-full w-[22%] rounded-full bg-gradient-to-r from-reflux-accent to-reflux-green shadow-[0_0_12px_rgba(93,222,134,0.5)]" />
            </div>
          </div>
        )}

        {activeTab === "Cleanup" && (
          <div className="py-8 text-center">
            <div className="text-5xl font-extrabold text-reflux-green">12.4 GB</div>
            <div className="mt-2 text-sm text-reflux-muted">Ready to recover</div>
            <button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-reflux-accent to-[#c43d35] px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(241,91,80,0.4)]"
            >
              Run Cleanup
            </button>
          </div>
        )}

        {activeTab === "Benchmarks" && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "GPU FPS", val: "144", color: "text-reflux-accent" },
              { label: "CPU", val: "94%", color: "text-reflux-green" },
              { label: "RAM Free", val: "31 GB", color: "text-reflux-purple" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-reflux-border/50 bg-[#0f1217]/80 p-5 text-center"
              >
                <div className={`text-3xl font-extrabold tabular-nums ${s.color}`}>{s.val}</div>
                <div className="mt-1 text-xs font-medium text-reflux-muted">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
