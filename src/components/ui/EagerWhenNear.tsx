"use client";

import { useEffect } from "react";

/** How far below the screen a block may be when its pictures start loading. */
const REACH = "1200px 0px";

/**
 * Pictures inside a `[data-eager-near]` block are written `loading="lazy"`,
 * so nothing far down a page is fetched while the first screen loads. When
 * the block comes within reach of the screen this turns them all to eager at
 * once, which makes the browser fetch them straight away.
 *
 * It exists for rows that glide sideways (the logo carousels): a lazy picture
 * waiting off to the side of such a row is not loaded until it has slid into
 * view, so its tile would arrive blank. Renders nothing; mounted by the
 * section that holds the rows. Without JavaScript the pictures stay lazy and
 * load as they come on screen.
 */
export default function EagerWhenNear() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-eager-near]"));
    if (blocks.length === 0) return;
    const wake = (block: Element) => {
      for (const img of block.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) img.loading = "eager";
    };
    if (typeof IntersectionObserver === "undefined") {
      blocks.forEach(wake);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          wake(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: REACH },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return null;
}
