export function GpuVisual() {
  const fans = [
    { cx: 42, cy: 68 },
    { cx: 100, cy: 68 },
    { cx: 158, cy: 68 },
  ];

  return (
    <div className="relative mb-4 flex h-[130px] w-full items-center justify-center">
      <svg
        viewBox="0 0 200 120"
        className="h-full w-[200px] drop-shadow-[0_0_14px_rgba(241,91,80,0.5)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gpuBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2229" />
            <stop offset="100%" stopColor="#0a0c10" />
          </linearGradient>
          <linearGradient id="gpuDie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a3040" />
            <stop offset="100%" stopColor="#111318" />
          </linearGradient>
        </defs>

        <rect x="10" y="28" width="180" height="72" rx="8" fill="url(#gpuBody)" stroke="#F15B50" strokeWidth="2" />
        <rect x="70" y="28" width="60" height="14" rx="2" fill="#151820" stroke="#F15B50" strokeWidth="1" />
        {[78, 86, 94, 102, 110, 118].map((x) => (
          <rect key={x} x={x} y="30" width="4" height="10" rx="1" fill="#F15B50" opacity="0.7" />
        ))}

        <rect x="78" y="50" width="44" height="36" rx="4" fill="url(#gpuDie)" stroke="#F15B50" strokeWidth="1.5" />
        <rect x="86" y="58" width="28" height="20" rx="2" fill="#0d0f14" stroke="#FF6B6B" strokeWidth="0.8" />

        {fans.map(({ cx, cy }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="18" fill="#12151c" stroke="#F15B50" strokeWidth="1.5" />
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${cx} ${cy}`}
                to={`360 ${cx} ${cy}`}
                dur={`${1 + i * 0.15}s`}
                repeatCount="indefinite"
              />
              {[0, 72, 144].map((angle) => (
                <line
                  key={angle}
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={cy - 14}
                  stroke="#F15B50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} ${cx} ${cy})`}
                />
              ))}
              <circle cx={cx} cy={cy} r="4" fill="#F15B50" />
            </g>
          </g>
        ))}

        {[22, 42, 62, 82, 102, 122, 142, 162].map((x) => (
          <rect key={x} x={x} y="92" width="12" height="6" rx="1" fill="#1a1f28" stroke="#F15B50" strokeWidth="0.6" />
        ))}

        <rect x="88" y="102" width="24" height="6" rx="2" fill="#F15B50" opacity="0.3" className="gpu-pcie-pulse" />
        <text x="100" y="24" textAnchor="middle" fill="#F15B50" fontSize="8" fontWeight="bold" opacity="0.7">
          RTX GPU
        </text>
      </svg>
      <span className="absolute top-0 right-2 rounded-full bg-reflux-accent/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-reflux-accent uppercase">
        Live
      </span>
    </div>
  );
}
