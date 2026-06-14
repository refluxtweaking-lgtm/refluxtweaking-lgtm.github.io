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

  const p = power;
  const corrupt = 1 - p;
  const fanDur = 0.35 + p * 2.2;
  const rgb = 0.15 + p * 0.85;
  const pcb = 0.25 + p * 0.75;
  const glitchX = corrupt * 4;
  const hudAlpha = 0.2 + p * 0.8;

  return (
    <div
      className="pointer-events-none fixed top-[84px] left-2 z-[5] hidden w-[300px] lg:block lg:w-[340px] xl:left-5 xl:w-[400px]"
      aria-hidden="true"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[rgba(241,91,80,0.12)] bg-[rgba(4,5,8,0.55)] backdrop-blur-[2px]"
        style={{
          opacity: 0.5 + p * 0.5,
          filter: `drop-shadow(0 0 ${8 + p * 32}px rgba(241, 91, 80, ${0.1 + p * 0.45})) saturate(${0.4 + p * 0.6})`,
        }}
      >
        {/* HUD label */}
        <div
          className="absolute top-2 right-2 z-20 rounded border px-2 py-0.5 font-mono text-[9px] tracking-wider"
          style={{
            borderColor: `rgba(241, 91, 80, ${0.2 + p * 0.5})`,
            color: corrupt > 0.6 ? "#ff4444" : "#f15b50",
            background: `rgba(0,0,0,${0.4 + corrupt * 0.3})`,
            opacity: hudAlpha,
          }}
        >
          {corrupt > 0.85 ? "SYS_CORRUPT" : corrupt > 0.4 ? "PWR_DRAIN" : "INTERNAL_VIEW"}
        </div>

        <svg viewBox="0 0 400 460" className="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pcCase" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1f28" />
              <stop offset="100%" stopColor="#0c0e12" />
            </linearGradient>
            <linearGradient id="pcbGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a2f" />
              <stop offset="100%" stopColor="#0f1a14" />
            </linearGradient>
            <linearGradient id="gpuShroud" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#222830" />
              <stop offset="50%" stopColor="#2a3040" />
              <stop offset="100%" stopColor="#1a1f28" />
            </linearGradient>
            <linearGradient id="corruptPool" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#8b0000" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#f15b50" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#f15b50" stopOpacity="0" />
            </linearGradient>
            <pattern id="pcbTraces" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4 H8 M4 0 V8" stroke="#2d5a45" strokeWidth="0.3" opacity={pcb * 0.5} />
            </pattern>
            <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="400" y2="0" stroke="#000" strokeWidth="1" opacity={corrupt * 0.25} />
            </pattern>
            <filter id="pcGlow">
              <feGaussianBlur stdDeviation={1 + p * 3} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ═══ CASE CHASSIS (open side panel) ═══ */}
          <rect x="24" y="20" width="352" height="400" rx="10" fill="url(#pcCase)" stroke="#3a4250" strokeWidth="2" />
          {/* Top panel vents */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <rect key={i} x={40 + i * 26} y="26" width="18" height="4" rx="1" fill="#0a0c10" stroke="#2a3040" strokeWidth="0.5" opacity={0.5 + p * 0.5} />
          ))}
          {/* Case feet */}
          <rect x="40" y="412" width="24" height="6" rx="2" fill="#141820" />
          <rect x="336" y="412" width="24" height="6" rx="2" fill="#141820" />
          {/* Removed side panel — edge highlight */}
          <path d="M24 30 L24 410" stroke="#f15b50" strokeWidth="1.5" opacity={0.15 + rgb * 0.35} />

          {/* ═══ TOP AIO RADIATOR ═══ */}
          <g opacity={0.3 + p * 0.7} style={{ transform: `translateX(${glitchX * 0.3}px)` }}>
            <rect x="60" y="38" width="280" height="36" rx="4" fill="#141820" stroke="#2a3040" strokeWidth="1" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i}>
                <rect x={72 + i * 42} y="44" width="32" height="24" rx="2" fill="#10141c" stroke="#2a3040" strokeWidth="0.8" />
                <circle cx={88 + i * 42} cy="56" r="9" fill="#0c0e12" stroke="#f15b50" strokeWidth="0.6" opacity={0.4 + rgb * 0.5} />
                <g>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${88 + i * 42} 56`} to={`360 ${88 + i * 42} 56`} dur={`${fanDur}s`} repeatCount="indefinite" />
                  {[0, 60, 120].map((a) => (
                    <line key={a} x1={88 + i * 42} y1="56" x2={88 + i * 42} y2="49" stroke="#f15b50" strokeWidth="1.2" opacity={0.3 + rgb * 0.6} transform={`rotate(${a} ${88 + i * 42} 56)`} />
                  ))}
                </g>
              </g>
            ))}
            {/* Tubes to CPU */}
            <path d="M200 74 Q200 100 185 120" stroke="#2a3040" strokeWidth="3" fill="none" />
            <path d="M220 74 Q220 100 235 120" stroke="#2a3040" strokeWidth="3" fill="none" />
          </g>

          {/* ═══ MOTHERBOARD ═══ */}
          <g opacity={pcb} style={{ transform: `translateX(${-glitchX * 0.2}px)` }}>
            <rect x="48" y="110" width="200" height="260" rx="4" fill="url(#pcbGrad)" stroke="#3d6b55" strokeWidth="1.2" />
            <rect x="48" y="110" width="200" height="260" rx="4" fill="url(#pcbTraces)" />

            {/* VRM heatsink */}
            <rect x="52" y="114" width="48" height="28" rx="2" fill="#1a1f28" stroke="#4a5568" strokeWidth="0.8" />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={56 + i * 10} y="118" width="6" height="20" rx="1" fill="#222830" stroke="#3a4250" strokeWidth="0.4" />)}

            {/* CPU socket + cooler block */}
            <rect x="118" y="130" width="56" height="56" rx="3" fill="#111318" stroke="#5a6070" strokeWidth="1" />
            <rect x="126" y="138" width="40" height="40" rx="2" fill="#0a0c10" stroke="#f15b50" strokeWidth="0.8" opacity={0.4 + rgb * 0.5} filter="url(#pcGlow)" />
            {/* Heat pipes */}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${134 + i * 8} 178 Q${120 + i * 12} 200 ${110 + i * 6} 220`} stroke="#6a7080" strokeWidth="3" fill="none" opacity={0.5 + p * 0.5} />
            ))}
            <text x="146" y="165" textAnchor="middle" fill="#f15b50" fontSize="6" fontWeight="bold" opacity={rgb * 0.8}>RYZEN</text>

            {/* RAM sticks x2 */}
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x={178 + i * 18} y="128" width="12" height="72" rx="1" fill="#1a1f28" stroke="#f15b50" strokeWidth="0.6" opacity={0.5 + rgb * 0.5} />
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <rect key={j} x={179 + i * 18} y={132 + j * 10} width="10" height="6" rx="0.5" fill={j % 2 === 0 ? "#b392f0" : "#1e2229"} opacity={0.3 + rgb * 0.6} />
                ))}
                <rect x={178 + i * 18} y="128" width="12" height="4" fill="#f15b50" opacity={rgb * 0.7} />
              </g>
            ))}

            {/* PCIe x16 slot + GPU */}
            <rect x="52" y="230" width="180" height="8" rx="1" fill="#0a0c10" stroke="#4a5568" strokeWidth="0.6" />
            <rect x="52" y="248" width="180" height="8" rx="1" fill="#0a0c10" stroke="#4a5568" strokeWidth="0.6" />

            {/* M.2 SSD */}
            <rect x="52" y="200" width="36" height="8" rx="1" fill="#222830" stroke="#f15b50" strokeWidth="0.5" opacity={0.4 + rgb * 0.4} />
            <text x="70" y="206" textAnchor="middle" fill="#9aa4b2" fontSize="4">NVMe</text>

            {/* 24-pin ATX */}
            <rect x="52" y="340" width="28" height="14" rx="1" fill="#1a1f28" stroke="#4a5568" strokeWidth="0.6" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <rect key={i} x={54 + (i % 6) * 4} y={342 + Math.floor(i / 6) * 5} width="3" height="4" fill="#f15b50" opacity={0.2 + rgb * 0.5} />
            ))}

            {/* Rear I/O shield */}
            <rect x="230" y="120" width="14" height="100" rx="2" fill="#1a1f28" stroke="#3a4250" strokeWidth="1" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect key={i} x="232" y={126 + i * 11} width="10" height="7" rx="1" fill="#0c0e12" stroke="#2a3040" strokeWidth="0.4" />
            ))}

            {/* PCB capacitors & chips */}
            {[
              [60, 160], [72, 168], [88, 210], [100, 218], [64, 300], [90, 310], [140, 320], [170, 200],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width={i % 2 === 0 ? 6 : 4} height={i % 2 === 0 ? 4 : 6} rx="0.5" fill="#222830" stroke="#3a4250" strokeWidth="0.3" opacity={pcb} />
            ))}
          </g>

          {/* ═══ GPU (triple fan) ═══ */}
          <g opacity={0.35 + p * 0.65} style={{ transform: `translateX(${glitchX}px)` }}>
            <rect x="44" y="262" width="210" height="72" rx="6" fill="url(#gpuShroud)" stroke="#f15b50" strokeWidth="1" opacity={0.5 + rgb * 0.5} />
            {/* Backplate */}
            <rect x="44" y="262" width="210" height="6" rx="2" fill="#2a3040" />
            {/* Fans */}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <circle cx={88 + i * 60} cy="298" r="22" fill="#0c0e12" stroke="#3a4250" strokeWidth="1" />
                <g>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${88 + i * 60} 298`} to={`360 ${88 + i * 60} 298`} dur={`${fanDur * (1 + i * 0.1)}s`} repeatCount="indefinite" />
                  {[0, 45, 90, 135].map((a) => (
                    <line key={a} x1={88 + i * 60} y1="298" x2={88 + i * 60} y2="282" stroke="#f15b50" strokeWidth="2" opacity={0.25 + rgb * 0.65} transform={`rotate(${a} ${88 + i * 60} 298)`} />
                  ))}
                </g>
              </g>
            ))}
            {/* RGB stripe on GPU */}
            <rect x="50" y="328" width="198" height="3" rx="1" fill="#f15b50" opacity={rgb * 0.8} filter="url(#pcGlow)" />
            {/* 8-pin power */}
            <rect x="220" y="280" width="16" height="8" rx="1" fill="#1a1f28" stroke="#f15b50" strokeWidth="0.5" opacity={0.4 + rgb * 0.4} />
            <text x="149" y="292" textAnchor="middle" fill="#9aa4b2" fontSize="5" opacity={0.4 + p * 0.5}>RTX 4070</text>
          </g>

          {/* ═══ PSU (bottom) ═══ */}
          <g opacity={0.3 + p * 0.7}>
            <rect x="260" y="300" width="100" height="100" rx="4" fill="#141820" stroke="#3a4250" strokeWidth="1.2" />
            <text x="310" y="340" textAnchor="middle" fill="#5a6070" fontSize="7" fontWeight="bold">850W</text>
            <text x="310" y="352" textAnchor="middle" fill="#5a6070" fontSize="5">80+ GOLD</text>
            {/* PSU fan */}
            <circle cx="310" cy="380" r="18" fill="#0c0e12" stroke="#2a3040" strokeWidth="1" />
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 310 380" to="360 310 380" dur={`${fanDur * 1.2}s`} repeatCount="indefinite" />
              {[0, 72, 144].map((a) => (
                <line key={a} x1="310" y1="380" x2="310" y2="366" stroke="#4a5568" strokeWidth="1.5" opacity={0.3 + p * 0.5} transform={`rotate(${a} 310 380)`} />
              ))}
            </g>
            {/* Modular cables */}
            <path d="M260 320 Q220 310 200 300" stroke="#2a3040" strokeWidth="2.5" fill="none" opacity={0.5 + p * 0.3} />
            <path d="M260 340 Q210 350 180 340" stroke="#f15b50" strokeWidth="1.5" fill="none" opacity={0.15 + rgb * 0.4} />
            <path d="M260 360 Q200 370 160 360" stroke="#2a3040" strokeWidth="2" fill="none" opacity={0.4 + p * 0.3} />
          </g>

          {/* ═══ FRONT / REAR CASE FANS ═══ */}
          <g opacity={0.25 + p * 0.75}>
            <circle cx="36" cy="200" r="16" fill="#10141c" stroke="#2a3040" strokeWidth="1" />
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 36 200" to="360 36 200" dur={`${fanDur}s`} repeatCount="indefinite" />
              {[0, 72, 144].map((a) => (
                <line key={a} x1="36" y1="200" x2="36" y2="188" stroke="#5dde86" strokeWidth="1.2" opacity={0.2 + p * 0.6} transform={`rotate(${a} 36 200)`} />
              ))}
            </g>
            <circle cx="364" cy="180" r="14" fill="#10141c" stroke="#2a3040" strokeWidth="1" />
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0 364 180" to="360 364 180" dur={`${fanDur * 0.9}s`} repeatCount="indefinite" />
              {[0, 72, 144].map((a) => (
                <line key={a} x1="364" y1="180" x2="364" y2="170" stroke="#f15b50" strokeWidth="1" opacity={0.2 + p * 0.5} transform={`rotate(${a} 364 180)`} />
              ))}
            </g>
          </g>

          {/* ═══ CABLE BUNDLE ═══ */}
          <g opacity={0.2 + p * 0.5}>
            <path d="M80 354 Q120 370 160 380 Q200 390 240 370" stroke="#2a3040" strokeWidth="2" fill="none" />
            <path d="M90 358 Q130 375 170 384" stroke="#f15b50" strokeWidth="0.8" fill="none" opacity={rgb * 0.5} />
            <rect x="155" y="376" width="14" height="6" rx="2" fill="#1a1f28" stroke="#3a4250" strokeWidth="0.5" />
          </g>

          {/* ═══ RGB STRIPS ═══ */}
          <rect x="32" y="108" width="3" height="280" rx="1" fill="#f15b50" opacity={rgb * 0.6} filter="url(#pcGlow)" />
          <rect x="32" y="108" width="3" height={280 * p} rx="1" fill="#ff6b6b" opacity={corrupt * 0.8} />

          {/* ═══ POWER LEDS ═══ */}
          <circle cx="350" cy="40" r="4" fill="#5dde86" opacity={0.15 + p * 0.85} filter="url(#pcGlow)" />
          <circle cx="362" cy="40" r="3" fill="#f15b50" opacity={0.1 + rgb * 0.7} />

          {/* ═══ LIVE STATS OVERLAY (inside case) ═══ */}
          <g opacity={hudAlpha}>
            <rect x="270" y="130" width="90" height="56" rx="3" fill="#0a0c10" stroke="#f15b50" strokeWidth="0.8" opacity={0.7} />
            <text x="315" y="148" textAnchor="middle" fill="#f15b50" fontSize="7" fontWeight="bold">PWR CORE</text>
            <text x="315" y="162" textAnchor="middle" fill={corrupt > 0.5 ? "#ff4444" : "#5dde86"} fontSize="10" fontWeight="bold">
              {Math.round(p * 100)}%
            </text>
            <text x="315" y="176" textAnchor="middle" fill="#9aa4b2" fontSize="6">
              {Math.round(60 + p * 264)} FPS
            </text>
          </g>

          {/* ═══ CORRUPTION: rising red pool ═══ */}
          <rect x="24" y={20 + (1 - corrupt) * 400} width="352" height={corrupt * 400 + 20} fill="url(#corruptPool)" opacity={0.3 + corrupt * 0.65} />

          {/* Corruption glitch slices */}
          {corrupt > 0.2 && (
            <>
              <rect x="24" y={180 + corrupt * 40} width="352" height="3" fill="#f15b50" opacity={corrupt * 0.4} style={{ transform: `translateX(${glitchX * 2}px)` }} />
              <rect x="24" y={260 + corrupt * 30} width="352" height="2" fill="#ff0000" opacity={corrupt * 0.35} style={{ transform: `translateX(${-glitchX * 3}px)` }} />
              <rect x="24" y={320 + corrupt * 20} width="352" height="4" fill="#8b0000" opacity={corrupt * 0.5} />
            </>
          )}

          {/* Static / scanlines */}
          <rect x="24" y="20" width="352" height="400" fill="url(#scanlines)" opacity={corrupt * 0.6} />

          {/* Dead static blocks */}
          {corrupt > 0.35 &&
            [
              [60, 280], [140, 190], [200, 340], [280, 250], [100, 360], [180, 150],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x + (i % 2) * corrupt * 6}
                y={y}
                width={8 + (i % 3) * 4}
                height={4}
                fill={i % 2 === 0 ? "#f15b50" : "#1a0000"}
                opacity={corrupt * 0.5}
              />
            ))}

          {/* Corruption text */}
          {corrupt > 0.55 && (
            <text
              x="200"
              y={200 + corrupt * 60}
              textAnchor="middle"
              fill="#ff2222"
              fontSize="11"
              fontWeight="bold"
              opacity={corrupt * 0.7}
              style={{ transform: `translateX(${glitchX * 5}px)` }}
            >
              {corrupt > 0.8 ? "KERNEL_DEAD" : "DRAINING..."}
            </text>
          )}

          {/* Vignette drain */}
          <rect x="24" y="20" width="352" height="400" rx="10" fill="#000" opacity={corrupt * 0.45} />
        </svg>

        {/* Power bar */}
        <div className="absolute right-3 bottom-2 left-3 z-10">
          <div className="mb-0.5 flex justify-between font-mono text-[8px] tracking-wider text-reflux-muted/70">
            <span>SYSTEM PWR</span>
            <span style={{ color: corrupt > 0.5 ? "#ff4444" : "#f15b50" }}>{Math.round(p * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1a0000]/60">
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{
                width: `${p * 100}%`,
                background: corrupt > 0.6 ? "linear-gradient(90deg, #8b0000, #ff2222)" : "linear-gradient(90deg, #c43d35, #f15b50)",
                boxShadow: `0 0 ${p * 14}px rgba(241, 91, 80, ${p * 0.8})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
