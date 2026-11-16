import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import PlanMotif from "@/components/ui/PlanMotif";
import type { MediaRef } from "@/lib/media-types";
import {
  frameOrientation,
  headlineText,
  headlineWidth,
  isMediaRef,
  resolveHeroLayout,
  type PageHeroImage,
  type PageHeroLayout,
} from "@/lib/hero-images";

export type { PageHeroImage, PageHeroLayout };

type PageHeroSize = "sm" | "md" | "lg";

interface PageHeroProps {
  /** Which composition. Left out, it follows from the other props (see resolveHeroLayout). */
  layout?: PageHeroLayout;
  /**
   * The header photograph, resolved on the server (heroFrame() from
   * "@/lib/hero-frame", or image()/slot() from "@/lib/media"). Shown in a
   * frame beside the text (split, cinema) or below it (editorial); never
   * behind text.
   */
  frame?: MediaRef | null;
  /** Legacy: the hero is always on ink now. Accepted and ignored. */
  variant?: "navy" | "light";
  /** "emergency" gives the urgent layout when no layout is named. */
  accentTone?: "gold" | "emergency";
  overline?: string;
  /** Small icon before the eyebrow label (decorative). */
  overlineIcon?: ReactNode;
  /** The H1 words, exactly as written in the data. */
  title: string;
  /** Appended to the title after a space (or a line break with accentPosition "block"), same colour. */
  accent?: string;
  accentPosition?: "inline" | "block";
  description?: ReactNode;
  align?: "left" | "center";
  /** "sm" gives compact proportions (smaller paddings and headline). */
  size?: PageHeroSize;
  /** Visible trail; the JSON-LD stays in the page file. */
  breadcrumb?: { name: string; href: string }[];
  /** CTA row: stacked full width on phones, inline from sm. */
  actions?: ReactNode;
  /** Legacy right column (a node the caller built). Gives the split layout. */
  media?: ReactNode;
  /**
   * Legacy header photo path. PageHero is rendered by client components, so
   * it cannot read the picture registry: a path alone gives the type-led
   * layout. Resolve it on the server with heroFrame() and pass `frame`
   * instead. An already-resolved MediaRef is framed as is.
   */
  image?: PageHeroImage | MediaRef | string | null;
  /** Rows under the actions: rating, award, trust lines. */
  children?: ReactNode;
  className?: string;
}

const enterStyle = (i: number) => ({ "--enter-i": i }) as CSSProperties;

const TOP_PADDING = "pt-[calc(var(--nav-h)+clamp(2rem,5vw,4.5rem))]";
const TOP_PADDING_COMPACT = "pt-[calc(var(--nav-h)+clamp(1.5rem,4vw,3rem))]";

const BOTTOM_PADDING: Record<PageHeroLayout, string> = {
  cinema: "pb-section",
  split: "pb-section-sm",
  "type-led": "pb-section-sm",
  editorial: "pb-section-sm",
  urgent: "pb-section-sm",
  compact: "pb-10 sm:pb-12",
};

/** Text column on the 12-column grid (≥ 1024 px). */
const TEXT_COLUMN: Record<PageHeroLayout, string> = {
  cinema: "lg:col-span-5",
  split: "lg:col-span-6",
  "type-led": "lg:col-span-8",
  urgent: "lg:col-span-8",
  compact: "lg:col-span-9",
  editorial: "",
};

const WIDTH_CLASS = {
  "display-wide": "display-wide",
  default: "",
  "display-normal": "display-normal",
  "display-tight": "display-tight",
} as const;

function HeroFrame({ media, layout }: { media: MediaRef; layout: "split" | "cinema" | "editorial" }) {
  const portrait = frameOrientation(media) === "portrait";
  const aspect = portrait
    ? "aspect-[4/5]"
    : layout === "editorial"
      ? "aspect-[4/3] sm:aspect-[16/9]"
      : "aspect-[4/3] lg:aspect-[3/2]";
  const sizes =
    layout === "editorial"
      ? portrait
        ? "(min-width: 768px) 46rem, 100vw"
        : "(min-width: 1280px) 1216px, 100vw"
      : layout === "cinema"
        ? "(min-width: 1280px) 710px, (min-width: 1024px) 56vw, 100vw"
        : portrait
          ? "(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
          : "(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw";
  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden rounded-frame bg-ink-700",
        aspect,
        // Never taller than the screen below the header on desktop.
        "lg:max-h-[calc(100svh-var(--nav-h)-6rem)]"
      )}
      style={media.color ? { backgroundColor: media.color } : undefined}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        preload
        sizes={sizes}
        quality={75}
        className="object-cover"
        style={{ objectPosition: media.position ?? "center" }}
      />
    </figure>
  );
}

/**
 * The page header: always on ink, under the transparent site header.
 * Rows: breadcrumb → eyebrow → h1 → lead → actions → children. Six layouts
 * (cinema, split, type-led, editorial, compact, urgent); a photograph is only
 * ever shown in a frame beside or below the words.
 *
 * Server-safe and client-safe: it imports no picture data, so the client
 * page templates that render it keep working.
 */
