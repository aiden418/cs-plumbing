"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Dialog from "@/components/ui/Dialog";
import { ArrowRight, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import {
  formatCounter,
  isNearSlide,
  keyToIndex,
  lightboxImageStyle,
  photoAnnouncement,
} from "@/components/explorer/explorer-utils";
import type { LightboxCollection } from "./LightboxProvider";

/**
 * The full-screen photo viewer (explorer.md "Lightbox"). Loaded on first
 * use by LightboxProvider. A native <dialog> through the Dialog primitive:
 * the browser traps focus, Esc closes (native `cancel`), the page behind is
 * inert and scroll-locked.
 *
 * The stage is a horizontal scroll-snap track, so a swipe on a phone is the
 * browser's own scrolling; arrow keys, Home/End and the side buttons scroll
 * the same track. Only the current slide and its two neighbours on each side
 * carry an image. Never touches history, never stops propagation.
 */

interface LightboxProps {
  collection: LightboxCollection;
  startIndex: number;
  onClose: (lastIndex: number) => void;
  onContinue: (nextId: string) => void;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Lightbox({ collection, startIndex, onClose, onContinue }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [shownId, setShownId] = useState(collection.id);
  // A new collection ("Continue to …") starts at its first photo. Adjusting
  // state while rendering is React's documented pattern for this.
  if (shownId !== collection.id) {
    setShownId(collection.id);
    setIndex(startIndex);
  }
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const total = collection.items.length;
  const current = collection.items[Math.min(index, total - 1)];
  const handleClose = useCallback(() => onClose(indexRef.current), [onClose]);

  return (
    <Dialog
      open
      onClose={handleClose}
      title={collection.title}
      variant="fullscreen"
      tone="ink"
      closeLabel="Close"
      headerExtra={
        <p className="label-tech tabular-nums whitespace-nowrap text-muted" aria-hidden="true">
          {formatCounter(index, total)}
        </p>
      }
      // The stage fills the dialog body edge to edge (Dialog pads its body
      // for text content).
      className="lightbox max-sm:[&_h2]:text-[0.9375rem] [&>div>div:last-child]:overflow-hidden [&>div>div:last-child]:p-0"
    >
      <LightboxStage
        key={collection.id}
        collection={collection}
        startIndex={startIndex}
        index={index}
        onIndex={setIndex}
        onContinue={onContinue}
      />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {current ? photoAnnouncement(index, total, current.caption ?? current.alt) : ""}
      </p>
    </Dialog>
  );
}

interface StageProps {
  collection: LightboxCollection;
  startIndex: number;
  index: number;
  onIndex: (index: number) => void;
  onContinue: (nextId: string) => void;
}

function LightboxStage({ collection, startIndex, index, onIndex, onContinue }: StageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const { items, next } = collection;
  const total = items.length;

  const goTo = useCallback((target: number, instant = false) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[target] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: instant || prefersReducedMotion() ? "instant" : "smooth",
    });
  }, []);

  // Open on the photo that was chosen. The dialog becomes visible in the
  // same commit (Dialog's effect runs after this one), so wait a frame.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      goTo(startIndex, true);
      ready.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [goTo, startIndex]);

  // The slide that fills most of the stage is the current one.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!ready.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (Number.isFinite(i)) onIndex(i);
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    for (const slide of Array.from(track.children)) observer.observe(slide);
    return () => observer.disconnect();
  }, [onIndex]);

  // Arrow keys, Home and End anywhere in the dialog (Esc is the dialog's own).
  useEffect(() => {
    const dialog = trackRef.current?.closest("dialog");
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = keyToIndex(event.key, index, total);
      if (target === null) return;
      event.preventDefault();
      goTo(target);
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [goTo, index, total]);

  // A click on the empty stage around a photo closes, like a backdrop click.
  const onSlideClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.closest("dialog")?.close();
  };

  return (
    <div className="relative h-full">
      <div ref={trackRef} className="lightbox-track" tabIndex={-1}>
        {items.map((media, i) => {
          const near = isNearSlide(i, index);
          const last = i === total - 1;
          const caption = media.caption ?? media.alt;
          return (
            <figure
              key={media.path}
              data-index={i}
              className="lightbox-slide"
              onClick={onSlideClick}
              inert={i !== index}
            >
              <div className="lightbox-photo" onClick={onSlideClick}>
                {near && (
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={media.width}
                    height={media.height}
                    sizes="100vw"
                    loading={i === index ? "eager" : "lazy"}
                    draggable={false}
                    style={lightboxImageStyle(media.width, media.height, media.color)}
                  />
                )}
              </div>
              <figcaption className="lightbox-caption">
                {near && <span className="block">{caption}</span>}
                {last && next && near && (
                  <button
                    type="button"
                    onClick={() => onContinue(next.id)}
                    className="group mt-3 inline-flex min-h-11 items-center gap-2 rounded-control px-1 font-semibold text-link underline-offset-4 hover:underline"
                  >
                    Continue to {next.label}
                    <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </button>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => goTo(Math.max(0, index - 1))}
        disabled={index === 0}
        className="lightbox-arrow left-3"
      >
        <ChevronLeft className="size-6" />
        <span className="sr-only">Previous photo</span>
      </button>
      <button
        type="button"
        onClick={() => goTo(Math.min(total - 1, index + 1))}
        disabled={index >= total - 1}
        className="lightbox-arrow right-3"
      >
        <ChevronRight className="size-6" />
        <span className="sr-only">Next photo</span>
      </button>
    </div>
  );
}
