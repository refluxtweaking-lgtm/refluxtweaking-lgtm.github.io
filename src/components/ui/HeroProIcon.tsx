"use client";

import { useId } from "react";

interface HeroProIconProps {
  size?: number;
  className?: string;
}

/** Custom stacked-tweaks mark for the hero Pro signal badge. */
export function HeroProIcon({ size = 16, className = "" }: HeroProIconProps) {
  const gradId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb4a8" />
          <stop offset="0.55" stopColor="#ff6b5b" />
          <stop offset="1" stopColor="#ff3d2e" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="15" width="17" height="3.2" rx="1.6" fill={`url(#${gradId})`} opacity="0.85" />
      <rect x="5.5" y="10.4" width="13" height="3.2" rx="1.6" fill={`url(#${gradId})`} />
      <rect x="7.5" y="5.8" width="9" height="3.2" rx="1.6" fill={`url(#${gradId})`} />
      <circle cx="18.5" cy="7.2" r="3.1" fill="#ff4d3d" stroke="#ffb4a8" strokeWidth="0.9" />
      <path
        d="M17.1 7.2h2.8M18.5 5.8v2.8"
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
