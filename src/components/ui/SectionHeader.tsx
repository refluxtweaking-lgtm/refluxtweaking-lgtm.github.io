interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 ${centered ? "text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <span className={`section-eyebrow mb-4 ${centered ? "mx-auto" : ""} inline-flex`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`section-title ${centered ? "mx-auto" : ""} max-w-3xl`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`section-subtitle mt-4 ${centered ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
