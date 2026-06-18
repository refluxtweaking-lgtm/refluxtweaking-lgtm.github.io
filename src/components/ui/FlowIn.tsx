import type { CSSProperties, ReactNode } from "react";

interface FlowInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
  sectionLabel?: string;
}

export function FlowIn({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  sectionLabel,
}: FlowInProps) {
  return (
    <Tag
      data-scroll-reveal
      data-section-label={sectionLabel}
      className={`scroll-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
