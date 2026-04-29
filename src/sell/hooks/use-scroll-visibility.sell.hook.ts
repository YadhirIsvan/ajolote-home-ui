import { useState, useRef, useEffect } from "react";

export const useScrollVisibility = (count: number) => {
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleIndexes((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return { visibleIndexes, containerRef };
};
