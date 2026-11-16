import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import type { MediaRef } from "@/lib/media-types";
import {
  headlineText,
  headlineWidth,
  isMediaRef,
  resolveHeroLook,
  type HeroLook,
  type PageHeroImage,
  type PageHeroLayout,
} from "@/lib/hero-images";

export type { HeroLook, PageHeroImage, PageHeroLayout };

type PageHeroSize = "sm" | "md" | "lg";

interface PageHeroProps {
  /**
   * "photo" or "plain". The older names still work: split, cinema and
   * editorial give "photo" when a photograph was resolved (else "plain");
   * type-led, compact and urgent give "plain". Left out, a photograph gives
   * "photo".
   */
  layout?: PageHeroLayout;
  /**
   * The header photograph, resolved on the server (heroFrame() from
   * "@/lib/hero-frame", or picture()/image() from "@/lib/media"). It fills
   * the hero behind the words.
   */
  frame?: MediaRef | null;
  /** Legacy. Accepted and ignored. */
  variant?: "navy" | "light";
  /** "emergency" marks the eyebrow red (the caller passes the red call button). */
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
  /** "center" centres a plain hero that has nothing beside it. A photo hero is always bottom-left. */
  align?: "left" | "center";
  /** "sm" gives a smaller headline and tighter spacing. */
  size?: PageHeroSize;
  /** Visible trail; the JSON-LD stays in the page file. */
  breadcrumb?: { name: string; href: string }[];
  /** CTA row: stacked full width on phones, inline from sm. */
  actions?: ReactNode;
  /** Legacy right column (a node the caller built): shown beside a plain hero from lg, below it on phones. */
  media?: ReactNode;
  /**
   * Legacy header photo path. PageHero is rendered by client components, so
   * it cannot read the picture registry: a path alone gives the plain look.
   * Resolve it on the server with heroFrame() and pass `frame` instead. An
   * already-resolved MediaRef is used as is.
   */
  image?: PageHeroImage | MediaRef | string | null;
  /** Rows under the actions: rating, award, price, trust lines. */
  children?: ReactNode;
  className?: string;
}

const WIDTH_CLASS = {
  "display-wide": "display-wide",
  default: "",
  "display-normal": "display-normal",
  "display-tight": "display-tight",
} as const;

function Headline({
  title,
  accent,
  accentPosition,
  className,
}: {
  title: string;
  accent?: string;
  accentPosition: "inline" | "block";
  className: string;
}) {
  return (
    <h1 className={className}>
      {accent && accentPosition === "block" ? (
        <>
          {title}
          <br />
          {accent}
        </>
      ) : (
        headlineText(title, accent)
      )}
    </h1>
  );
}

/**
 * The page header (v2-bright.md "Heroes"). Two looks:
 *
 * - photo: the photograph fills the hero edge to edge; a navy scrim, darkest
 *   at the bottom-left, carries white words there. Marked data-hero-photo so
 *   the site header sits transparent over it; the top keeps room for that
 *   header and the breadcrumb sits right under it.
 * - plain: white, navy headline, compact; starts below the solid header.
 *
 * Rows: breadcrumb, eyebrow, H1, lead, actions, children. The H1 is one plain
 * text node (title and accent joined by a space).
 *
 * Server-safe and client-safe: it imports no picture data, so the client
 * page templates that render it keep working.
 */
