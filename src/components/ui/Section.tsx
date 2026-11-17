import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export type Tone = "white" | "shell" | "navy" | "ink";
export type SectionSpacing = "default" | "sm" | "none";

interface SectionProps {
  children: ReactNode;
  /** The surface. Everything inside reads its colours from it (bg-canvas, text-fg, border-rule …). */
  tone?: Tone;
  spacing?: SectionSpacing;
  id?: string;
  as?: "section" | "div" | "aside" | "footer" | "header";
  /** id of the heading that names this section (aria-labelledby). */
  labelledBy?: string;
  /**
   * A hairline at the top. Use it between two neighbouring sections of the
   * same tone instead of changing the background.
   */
  divider?: boolean;
  className?: string;
}

const spacings: Record<SectionSpacing, string> = {
  default: "py-section",
  sm: "py-section-sm",
  none: "",
};

/** A chapter of a page on one surface tone. */
export default function Section({
  children,
  tone = "white",
  spacing = "default",
  id,
  as: Tag = "section",
  labelledBy,
  divider = false,
  className,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn("relative bg-canvas text-body", spacings[spacing], divider && "border-t border-rule", className)}
    >
      {children}
    </Tag>
  );
}
