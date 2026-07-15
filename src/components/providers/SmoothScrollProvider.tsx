"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap";
import { breakpoints } from "@/hooks/useMediaQuery";

/**
 * Lenis smooth-scroll provider for the entire app.
 *
 * Bails out under `prefers-reduced-motion: reduce` so native scroll handles
 * accessibility, and on coarse pointers: Lenis is smoothWheel-only, so on
 * touch it adds no smoothing yet still burns a permanent rAF and a
 * ScrollTrigger.update per scroll frame — native momentum IS the app feel.
 * Shares one RAF with GSAP so ScrollTrigger pinning/parallax stays glassy.
 * Exposes `window.__lenis` so the Navbar mobile menu can stop/start
 * scrolling without poking internal state (callers optional-chain it).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    if (window.matchMedia(breakpoints.coarse).matches) return;

    registerGSAP();

    // lerp-only mode — passing `duration` flips Lenis into easing mode and
    // the scroll trails the wheel by over a second, which reads as lag.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    // Expose to other modules (Navbar uses this for the mobile-menu lock).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Drive ScrollTrigger off Lenis — without this, the two race and pins jitter.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Hand Lenis the GSAP ticker so it RAFs through one clock.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recalc pin positions once webfonts settle — measuring before the swap
    // bakes fallback-font line heights into every trigger position.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
