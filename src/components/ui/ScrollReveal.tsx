import { FlowIn } from "@/components/ui/FlowIn";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Wraps a homepage section so it pops in when scrolled into view */
export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <FlowIn delay={delay} className={className}>
      {children}
    </FlowIn>
  );
}
