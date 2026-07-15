import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import { type ReactNode } from "react";

type PageHeroSize = "sm" | "md" | "lg";

interface PageHeroProps {
  /** navy = showpiece treatment (default); light = legacy flat surface escape hatch */
  variant?: "navy" | "light";
  /** emergency swaps the gold ambient orb for a red one (emergency page identity) */
  accentTone?: "gold" | "emergency";
  overline?: string;
  overlineIcon?: ReactNode;
  /** Plain words of the H1 (rendered white on navy). Keep SEO copy identical. */
  title: string;
  /** Words of the H1 rendered in the gold gradient span */
  accent?: string;
  /** inline = accent continues the sentence; block = accent on its own line (about-style) */
  accentPosition?: "inline" | "block";
  description?: ReactNode;
  align?: "left" | "center";
  /** sm = compact band for templates/app pages, md = default, lg = index pages */
  size?: PageHeroSize;
  /** Visible breadcrumb trail — JSON-LD stays in the page.tsx via BreadcrumbJsonLd */
  breadcrumb?: { name: string; href: string }[];
  /** CTA row (Buttons / tel links) */
  actions?: ReactNode;
  /** Optional right column (image / rating panel) — switches to a 2-col grid */
  media?: ReactNode;
  /** Extra rows below the actions: rating blocks, award chips, trust dots */
  children?: ReactNode;
  className?: string;
}

const sizePadding: Record<PageHeroSize, string> = {
  sm: "pt-28 pb-10 sm:pt-32 sm:pb-12",
  md: "pt-28 pb-14 sm:pt-32 sm:pb-20",
  lg: "pt-32 pb-16 sm:pt-40 sm:pb-24",
};

const sizeTitle: Record<PageHeroSize, string> = {
  sm: "text-3xl sm:text-4xl lg:text-5xl",
  md: "text-4xl sm:text-5xl lg:text-6xl",
  lg: "text-4xl sm:text-6xl lg:text-7xl",
};

/**
 * Shared page hero carrying the About-page showpiece language: navy surface,
 * blurred ambient orbs, gold overline, gradient accent headline. Server-safe —
 * entrance animation is CSS-only (animate-hero-in), so LCP text stays
 * server-rendered and the component works inside both server pages and
 * client templates.
 */
export default function PageHero({
  variant = "navy",
  accentTone = "gold",
  overline,
  overlineIcon,
  title,
  accent,
  accentPosition = "inline",
  description,
  align = "left",
  size = "md",
  breadcrumb,
  actions,
  media,
  children,
  className,
}: PageHeroProps) {
  const navy = variant === "navy";
  const centered = align === "center" && !media;

  const rows = (
    <div className={cn(centered && "mx-auto max-w-3xl text-center")}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className={cn(
            "animate-hero-in mb-5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm",
            centered && "justify-center",
            navy ? "text-white/50" : "text-gray-500"
          )}
        >
          {breadcrumb.map((crumb, i) => {
            const last = i === breadcrumb.length - 1;
            return (
              <span key={crumb.href} className="inline-flex items-center gap-1.5">
                {last ? (
                  <span className={navy ? "text-white/80" : "text-gray-900"}>
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className={cn(
                        "transition-colors",
                        navy ? "hover:text-white" : "hover:text-gray-900"
                      )}
                    >
                      {crumb.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  </>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {overline && (
        <span
          className={cn(
            "animate-hero-in mb-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]",
            navy ? "text-gold" : "text-primary"
          )}
        >
          {overlineIcon}
          {overline}
        </span>
      )}

      <h1
        className={cn(
          "animate-hero-in font-black leading-[1.05]",
          sizeTitle[size],
          navy ? "text-white" : "text-gray-900"
        )}
        style={{ animationDelay: "80ms" }}
      >
        {title}
        {accent && (
          <>
            {accentPosition === "block" ? <br /> : " "}
            <span className={navy ? "text-gold-gradient" : "text-gradient"}>
              {accent}
            </span>
          </>
        )}
      </h1>

      {description && (
        <p
          className={cn(
            "animate-hero-in mt-5 max-w-xl text-base sm:text-lg leading-relaxed",
            centered && "mx-auto",
            navy ? "text-white/70" : "text-gray-500"
          )}
          style={{ animationDelay: "160ms" }}
        >
          {description}
        </p>
      )}

      {actions && (
        <div
          className={cn(
            // Phones get full-width stacked CTAs (easier thumb targets);
            // sm+ returns to the inline pill row
            "animate-hero-in mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
            centered && "sm:justify-center"
          )}
          style={{ animationDelay: "240ms" }}
        >
          {actions}
        </div>
      )}

      {children && (
        <div className="animate-hero-in" style={{ animationDelay: "320ms" }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        navy ? "bg-navy" : "bg-surface",
        sizePadding[size],
        className
      )}
    >
      {navy && (
        <>
          <div className="pointer-events-none absolute -top-32 left-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full blur-[100px]",
              accentTone === "emergency" ? "bg-emergency/15" : "bg-gold/15"
            )}
          />
        </>
      )}
      <Container className="relative">
        {media ? (
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {rows}
            <div className="animate-hero-in" style={{ animationDelay: "200ms" }}>
              {media}
            </div>
          </div>
        ) : (
          rows
        )}
      </Container>
    </section>
  );
}
