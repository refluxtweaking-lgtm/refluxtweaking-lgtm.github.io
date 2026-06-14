"use client";

import { useEffect, useMemo, useState } from "react";

const DRIP_SEEDS = [
  { left: 12, top: 140, w: 5, h: 14, dur: 7.2, delay: 0, wobble: 2.1, streak: false },
  { left: 28, top: 155, w: 3, h: 22, dur: 9.8, delay: 1.4, wobble: 3.4, streak: true },
  { left: 8, top: 130, w: 4, h: 10, dur: 5.5, delay: 3.1, wobble: 1.8, streak: false },
  { left: 42, top: 148, w: 6, h: 16, dur: 11.3, delay: 0.6, wobble: 4.2, streak: false },
  { left: 18, top: 162, w: 3, h: 28, dur: 13.7, delay: 5.2, wobble: 2.9, streak: true },
  { left: 34, top: 138, w: 4, h: 12, dur: 6.9, delay: 2.8, wobble: 3.1, streak: false },
  { left: 52, top: 152, w: 5, h: 18, dur: 10.4, delay: 7.1, wobble: 5.0, streak: true },
  { left: 22, top: 145, w: 3, h: 9, dur: 4.8, delay: 4.5, wobble: 1.5, streak: false },
  { left: 46, top: 168, w: 4, h: 20, dur: 12.1, delay: 8.3, wobble: 3.8, streak: true },
  { left: 14, top: 172, w: 5, h: 13, dur: 8.6, delay: 6.0, wobble: 2.4, streak: false },
  { left: 38, top: 128, w: 3, h: 24, dur: 14.5, delay: 9.7, wobble: 4.6, streak: true },
  { left: 56, top: 142, w: 4, h: 11, dur: 6.2, delay: 3.9, wobble: 1.9, streak: false },
  { left: 6, top: 158, w: 6, h: 15, dur: 9.1, delay: 11.2, wobble: 3.3, streak: false },
  { left: 30, top: 175, w: 3, h: 26, dur: 15.8, delay: 1.9, wobble: 5.5, streak: true },
  { left: 48, top: 134, w: 4, h: 8, dur: 5.1, delay: 10.4, wobble: 2.0, streak: false },
];

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

  const p = power;
  const corrupt = 1 - p;
  const cyan = 0.2 + p * 0.8;
  const red = 0.15 + p * 0.85;
  const fanDur = 0.4 + p * 2.4;

  const activeDrips = useMemo(
    () =>
      DRIP_SEEDS.filter((_, i) => corrupt > 0.08 + (i % 7) * 0.06).map((d, i) => ({
        ...d,
        opacity: Math.min(0.9, corrupt * (0.35 + (i % 5) * 0.12)),
        dur: d.dur * (0.6 + corrupt * 0.5),
      })),
    [corrupt],
  );

  return (
    <>
      {/* Uncoordinated blood-power drips down the page */}
      {activeDrips.map((d, i) => (
        <span
          key={i}
          className={`power-drip ${d.streak ? "power-drip-streak" : ""}`}
          style={{
            left: `${d.left}px`,
            top: `${d.top}px`,
            width: `${d.w}px`,
            height: `${d.h}px`,
            opacity: d.opacity,
            animationDuration: `${d.dur}s, ${d.wobble}s`,
            animationDelay: `${d.delay}s, ${d.delay * 0.37}s`,
          }}
        />
      ))}

      {/* Isometric PC — top left */}
      <div
        className="pointer-events-none fixed top-[80px] left-2 z-[5] hidden w-[280px] lg:block lg:w-[320px] xl:left-4 xl:w-[360px]"
        aria-hidden="true"
      >
        <div
          className="relative"
          style={{
            opacity: 0.45 + p * 0.55,
            filter: `saturate(${0.35 + p * 0.65}) brightness(${0.5 + p * 0.5})`,
          }}
        >
          <svg viewBox="0 0 420 400" className="h-auto w-full" fill="none">
            <defs>
              <linearGradient id="isoBase" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a6fff" stopOpacity={cyan * 0.35} />
                <stop offset="50%" stopColor="#b392f0" stopOpacity={cyan * 0.2} />
                <stop offset="100%" stopColor="#f15b50" stopOpacity={red * 0.45} />
              </linearGradient>
              <linearGradient id="caseFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a2030" />
                <stop offset="100%" stopColor="#0a0c14" />
              </linearGradient>
              <linearGradient id="glassPanel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a3050" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0a1020" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="corruptBleed" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#6b0000" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#f15b50" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f15b50" stopOpacity="0" />
              </linearGradient>
              <filter id="neonGlow">
                <feGaussianBlur stdDeviation={2 + p * 4} result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing platform */}
            <path d="M60 310 L210 380 L360 310 L210 240 Z" fill="url(#isoBase)" opacity={0.5 + p * 0.4} />
            <path d="M60 310 L210 380 L360 310 L210 240 Z" fill="none" stroke="#f15b50" strokeWidth="1" opacity={red * 0.5} />
            <path d="M90 300 L210 355 L330 300 L210 255 Z" fill="#0a0c14" opacity="0.6" />

            {/* Circuit traces on platform */}
            {[
              "M100 320 L160 350", "M260 350 L320 320", "M180 340 L240 340",
              "M130 305 L190 335", "M230 335 L290 305",
            ].map((d, i) => (
              <path key={i} d={d} stroke={i % 2 === 0 ? "#3d8bff" : "#f15b50"} strokeWidth="0.8" opacity={(0.15 + p * 0.35) * (i % 2 === 0 ? cyan : red)} />
            ))}

            {/* ═══ ISOMETRIC CASE — left face (glass) ═══ */}
            <path d="M210 80 L210 280 L60 355 L60 155 Z" fill="#0c1018" stroke="#2a3548" strokeWidth="1.5" />
            <path d="M65 160 L205 88 L205 275 L65 348 Z" fill="url(#glassPanel)" stroke="#3d8bff" strokeWidth="0.8" opacity={0.4 + cyan * 0.4} />

            {/* Internals visible through glass */}
            <g opacity={0.35 + p * 0.65} style={{ animation: p > 0.3 ? "holoFlicker 4s infinite" : undefined }}>
              {/* Motherboard plane */}
              <path d="M75 200 L195 135 L195 250 L75 315 Z" fill="#0f1a14" stroke="#2d5a45" strokeWidth="0.8" />
              {/* CPU tower cooler */}
              <path d="M120 175 L165 152 L165 210 L120 233 Z" fill="#1a1f28" stroke="#f15b50" strokeWidth="0.8" opacity={0.5 + red * 0.5} filter="url(#neonGlow)" />
              <circle cx="143" cy="192" r="14" fill="#0c0e12" stroke="#3d8bff" strokeWidth="0.8" opacity={cyan * 0.8} />
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0 143 192" to="360 143 192" dur={`${fanDur}s`} repeatCount="indefinite" />
                {[0, 72, 144].map((a) => (
                  <line key={a} x1="143" y1="192" x2="143" y2="180" stroke="#3d8bff" strokeWidth="1.5" opacity={cyan * 0.7} transform={`rotate(${a} 143 192)`} />
                ))}
              </g>
              {/* GPU horizontal */}
              <path d="M80 255 L190 195 L190 230 L80 290 Z" fill="#1a2030" stroke="#f15b50" strokeWidth="1" opacity={0.5 + red * 0.4} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={105 + i * 28} cy={248 - i * 8} r="9" fill="#0c0e12" stroke="#3d8bff" strokeWidth="0.6" opacity={cyan * 0.6} />
              ))}
              {/* RAM sticks */}
              <path d="M170 155 L182 148 L182 200 L170 207 Z" fill="#1a1f28" stroke="#b392f0" strokeWidth="0.6" opacity={0.4 + red * 0.4} />
              <path d="M184 147 L196 140 L196 192 L184 199 Z" fill="#1a1f28" stroke="#f15b50" strokeWidth="0.6" opacity={0.4 + red * 0.4} />
              {/* RGB strip inside */}
              <path d="M78 220 L192 158" stroke="#f15b50" strokeWidth="2" opacity={red * 0.7} filter="url(#neonGlow)" />
            </g>

            {/* ═══ ISOMETRIC CASE — right face (front fans) ═══ */}
            <path d="M210 80 L360 155 L360 355 L210 280 Z" fill="url(#caseFace)" stroke="#2a3548" strokeWidth="1.5" />
            {/* Front mesh */}
            <path d="M230 120 L340 170 L340 310 L230 260 Z" fill="#080a10" stroke="#1e2838" strokeWidth="1" />

            {/* Three front intake fans */}
            {[
              { cy: 175, r: 28 },
              { cy: 235, r: 28 },
              { cy: 295, r: 28 },
            ].map(({ cy, r }, fi) => (
              <g key={fi} opacity={0.4 + p * 0.6}>
                <circle cx="285" cy={cy} r={r} fill="#0a0c12" stroke={fi === 1 ? "#f15b50" : "#3d8bff"} strokeWidth="1.2" opacity={0.6 + (fi === 1 ? red : cyan) * 0.4} />
                <circle cx="285" cy={cy} r={r - 6} fill="none" stroke={fi === 1 ? "#f15b50" : "#3d8bff"} strokeWidth="0.5" opacity={0.3 + p * 0.4} filter="url(#neonGlow)" />
                <g>
                  <animateTransform attributeName="transform" type="rotate" from={`0 285 ${cy}`} to={`360 285 ${cy}`} dur={`${fanDur * (0.9 + fi * 0.15)}s`} repeatCount="indefinite" />
                  {[0, 45, 90, 135].map((a) => (
                    <line key={a} x1="285" y1={cy} x2="285" y2={cy - r + 8} stroke={fi === 1 ? "#f15b50" : "#3d8bff"} strokeWidth="2" opacity={0.25 + (fi === 1 ? red : cyan) * 0.55} transform={`rotate(${a} 285 ${cy})`} />
                  ))}
                </g>
              </g>
            ))}

            {/* ═══ ISOMETRIC CASE — top face ═══ */}
            <path d="M60 155 L210 80 L360 155 L210 230 Z" fill="#141820" stroke="#2a3548" strokeWidth="1.5" />
            {/* Top exhaust vents */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M${100 + i * 22} 178 L${118 + i * 22} 168 L${136 + i * 22} 178 L${118 + i * 22} 188 Z`} fill="#0c0e12" stroke="#3a4250" strokeWidth="0.5" opacity={0.4 + p * 0.4} />
            ))}

            {/* ═══ HOLOGRAPHIC UI FRAGMENTS (original, not copied) ═══ */}
            <g opacity={(0.2 + p * 0.5) * (1 - corrupt * 0.7)} style={{ animation: "holoFlicker 6s infinite" }}>
              {/* Mini chart */}
              <rect x="30" y="300" width="50" height="36" rx="2" fill="#0a1020" stroke="#3d8bff" strokeWidth="0.6" opacity="0.7" />
              {[12, 22, 16, 28, 20].map((h, i) => (
                <rect key={i} x={36 + i * 8} y={330 - h} width="5" height={h} fill={i % 2 === 0 ? "#3d8bff" : "#f15b50"} opacity="0.6" />
              ))}
              {/* Floating ping readout */}
              <rect x="330" y="290" width="58" height="28" rx="3" fill="#0a0c10" stroke="#f15b50" strokeWidth="0.6" opacity="0.6" />
              <text x="359" y="302" textAnchor="middle" fill="#3d8bff" fontSize="5" opacity={cyan}>PING</text>
              <text x="359" y="314" textAnchor="middle" fill="#5dde86" fontSize="8" fontWeight="bold">{Math.round(12 + corrupt * 73)}ms</text>
              {/* Orbit ring */}
              <ellipse cx="210" cy="200" rx="80" ry="20" fill="none" stroke="#3d8bff" strokeWidth="0.5" opacity={cyan * 0.3} transform="rotate(-25 210 200)" />
              <ellipse cx="210" cy="200" rx="60" ry="14" fill="none" stroke="#f15b50" strokeWidth="0.4" opacity={red * 0.3} transform="rotate(15 210 200)" />
            </g>

            {/* ═══ CORRUPTION — red bleed rising through case ═══ */}
            <rect
              x="30"
              y={75 + p * 290}
              width="360"
              height={corrupt * 310 + 30}
              fill="url(#corruptBleed)"
              opacity={0.25 + corrupt * 0.55}
            />

            {/* Glitch slices across case */}
            {corrupt > 0.25 && (
              <>
                <rect x="55" y={160 + corrupt * 30} width="310" height="2" fill="#ff2222" opacity={corrupt * 0.5} />
                <rect x="60" y={220 + corrupt * 20} width="300" height="3" fill="#f15b50" opacity={corrupt * 0.35} />
                <rect x="50" y={280 + corrupt * 15} width="320" height="2" fill="#8b0000" opacity={corrupt * 0.45} />
              </>
            )}

            {/* Corruption vignette on PC */}
            <rect x="30" y="70" width="360" height="310" fill="#000" opacity={corrupt * 0.4} rx="4" />

            {corrupt > 0.7 && (
              <text x="210" y="200" textAnchor="middle" fill="#ff3333" fontSize="10" fontWeight="bold" opacity={corrupt * 0.6}>
                PWR LOSS
              </text>
            )}
          </svg>

          {/* Drip origin glow — where blood leaks from case bottom */}
          <div
            className="absolute bottom-[18%] left-[38%] h-3 w-3 rounded-full bg-[#f15b50]"
            style={{
              opacity: corrupt * 0.8,
              boxShadow: `0 0 ${corrupt * 16}px rgba(241,91,80,0.9)`,
              animation: corrupt > 0.15 ? "pulse 1.8s infinite" : undefined,
            }}
          />
        </div>
      </div>
    </>
  );
}
