import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  as?: "p" | "span" | "div";
  /** The joint ring before the label (default true). */
  joint?: boolean;
  className?: string;
  id?: string;
}

/** The plan-drawing label above a heading: a joint and an uppercase label in the accent. */
export default function Eyebrow({ children, as: Tag = "p", joint = true, className, id }: EyebrowProps) {
  return (
    <Tag id={id} className={cn("label-tech flex items-center gap-2.5 text-accent", className)}>
      {joint && <span className="joint" aria-hidden="true" />}
      <span>{children}</span>
    </Tag>
  );
}
