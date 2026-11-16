"use client";

import { cn } from "@/lib/utils";

/**
 * The gallery's category filters (explorer.md "Gallery"): toggle buttons
 * with aria-pressed, 44 px chips, "All" first. Rendered by GalleryGrid,
 * which owns the state. They are in the server HTML so nothing shifts on
 * hydration; without JavaScript "All" stays pressed and every photo shows.
 */

export interface GalleryCategory {
  id: string;
  label: string;
}

interface GalleryFiltersProps {
  categories: GalleryCategory[];
  active: string;
  onChange: (id: string) => void;
  /** Photos per category id ("all" included); a category with none is left out. */
  counts: Record<string, number>;
  label?: string;
  controls?: string;
}

export default function GalleryFilters({
  categories,
  active,
  onChange,
  counts,
  label = "Filter photos",
  controls,
}: GalleryFiltersProps) {
  return (
    <div role="group" aria-label={label} className="gallery-filters">
      {categories
        .filter((category) => category.id === "all" || (counts[category.id] ?? 0) > 0)
        .map((category) => {
          const pressed = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={pressed}
              aria-controls={controls}
              onClick={() => onChange(category.id)}
              className={cn("gallery-chip", pressed && "is-pressed")}
            >
              {category.label}
              <span className="gallery-chip-count tabular-nums">{counts[category.id] ?? 0}</span>
            </button>
          );
        })}
    </div>
  );
}
