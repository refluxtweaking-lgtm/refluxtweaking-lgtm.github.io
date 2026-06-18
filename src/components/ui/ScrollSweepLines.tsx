"use client";

import { useEffect, useRef } from "react";

const SECTION_EVENT = "reflux-section-reveal";

function spawnSweep(
  container: HTMLDivElement,
  yPercent: number,
  label?: string,
  strong = false,
) {
  const line = document.createElement("div");
  line.className = `scroll-sweep-line${strong ? " scroll-sweep-line-strong" : ""}`;
  line.style.top = `${yPercent}%`;
  line.style.setProperty("--sweep-speed", strong ? "1.1s" : `${0.55 + Math.random() * 0.35}s`);
  container.appendChild(line);

  if (label) {
    const tag = document.createElement("span");
    tag.className = "scroll-sweep-label";
    tag.textContent = label;
    tag.style.top = `${yPercent}%`;
    container.appendChild(tag);
    window.setTimeout(() => tag.remove(), 1400);
  }

  window.setTimeout(() => line.remove(), strong ? 1400 : 1000);
}

export function ScrollSweepLines() {
  const layerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const delta = window.scrollY - lastScrollY.current;
        if (delta > 6) {
          const count = Math.min(4, 1 + Math.floor(delta / 50));
          for (let i = 0; i < count; i++) {
            const y = 8 + Math.random() * 84;
            spawnSweep(layer, y);
          }
        }
        lastScrollY.current = window.scrollY;
        ticking.current = false;
      });
    };

    const onSectionReveal = (event: Event) => {
      const detail = (event as CustomEvent<{ label?: string; top: number; height: number }>).detail;
      const centerY = ((detail.top + detail.height * 0.35) / window.innerHeight) * 100;
      const clamped = Math.min(88, Math.max(10, centerY));
      spawnSweep(layer, clamped, detail.label, true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(SECTION_EVENT, onSectionReveal);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SECTION_EVENT, onSectionReveal);
    };
  }, []);

  return <div ref={layerRef} className="scroll-sweep-layer" aria-hidden="true" />;
}

export { SECTION_EVENT };
