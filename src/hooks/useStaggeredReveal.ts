import { useEffect, useRef, useState } from "react";

export function useStaggeredReveal<T extends HTMLElement = HTMLDivElement>(
  count: number,
  stepMs = 120,
  threshold = 0.2
) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(Array(count).fill(true));
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setRevealed((prev) => {
                if (prev[i]) return prev;
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * stepMs);
          }
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [count, stepMs, threshold]);

  return { ref, revealed };
}
