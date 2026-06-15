"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewport<T extends Element>(rootMargin = "0px", threshold = 0.12) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, visible };
}
