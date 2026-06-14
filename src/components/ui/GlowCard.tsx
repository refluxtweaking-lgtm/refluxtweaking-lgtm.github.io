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
      className={`flex w-full flex-col rounded-3xl p-6 sm:p-8 md:px-10 ${
        hover ? "glass-card" : "glass-card-static"
      } ${centered ? "items-center" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
