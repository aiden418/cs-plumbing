import { cn } from "@/lib/utils";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

interface SectionHeadingProps {
  /** The eyebrow label above the heading. */
  overline?: string;
  title: string;
  /** Words appended to the title, in the same colour (the old gradient is gone). */
  accent?: string;
  subtitle?: string;
  /** "center" for short symmetrical sections; chapter headers are usually "left". */
  align?: "left" | "center";
  level?: 2 | 3;
  id?: string;
  /**
   * Legacy. The colours come from the section's tone. "dark" is still
   * honoured for pages not yet rebuilt whose dark band has no data-tone: the
   * heading then takes the dark-surface text colours.
   */
  tone?: "light" | "dark";
  className?: string;
}

/** Chapter header: eyebrow, display heading, optional lead. */
export default function SectionHeading({
  overline,
  title,
  accent,
  subtitle,
  align = "center",
  level = 2,
  id,
  tone,
  className,
}: SectionHeadingProps) {
  const center = align === "center";
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <Reveal className={cn("mb-12", className)}>
      <div
        // Legacy dark bands set bg-navy without a tone: borrow the dark text
        // colours but keep the band's own background.
        data-tone={tone === "dark" ? "navy" : undefined}
        style={tone === "dark" ? { backgroundColor: "transparent" } : undefined}
        className={cn("max-w-3xl", center && "mx-auto text-center")}
      >
        {overline && <Eyebrow className={cn("mb-4", center && "justify-center")}>{overline}</Eyebrow>}
        <Heading
          id={id}
          className={cn(
            "text-fg",
            level === 3 ? "font-display text-display-sm font-bold [font-stretch:108%]" : "text-display-md",
          )}
        >
          {title}
          {accent && <> {accent}</>}
        </Heading>
        {subtitle && (
          <p className={cn("mt-5 max-w-[56ch] text-lead text-body", center && "mx-auto")}>{subtitle}</p>
        )}
      </div>
    </Reveal>
  );
}
