import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className,
  hover = true,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-2xl border border-white/5",
        paddings[padding],
        hover &&
          "transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
