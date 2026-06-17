import type { ReactNode } from "react";
import type { AppIconName } from "./app-icons";

export const APP_ICONS: Record<AppIconName, ReactNode> = {
  home: (
    <>
      <path d="M3 11.4 12 4l9 7.4" />
      <path d="M5.5 10.2V20h13v-9.8" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  optimizer: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M12 1.5V4M12 20v2.5M1.5 12H4M20 12h2.5" />
    </>
  ),
  internet: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.8c2.6 2.4 2.6 13.9 0 16.4M12 3.8c-2.6 2.4-2.6 13.9 0 16.4" />
    </>
  ),
  gpu: (
    <>
      <rect x="2.5" y="6" width="19" height="11" rx="1.8" />
      <circle cx="8.5" cy="11.5" r="2.7" />
      <circle cx="8.5" cy="11.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.5" r="1.7" />
      <path d="M5.5 17v3M19 17v3M21.5 9.5H23" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="1.4" />
      <rect x="9.8" y="9.8" width="4.4" height="4.4" rx="0.6" />
      <path d="M9.5 3v3.8M14.5 3v3.8M9.5 17.2V21M14.5 17.2V21M3 9.5h3.8M3 14.5h3.8M17.2 9.5H21M17.2 14.5H21" />
    </>
  ),
  ram: (
    <>
      <rect x="2.5" y="7.5" width="19" height="8.5" rx="1" />
      <path d="M5.5 16v2M8.5 16v2M11.5 16v2M14.5 16v2M17.5 16v2" />
      <path d="M6 10v3.2M9 10v3.2M12 10v3.2M15 10v3.2M18 10v3.2" />
    </>
  ),
  system: (
    <>
      <circle cx="12" cy="12" r="3.3" />
      <path d="M12 2.2v3.1M12 18.7v3.1M2.2 12h3.1M18.7 12h3.1M5 5l2.2 2.2M16.8 16.8 19 19M19 5l-2.2 2.2M7.2 16.8 5 19" />
    </>
  ),
  cleanup: (
    <>
      <path d="M19.5 4.5 12 12" />
      <path d="M12 12 6 13.4 7.4 19.5 14 16z" />
      <path d="M6.6 14.2 9.8 17.4" />
    </>
  ),
  debloat: (
    <>
      <path d="M4 7h16" />
      <path d="M9.2 7V4.8h5.6V7" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  bios: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.2" />
      <rect x="6.5" y="6.5" width="6" height="6" rx="0.8" />
      <path d="M15 8h3.2M15 11h3.2M7 16h10" />
      <circle cx="16.2" cy="16.2" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  benchmark: (
    <>
      <path d="M3.5 20.2h17" />
      <path d="M6 20V11M11 20V4.5M16 20v-7M20.5 20V8" />
    </>
  ),
  games: (
    <>
      <rect x="2.5" y="7.8" width="19" height="9.4" rx="4.7" />
      <path d="M7.6 11v3M6.1 12.5h3" />
      <circle cx="15.6" cy="11.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17.8" cy="13.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  processkiller: (
    <>
      <path d="M12 3v8.5" />
      <path d="M6.7 6.7a8 8 0 1 0 10.6 0" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor" stroke="none" />,
  sparkle: (
    <path d="M12 3l1.9 5.4L19 10l-5.1 1.6L12 17l-1.9-5.4L5 10l5.1-1.6z" fill="currentColor" stroke="none" />
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.2h17" />
      <path d="M6 20V11M11 20V4.5M16 20v-7M20.5 20V8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.8c2.6 2.4 2.6 13.9 0 16.4M12 3.8c-2.6 2.4-2.6 13.9 0 16.4" />
    </>
  ),
  broom: (
    <>
      <path d="M19.5 4.5 12 12" />
      <path d="M12 12 6 13.4 7.4 19.5 14 16z" />
      <path d="M6.6 14.2 9.8 17.4" />
    </>
  ),
  rocket: (
    <>
      <path d="M5.5 14.5c-1.5 1-2 4-2 4s3-.5 4-2" />
      <path d="M12 15l-3-3c1-5 4-8 9-9 0 5-4 8-9 9z" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  save: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 3v5h7V3" />
      <rect x="8" y="13" width="8" height="6" rx="0.6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.49-6.01" />
      <path d="M20.5 4v5h-5" />
    </>
  ),
};
