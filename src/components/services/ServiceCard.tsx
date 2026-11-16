import Link from "next/link";
import { cn } from "@/lib/utils";
import Frame from "@/components/ui/Frame";
import { ArrowRight } from "@/components/ui/icons";
import type { MediaRef } from "@/lib/media-types";
import type { Service } from "@/lib/types";

/**
 * A service tile (v2-bright.md): a white card with the photograph on top and
 * the service's name under it; the whole card is one link. The service's line
 * shows from md (on a phone, two tiles a row, it would be too long) and its
 * feature list stays in the page for search engines and screen readers.
 *
 * `media` is resolved by the server page; without one the card shows its
 * words only.
 *
 * "wide": a landscape photograph (a short group of two).
 */
interface ServiceCardProps {
  service: Service;
  media: MediaRef | null;
  more: string;
  layout?: "tile" | "wide";
  /** Real layout widths of the photograph. */
  sizes: string;
  titleAs?: "h3" | "h4";
  className?: string;
}

export default function ServiceCard({
  service,
  media,
  more,
  layout = "tile",
  sizes,
  titleAs: Title = "h4",
  className,
}: ServiceCardProps) {
  const wide = layout === "wide";
  return (
    <Link
      href={service.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-steel-200 bg-white transition-colors duration-150 hover:border-steel-300",
        wide && media && "sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
        className,
      )}
    >
      {media && (
        <Frame
          media={media}
          alt=""
          aspect="4/3"
          sizes={sizes}
          quality={70}
          frameClassName={cn("rounded-none", wide && "aspect-video sm:aspect-auto sm:h-full sm:min-h-44")}
        />
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Title className="flex items-start justify-between gap-2 text-[1.0625rem] leading-snug font-semibold text-fg sm:text-lg">
          <span className="group-hover:text-primary-dark">{service.title}</span>
          <ArrowRight className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        </Title>
        <p className={cn("mt-2 text-base leading-normal text-body", !wide && "sr-only md:not-sr-only")}>
          {service.description}
        </p>
        {service.features && service.features.length > 0 && (
          <ul className="sr-only">
            {service.features.slice(0, 4).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
        <span className="sr-only">{more}</span>
      </div>
    </Link>
  );
}
