import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/icons";
import type { MediaRef } from "@/lib/media-types";

/**
 * Frame: the only way a content photograph is shown (design-system.md
 * section 4). An aspect-ratio box with rounded corners, the photo's dominant
 * colour underneath while it loads, object-cover with the photo's own
 * object-position, and the caption below the frame, never on it.
 *
 * Server-safe: it takes a resolved MediaRef (from @/lib/media in a server
 * component) and imports no picture data itself.
 */

export type FrameAspect = "4/5" | "3/2" | "4/3" | "1/1" | "16/9" | "5/4" | "natural";
export type FrameQuality = 60 | 70 | 75 | 80 | 85;

const aspects: Record<Exclude<FrameAspect, "natural">, string> = {
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
  "5/4": "aspect-[5/4]",
};

interface FrameProps {
  media: MediaRef | null | undefined;
  aspect?: FrameAspect;
  /** Real layout widths, e.g. "(min-width: 1024px) 40vw, 100vw". Required. */
  sizes: string;
  /** Only for the one largest picture at the top of a page. */
  preload?: boolean;
  quality?: FrameQuality;
  /** Rendered under the frame as a figcaption. */
  caption?: ReactNode;
  /** CSS object-position; defaults to the picture's own. */
  position?: string;
  /** Overrides the picture's alt text (use "" for a decorative repeat). */
  alt?: string;
  className?: string;
  /** Classes for the frame box itself (the figure/wrapper takes `className`). */
  frameClassName?: string;
}

function FrameBox({
  media,
  aspect = "4/5",
  sizes,
  preload = false,
  quality,
  position,
  alt,
  className,
}: Omit<FrameProps, "media" | "caption"> & { media: MediaRef }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-frame", aspect !== "natural" && aspects[aspect], className)}
      style={{
        backgroundColor: media.color,
        aspectRatio: aspect === "natural" ? `${media.width} / ${media.height}` : undefined,
      }}
    >
      <Image
        src={media.src}
        alt={alt ?? media.alt}
        fill
        sizes={sizes}
        preload={preload || undefined}
        quality={quality}
        placeholder={media.blurDataURL ? "blur" : "empty"}
        blurDataURL={media.blurDataURL}
        className="object-cover"
        style={{ objectPosition: position ?? media.position }}
      />
    </div>
  );
}

export default function Frame({ media, caption, className, frameClassName, ...rest }: FrameProps) {
  if (!media) return null;
  if (caption === undefined || caption === null || caption === "") {
    return <FrameBox media={media} {...rest} className={cn(frameClassName, className)} />;
  }
  return (
    <figure className={className}>
      <FrameBox media={media} {...rest} className={frameClassName} />
      <figcaption className="mt-3 max-w-[68ch] text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

interface FrameLinkProps {
  href: string;
  media: MediaRef | null | undefined;
  sizes: string;
  title: ReactNode;
  /** Small label above the title (label-tech, accent): a category, a city, a count. */
  label?: ReactNode;
  /** One line under the title. */
  description?: ReactNode;
  aspect?: FrameAspect;
  quality?: FrameQuality;
  titleAs?: "h2" | "h3" | "h4" | "span";
  className?: string;
}

/**
 * A tile: frame and the words below it, all one link. Hover lifts the frame
 * 2 px and nudges the arrow. With no picture the text still links.
 */
export function FrameLink({
  href,
  media,
  sizes,
  title,
  label,
  description,
  aspect = "4/5",
  quality,
  titleAs: Title = "h3",
  className,
}: FrameLinkProps) {
  return (
    <Link href={href} className={cn("group block rounded-frame", className)}>
      {media && (
        <FrameBox
          media={media}
          aspect={aspect}
          sizes={sizes}
          quality={quality}
          alt=""
          className="transition-[transform,box-shadow] duration-250 ease-settle group-hover:-translate-y-0.5 group-hover:shadow-lift"
        />
      )}
      <span className="mt-4 block">
        {label && <span className="label-tech mb-2 block text-accent">{label}</span>}
        <Title className="flex items-start gap-2 text-lg leading-snug font-semibold text-fg">
          <span className="group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{title}</span>
          <ArrowRight className="mt-[0.2em] size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </Title>
        {description && <span className="mt-1.5 block text-sm text-muted">{description}</span>}
      </span>
    </Link>
  );
}
