import type { PlanId } from "./plans";

export type TweakCategory =
  | "Network"
  | "CPU & Power"
  | "GPU & Display"
  | "Memory & Storage"
  | "System & Services"
  | "Gaming"
  | "Cleanup & Maintenance";

export interface Tweak {
  id: string;
  name: string;
  description: string;
  category: TweakCategory;
  plans: Record<PlanId, boolean>;
}

const allPaid = { free: false, monthly: true, yearly: true, lifetime: true } as const;
const allPlans = { free: true, monthly: true, yearly: true, lifetime: true } as const;
const freeBasic = { free: true, monthly: true, yearly: true, lifetime: true } as const;
const paidOnly = { free: false, monthly: true, yearly: true, lifetime: true } as const;
const yearlyUp = { free: false, monthly: false, yearly: true, lifetime: true } as const;

export const tweakCategories: TweakCategory[] = [
  "Network",
  "CPU & Power",
  "GPU & Display",
  "Memory & Storage",
  "System & Services",
  "Gaming",
  "Cleanup & Maintenance",
];

/** Matches REFLUX FREE app limits (FREE_LIMITS.maxTweaks / maxPowerPlans). */
export const PRODUCT_LIMITS = {
  freeTweaks: 30,
  proTweaksLabel: "70+",
  totalTweaksLabel: "100+",
  freePowerPlans: 2,
} as const;

export function displayTweakCountForPlan(plan: PlanId): string {
  if (plan === "free") return String(PRODUCT_LIMITS.freeTweaks);
  return PRODUCT_LIMITS.totalTweaksLabel;
}

