import type { AppIconName } from "@/data/app-icons";
import { APP_ICONS } from "@/data/app-icon-glyphs";

interface AppIconProps {
  name: AppIconName;
  size?: number;
  glow?: boolean;
  filled?: boolean;
  className?: string;
}

export function AppIcon({ name, size = 20, glow = true, filled = false, className = "" }: AppIconProps) {
  const inner = APP_ICONS[name];
  if (!inner) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${glow ? "app-icon-glow" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-reflux-accent"
      >
        {inner}
      </svg>
    </span>
  );
}

interface AppIconChipProps {
  name: AppIconName;
  size?: number;
  chipSize?: number;
  className?: string;
  active?: boolean;
}

export function AppIconChip({
  name,
  size = 18,
  chipSize = 40,
  className = "",
  active = false,
}: AppIconChipProps) {
  return (
    <span
      className={`app-icon-chip inline-flex items-center justify-center rounded-xl border transition-all ${
        active
          ? "border-reflux-accent/45 bg-reflux-accent/15 shadow-[0_0_20px_-4px_rgba(255,107,91,0.55)]"
          : "border-white/10 bg-white/[0.04]"
      } ${className}`}
      style={{ width: chipSize, height: chipSize }}
    >
      <AppIcon name={name} size={size} glow={active} />
    </span>
  );
}
