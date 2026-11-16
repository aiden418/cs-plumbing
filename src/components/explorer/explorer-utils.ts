/**
 * Pure helpers for the explorer, the lightbox and the gallery grid. No
 * imports, no DOM: server and client components share them and
 * tests/explorer-utils.test.ts covers them.
 */

/** Rail height on a phone and its cap on a large screen, in CSS px (explorer.css: clamp(17rem, 52vh, 34rem)). */
export const RAIL_HEIGHT_PHONE = 440;
export const RAIL_HEIGHT_MAX = 544;
/** On a phone a frame is never wider than this share of the viewport (the next one peeks in). */
export const RAIL_PHONE_MAX_VW = 86;

/** Width / height, 1 when the size is unknown or nonsense. */
export function aspectOf(width: number | undefined, height: number | undefined): number {
  if (!width || !height || width <= 0 || height <= 0) return 1;
  return width / height;
}

/**
 * The `sizes` of one filmstrip frame: the rail is one height, so a frame's
 * width is that height times its aspect ratio (capped on phones).
 */
export function railSizes(width: number, height: number): string {
  const aspect = aspectOf(width, height);
  const phoneVw = Math.min(RAIL_PHONE_MAX_VW, Math.ceil(((RAIL_HEIGHT_PHONE * aspect) / 390) * 100));
  const desktopPx = Math.ceil(RAIL_HEIGHT_MAX * aspect);
  return `(max-width: 767px) ${phoneVw}vw, ${desktopPx}px`;
}

/** "03 / 28": both numbers padded to two digits (or more for a longer set). */
export function formatCounter(index: number, total: number): string {
  const digits = Math.max(2, String(total).length);
  const pad = (n: number) => String(n).padStart(digits, "0");
  const safeTotal = Math.max(0, total);
  const current = safeTotal === 0 ? 0 : clamp(index, 0, safeTotal - 1) + 1;
  return `${pad(current)} / ${pad(safeTotal)}`;
}

/** The polite announcement for the lightbox: "Photo 3 of 28: <alt>". */
export function photoAnnouncement(index: number, total: number, alt: string): string {
  const base = `Photo ${index + 1} of ${total}`;
  const text = alt.trim();
  return text ? `${base}: ${text}` : base;
}

export function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Where a key press moves a roving focus (a rail, the lightbox, a tab
 * list). Null for a key that does not move it.
 * `axis` "both" accepts the four arrows (a tab list that turns from
 * horizontal on phones to vertical on desktop).
 */
export function keyToIndex(
  key: string,
  index: number,
  count: number,
  { axis = "horizontal", wrap = false }: { axis?: "horizontal" | "vertical" | "both"; wrap?: boolean } = {},
): number | null {
  if (count <= 0) return null;
  const prevKeys = axis === "horizontal" ? ["ArrowLeft"] : axis === "vertical" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"];
  const nextKeys =
    axis === "horizontal" ? ["ArrowRight"] : axis === "vertical" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"];
  let target: number;
  if (prevKeys.includes(key)) target = index - 1;
  else if (nextKeys.includes(key)) target = index + 1;
  else if (key === "Home") return 0;
  else if (key === "End") return count - 1;
  else return null;
  if (wrap) return (target + count) % count;
  return clamp(target, 0, count - 1);
}

/** The lightbox renders a slide's picture only near the current one (current ± radius). */
export function isNearSlide(index: number, current: number, radius = 2): boolean {
  return Math.abs(index - current) <= radius;
}

/** Row height of the justified gallery grid, in CSS px (explorer.css uses the same values). */
export const GALLERY_ROW_PHONE = 170;
export const GALLERY_ROW_DESKTOP = 260;

/**
 * Justified rows in pure CSS: each item grows by its aspect ratio and starts
 * at the width it has at the row height (`--row-h`). The numbers are written
 * as custom properties so the stylesheet can switch the row height.
 */
export function justifiedItemStyle(width: number, height: number): { "--ar": string; "--grow": string } {
  const aspect = aspectOf(width, height);
  return { "--ar": aspect.toFixed(4), "--grow": (aspect * 100).toFixed(2) };
}

/** The `sizes` of one gallery item (its width at the row height, plus room to grow). */
export function gallerySizes(width: number, height: number): string {
  const aspect = aspectOf(width, height);
  const phonePx = Math.ceil(GALLERY_ROW_PHONE * aspect * 1.5);
  const desktopPx = Math.ceil(GALLERY_ROW_DESKTOP * aspect * 1.5);
  return `(max-width: 767px) min(100vw, ${phonePx}px), ${desktopPx}px`;
}

/** The fragment id of a project phase section: today's anchors, unchanged. */
export function phaseAnchor(slug: string): string {
  return `phase-${slug}`;
}

/** "1 photo", "28 photos". */
export function photoCountLabel(count: number): string {
  return `${count} ${count === 1 ? "photo" : "photos"}`;
}

/** The file a photo's no-JavaScript link opens. */
export function fileHref(src: string | { src: string }): string {
  return typeof src === "string" ? src : src.src;
}

export type LightboxImageStyle = { aspectRatio: string; width: string; height: "auto"; backgroundColor?: string };

/**
 * The lightbox picture's box: its own aspect ratio, as wide as the stage
 * allows, never wider than the file (no upscaling) and never taller than
 * the room left for it (`--lightbox-max-h`, set in explorer.css). Sized
 * before the file arrives, so the caption does not jump.
 */
export function lightboxImageStyle(width: number, height: number, color?: string): LightboxImageStyle {
  const aspect = aspectOf(width, height);
  const style: LightboxImageStyle = {
    aspectRatio: `${width} / ${height}`,
    width: `min(100%, ${Math.round(width)}px, calc(var(--lightbox-max-h) * ${aspect.toFixed(4)}))`,
    height: "auto",
  };
  if (color) style.backgroundColor = color;
  return style;
}
