"use client";

import { useEffect } from "react";
import { SECTION_EVENT } from "@/components/ui/ScrollSweepLines";

export function ScrollRevealBoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-ready");

    const targets = () =>
      document.querySelectorAll<HTMLElement>("[data-scroll-reveal]:not(.scroll-reveal-visible)");

    const revealAll = () => {
      targets().forEach((el) => el.classList.add("scroll-reveal-visible"));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("scroll-reveal-visible");
          observer.unobserve(el);

          const rect = el.getBoundingClientRect();
          window.dispatchEvent(
            new CustomEvent(SECTION_EVENT, {
              detail: {
                label: el.dataset.sectionLabel,
                top: rect.top,
                height: rect.height,
              },
            }),
          );
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    const observe = () => {
      targets().forEach((el) => observer.observe(el));
    };

    observe();
    requestAnimationFrame(observe);

    return () => observer.disconnect();
  }, []);

  return null;
}
