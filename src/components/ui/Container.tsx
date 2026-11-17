import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export type ContainerSize = "narrow" | "default" | "wide";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** narrow 48rem (reading column), default 80rem, wide 90rem (showpieces). */
  size?: ContainerSize;
  id?: string;
}

const sizes: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
};

/**
 * The page gutter and the content cap. The gutter grows with the viewport
 * (--spacing-gutter) and adds the safe-area insets, so content clears the
 * notch and rounded corners of a phone held sideways.
 */
export default function Container({ children, className, size = "default", id }: ContainerProps) {
  return (
    <div
      id={id}
      className={cn(
        sizes[size],
        "mx-auto w-full pl-[calc(var(--spacing-gutter)+env(safe-area-inset-left,0px))] pr-[calc(var(--spacing-gutter)+env(safe-area-inset-right,0px))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
