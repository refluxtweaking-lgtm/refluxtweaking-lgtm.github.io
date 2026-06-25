import { PRODUCT_LIMITS } from "./tweaks";

import type { AppIconName } from "./app-icons";

export const refluxAdvantages = [
  {
    objection: "Will this work on my PC?",
    title: "Detects your exact hardware",
    body: "Intel + NVIDIA? AMD + AMD? REFLUX reads your CPU & GPU on launch and only shows tweaks that match your rig — with real vendor logos, not generic sliders.",
    icon: "search" as const,
  },
  {
    objection: "Is the free version fake?",
    title: "Real app, real tweaks — free",
    body: `${PRODUCT_LIMITS.freeTweaks} optimizations in the full desktop app. Not a web demo. Restore points, live dashboard, and honest toggles from day one — no card required.`,
    icon: "download" as const,
  },
  {
    objection: "Will it slow my PC down?",
    title: "Zero background bloat",
    body: "REFLUX only runs when you open it. No always-on services, no extra launchers, no surprise startup entries eating your RAM.",
    icon: "shield" as const,
  },
  {
    objection: "Another subscription trap?",
    title: "Own Pro forever if you want",
    body: "Lifetime at $89.99 — one payment, every future update. Or stay free until you're ready. Your call, not ours.",
    icon: "sparkle" as const,
  },
];

export const trustObjections = [
  {
    objection: "Will this brick Windows?",
    proof: "Restore point before every batch",
    icon: "save" as const,
  },
  {
    objection: "Is this malware?",
    proof: "Clean code, no hidden miners",
    icon: "shield" as const,
  },
  {
    objection: "Does free actually work?",
    proof: `${PRODUCT_LIMITS.freeTweaks} real tweaks, no card`,
    icon: "bolt" as const,
  },
  {
    objection: "Will it find my games?",
    proof: "Steam & Epic auto-scanner",
    icon: "games" as const,
  },
  {
    objection: "Wrong CPU/GPU tweaks?",
    proof: "Live Intel / AMD / NVIDIA detect",
    icon: "cpu" as const,
  },
  {
    objection: "Always running in background?",
    proof: "Opens when you open it — that's it",
    icon: "processkiller" as const,
  },
] as const;

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
    detail: "Reads your CPU and GPU on launch — shows the matching tweak pages",
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
    detail: "Auto-find Steam & Epic titles with per-game optimization (Pro)",
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

export const appGalleryItems: {
  id: string;
  label: string;
  icon: AppIconName;
  title: string;
  caption: string;
  bullets: string[];
}[] = [
  {
    id: "detect",
    label: "Live Detection",
    icon: "search",
    title: "Knows your rig instantly",
    caption: "Intel + NVIDIA? AMD + AMD? REFLUX detects your combo and unlocks the right CPU & GPU profiles automatically.",
    bullets: [
      "Scans your PC the first time you open it",
      "Picks the right CPU and GPU tweak pages for your build",
      "No guessing which vendor profile to use",
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "home",
    title: "Real-time performance monitor",
    caption: "Live CPU, GPU & RAM charts with one-click quick actions — clean RAM, optimize network, boost graphics.",
    bullets: [
      "CPU, GPU, and RAM meters on one screen",
      "Quick actions without digging through menus",
      "Only runs when you have the app open",
    ],
  },
  {
    id: "tweaks",
    label: "Tweaks",
    icon: "optimizer",
    title: `${PRODUCT_LIMITS.totalTweaksLabel} optimizations, one toggle away`,
    caption: "Network, CPU, GPU, RAM, system, cleanup & debloat — each tweak explains what it does before you apply.",
    bullets: [
      "Flip tweaks on or off — nothing hidden",
      "Windows restore point before each batch",
      "Full desktop app you actually install",
    ],
  },
  {
    id: "games",
    label: "Game Scanner",
    icon: "games",
    title: "Auto-find & optimize games",
    caption: "Scans Steam, Epic, and installed titles. Hit Optimize on CS2, Apex, Fortnite, and more.",
    bullets: [
      "Finds Steam and Epic games automatically",
      "One Optimize button per title",
      "Network Priority toggles per game in Pro",
    ],
  },
  {
    id: "network",
    label: "Network",
    icon: "internet",
    title: "Latency you can feel",
    caption: "DNS flush, TCP tuning, and Winsock reset — same toggles you get in the installed app.",
    bullets: [
      "Nagle's, DNS flush, TCP stack — grouped in one tab",
      "Turn on what you want, leave the rest off",
      "No fake ping counters or demo graphs",
    ],
  },
  {
    id: "optimizer",
    label: "Smart Optimizer",
    icon: "bolt",
    title: "One-click Pro suites",
    caption: "Quick command library plus custom PowerShell runner — tuned recommendations for your detected hardware.",
    bullets: [
      "One-click suites for your detected hardware",
      "Copy or run commands from the built-in library",
      "Custom PowerShell runner when you need it",
    ],
  },
];
