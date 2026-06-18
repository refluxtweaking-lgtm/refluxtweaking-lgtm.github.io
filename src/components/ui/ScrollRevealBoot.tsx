"use client";

import { useEffect } from "react";

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
          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
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
