"use client";

import { useId, useMemo, useState } from "react";
import Frame from "@/components/ui/Frame";
import GalleryFilters, { type GalleryCategory } from "@/components/gallery/GalleryFilters";
import type { MediaRef } from "@/lib/media-types";

export interface BuilderGalleryItem {
  id: string;
  media: MediaRef;
  category: string;
  categoryLabel: string;
  caption: string;
}

/**
 * The builder project gallery: category filters (toggle buttons) over framed
 * photographs with the category and caption under each frame. Every photo
 * is in the server HTML; filtering only toggles `hidden`, so without
 * JavaScript "All" stays pressed and everything shows.
 */
export default function BuilderGallery({
  items,
  categories,
  filterLabel,
  empty,
}: {
  items: BuilderGalleryItem[];
  categories: GalleryCategory[];
  filterLabel: string;
  empty: string;
}) {
  const [active, setActive] = useState("all");
  const gridId = useId();
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: items.length };
    for (const item of items) out[item.category] = (out[item.category] ?? 0) + 1;
    return out;
  }, [items]);
  const shown = items.filter((item) => active === "all" || item.category === active).length;

  return (
    <div>
      <GalleryFilters
        categories={categories}
        active={active}
        onChange={setActive}
        counts={counts}
        label={filterLabel}
        controls={gridId}
      />
      <ul id={gridId} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
        {items.map((item) => (
          <li key={item.id} hidden={active !== "all" && item.category !== active}>
            <Frame
              media={item.media}
              aspect="4/5"
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 46vw"
            />
            <p className="label-tech mt-3 text-accent sm:mt-4">{item.categoryLabel}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-snug font-medium text-fg sm:text-base">{item.caption}</p>
          </li>
        ))}
      </ul>
      {shown === 0 && <p className="mt-12 text-center text-muted">{empty}</p>}
    </div>
  );
}
