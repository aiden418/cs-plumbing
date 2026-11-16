import { type CSSProperties, type ReactNode } from "react";

/**
 * Reveal on scroll, without hiding anything that has not been checked.
 *
 * This component only writes attributes: `data-reveal` (empty) and the
 * stagger position `--reveal-i`. The page is fully visible as served. After
 * hydration, RevealObserver (mounted once in the root layout) marks the
 * elements that are still below the fold `pending` (16 px down, transparent)
 * and flips each one to `in` as it scrolls into view. Without JavaScript,
 * with reduced motion and in print, nothing is ever hidden (globals.css).
 *
 * Server component. Never put it on sticky or fixed elements (the observer
 * skips them anyway).
 */

/** At most this many items are staggered; the rest arrive with the last of them. */
export const REVEAL_MAX_STAGGER = 6;

/** The stagger position for item `index`, clamped to 0 … REVEAL_MAX_STAGGER - 1. */
export function revealIndex(index: number | undefined): number {
  if (index === undefined || !Number.isFinite(index) || index < 0) return 0;
  return Math.min(Math.floor(index), REVEAL_MAX_STAGGER - 1);
}

/**
 * Whether an element should be held back until it scrolls in: only when it
 * starts entirely below the visible part of the window. Anything on screen or
 * already scrolled past is left alone, so the first paint never changes.
 */
export function startsBelowFold(rectTop: number, viewportHeight: number): boolean {
  return rectTop >= viewportHeight;
}

type RevealTag = "div" | "section" | "li" | "ul" | "ol" | "article" | "figure" | "span" | "p" | "header";

interface RevealProps {
  children?: ReactNode;
  as?: RevealTag;
  /** Position in a short staggered group (0 = first). Clamped to 6 items. */
  index?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export default function Reveal({ children, as: Tag = "div", index, className, id, style }: RevealProps) {
  const i = revealIndex(index);
  const merged = i > 0 ? ({ ...style, "--reveal-i": i } as CSSProperties) : style;
  return (
    <Tag data-reveal="" id={id} className={className} style={merged} suppressHydrationWarning>
      {children}
    </Tag>
  );
}
