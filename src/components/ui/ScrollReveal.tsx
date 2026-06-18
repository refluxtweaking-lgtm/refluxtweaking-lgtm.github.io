import { FlowIn } from "@/components/ui/FlowIn";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  sectionLabel?: string;
}

/** Wraps a homepage section so it pops in when scrolled into view */
export function ScrollReveal({ children, className = "", delay = 0, sectionLabel }: ScrollRevealProps) {
  return (
    <FlowIn delay={delay} className={className} sectionLabel={sectionLabel}>
      {children}
    </FlowIn>
  );
}
