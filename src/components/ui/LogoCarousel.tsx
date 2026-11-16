import type { CSSProperties, ReactNode } from "react";

export interface LogoCarouselItem {
  key: string;
  /** The logo itself (an <Image>, or a link around one). */
  logo: ReactNode;
  /** A white-on-transparent logo sits on a dark (navy) tile. */
  dark?: boolean;
}

interface LogoCarouselProps {
  items: LogoCarouselItem[];
  /** id of the heading that names this row. */
  labelledBy: string;
  /** Glide left to right instead of right to left. */
  reverse?: boolean;
  /** Seconds per loop (one full pass of the list). */
  seconds?: number;
  className?: string;
}

/**
 * One row of logo tiles that glides sideways and loops, in CSS only (styles in
 * app/styles/home.css, "Logo carousel"). The list is rendered twice inside the
 * moving track; the second copy is aria-hidden and inert, so screen readers
 * and the keyboard meet each logo once. The row pauses on hover, on focus and
 * while touched; under reduced motion it is a plain horizontally scrollable
 * strip. The row is focusable so keyboard users can pause it or scroll it.
 */
export default function LogoCarousel({ items, labelledBy, reverse = false, seconds = 45, className }: LogoCarouselProps) {
  const tiles = items.map((item) => (
    <li key={item.key} className="logo-carousel-tile" data-tone={item.dark ? "navy" : undefined}>
      {item.logo}
    </li>
  ));
  const style = { "--logo-carousel-duration": `${seconds}s` } as CSSProperties;

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      tabIndex={0}
      className={className ? `logo-carousel ${className}` : "logo-carousel"}
      data-reverse={reverse ? "" : undefined}
    >
      <div className="logo-carousel-track" style={style}>
        <ul className="logo-carousel-list">{tiles}</ul>
        <ul className="logo-carousel-list" aria-hidden="true" inert>
          {tiles}
        </ul>
      </div>
    </div>
  );
}
