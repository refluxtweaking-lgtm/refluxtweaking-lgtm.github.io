import { PRODUCT_LIMITS } from "./tweaks";

export type ComparisonWinner = "reflux" | "exm" | "tie";

export interface ComparisonRow {
  feature: string;
  reflux: string;
  exm: string;
  winner?: ComparisonWinner;
  highlight?: boolean;
}

export const EXM_COMPETITOR = {
  name: "EXM Tweaks",
  slug: "exm-tweaks",
} as const;

export const comparisonRows: ComparisonRow[] = [
  {
    feature: "Free tier (no card)",
    reflux: `${PRODUCT_LIMITS.freeTweaks} tweaks + full app`,
    exm: "Very limited free mode",
    winner: "reflux",
    highlight: true,
  },
  {
    feature: "Total optimizations",
    reflux: `${PRODUCT_LIMITS.totalTweaksLabel} tweaks (Pro)`,
    exm: "Premium subscription unlock",
    winner: "reflux",
  },
  {
    feature: "Live hardware detection",
    reflux: "Detects Intel, AMD & NVIDIA — auto-matches profiles",
    exm: "Generic one-size-fits-all lists",
    winner: "reflux",
    highlight: true,
  },
  {
    feature: "Vendor-specific tabs",
    reflux: "Dedicated Intel / AMD / NVIDIA tweak pages",
    exm: "Mixed into general categories",
    winner: "reflux",
  },
  {
    feature: "Built-in restore points",
    reflux: "One-click before every batch",
    exm: "Manual or third-party tools",
    winner: "reflux",
  },
  {
    feature: "100% reversible",
    reflux: "Restore defaults in-app",
    exm: "Partial — some changes stick",
    winner: "reflux",
  },
  {
    feature: "Background bloat",
    reflux: "Zero extra processes",
    exm: "Extra services & telemetry common",
    winner: "reflux",
    highlight: true,
  },
  {
    feature: "Game auto-optimizer",
    reflux: "Pro — scans Steam, Epic & more",
    exm: "Yes (paid)",
    winner: "tie",
  },
  {
    feature: "Pricing flexibility",
    reflux: "Free · $6.99/mo · $89.99 lifetime",
    exm: "Mostly subscription-only",
    winner: "reflux",
  },
  {
    feature: "Smart Optimizer",
    reflux: "One-click suites tuned to your CPU + GPU",
    exm: "Manual tweak picking",
    winner: "reflux",
  },
];

export const refluxAdvantages = [
  {
    title: "Built for your exact hardware",
    body: "REFLUX detects your CPU and GPU brands on launch, shows real Intel / AMD / NVIDIA logos, and surfaces the tweak pages that actually match your rig.",
    icon: "search" as const,
  },
  {
    title: "See the app before you buy",
    body: "30 free tweaks in the full desktop app — not a stripped web demo. Try real optimizations, restore points, and the live dashboard first.",
    icon: "download" as const,
  },
  {
    title: "No mystery background apps",
    body: "REFLUX runs when you open it. No always-on services, no extra launchers, no surprise startup entries.",
    icon: "shield" as const,
  },
  {
    title: "Own it forever option",
    body: "Lifetime Pro at $89.99 beats years of subscription fees. Every future update included.",
    icon: "sparkle" as const,
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
    title: "129 optimizations, one toggle away",
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
