"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "./useReveal";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  scale?: number;
}

const OFFSETS: Record<Direction, [x: number, y: number]> = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
  none: [0, 0],
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 60,
  once = true,
  className,
  scale = 1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { once, margin: 80 });

  const [x, y] = OFFSETS[direction];
  const style = {
    "--reveal-x": `${x * distance}px`,
    "--reveal-y": `${y * distance}px`,
    "--reveal-scale": scale,
    "--reveal-duration": `${duration}s`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div ref={ref} data-reveal-kind="self" className={className} style={style}>
      {children}
    </div>
  );
}
