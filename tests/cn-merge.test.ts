import { test } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../src/lib/utils";
import { themeTokens } from "./helpers/globals-css";

// cn() merges conflicting Tailwind classes (the last one wins). tailwind-merge
// has to be told about the design-system tokens, or it mistakes the new font
// sizes for colours and silently drops one of `text-display-lg text-fg`.

test("a display size and a tone colour survive together, in either order", () => {
  assert.equal(cn("text-display-lg", "text-fg"), "text-display-lg text-fg");
  assert.equal(cn("text-fg", "text-display-lg"), "text-fg text-display-lg");
  assert.equal(cn("text-lead text-muted"), "text-lead text-muted");
  assert.equal(cn("text-muted text-lead"), "text-muted text-lead");
  assert.equal(cn("text-label", "text-accent"), "text-label text-accent");
  assert.equal(cn("text-link", "text-display-sm"), "text-link text-display-sm");
  // and with the stock scale and palette on the other side
  assert.equal(cn("text-display-md", "text-white"), "text-display-md text-white");
  assert.equal(cn("text-ink", "text-sm"), "text-ink text-sm");
});

test("two sizes conflict: the last one wins", () => {
  assert.equal(cn("text-display-lg", "text-display-md"), "text-display-md");
  assert.equal(cn("text-display-md", "text-display-lg"), "text-display-lg");
  assert.equal(cn("text-lead", "text-sm"), "text-sm");
  assert.equal(cn("text-base", "text-lead"), "text-lead");
  assert.equal(cn("text-display-xl text-fg", "text-display-sm"), "text-fg text-display-sm");
});

test("two colours conflict: the last one wins", () => {
  assert.equal(cn("text-fg", "text-muted"), "text-muted");
  assert.equal(cn("text-muted", "text-fg"), "text-fg");
  assert.equal(cn("text-brass", "text-accent"), "text-accent");
  assert.equal(cn("bg-canvas", "bg-raised"), "bg-raised");
  assert.equal(cn("bg-shell", "bg-ink"), "bg-ink");
  assert.equal(cn("border-rule", "border-steel-300"), "border-steel-300");
  // a border width is not a border colour
  assert.equal(cn("border", "border-rule"), "border border-rule");
  assert.equal(cn("text-display-lg text-fg", "text-link"), "text-display-lg text-link");
});

test("rounded-frame and rounded-control conflict", () => {
  assert.equal(cn("rounded-frame", "rounded-control"), "rounded-control");
  assert.equal(cn("rounded-control", "rounded-frame"), "rounded-frame");
  assert.equal(cn("rounded-xl", "rounded-chip"), "rounded-chip");
  assert.equal(cn("rounded-frame", "rounded-none"), "rounded-none");
});

test("shadows, easings and spacing from the design system replace the stock ones", () => {
  assert.equal(cn("shadow-md", "shadow-float"), "shadow-float");
  assert.equal(cn("shadow-float", "shadow-lift"), "shadow-lift");
  assert.equal(cn("shadow-lift", "shadow-none"), "shadow-none");
  // a shadow and a shadow colour are different things
  assert.equal(cn("shadow-float", "shadow-ink"), "shadow-float shadow-ink");
  assert.equal(cn("ease-in-out", "ease-enter"), "ease-enter");
  assert.equal(cn("ease-enter", "ease-exit"), "ease-exit");
  assert.equal(cn("ease-settle", "ease-linear"), "ease-linear");
  assert.equal(cn("py-8", "py-section"), "py-section");
  assert.equal(cn("py-section", "py-section-sm"), "py-section-sm");
  assert.equal(cn("px-6 lg:px-8", "px-gutter"), "lg:px-8 px-gutter");
  // the shorthand replaces the sides, a side refines the shorthand
  assert.equal(cn("px-gutter", "p-4"), "p-4");
  assert.equal(cn("p-4", "px-gutter"), "p-4 px-gutter");
});

test("the headline widths are one choice, and variants are kept apart", () => {
  assert.equal(cn("display-normal", "display-tight"), "display-tight");
  assert.equal(cn("display-wide", "display-normal"), "display-normal");
  assert.equal(cn("display-wide text-display-xl text-fg"), "display-wide text-display-xl text-fg");
  assert.equal(cn("text-display-md", "nav:text-display-lg"), "text-display-md nav:text-display-lg");
  assert.equal(cn("nav:text-display-md", "nav:text-display-lg"), "nav:text-display-lg");
  assert.equal(cn("hocus:text-link", "hocus:text-fg"), "hocus:text-fg");
});

test("every token in globals.css is known to cn()", () => {
  const tokens = [...themeTokens().keys()];
  const names = (prefix: string) =>
    tokens
      .filter((t) => t.startsWith(prefix) && !t.slice(prefix.length).includes("--"))
      .map((t) => t.slice(prefix.length));

  const sizes = names("--text-");
  const colours = names("--color-");
  const radii = names("--radius-");
  const shadows = names("--shadow-");
  const easings = names("--ease-");
  const spacings = names("--spacing-");
  // guard against the parser quietly finding nothing
  assert.ok(sizes.includes("display-lg") && sizes.includes("label"), "font sizes were read from globals.css");
  assert.ok(colours.includes("ink") && colours.includes("canvas") && colours.includes("steel-500"), "colours were read from globals.css");
  assert.ok(radii.includes("frame") && shadows.includes("float") && easings.includes("enter") && spacings.includes("gutter"));

  for (const size of sizes) {
    assert.equal(cn(`text-${size}`, "text-fg"), `text-${size} text-fg`, `text-${size} is a font size, not a colour`);
    assert.equal(cn("text-fg", `text-${size}`), `text-fg text-${size}`, `text-${size} is a font size, not a colour`);
    assert.equal(cn(`text-${size}`, "text-base"), "text-base", `text-${size} gives way to another font size`);
  }
  for (const name of colours) {
    assert.equal(cn(`text-${name}`, "text-white"), "text-white", `text-${name} is a colour`);
    assert.equal(cn("text-display-lg", `text-${name}`), `text-display-lg text-${name}`, `text-${name} is a colour, not a font size`);
    assert.equal(cn(`bg-${name}`, "bg-white"), "bg-white", `bg-${name} is a colour`);
  }
  for (const radius of radii) assert.equal(cn(`rounded-${radius}`, "rounded-none"), "rounded-none", `rounded-${radius} is a radius`);
  for (const shadow of shadows) assert.equal(cn(`shadow-${shadow}`, "shadow-none"), "shadow-none", `shadow-${shadow} is a shadow`);
  for (const ease of easings) assert.equal(cn(`ease-${ease}`, "ease-linear"), "ease-linear", `ease-${ease} is an easing`);
  for (const space of spacings) assert.equal(cn(`p-${space}`, "p-4"), "p-4", `p-${space} is a spacing step`);
});
