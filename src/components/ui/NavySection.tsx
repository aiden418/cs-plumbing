import { type ReactNode } from "react";
import Section from "@/components/ui/Section";

interface NavySectionProps {
  /** Accepted for pages not yet rebuilt and ignored: the design has no glow orbs. */
  orbs?: boolean;
  /** "lg" = the full chapter spacing, "md" (default) = the smaller one. */
  padding?: "md" | "lg";
  id?: string;
  className?: string;
  children: ReactNode;
}

/** A navy chapter. At most one per page. A thin wrapper around Section. */
export default function NavySection({ padding = "md", id, className, children }: NavySectionProps) {
  return (
    <Section tone="navy" spacing={padding === "lg" ? "default" : "sm"} id={id} className={className}>
      {children}
    </Section>
  );
}
