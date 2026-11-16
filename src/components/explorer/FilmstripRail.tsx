"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { useLightbox, type LightboxNext } from "@/components/lightbox/LightboxProvider";
import type { MediaRef } from "@/lib/media-types";
import { aspectOf, fileHref, formatCounter, keyToIndex, railSizes } from "./explorer-utils";
import { useHydrated } from "./useHydrated";

/**
 * The rail (explorer.md "Filmstrip"): one row of photographs at one height,
 * each at its own aspect ratio, scrolling natively with scroll-snap.
 *
 * - One tab stop (roving tabindex): Left/Right move between photos and
 *   scroll them into view, Home/End jump, Enter/Space opens the lightbox.
 * - The counter follows the scroll through an IntersectionObserver.
 * - Previous/next scroll by about 80% of the rail; disabled at the ends,
 *   hidden on touch-only screens (explorer.css).
 * - Without JavaScript, or outside a LightboxProvider, every photo is a link
 *   to its image file; after hydration it becomes a button.
 * - No wheel or touch listeners: vertical page scrolling is never trapped.
 */

export const REVEAL_EVENT = "explorer:reveal";

export type RevealDetail = { id: string };

interface FilmstripRailProps {
  /** Collection id, unique on the page (a phase anchor such as "phase-underground"). */
  id: string;
  /** Lightbox title for this collection. */
  title: string;
  items: MediaRef[];
  /** Heading and description, rendered by the server (Filmstrip). */
  header?: ReactNode;
  /** Images loaded eagerly (the first rail on a page: 2). */
  eager?: number;
  next?: LightboxNext;
  /** "page": the rail starts on the page grid and bleeds right. "column": it starts at its column. */
  align?: "page" | "column";
  className?: string;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FilmstripRail({
  id,
  title,
  items,
  header,
  eager = 0,
  next,
  align = "page",
  className,
}: FilmstripRailProps) {
  const lightbox = useLightbox();
  const hydrated = useHydrated();
  const interactive = hydrated && lightbox !== null;

  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [focusIndex, setFocusIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: items.length <= 1 });
  const total = items.length;

  const photoAt = useCallback((i: number) => {
    return railRef.current?.querySelectorAll<HTMLElement>("[data-photo]")[i] ?? null;
  }, []);

  const measureEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const start = rail.scrollLeft <= 2;
    const end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    return end;
  }, []);

  // Counter: the leftmost photo that is mostly in view (the last one once
  // the rail reaches its end). Tab lands on that photo when focus is
  // elsewhere.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const visible = new Set<number>();
    const update = () => {
      const atEnd = measureEdges();
      if (visible.size === 0) return;
      const next = atEnd ? total - 1 : Math.min(...visible);
      setCurrent(next);
      if (!rail.contains(document.activeElement)) setFocusIndex(next);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.index);
          if (entry.intersectionRatio >= 0.55) visible.add(i);
          else visible.delete(i);
        }
        update();
      },
      { root: rail, threshold: [0, 0.55, 1] },
    );
    for (const item of Array.from(rail.children)) observer.observe(item);
    const resize = new ResizeObserver(() => measureEdges());
    resize.observe(rail);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, [measureEdges, total]);

  const scrollToPhoto = useCallback(
    (i: number, behavior: ScrollBehavior) => {
      const photo = photoAt(i);
      photo?.scrollIntoView({ behavior, block: "nearest", inline: "nearest" });
    },
    [photoAt],
  );

  // Register with the page's lightbox. restore() runs when the lightbox
  // closes on this collection: focus the last photo seen and bring it into
  // view (revealing a hidden panel first, for FeaturedProjects).
  useEffect(() => {
    if (!lightbox) return;
    const restore = (index: number) => {
      const root = rootRef.current;
      if (!root) return;
      const focus = () => {
        setFocusIndex(index);
        const photo = photoAt(index);
        if (!photo) return;
        photo.focus({ preventScroll: true });
        scrollToPhoto(index, "instant");
      };
      if (root.closest("[hidden]")) {
        root.dispatchEvent(
          new CustomEvent<RevealDetail>(REVEAL_EVENT, {
            bubbles: true,
            detail: { id },
          }),
        );
        requestAnimationFrame(() => requestAnimationFrame(focus));
      } else {
        focus();
      }
    };
    return lightbox.register({ id, title, items, next, restore });
  }, [lightbox, id, title, items, next, photoAt, scrollToPhoto]);

  const step = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = keyToIndex(event.key, focusIndex, total);
    if (target === null) return;
    event.preventDefault();
    setFocusIndex(target);
    const photo = photoAt(target);
    if (!photo) return;
    photo.focus({ preventScroll: true });
    scrollToPhoto(target, prefersReducedMotion() ? "instant" : "smooth");
  };

  if (total === 0) return null;

  return (
    <div
      ref={rootRef}
      className={cn("filmstrip", align === "column" && "filmstrip--column", className)}
      data-collection={id}
      onPointerEnter={lightbox?.preload}
      onFocusCapture={lightbox?.preload}
    >
      <div className="filmstrip-head">
        <div className="min-w-0">{header}</div>
        <div className="filmstrip-controls">
          <p className="meta tabular-nums text-muted">
            <span className="sr-only">Photo </span>
            {formatCounter(current, total)}
          </p>
          <div className="filmstrip-arrows">
            <button type="button" className="filmstrip-arrow" onClick={() => step(-1)} disabled={edges.start}>
              <ChevronLeft className="size-5" />
              <span className="sr-only">Previous photos</span>
            </button>
            <button type="button" className="filmstrip-arrow" onClick={() => step(1)} disabled={edges.end}>
              <ChevronRight className="size-5" />
              <span className="sr-only">Next photos</span>
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={railRef}
        className="filmstrip-rail"
        aria-label={`${title}: ${total} ${total === 1 ? "photo" : "photos"}`}
        onKeyDown={interactive ? onKeyDown : undefined}
        onScroll={measureEdges}
      >
        {items.map((media, i) => {
          const frame = (
            <span
              className="filmstrip-frame"
              style={
                {
                  "--ar": aspectOf(media.width, media.height),
                  backgroundColor: media.color,
                } as CSSProperties
              }
            >
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes={railSizes(media.width, media.height)}
                loading={i < eager ? "eager" : "lazy"}
                className="object-cover"
                style={{ objectPosition: media.position }}
                draggable={false}
              />
            </span>
          );
          return (
            <li key={media.path} data-index={i} className="filmstrip-item">
              {interactive ? (
                <button
                  type="button"
                  data-photo
                  tabIndex={i === focusIndex ? 0 : -1}
                  aria-label={`${media.alt}, open photo`}
                  onFocus={() => setFocusIndex(i)}
                  onClick={(event) => lightbox.open(id, i, event.currentTarget)}
                  className="filmstrip-photo"
                >
                  {frame}
                </button>
              ) : (
                <a
                  data-photo
                  href={fileHref(media.src)}
                  aria-label={`${media.alt}, open photo`}
                  className="filmstrip-photo"
                >
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
