import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  as?: "p" | "span" | "div";
  /** Legacy: the plan-drawing joint ring before the label. Off by default in version 2. */
  joint?: boolean;
  className?: string;
  id?: string;
}

/**
 * The small label above a heading (v2-bright.md "The look"): 14 px,
 * semibold, in the accent (brand blue on white and shell, white on a photo).
 * At most one per section; most sections need none.
 */
export default function Eyebrow({ children, as: Tag = "p", joint = false, className, id }: EyebrowProps) {
  return (
    <Tag id={id} className={cn("eyebrow flex items-center gap-2.5 text-accent", className)}>
      {joint && <span className="joint" aria-hidden="true" />}
      <span>{children}</span>
    </Tag>
  );
}
