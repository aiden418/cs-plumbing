/**
 * Shared class lists for the forms kit. Controls are always white-surfaced
 * with ink text, whatever the section tone (forms on ink/navy sit in a white
 * panel, see FormPanel).
 *
 * Focus: the global `:focus-visible` rule draws a 2 px outline offset by 2 px.
 * Text controls replace it (same `outline` property, so there is only ever one
 * ring) with the blue border plus a 3 px ring at 20% blue that hugs the
 * control. Using `outline` rather than a box-shadow keeps the ring visible in
 * forced-colors mode.
 */

/** Base for Input, Select and Textarea. */
export const controlBase = [
  "block w-full min-w-0 rounded-control border border-steel-300 bg-white px-4",
  "font-sans text-base leading-6 text-ink placeholder:text-steel-500",
  "transition-[border-color,outline-color] duration-150 ease-enter",
  "hover:border-steel-500",
  "focus:border-primary focus:outline-3 focus:outline-offset-0 focus:outline-primary/20",
  "aria-[invalid=true]:border-emergency aria-[invalid=true]:hover:border-emergency-dark aria-[invalid=true]:focus:outline-emergency/20",
  "disabled:cursor-not-allowed disabled:border-dashed disabled:border-steel-300 disabled:bg-steel-50 disabled:text-steel-500",
].join(" ");

/** 48 px single-line height. */
export const controlHeight = "h-12";

/** Field label: 15 px Inter 600 in the tone's strong text color. */
export const labelClass = "block text-sm font-semibold leading-snug text-fg";

/** Hint: 14 px secondary text. */
export const hintClass = "text-[0.875rem] leading-snug text-muted";

/** The quiet "Optional" tag beside a label. */
export const optionalTagClass =
  "ml-2 align-baseline text-[0.875rem] font-normal text-muted";
