"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";

const GOLD = "#E8A427";

/**
 * Scroll-scrubbed radar rings behind the emergency phone number — the
 * "pressure release" payoff of the pipeline. Transform/opacity only.
 * Reduced motion: CSS swaps the animated rings for a single static ring.
 */
export default function RadarPulse() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] pointer-events-none"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="radar-ring motion-reduce:hidden absolute inset-0 rounded-full border-2 opacity-0 will-change-transform"
          style={{ borderColor: GOLD }}
        />
      ))}
      {/* Static ring for reduced-motion users */}
      <div
        className="hidden motion-reduce:block absolute inset-[15%] rounded-full border-2"
        style={{ borderColor: "rgba(232,164,39,0.25)" }}
      />
    </div>
  );
}
