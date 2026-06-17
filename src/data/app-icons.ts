/** Matches REFLUX desktop app NAV_ICONS + shared ICONS from icons.js */
export type AppIconName =
  | "home"
  | "optimizer"
  | "internet"
  | "gpu"
  | "cpu"
  | "ram"
  | "system"
  | "cleanup"
  | "debloat"
  | "bios"
  | "benchmark"
  | "games"
  | "processkiller"
  | "bolt"
  | "sparkle"
  | "shield"
  | "check"
  | "search"
  | "chart"
  | "globe"
  | "broom"
  | "rocket"
  | "save"
  | "refresh";

export const APP_NAV_MODULES = [
  { icon: "home" as const, label: "Home", desc: "Live dashboard & quick actions" },
  { icon: "optimizer" as const, label: "Optimizer", desc: "One-click tweak suites" },
  { icon: "cpu" as const, label: "CPU", desc: "Power plans & core tuning" },
  { icon: "gpu" as const, label: "GPU", desc: "Scheduling & driver tweaks" },
  { icon: "ram" as const, label: "RAM", desc: "Memory & cache optimization" },
  { icon: "internet" as const, label: "Internet", desc: "DNS, TCP & latency tools" },
  { icon: "games" as const, label: "Games", desc: "Steam & Epic game scanner" },
  { icon: "cleanup" as const, label: "Cleanup", desc: "Junk & temp file removal" },
  { icon: "debloat" as const, label: "Debloat", desc: "Strip Windows bloatware" },
  { icon: "system" as const, label: "System", desc: "Services & registry tweaks" },
  { icon: "bios" as const, label: "BIOS", desc: "Firmware tuning guides" },
  { icon: "benchmark" as const, label: "Benchmark", desc: "Before/after FPS tests" },
] as const;
