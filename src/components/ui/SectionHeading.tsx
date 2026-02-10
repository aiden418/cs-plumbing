import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
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
          <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            {overline}
          </span>
        )}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-gray-400 text-lg max-w-2xl leading-relaxed mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
