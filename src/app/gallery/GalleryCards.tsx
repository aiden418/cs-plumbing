"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import { fileHref } from "@/components/explorer/explorer-utils";
import { useHydrated } from "@/components/explorer/useHydrated";
import GalleryFilters, { type GalleryCategory } from "@/components/gallery/GalleryFilters";
import type { GalleryGridItem } from "@/components/gallery/GalleryGrid";

/**
 * The /gallery grid, version 2: the same behaviour as the shared GalleryGrid
 * (category chips, lightbox with the title as caption, focus restored on
 * close, every photo a link to its file without JavaScript) drawn as an even
 * grid of photo cards with each photo's title in small text under it, as the
 * current site shows it. Two columns on phones, three from 48rem, four from
 * 64rem; filtering toggles `hidden`, so every photo stays in the HTML.
 */

interface GalleryCardsProps {
  items: GalleryGridItem[];
  categories: GalleryCategory[];
  /** Lightbox title. */
  title?: string;
  /** Images loaded eagerly (only when the grid starts in the first screen). */
  eager?: number;
}

const COLLECTION_ID = "gallery";
const SIZES = "(min-width: 80rem) 18rem, (min-width: 64rem) 23vw, (min-width: 48rem) 31vw, 46vw";

export default function GalleryCards({ items, categories, title = "Gallery", eager = 0 }: GalleryCardsProps) {
  const lightbox = useLightbox();
  const hydrated = useHydrated();
  const interactive = hydrated && lightbox !== null;
  const gridId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState("all");

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: items.length };
    for (const item of items) out[item.category] = (out[item.category] ?? 0) + 1;
    return out;
  }, [items]);

  const shown = useMemo(
    () => items.map((item, i) => ({ item, i })).filter(({ item }) => active === "all" || item.category === active),
    [items, active],
  );
  const position = useMemo(() => new Map(shown.map(({ i }, n) => [i, n])), [shown]);

  useEffect(() => {
    if (!lightbox) return;
    const restore = (index: number) => {
      const target = shown[index];
      if (!target) return;
      const button = listRef.current?.querySelector<HTMLElement>(`[data-photo="${target.i}"]`);
      if (!button) return;
      button.focus({ preventScroll: true });
      button.scrollIntoView({ block: "nearest", behavior: "instant" });
    };
    return lightbox.register({
      id: COLLECTION_ID,
      title,
      items: shown.map(({ item }) => item.media),
      restore,
    });
  }, [lightbox, shown, title]);

  return (
    <div className="gallery" onPointerEnter={lightbox?.preload} onFocusCapture={lightbox?.preload}>
      <GalleryFilters categories={categories} active={active} onChange={setActive} counts={counts} controls={gridId} />
      <p className="sr-only" aria-live="polite">
        {hydrated ? `${shown.length} ${shown.length === 1 ? "photo" : "photos"} shown` : ""}
      </p>
      <ul ref={listRef} id={gridId} className="gallery-cards">
        {items.map(({ media, category }, i) => {
          const n = position.get(i);
          const caption = media.caption ?? media.alt;
          const body = (
            <>
              <span className="gallery-card-frame" style={{ backgroundColor: media.color }}>
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes={SIZES}
                  loading={i < eager ? "eager" : "lazy"}
                  className="object-cover"
                  style={{ objectPosition: media.position }}
                  draggable={false}
                />
              </span>
              <span className="gallery-card-title" aria-hidden="true">
                {caption}
              </span>
            </>
          );
          const label = `${caption}, open photo`;
          return (
            <li key={media.path} hidden={n === undefined} data-category={category}>
              {interactive ? (
                <button
                  type="button"
                  data-photo={i}
                  aria-label={label}
                  onClick={(event) => n !== undefined && lightbox.open(COLLECTION_ID, n, event.currentTarget)}
                  className="gallery-card"
                >
                  {body}
                </button>
              ) : (
                <a data-photo={i} href={fileHref(media.src)} aria-label={label} className="gallery-card">
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
