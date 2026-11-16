"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import { fileHref, gallerySizes, justifiedItemStyle } from "@/components/explorer/explorer-utils";
import { useHydrated } from "@/components/explorer/useHydrated";
import type { MediaRef } from "@/lib/media-types";
import GalleryFilters, { type GalleryCategory } from "./GalleryFilters";

/**
 * The gallery (explorer.md "Gallery"): justified rows in pure CSS. Each
 * item grows by its aspect ratio from the width it has at the row height,
 * and a trailing spacer keeps the last row from stretching, so DOM order is
 * reading order and nothing is measured in script. Each photo opens the
 * lightbox with its title as the caption; filtering toggles `hidden` on the
 * items and re-scopes the lightbox to what is shown. Without JavaScript
 * every photo shows and links to its file.
 */

export interface GalleryGridItem {
  /** caption = the photo's title (shown in the lightbox). */
  media: MediaRef;
  category: string;
}

interface GalleryGridProps {
  items: GalleryGridItem[];
  categories: GalleryCategory[];
  /** Lightbox title. */
  title?: string;
  /** Images loaded eagerly (only when the grid starts in the first screen). */
  eager?: number;
}

const COLLECTION_ID = "gallery";

export default function GalleryGrid({ items, categories, title = "Gallery", eager = 0 }: GalleryGridProps) {
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
      <ul ref={listRef} id={gridId} className="gallery-grid">
        {items.map(({ media, category }, i) => {
          const n = position.get(i);
          const frame = (
            <span className="gallery-frame" style={{ backgroundColor: media.color }}>
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes={gallerySizes(media.width, media.height)}
                loading={i < eager ? "eager" : "lazy"}
                className="object-cover"
                style={{ objectPosition: media.position }}
                draggable={false}
              />
            </span>
          );
          const label = `${media.caption ?? media.alt}, open photo`;
          return (
            <li
              key={media.path}
              hidden={n === undefined}
              data-category={category}
              className="gallery-item"
              style={justifiedItemStyle(media.width, media.height) as CSSProperties}
            >
              {interactive ? (
                <button
                  type="button"
                  data-photo={i}
                  aria-label={label}
                  onClick={(event) => n !== undefined && lightbox.open(COLLECTION_ID, n, event.currentTarget)}
                  className="gallery-photo"
                >
                  {frame}
                </button>
              ) : (
                <a data-photo={i} href={fileHref(media.src)} aria-label={label} className="gallery-photo">
                  {frame}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