export default function PageHero({
  layout: layoutProp,
  frame,
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
  image,
  children,
  className,
}: PageHeroProps) {
  const photo: MediaRef | null = frame ?? (isMediaRef(image) ? image : null);
  const layout = resolveHeroLayout({
    layout: layoutProp,
    hasFrame: Boolean(photo),
    hasMedia: Boolean(media),
    hasImage: Boolean(image),
    size,
    align,
    accentTone,
  });
  const compact = layout === "compact" || size === "sm";
  const urgent = layout === "urgent";
  const editorial = layout === "editorial";
  // Centring only where nothing sits beside the words.
  const centered = align === "center" && (editorial || layout === "compact");

  const h1Text = headlineText(title, accent);
  const { width, stepDown: longest } = headlineWidth(h1Text);
  // Beside a photograph the headline has half the page: a title past about
  // 40 characters would run to five lines at full size, so it steps down too.
  const besidePhoto = layout === "split" || layout === "cinema";
  const stepDown = longest || (besidePhoto && h1Text.length > 40);
  const h1Size = compact
    ? stepDown
      ? "text-display-sm"
      : "text-display-md"
    : stepDown
      ? "text-display-md"
      : "text-display-lg";

  const framed = photo && (layout === "split" || layout === "cinema" || editorial) ? photo : null;
  const aside: ReactNode = media ? (
    media
  ) : framed && !editorial ? (
    <HeroFrame media={framed} layout={layout === "cinema" ? "cinema" : "split"} />
  ) : layout === "type-led" || urgent ? (
    <PlanMotif seed={h1Text} className="ml-auto w-full max-w-[22rem]" />
  ) : null;

  const asideColumn = media
    ? "lg:col-span-6 lg:col-start-7"
    : framed
      ? layout === "cinema"
        ? "lg:col-span-7 lg:col-start-6"
        : frameOrientation(framed) === "portrait"
          ? "lg:col-span-5 lg:col-start-8"
          : "lg:col-span-6 lg:col-start-7"
      : // the plan motif: decoration, desktop only
        "hidden lg:block lg:col-span-4 lg:col-start-9 lg:self-end";

  const rows = (
    <div
      className={cn(
        centered ? "mx-auto max-w-[46rem] text-center lg:col-span-12" : editorial ? "mx-auto max-w-[46rem]" : TEXT_COLUMN[layout]
      )}
    >
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="enter mb-6 text-sm text-muted" style={enterStyle(0)}>
          <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", centered && "justify-center")}>
            {breadcrumb.map((crumb, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={`${crumb.href}-${i}`} className="inline-flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="opacity-70">
                      /
                    </span>
                  )}
                  {last ? (
                    <span aria-current="page" className="text-body">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="relative underline-offset-4 transition-colors duration-150 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-fg hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {overline && (
        <p
          className={cn("enter label-tech mb-5 flex items-center gap-2.5 text-accent", centered && "justify-center")}
          style={enterStyle(0)}
        >
          <span className={cn("joint", urgent && "text-emergency-300")} aria-hidden="true" />
          {urgent && <span className="h-px w-8 bg-emergency-300" aria-hidden="true" />}
          {overlineIcon && (
            <span className="inline-flex shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">
              {overlineIcon}
            </span>
          )}
          <span>{overline}</span>
        </p>
      )}

      <h1 className={cn("enter text-fg", h1Size, WIDTH_CLASS[width])} style={enterStyle(1)}>
        {accent && accentPosition === "block" ? (
          <>
            {title}
            <br />
            {accent}
          </>
        ) : (
          h1Text
        )}
      </h1>

      {description &&
        (typeof description === "string" ? (
          <p className={cn("enter mt-5 max-w-[52ch] text-lead text-body", centered && "mx-auto")} style={enterStyle(2)}>
            {description}
          </p>
        ) : (
          <div className={cn("enter mt-5 max-w-[52ch] text-lead text-body", centered && "mx-auto")} style={enterStyle(2)}>
            {description}
          </div>
        ))}

      {actions && (
        <div
          className={cn(
            "enter mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
            centered && "sm:justify-center"
          )}
          style={enterStyle(3)}
        >
          {actions}
        </div>
      )}

      {children && (
        <div className="enter" style={enterStyle(3)}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <section
      data-tone="ink"
      data-header="overlay"
      data-hero-layout={layout}
      className={cn(
        "relative w-full bg-canvas",
        compact ? TOP_PADDING_COMPACT : TOP_PADDING,
        compact && layout !== "cinema" ? BOTTOM_PADDING.compact : BOTTOM_PADDING[layout],
        className
      )}
    >
      <Container>
        {editorial ? (
          <>
            {rows}
            {framed && (
              <div
                className={cn(
                  "enter mt-12 lg:mt-16",
                  frameOrientation(framed) === "portrait" && "mx-auto max-w-[46rem]"
                )}
                style={enterStyle(3)}
              >
                <HeroFrame media={framed} layout="editorial" />
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8",
              layout === "type-led" || urgent || layout === "compact" ? "lg:items-end" : "lg:items-center"
            )}
          >
            {rows}
            {aside && (
              <div className={cn("enter", asideColumn)} style={enterStyle(3)}>
                {aside}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
