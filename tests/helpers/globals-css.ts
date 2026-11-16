/**
 * Reads the design tokens straight out of src/app/globals.css, so the tests
 * check the stylesheet that ships and not a copy of it.
 */

import { readFileSync } from "node:fs";

export const GLOBALS_CSS = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");

/** The stylesheet without comments. */
export const CSS = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");

export type Rule = { selector: string; body: string; context: string[] };

/**
 * Every `selector { ... }` block, with the at-rules it sits in. Nested blocks
 * are listed too (their `body` then holds only their own text).
 */
export function rules(css: string = CSS): Rule[] {
  const out: Rule[] = [];
  const walk = (text: string, context: string[]) => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf("{", i);
      if (open === -1) return;
      // the prelude starts after the previous `;` or `}`
      let start = open - 1;
      while (start >= i && text[start] !== ";" && text[start] !== "}") start--;
      const selector = text.slice(start + 1, open).trim();
      let depth = 1;
      let close = open + 1;
      for (; close < text.length && depth > 0; close++) {
        if (text[close] === "{") depth++;
        else if (text[close] === "}") depth--;
      }
      const body = text.slice(open + 1, close - 1);
      out.push({ selector, body, context });
      if (body.includes("{")) walk(body, [...context, selector]);
      i = close;
    }
  };
  walk(css, []);
  return out;
}

/** `name: value` pairs written directly in a block (not in blocks nested inside it). */
export function declarations(body: string): Map<string, string> {
  let flat = "";
  let depth = 0;
  for (const char of body) {
    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      // a nested block ends a declaration just like `;` does
      if (depth === 0) flat += ";";
    } else if (depth === 0) flat += char;
  }
  // drop the preludes of nested blocks, which are left without a value
  const map = new Map<string, string>();
  for (const part of flat.split(";")) {
    const colon = part.indexOf(":");
    if (colon === -1) continue;
    const name = part.slice(0, colon).trim();
    const value = part.slice(colon + 1).trim().replace(/\s+/g, " ");
    if (/^[-a-z][-\w]*$/i.test(name) && value) map.set(name, value);
  }
  return map;
}

const ALL_RULES = rules();

/** Custom properties declared in the `@theme` blocks whose prelude matches (e.g. /static/ or /inline/). */
export function themeTokens(kind: RegExp = /./): Map<string, string> {
  const map = new Map<string, string>();
  for (const rule of ALL_RULES) {
    if (!rule.selector.startsWith("@theme") || !kind.test(rule.selector)) continue;
    for (const [name, value] of declarations(rule.body)) map.set(name, value);
  }
  return map;
}

/** The first block with exactly this selector, optionally inside a given at-rule. */
export function block(selector: string, within?: RegExp): Map<string, string> {
  const normalise = (s: string) => s.replace(/\s+/g, " ").trim();
  const found = ALL_RULES.find((r) => normalise(r.selector) === normalise(selector) && (within ? r.context.some((c) => within.test(c)) : true));
  if (!found) throw new Error(`No "${selector}" block${within ? ` inside ${within}` : ""} in globals.css`);
  return declarations(found.body);
}

/** All blocks whose selector list contains `selector`, merged in source order. */
export function cascade(selector: string, within?: (context: string[]) => boolean): Map<string, string> {
  const map = new Map<string, string>();
  for (const rule of ALL_RULES) {
    if (within && !within(rule.context)) continue;
    const list = rule.selector.split(",").map((s) => s.trim());
    if (!list.includes(selector)) continue;
    for (const [name, value] of declarations(rule.body)) map.set(name, value);
  }
  return map;
}

export { ALL_RULES };

// ---- colour maths -------------------------------------------------------------------------------

export type Rgba = { r: number; g: number; b: number; a: number };

const THEME = themeTokens();

/** Resolves a token value (hex, rgb(r g b / a), or var(--color-x)) to a colour. */
export function colour(value: string): Rgba {
  const v = value.trim();
  const viaVar = v.match(/^var\((--[\w-]+)\)$/);
  if (viaVar) {
    const target = THEME.get(viaVar[1]);
    if (!target) throw new Error(`${viaVar[1]} is not a theme token`);
    return colour(target);
  }
  const hex = v.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgb = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/i);
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha };
  }
  throw new Error(`Cannot read the colour "${value}"`);
}

/** A translucent colour as it looks on an opaque background. */
export function over(top: Rgba, background: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, background.r), g: mix(top.g, background.g), b: mix(top.b, background.b), a: 1 };
}

/** WCAG 2 relative luminance. */
export function luminance({ r, g, b }: Rgba): number {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG 2 contrast ratio of text on an opaque background (translucent text is composited first). */
export function contrast(text: Rgba, background: Rgba): number {
  const a = luminance(text.a < 1 ? over(text, background) : text);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
