import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; delay?: number }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${options?.delay ?? 0}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${options?.delay ?? 0}ms`;

    // Small delay to ensure the element is in the DOM and layout is computed
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        },
        { threshold: options?.threshold ?? 0.05, rootMargin: "50px" }
      );

      observer.observe(el);

      // Fallback: if still hidden after 1.5s, force show
      const fallback = setTimeout(() => {
        if (el.style.opacity === "0") {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      }, 1500);

      return () => {
        observer.disconnect();
        clearTimeout(fallback);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [options?.threshold, options?.delay]);

  return ref;
}
