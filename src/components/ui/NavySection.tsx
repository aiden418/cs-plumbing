import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface NavySectionProps {
  /** Ambient blurred orbs — keep max 2 navy surfaces per viewport for GPU cost */
  orbs?: boolean;
  padding?: "md" | "lg";
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Mid-page premium band in the About-page navy treatment. Use at most one
 * per page (plus the PageHero) so the showpiece look stays special.
 */
export default function NavySection({
  orbs = true,
  padding = "md",
  id,
  className,
  children,
}: NavySectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-navy",
        padding === "lg" ? "section-py" : "py-16 sm:py-24",
        className
      )}
    >
      {orbs && (
        <>
          <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gold/10 blur-[100px]" />
        </>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
