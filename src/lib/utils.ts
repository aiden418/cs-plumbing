import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scale. Left alone it takes every
 * unknown `text-*` for a colour, so `text-display-lg` next to `text-fg` loses
 * one of the two, and it does not see `rounded-frame`, `shadow-float`,
 * `ease-enter` or `py-section` as radius, shadow, easing or spacing at all,
 * so a later override never replaces them.
 *
 * These lists mirror the tokens in src/app/globals.css. tests/cn-merge.test.ts
 * reads that file and fails when a token is added there and not here.
 */
const twMerge = extendTailwindMerge<"display-width">({
  extend: {
    theme: {
      text: ["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "lead", "label"],
      radius: ["frame", "control", "chip"],
      shadow: ["float", "lift"],
      ease: ["enter", "exit", "move", "settle", "out-expo"],
      spacing: ["gutter", "section", "section-sm"],
      color: [
        // tone colours: what they resolve to depends on the section's data-tone
        "canvas",
        "raised",
        "fg",
        "body",
        "muted",
        "rule",
        "accent",
        "link",
        "focus",
        // palette
        "ink",
        "ink-700",
        "navy",
        "primary",
        "primary-dark",
        "primary-300",
        "brass",
        "brass-600",
        "brass-300",
        "bronze",
        "shell",
        "shell-200",
        "shell-300",
        "steel-50",
        "steel-100",
        "steel-200",
        "steel-300",
        "steel-400",
        "steel-500",
        "steel-600",
        "steel-700",
        "steel-800",
        "steel-900",
        "emergency",
        "emergency-dark",
        "emergency-300",
        "success",
        "success-ink",
      ],
    },
    classGroups: {
      // The headline widths are one choice: the last one given wins.
      "display-width": ["display-wide", "display-normal", "display-tight"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); // claim-ok: regex replacement tokens
}
