import { useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  _options?: { threshold?: number; delay?: number }
) {
  return useRef<T>(null);
}
