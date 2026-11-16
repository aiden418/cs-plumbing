import Link from "next/link";
import { cn } from "@/lib/utils";
import Frame from "@/components/ui/Frame";
import { ArrowRight } from "@/components/ui/icons";
import type { MediaRef } from "@/lib/media-types";
import type { Service } from "@/lib/types";

/**
 * A service tile (design-system.md "Tiles"): a portrait frame with the title,
 * the service's line and its feature list below it, never on it. The whole
 * tile is one link; hover lifts the frame 2 px and nudges the arrow.
 *
 * `media` is resolved by the server page (picture("home.service.<slug>"));
 * without one the tile is type-led: no frame and no stand-in picture, the
 * words under a hairline.
 *
 * "door": the frame sits beside the words (a wide tile for a short group).
 */
interface ServiceCardProps {
  service: Service;
  media: MediaRef | null;
  more: string;
  layout?: "tile" | "door";
  /** Real layout widths of the frame. */
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
  const door = layout === "door";
  const lift = "transition-[transform,box-shadow] duration-250 ease-settle group-hover:-translate-y-0.5 group-hover:shadow-lift";
  const frame = media ? (
    <Frame media={media} alt="" aspect="4/5" sizes={sizes} quality={70} frameClassName={lift} />
  ) : null;

  return (
    <Link
      href={service.href}
      className={cn(
        "service-tile group flex h-full flex-col rounded-frame",
        door && frame && "grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-5 sm:gap-8",
        !frame && "rounded-none border-t border-rule pt-6",
        className,
      )}
    >
      {frame}
      <div className={cn("flex flex-1 flex-col", !door && frame && "mt-5")}>
        <Title className="text-lg leading-snug font-semibold text-fg sm:text-xl">
          <span className="underline-offset-4 group-hover:underline group-hover:decoration-1">{service.title}</span>
        </Title>
        <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
        {service.features && service.features.length > 0 && (
          <ul className="service-tile-features mt-4 text-sm text-body">
            {service.features.slice(0, 4).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex min-h-6 items-center gap-1.5 pt-4 text-sm font-semibold text-link">
          {more}
          <ArrowRight className="size-4 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
