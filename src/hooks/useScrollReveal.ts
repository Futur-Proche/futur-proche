import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; delay?: number }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const delay = options?.delay ?? 0;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";

    const timer = setTimeout(() => {
      el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 150 + delay);

    return () => clearTimeout(timer);
  }, [options?.delay]);

  return ref;
}
