export function CpuVisual({ compact = false }: { compact?: boolean }) {
  const cores = [
    { x: 72, y: 48, delay: "0s" },
    { x: 88, y: 48, delay: "0.15s" },
    { x: 104, y: 48, delay: "0.3s" },
    { x: 120, y: 48, delay: "0.45s" },
    { x: 72, y: 64, delay: "0.6s" },
    { x: 88, y: 64, delay: "0.75s" },
    { x: 104, y: 64, delay: "0.9s" },
    { x: 120, y: 64, delay: "1.05s" },
  ];

  return (
    <div className={`relative flex w-full items-center justify-center ${compact ? "mb-1 h-[72px]" : "mb-4 h-[130px]"}`}>
      <svg
        viewBox="0 0 200 120"
        className={`h-full drop-shadow-[0_0_14px_rgba(93,222,134,0.35)] ${compact ? "w-[120px]" : "w-[200px]"}`}
        aria-hidden="true"
      >
        <rect x="50" y="30" width="100" height="80" rx="8" fill="#1a1f28" stroke="#5DDE86" strokeWidth="2" />
        <rect x="65" y="42" width="70" height="56" rx="5" fill="#111318" stroke="#5DDE86" strokeWidth="1.2" />

        {cores.map((core, i) => (
          <rect
            key={i}
            x={core.x}
            y={core.y}
            width="12"
            height="12"
            rx="2"
            fill="#1e2830"
            stroke="#5DDE86"
            strokeWidth="0.8"
            className="cpu-core-pulse"
            style={{ animationDelay: core.delay }}
          />
        ))}

        {[58, 70, 82, 94, 106, 118, 130, 142].map((x) => (
          <g key={x}>
            <line x1={x} y1="14" x2={x} y2="30" stroke="#5DDE86" strokeWidth="2" />
            <line x1={x} y1="110" x2={x} y2="106" stroke="#5DDE86" strokeWidth="2" />
          </g>
        ))}

        <text x="100" y="105" textAnchor="middle" fill="#5DDE86" fontSize="8" fontWeight="bold" opacity="0.6">
          8-CORE
        </text>
      </svg>
      <span className="absolute top-0 right-2 rounded-full bg-reflux-green/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-reflux-green uppercase">
        Live
      </span>
    </div>
  );
}
