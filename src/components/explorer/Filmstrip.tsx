import type { MediaRef } from "@/lib/media-types";
import type { LightboxNext } from "@/components/lightbox/LightboxProvider";
import FilmstripRail from "./FilmstripRail";
import { photoCountLabel } from "./explorer-utils";

/**
 * A filmstrip (explorer.md "Filmstrip"): the heading row rendered on the
 * server, the rail handed to FilmstripRail with plain MediaRef props.
 * Renders nothing for an empty set.
 *
 * `heading` names the set as a heading (`as` h2 or h3, as the page needs);
 * `label` instead shows a plain label-tech line (a single-phase project).
 */

interface FilmstripProps {
  /** Collection id, unique on the page. */
  id: string;
  items: MediaRef[];
  /** The name of the set (a phase name). */
  name: string;
  /** Lightbox title; defaults to `name`. */
  title?: string;
  description?: string;
  as?: "h2" | "h3";
  /** Show the name as a plain label instead of a heading. */
  plain?: boolean;
  /** Leave the name out of the heading row (FeaturedProjects names the phase in its stepper). */
  showName?: boolean;
  headingId?: string;
  /** Images loaded eagerly (only the first rail on a page: 2). */
  eager?: number;
  next?: LightboxNext;
  align?: "page" | "column";
  className?: string;
}

export default function Filmstrip({
  id,
  items,
  name,
  title,
  description,
  as: Heading = "h2",
  plain = false,
  showName = true,
  headingId,
  eager = 0,
  next,
  align = "page",
  className,
}: FilmstripProps) {
  if (items.length === 0) return null;

  const header = !showName ? null : (
    <>
      {plain ? (
        <p id={headingId} className="label-tech flex items-center gap-3 text-accent">
          <span className="joint" aria-hidden="true" />
          {name}
          <span className="text-muted">{photoCountLabel(items.length)}</span>
        </p>
      ) : (
        <Heading id={headingId} className="filmstrip-title">
          {name}
        </Heading>
      )}
      {description && <p className="mt-3 max-w-[60ch] text-body">{description}</p>}
    </>
  );

  return (
    <FilmstripRail
      id={id}
      title={title ?? name}
      items={items}
      header={header}
      eager={eager}
      next={next}
      align={align}
      className={className}
    />
  );
}
