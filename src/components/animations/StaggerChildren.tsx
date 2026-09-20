"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "./useReveal";

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

// The stagger is now pure CSS on the container's direct children (see
// useReveal + globals.css). Kept as an empty variants object so existing
// `<motion.div variants={staggerItem}>` children keep compiling and render
// as plain, visible elements.
export const staggerItem = {};

export default function StaggerChildren({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className,
  once = true,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { once, margin: 50 });

  const style = {
    "--reveal-stagger": `${staggerDelay}s`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div ref={ref} data-reveal-kind="children" className={className} style={style}>
      {children}
    </div>
  );
}
