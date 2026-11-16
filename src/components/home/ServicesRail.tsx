"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

/**
 * The services rail below 1024 px: the server-rendered tiles in a native
 * scroll-snap row, with previous/next buttons. From 1024 px the same list is
 * a 3 × 3 grid and the buttons are hidden (CSS only). Keyboard users move
 * with the buttons, or Tab through the tiles (each scrolls into view).
 */
export default function ServicesRail({
  children,
  label,
  previousLabel,
  nextLabel,
  after,
}: {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Shown beside the buttons (the "All services" link). */
  after?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (direction: 1 | -1) => {
    const rail = ref.current;
    if (!rail) return;
    const tile = rail.querySelector("li");
    const step = tile ? tile.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  const button =
    "inline-flex size-11 items-center justify-center rounded-control border border-rule text-fg transition-colors duration-150 hover:border-fg active:scale-[0.98] lg:hidden";

  return (
    <>
      <div ref={ref} className="home-services-rail" role="group" aria-label={label}>
        {children}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 lg:mt-10">
        {after}
        <div className="flex gap-2 lg:hidden">
          <button type="button" className={button} aria-label={previousLabel} onClick={() => move(-1)}>
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" className={button} aria-label={nextLabel} onClick={() => move(1)}>
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
