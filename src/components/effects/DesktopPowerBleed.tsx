"use client";

import { useEffect, useState } from "react";

export function DesktopPowerBleed() {
  const [power, setPower] = useState(1);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setPower(1 - Math.min(1, Math.max(0, progress)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const glow = power;
  const bleed = 1 - power;
  const screenOn = 0.15 + power * 0.85;
  const fanSpeed = 0.4 + power * 2.6;

  return (
    <div
      className="pointer-events-none fixed top-[88px] left-3 z-[5] hidden w-[220px] lg:left-4 lg:block lg:w-[260px] xl:left-6 xl:w-[300px]"
      aria-hidden="true"
    >
      <div
        className="relative transition-[filter,opacity] duration-150"
        style={{
          opacity: 0.35 + glow * 0.65,
          filter: `drop-shadow(0 0 ${12 + glow * 28}px rgba(241, 91, 80, ${0.15 + glow * 0.55}))`,
        }}
      >
        <svg viewBox="0 0 300 340" className="h-auto w-full" fill="none">
          <defs>
            <linearGradient id="deskGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f15b50" stopOpacity={0.2 + glow * 0.5} />
              <stop offset="100%" stopColor="#f15b50" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2030" />
              <stop offset="100%" stopColor="#0a0c12" />
            </linearGradient>
            <filter id="screenGlow">
              <feGaussianBlur stdDeviation={2 + glow * 4} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Desk surface */}
          <rect x="20" y="268" width="260" height="10" rx="2" fill="#141820" stroke="#2a3040" strokeWidth="1" />
          <rect x="20" y="268" width="260" height="10" rx="2" fill="url(#deskGlow)" />

          {/* PC Tower */}
          <rect x="28" y="108" width="72" height="156" rx="6" fill="#0e1016" stroke="#2a3040" strokeWidth="1.5" />
          <rect
            x="34"
            y="114"
            width="60"
            height="80"
            rx="4"
            fill="#12151c"
            stroke={`rgba(241, 91, 80, ${0.2 + glow * 0.6})`}
            strokeWidth="1"
          />
          {/* Side panel window */}
          <rect x="40" y="122" width="48" height="64" rx="3" fill="#0a0c10" opacity={0.8 + glow * 0.2} />
          {/* GPU visible through panel */}
          <rect x="46" y="140" width="36" height="20" rx="2" fill="#1a1f28" stroke="#f15b50" strokeWidth="0.8" opacity={0.4 + glow * 0.6} />
          {/* RGB strip */}
          <rect x="30" y="200" width="68" height="3" rx="1" fill="#f15b50" opacity={0.2 + glow * 0.8} />
          {/* Fans */}
          {[50, 78].map((cy) => (
            <g key={cy}>
              <circle cx="64" cy={cy} r="12" fill="#10141c" stroke="#2a3040" strokeWidth="1" />
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 64 ${cy}`}
                  to={`360 64 ${cy}`}
                  dur={`${fanSpeed}s`}
                  repeatCount="indefinite"
                />
                {[0, 72, 144].map((angle) => (
                  <line
                    key={angle}
                    x1="64"
                    y1={cy}
                    x2="64"
                    y2={cy - 9}
                    stroke="#f15b50"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={0.3 + glow * 0.7}
                    transform={`rotate(${angle} 64 ${cy})`}
                  />
                ))}
              </g>
            </g>
          ))}
          {/* Power LED */}
          <circle cx="92" cy="248" r="3" fill="#5dde86" opacity={0.2 + glow * 0.8} />

          {/* Monitor */}
          <rect x="118" y="72" width="148" height="96" rx="6" fill="#0e1016" stroke="#2a3040" strokeWidth="1.5" />
          <rect x="126" y="80" width="132" height="76" rx="3" fill="url(#screenGrad)" stroke="#1e2229" strokeWidth="1" />
          {/* Screen content glow */}
          <rect
            x="130"
            y="84"
            width="124"
            height="68"
            rx="2"
            fill="#f15b50"
            opacity={screenOn * 0.12}
            filter="url(#screenGlow)"
          />
          <text x="192" y="118" textAnchor="middle" fill="#f15b50" fontSize="11" fontWeight="bold" opacity={screenOn * 0.9}>
            REFLUX
          </text>
          <text x="192" y="134" textAnchor="middle" fill="#9aa4b2" fontSize="7" opacity={screenOn * 0.7}>
            {Math.round(power * 100)}% POWER
          </text>
          {/* FPS readout */}
          <text x="192" y="148" textAnchor="middle" fill="#5dde86" fontSize="8" fontWeight="bold" opacity={screenOn * 0.8}>
            {Math.round(144 + power * 180)} FPS
          </text>
          {/* Monitor stand */}
          <rect x="178" y="168" width="28" height="18" rx="2" fill="#141820" stroke="#2a3040" strokeWidth="1" />
          <rect x="168" y="184" width="48" height="6" rx="2" fill="#141820" stroke="#2a3040" strokeWidth="1" />

          {/* Keyboard */}
          <rect x="118" y="228" width="110" height="28" rx="4" fill="#12151c" stroke="#2a3040" strokeWidth="1" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect
              key={i}
              x={124 + i * 11}
              y="234"
              width="8"
              height="6"
              rx="1"
              fill="#1a1f28"
              stroke="#2a3040"
              strokeWidth="0.5"
              opacity={0.4 + glow * 0.6}
            />
          ))}
          <rect x="118" y="252" width="110" height="2" rx="1" fill="#f15b50" opacity={0.15 + glow * 0.7} />

          {/* Mouse */}
          <ellipse cx="252" cy="242" rx="14" ry="18" fill="#12151c" stroke="#2a3040" strokeWidth="1" />
          <ellipse cx="252" cy="236" rx="6" ry="3" fill="#f15b50" opacity={0.1 + glow * 0.4} />

          {/* Headphones hook */}
          <path d="M108 88 Q100 72 108 60" stroke="#2a3040" strokeWidth="2" fill="none" />
          <ellipse cx="108" cy="58" rx="10" ry="14" fill="none" stroke="#2a3040" strokeWidth="2" opacity={0.5 + glow * 0.5} />

          {/* Cables */}
          <path d="M100 248 Q90 260 64 268" stroke="#2a3040" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M266 168 Q280 200 270 268" stroke="#2a3040" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>

        {/* Power bleed overlay — drains downward as you scroll */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{ clipPath: "inset(0 0 0 0 round 16px)" }}
        >
          <div
            className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[rgba(180,20,20,0.55)] via-[rgba(241,91,80,0.25)] to-transparent transition-[height] duration-150"
            style={{ height: `${bleed * 100}%` }}
          />
          <div
            className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[rgba(120,10,10,0.4)] to-transparent blur-sm transition-[height] duration-150"
            style={{ height: `${bleed * 85}%` }}
          />
        </div>

        {/* Power bar */}
        <div className="absolute right-2 bottom-1 left-2">
          <div className="h-1 overflow-hidden rounded-full bg-[#1e2229]/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c43d35] to-[#f15b50] transition-[width] duration-150"
              style={{ width: `${power * 100}%`, boxShadow: `0 0 ${glow * 12}px rgba(241, 91, 80, 0.8)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
