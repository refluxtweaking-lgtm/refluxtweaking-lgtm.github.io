"use client";

import { FlowIn } from "@/components/ui/FlowIn";

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
    <FlowIn className={`section-header-glow mb-14 md:mb-16 ${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <span className={`section-eyebrow mb-5 ${centered ? "mx-auto" : ""} inline-flex`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`section-title ${centered ? "mx-auto" : ""} max-w-4xl`}>{title}</h2>
      {subtitle && (
        <p className={`section-subtitle mt-5 ${centered ? "mx-auto" : ""}`}>{subtitle}</p>
      )}
    </FlowIn>
  );
}
