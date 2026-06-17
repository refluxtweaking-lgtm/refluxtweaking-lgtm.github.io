import { PRODUCT_LIMITS } from "./tweaks";

export const refluxAdvantages = [
  {
    title: "Built for your exact hardware",
    body: "REFLUX detects your CPU and GPU brands on launch, shows real Intel / AMD / NVIDIA logos, and surfaces the tweak pages that actually match your rig.",
    icon: "search" as const,
  },
  {
    title: "Try before you upgrade",
    body: `${PRODUCT_LIMITS.freeTweaks} free tweaks in the full desktop app — not a stripped web demo. Real optimizations, restore points, and the live dashboard from day one.`,
    icon: "download" as const,
  },
  {
    title: "No background bloat",
    body: "REFLUX runs when you open it. No always-on services, no extra launchers, no surprise startup entries.",
    icon: "shield" as const,
  },
  {
    title: "Own it forever",
    body: "Lifetime Pro at $89.99 — one payment, every future update included. Or start free and upgrade when you're ready.",
    icon: "sparkle" as const,
  },
];

export const refluxFeatures = [
  {
    feature: "Free tier",
    detail: `${PRODUCT_LIMITS.freeTweaks} tweaks + full desktop app, no card required`,
    highlight: true,
  },
  {
    feature: "Pro library",
    detail: `${PRODUCT_LIMITS.totalTweaksLabel} total optimizations across every category`,
  },
  {
    feature: "Live hardware detection",
    detail: "Auto-detects Intel, AMD & NVIDIA — matches vendor-specific tweak profiles",
    highlight: true,
  },
  {
    feature: "Restore points",
    detail: "One-click Windows restore before every tweak batch",
  },
  {
    feature: "100% reversible",
    detail: "Restore defaults in-app anytime",
  },
  {
    feature: "Game scanner",
    detail: "Auto-find Steam & Epic titles with per-game optimize (Pro)",
  },
  {
    feature: "Smart Optimizer",
    detail: "One-click suites tuned to your detected CPU + GPU combo",
  },
  {
    feature: "Pricing",
    detail: "Free · $6.99/mo · $54.99/yr · $89.99 lifetime",
  },
];

export const appGalleryItems = [
  {
    id: "detect",
    label: "Live Detection",
    title: "Knows your rig instantly",
    caption: "Intel + NVIDIA? AMD + AMD? REFLUX detects your combo and unlocks the right CPU & GPU profiles automatically.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Real-time performance monitor",
    caption: "Live CPU, GPU & RAM charts with one-click quick actions — clean RAM, optimize network, boost graphics.",
  },
  {
    id: "tweaks",
    label: "Tweaks",
    title: "100+ optimizations, one toggle away",
    caption: "Network, CPU, GPU, RAM, system, cleanup & debloat — each tweak explains what it does before you apply.",
  },
  {
    id: "games",
    label: "Game Scanner",
    title: "Auto-find & optimize games",
    caption: "Scans Steam, Epic, and installed titles. Hit Optimize on CS2, Apex, Fortnite, and more.",
  },
  {
    id: "network",
    label: "Network",
    title: "Latency you can feel",
    caption: "DNS flush, TCP tuning, Winsock repair — measured before/after ping improvements in-app.",
  },
  {
    id: "optimizer",
    label: "Smart Optimizer",
    title: "One-click pro suites",
    caption: "Quick command library plus custom PowerShell runner — tuned recommendations for your detected hardware.",
  },
] as const;
