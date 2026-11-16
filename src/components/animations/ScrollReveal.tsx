import { type ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

interface ScrollRevealProps {
  children: ReactNode;
  /** Accepted and ignored: every reveal is the same 16 px rise. */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Seconds before this element reveals once it scrolls in. */
  delay?: number;
  /** Accepted and ignored (reveals take 450 ms). */
  duration?: number;
  /** Accepted and ignored. */
  distance?: number;
  /** Accepted and ignored: a reveal happens once. */
  once?: boolean;
  className?: string;
  /** Accepted and ignored. */
  scale?: number;
}

/**
 * Legacy wrapper kept for pages not yet rebuilt: a <Reveal> with the old
 * props. Only `delay` and `className` still have an effect. Deleted at
 * cleanup.
 */
export default function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const seconds = Number.isFinite(delay) && delay > 0 ? Math.min(delay, 0.6) : 0;
  return (
    <Reveal className={className} style={seconds > 0 ? { transitionDelay: `${seconds}s` } : undefined}>
      {children}
    </Reveal>
  );
}
