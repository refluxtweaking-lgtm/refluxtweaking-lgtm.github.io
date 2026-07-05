type AnimatedCursorProps = {
  className?: string;
  clicking?: boolean;
};

export function AnimatedCursor({ className = "", clicking = false }: AnimatedCursorProps) {
  return (
    <div className={`hiw-cursor ${clicking ? "hiw-cursor--clicking" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 28" className="hiw-cursor-shape">
        <path
          d="M4 2 L4 22 L9.5 17 L13.5 26 L16.5 24.5 L12.5 15.5 L19 15 Z"
          fill="#fff"
          stroke="#111"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hiw-cursor-ripple" />
    </div>
  );
}
