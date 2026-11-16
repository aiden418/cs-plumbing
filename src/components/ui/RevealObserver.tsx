"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startsBelowFold } from "@/components/ui/Reveal";

/** True when the element or one of its ancestors is sticky or fixed: those never reveal. */
function isPinned(el: Element): boolean {
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    const position = getComputedStyle(node).position;
    if (position === "fixed" || position === "sticky") return true;
  }
  return false;
}

/**
 * The one IntersectionObserver behind every <Reveal>. Renders nothing. It
 * changes DOM attributes only (never React state), so no component
 * re-renders: an unmarked element stays visible, a below-the-fold one is
 * marked `pending` and becomes `in` when it scrolls into view. Re-scans after
 * every client-side navigation.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const viewportHeight = window.innerHeight;
    const candidates = document.querySelectorAll<HTMLElement>('[data-reveal=""]');
    for (const el of candidates) {
      if (!startsBelowFold(el.getBoundingClientRect().top, viewportHeight)) continue;
      if (isPinned(el)) continue;
      el.setAttribute("data-reveal", "pending");
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      // Whatever was still waiting is shown, so nothing stays hidden after a
      // navigation or an unmount.
      for (const el of document.querySelectorAll('[data-reveal="pending"]')) {
        el.setAttribute("data-reveal", "in");
      }
    };
  }, [pathname]);

  return null;
}
