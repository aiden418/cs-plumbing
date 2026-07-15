import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  /** Trailing words of the title rendered in the gold gradient (dark tone only). */
  accent?: string;
  subtitle?: string;
  align?: "left" | "center";
  /** "dark" renders white/gold for use inside navy sections. */
  tone?: "light" | "dark";
  className?: string;
}

export default function SectionHeading({
  overline,
  title,
  accent,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <ScrollReveal className={cn("mb-16", className)}>
      <div
        className={cn(
          align === "center" && "text-center",
          "max-w-3xl",
          align === "center" && "mx-auto"
        )}
      >
        {overline && (
          <span
            className={cn(
              "inline-block text-sm font-semibold uppercase mb-4",
              dark
                ? "text-gold font-bold tracking-[0.2em]"
                : "text-primary tracking-widest"
            )}
          >
            {overline}
          </span>
        )}
        <h2
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight",
            dark ? "text-white" : "text-gray-900"
          )}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span className={dark ? "text-gold-gradient" : "text-gradient"}>
                {accent}
              </span>
            </>
          )}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-lg max-w-2xl leading-relaxed mx-auto",
              dark ? "text-white/60" : "text-gray-500"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
