interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  hover?: boolean;
}

export function GlowCard({
  children,
  className = "",
  centered = false,
  hover = true,
}: GlowCardProps) {
  return (
    <div
      className={`reflux-glow-box flex w-full flex-col rounded-2xl p-4 sm:rounded-2xl sm:p-6 md:px-8 ${
        hover ? "glass-card" : "glass-card-static"
      } ${centered ? "items-center" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
