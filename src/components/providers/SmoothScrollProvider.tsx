"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap";

/**
 * Lenis smooth-scroll provider for the entire app.
 *
 * Bails out under `prefers-reduced-motion: reduce` so native scroll handles
 * accessibility. Shares one RAF with GSAP so ScrollTrigger pinning/parallax
 * stays glassy. Exposes `window.__lenis` so the Navbar mobile menu can
 * stop/start scrolling without poking internal state.
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

    registerGSAP();

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
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

    // After everything mounts, recalc pin positions once so the first paint
    // doesn't show a stale measurement.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