export default function PageHero({
  layout,
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
  const look = resolveHeroLook(layout, Boolean(photo));
  const small = size === "sm" || layout === "compact";
  const urgent = layout === "urgent" || (!layout && accentTone === "emergency");

  const h1Text = headlineText(title, accent);
  const { width, stepDown } = headlineWidth(h1Text);
  const h1Size = small || stepDown ? "text-display-md" : "text-display-lg";

  const crumbs =
    breadcrumb && breadcrumb.length > 0 ? (
      <Breadcrumbs
        items={breadcrumb.map((crumb, i) => ({
          label: crumb.name,
          href: i === breadcrumb.length - 1 ? undefined : crumb.href,
        }))}
      />
    ) : null;

  const eyebrow = overline ? (
    <Eyebrow className={cn("mb-4", urgent && look === "plain" && "text-emergency")}>
      {overlineIcon && (
        <span className="mr-2 inline-flex shrink-0 align-[-0.15em] [&>svg]:size-4" aria-hidden="true">
          {overlineIcon}
        </span>
      )}
      {overline}
    </Eyebrow>
  ) : null;

  if (look === "photo" && photo) {
    return (
      <section
        data-hero-photo=""
        data-hero-layout="photo"
        className={cn(
          "hero-photo relative isolate flex flex-col overflow-hidden bg-ink text-body",
          // About 78% of a phone screen (30 to 44rem); 36 to 42rem on desktop.
          "min-h-[clamp(30rem,78svh,44rem)] lg:min-h-[clamp(36rem,74svh,42rem)]",
          className
        )}
        style={photo.color ? { backgroundColor: photo.color } : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          preload
          sizes="100vw"
          quality={75}
          className="-z-20 object-cover"
          style={{ objectPosition: photo.position ?? "center" }}
        />
        <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
        <Container className="flex w-full flex-1 flex-col pt-[var(--nav-h)] pb-9 sm:pb-12 lg:pb-16">
          <div className="min-h-11 pt-1">{crumbs}</div>
          <div className="mt-auto max-w-[46rem] pt-8">
            {eyebrow}
            <Headline
              title={title}
              accent={accent}
              accentPosition={accentPosition}
              className={cn("text-fg lg:max-w-[20ch]", h1Size, WIDTH_CLASS[width])}
            />
            {description &&
              (typeof description === "string" ? (
                <p className="mt-4 max-w-[46ch] text-lead font-medium text-body sm:mt-5">{description}</p>
              ) : (
                <div className="mt-4 max-w-[46ch] text-lead font-medium text-body sm:mt-5">{description}</div>
              ))}
            {actions && (
              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {actions}
              </div>
            )}
            {children && <div className="hero-photo-rows">{children}</div>}
          </div>
        </Container>
      </section>
    );
  }

  const centered = align === "center" && !media;
  return (
    <section
      data-tone="white"
      data-hero-layout="plain"
      className={cn(
        "relative w-full border-b border-rule bg-canvas",
        "pt-[calc(var(--nav-h)+1.5rem)] pb-10 sm:pt-[calc(var(--nav-h)+2.5rem)] sm:pb-12",
        !small && "lg:pt-[calc(var(--nav-h)+3.5rem)] lg:pb-16",
        className
      )}
    >
      <Container>
        <div className={cn(media && "grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-8")}>
          <div className={cn(media ? "lg:col-span-7" : centered ? "mx-auto max-w-[46rem] text-center" : "max-w-[50rem]")}>
            {crumbs && <div className={cn("mb-3 -mt-2", centered && "[&_ol]:justify-center")}>{crumbs}</div>}
            {eyebrow && <div className={cn(centered && "[&>p]:justify-center")}>{eyebrow}</div>}
            <Headline
              title={title}
              accent={accent}
              accentPosition={accentPosition}
              className={cn("text-navy", h1Size, WIDTH_CLASS[width])}
            />
            {description &&
              (typeof description === "string" ? (
                <p className={cn("mt-4 max-w-[52ch] text-lead text-body sm:mt-5", centered && "mx-auto")}>{description}</p>
              ) : (
                <div className={cn("mt-4 max-w-[52ch] text-lead text-body sm:mt-5", centered && "mx-auto")}>{description}</div>
              ))}
            {actions && (
              <div
                className={cn(
                  "mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
                  centered && "sm:justify-center"
                )}
              >
                {actions}
              </div>
            )}
            {children && <div>{children}</div>}
          </div>
          {media && <div className="lg:col-span-5">{media}</div>}
        </div>
      </Container>
    </section>
  );
}