export const tweaks: Tweak[] = [
  // Network
  { id: "n1", name: "Disable Nagle's Algorithm", description: "Cuts TCP buffering delay for faster packets", category: "Network", plans: { ...freeBasic } },
  { id: "n2", name: "Flush DNS Cache", description: "Instant DNS refresh on demand", category: "Network", plans: { ...freeBasic } },
  { id: "n3", name: "Optimize TCP/IP Stack", description: "Tunes Windows network stack for gaming", category: "Network", plans: { ...freeBasic } },
  { id: "n4", name: "Disable Network Throttling", description: "Removes Windows multimedia throttling", category: "Network", plans: { ...freeBasic } },
  { id: "n5", name: "QoS Packet Prioritization", description: "Prioritizes game traffic over background apps", category: "Network", plans: { ...paidOnly } },
  { id: "n6", name: "Low-Latency NIC Tuning", description: "Reduces interrupt moderation on your adapter", category: "Network", plans: { ...freeBasic } },
  { id: "n7", name: "MTU Auto-Optimization", description: "Finds ideal packet size for your connection", category: "Network", plans: { ...freeBasic } },
  { id: "n8", name: "Disable Large Send Offload", description: "Lowers latency on competitive titles", category: "Network", plans: { ...paidOnly } },
  { id: "n9", name: "Gaming DNS Preset", description: "Fastest DNS servers for your region", category: "Network", plans: { ...freeBasic } },
  { id: "n10", name: "UDP Buffer Optimization", description: "Improves hit registration in shooters", category: "Network", plans: { ...freeBasic } },

  // CPU & Power
  { id: "c1", name: "High Performance Power Plan", description: "CPU runs at maximum frequency", category: "CPU & Power", plans: { ...freeBasic } },
  { id: "c2", name: "Disable Core Parking", description: "Keeps all CPU cores active", category: "CPU & Power", plans: { ...freeBasic } },
  { id: "c3", name: "Processor Performance Boost", description: "Maximizes turbo boost behavior", category: "CPU & Power", plans: { ...freeBasic } },
  { id: "c4", name: "Disable C-States", description: "Prevents CPU sleep during gameplay", category: "CPU & Power", plans: { ...paidOnly } },
  { id: "c5", name: "Timer Resolution Boost", description: "1ms system timer for smoother frames", category: "CPU & Power", plans: { ...freeBasic } },
  { id: "c6", name: "HPET Optimization", description: "Reduces input latency from timer source", category: "CPU & Power", plans: { ...paidOnly } },
  { id: "c7", name: "Background Process Limiter", description: "Frees CPU for your game", category: "CPU & Power", plans: { ...freeBasic } },
  { id: "c8", name: "Ultimate Performance Plan", description: "Windows Ultimate Performance power plan", category: "CPU & Power", plans: { ...yearlyUp } },

  // GPU & Display
  { id: "g1", name: "Disable Fullscreen Optimizations", description: "Lower input lag in fullscreen games", category: "GPU & Display", plans: { ...freeBasic } },
  { id: "g2", name: "Hardware-Accelerated GPU Scheduling", description: "Reduces render queue latency", category: "GPU & Display", plans: { ...freeBasic } },
  { id: "g3", name: "Disable Game DVR", description: "Stops background Xbox recording overhead", category: "GPU & Display", plans: { ...freeBasic } },
  { id: "g4", name: "NVIDIA Low Latency Mode", description: "Forces Reflex-style low latency path", category: "GPU & Display", plans: { ...paidOnly } },
  { id: "g5", name: "AMD Anti-Lag Profile", description: "Optimizes AMD GPU for competitive play", category: "GPU & Display", plans: { ...paidOnly } },
  { id: "g6", name: "Shader Cache Cleanup", description: "Clears bloated GPU shader caches", category: "GPU & Display", plans: { ...paidOnly } },
  { id: "g7", name: "Disable MPO", description: "Fixes stutter on multi-monitor setups", category: "GPU & Display", plans: { ...paidOnly } },
  { id: "g8", name: "HAGS + Flip Model Tuning", description: "Advanced display pipeline optimization", category: "GPU & Display", plans: { ...yearlyUp } },

  // Memory & Storage
  { id: "m1", name: "Standby Memory Cleaner", description: "Frees cached RAM before gaming", category: "Memory & Storage", plans: { ...paidOnly } },
  { id: "m2", name: "Page File Optimization", description: "Tunes virtual memory for your RAM size", category: "Memory & Storage", plans: { ...freeBasic } },
  { id: "m3", name: "Disable Prefetch/Superfetch", description: "Stops disk thrashing on SSDs", category: "Memory & Storage", plans: { ...paidOnly } },
  { id: "m4", name: "TRIM & SSD Health Check", description: "Keeps SSDs fast long-term", category: "Memory & Storage", plans: { ...freeBasic } },
  { id: "m5", name: "Memory Compression Toggle", description: "Reduces RAM overhead on low-memory rigs", category: "Memory & Storage", plans: { ...freeBasic } },

  // System & Services
  { id: "s1", name: "Disable SysMain (Superfetch)", description: "Stops background disk indexing", category: "System & Services", plans: { ...freeBasic } },
  { id: "s2", name: "Telemetry Disable Pack", description: "Cuts Windows data collection overhead", category: "System & Services", plans: { ...freeBasic } },
  { id: "s3", name: "Bloatware Service Remover", description: "Disables non-essential Windows services", category: "System & Services", plans: { ...freeBasic } },
  { id: "s4", name: "Windows Update Gaming Mode", description: "Prevents updates during sessions", category: "System & Services", plans: { ...paidOnly } },
  { id: "s5", name: "Restore Point Auto-Create", description: "Safe rollback before every tweak batch", category: "System & Services", plans: { ...allPlans } },
  { id: "s6", name: "One-Click Revert All", description: "Undo every change instantly", category: "System & Services", plans: { ...allPlans } },
  { id: "s7", name: "Startup App Manager", description: "Disables boot-time resource hogs", category: "System & Services", plans: { ...freeBasic } },
  { id: "s8", name: "Priority Boost for Games", description: "Sets high process priority automatically", category: "System & Services", plans: { ...freeBasic } },

  // Gaming
  { id: "gm1", name: "Automatic Game Scanner", description: "Detects installed games across launchers", category: "Gaming", plans: { ...paidOnly } },
  { id: "gm2", name: "Manual Game Scanner", description: "Pick games to optimize yourself", category: "Gaming", plans: { ...freeBasic } },
  { id: "gm3", name: "Per-Title Optimization Profiles", description: "Fortnite, Apex, Cyberpunk & more presets", category: "Gaming", plans: { ...paidOnly } },
  { id: "gm4", name: "Network Profile Per Game", description: "Game-specific latency tweaks", category: "Gaming", plans: { ...paidOnly } },
  { id: "gm5", name: "Live FPS Benchmark", description: "Real-time GPU performance readout", category: "Gaming", plans: { ...paidOnly } },
  { id: "gm6", name: "Input Lag Analyzer", description: "Measures click-to-pixel latency", category: "Gaming", plans: { ...yearlyUp } },
  { id: "gm7", name: "Seasonal Game Profiles", description: "Auto-updated configs for new patches", category: "Gaming", plans: { ...yearlyUp } },

  // Cleanup
  { id: "cl1", name: "Temp File Vacuum", description: "Clears Windows temp folders", category: "Cleanup & Maintenance", plans: { ...freeBasic } },
  { id: "cl2", name: "Disk Cleanup Automation", description: "Runs Windows Disk Cleanup silently", category: "Cleanup & Maintenance", plans: { ...freeBasic } },
  { id: "cl3", name: "Shader & DirectX Cache Wipe", description: "Frees GBs of stale GPU cache", category: "Cleanup & Maintenance", plans: { ...freeBasic } },
  { id: "cl4", name: "Browser Cache Purge", description: "Clears Chromium/Edge cache bloat", category: "Cleanup & Maintenance", plans: { ...paidOnly } },
  { id: "cl5", name: "Windows Update Cache Clean", description: "Removes old update installers", category: "Cleanup & Maintenance", plans: { ...paidOnly } },
  { id: "cl6", name: "Recycle Bin + Log Sweep", description: "One-click deep system sweep", category: "Cleanup & Maintenance", plans: { ...paidOnly } },
  { id: "cl7", name: "Scheduled Auto-Cleanup", description: "Weekly maintenance without lifting a finger", category: "Cleanup & Maintenance", plans: { ...yearlyUp } },
];

export function countTweaksForPlan(plan: PlanId): number {
  return tweaks.filter((t) => t.plans[plan]).length;
}
