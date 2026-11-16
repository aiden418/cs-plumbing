import { type ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

interface StaggerChildrenProps {
  children: ReactNode;
  /** Accepted and ignored: the group reveals as one block. */
  staggerDelay?: number;
  /** Seconds before the group reveals once it scrolls in. */
  delay?: number;
  className?: string;
  /** Accepted and ignored. */
  once?: boolean;
}

/**
 * Legacy item variants. Still imported by pages not yet rebuilt, which pass
 * them to their own motion elements; outside a StaggerChildren motion parent
 * those elements simply render in place. Kept as a plain object until its
 * last importer is gone.
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/**
 * Legacy wrapper: the group reveals as one block (lists longer than six are
 * never staggered item by item). Deleted at cleanup.
 */
export default function StaggerChildren({ children, delay = 0, className }: StaggerChildrenProps) {
  const seconds = Number.isFinite(delay) && delay > 0 ? Math.min(delay, 0.6) : 0;
  return (
    <Reveal className={className} style={seconds > 0 ? { transitionDelay: `${seconds}s` } : undefined}>
      {children}
    </Reveal>
  );
}
