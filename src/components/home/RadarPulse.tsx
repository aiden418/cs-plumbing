"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";

const GOLD = "#E8A427";

/**
 * Scroll-scrubbed radar rings behind the emergency phone number — the
 * "pressure release" payoff of the pipeline. Transform/opacity only.
 * Reduced motion: a single static ring.
 */
export default function RadarPulse() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || reduced || !hostRef.current) return;
    registerGSAP();
    const rings = hostRef.current.querySelectorAll(".radar-ring");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 1,
        },
      });
      rings.forEach((ring, i) => {
        const at = i * 0.12;
        tl.fromTo(
          ring,
          { scale: 0.45, opacity: 0 },
          { scale: 0.75 + i * 0.12, opacity: 0.45 - i * 0.1, duration: 0.45 },
          at,
        ).to(
          ring,
          { scale: 1.15 + i * 0.25, opacity: 0, duration: 0.55 },
          at + 0.45,
        );
      });
    }, hostRef);

    return () => ctx.revert();
  }, [mounted, reduced]);

  if (!mounted) return null;

  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 pointer-events-none"
        style={{ borderColor: "rgba(232,164,39,0.25)" }}
      />
    );
  }

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] pointer-events-none"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="radar-ring absolute inset-0 rounded-full border-2 opacity-0 will-change-transform"
          style={{ borderColor: GOLD }}
        />
      ))}
    </div>
  );
}
