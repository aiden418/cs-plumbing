"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scroll-reveal without hiding anything in the server HTML.
 *
 * The element renders fully visible on the server (and with JS off, and to
 * crawlers). After hydration it is hidden ONLY if it sits below the fold —
 * never something the visitor can already see — then revealed by a CSS
 * transition as it scrolls into view. The `data-reveal` attribute is removed
 * once the transition ends so its transition rules can't interfere with the
 * element's own hover transitions. Styles live in globals.css.
 */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  { once = true, margin = 80 }: { once?: boolean; margin?: number } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    Array.from(el.children).forEach((child, i) =>
      (child as HTMLElement).style.setProperty("--reveal-i", String(i)),
    );
    el.dataset.reveal = "hidden";

    let cleanupTimer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "visible";
          if (once) {
            observer.disconnect();
            // Longest possible transition: duration + delay + stagger tail.
            cleanupTimer = window.setTimeout(() => delete el.dataset.reveal, 2500);
          }
        } else if (!once) {
          el.dataset.reveal = "hidden";
        }
      },
      { rootMargin: `0px 0px -${margin}px 0px` },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(cleanupTimer);
      delete el.dataset.reveal;
    };
  }, [ref, once, margin]);
}
