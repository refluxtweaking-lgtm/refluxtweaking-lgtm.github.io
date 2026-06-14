import type { CSSProperties, ReactNode } from "react";

export type IconName =
  | "bolt"
  | "gamepad"
  | "globe"
  | "broom"
  | "chart"
  | "blackhole"
  | "search"
  | "check"
  | "star"
  | "chat"
  | "disk"
  | "undo"
  | "shield"
  | "sparkle"
  | "rocket"
  | "target"
  | "download"
  | "sliders"
  | "arrowRight"
  | "arrowLeft";

const ICONS: Record<IconName, ReactNode> = {
  bolt: <path d="M13 2 5 13h6l-1 9 9-12h-6l1-8z" />,
  gamepad: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 10.5v3M5.5 12h3" />
      <circle cx="16" cy="11.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18.4" cy="13.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  broom: (
    <>
      <path d="M20 4 12.5 11.5" />
      <path d="M14 7l3 3" />
      <path d="M12.5 11.5 6 18l-2 2 1-5 5.5-5.5z" />
      <path d="M8.5 13.5l2 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <rect x="5.5" y="11" width="3" height="6" rx="1" />
      <rect x="10.5" y="6.5" width="3" height="10.5" rx="1" />
      <rect x="15.5" y="13" width="3" height="4" rx="1" />
    </>
  ),
  blackhole: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  star: (
    <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
  ),
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L4 20l1.6-4.4A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  disk: (
    <>
      <path d="M5 4h11l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M8 4v5h7V4" />
      <rect x="8" y="13" width="8" height="6" rx="1" />
    </>
  ),
  undo: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 0 10H9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.7 5.6L19 10l-5.3 1.4L12 17l-1.7-5.6L5 10l5.3-1.4z" />
      <path d="M18.5 4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c2.6 1.8 4 5 4 8.6l-2 1.4h-4l-2-1.4C8 8 9.4 4.8 12 3z" />
      <path d="M8 13l-2 4 3.6-1.4M16 13l2 4-3.6-1.4" />
      <circle cx="12" cy="9" r="1.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M7 10.5 12 15.5l5-5" />
      <path d="M4 19.5h16" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h8M16 8h4" />
      <circle cx="14" cy="8" r="2" />
      <path d="M4 16h4M12 16h8" />
      <circle cx="10" cy="16" r="2" />
    </>
  ),
  arrowRight: <path d="M5 12h13M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H6M11 6l-6 6 6 6" />,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  glow?: boolean;
  style?: CSSProperties;
}

export function Icon({
  name,
  size = 24,
  className = "",
  strokeWidth = 1.6,
  glow = true,
  style,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${glow ? "icon-glow" : ""} text-reflux-accent ${className}`}
      style={style}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

interface IconChipProps {
  name: IconName;
  size?: number;
  chipSize?: number;
  className?: string;
  iconClassName?: string;
}

export function IconChip({
  name,
  size = 24,
  chipSize = 48,
  className = "",
  iconClassName = "",
}: IconChipProps) {
  return (
    <span
      className={`icon-chip inline-flex items-center justify-center rounded-2xl border border-reflux-accent/25 bg-gradient-to-br from-[rgba(241,91,80,0.18)] to-transparent ${className}`}
      style={{ width: chipSize, height: chipSize }}
    >
      <Icon name={name} size={size} className={iconClassName} />
    </span>
  );
}
