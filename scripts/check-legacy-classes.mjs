#!/usr/bin/env node
/**
 * Legacy-class ratchet.
 *
 * The redesign retires the old palette names (Tailwind gray-*, gold,
 * surface), the hard-coded `[#F5F5F7]` background and the hand-written
 * utilities in src/app/globals.css (card-lift, glass, section-py, …). They
 * stay defined until their last use is gone. This script counts, per file
 * under src/, how many uses of each one are left, so that number can only go
 * down and a definition is deleted once its total reaches zero.
 *
 *   node scripts/check-legacy-classes.mjs                  # report every hit and the totals, exit 0
 *   node scripts/check-legacy-classes.mjs src/app/services # same, only for files under that path
 *   node scripts/check-legacy-classes.mjs --strict         # fail on any count above the baseline
 *   node scripts/check-legacy-classes.mjs --baseline       # write scripts/legacy-classes.baseline.json
 *
 * Strict mode is a ratchet, per file and per token: a file may not use a
 * token MORE often than the baseline records, and a file absent from the
 * baseline must not use any. Counts may drop freely; re-run --baseline after
 * a cleanup to lower the ceiling. --baseline refuses to write a baseline in
 * which the site-wide total of any token went up (moving code between files
 * is fine) — if an increase is deliberate, delete the baseline file first
 * and say why in the commit.
 *
 * What counts as a use:
 *   - a colour utility on a retired colour, with any variant or opacity:
 *     `text-gray-500`, `hover:border-gray-300`, `bg-gold/15`, `to-surface`;
 *   - a reference to the colour's theme variable: `var(--color-gray-900)`;
 *   - the arbitrary value `[#F5F5F7]` on any utility;
 *   - a retired utility written as a class, with or without a variant:
 *     `card-lift`, `section-py`;
 *   - a reference to `--ease-out-expo`, the old easing those utilities are
 *     built on (the redesign brings its own motion tokens).
 * In .ts/.tsx a mention in a comment counts too — reword the comment.
 *
 * What does not: the definitions themselves (`--color-gray-900: …`,
 * `@utility glass { … }`, `@keyframes logo-aura`), and prop values such as
 * `variant="gold"` or `tone="surface"`. In .css files comments are skipped
 * and a class counts only inside `@apply` or as a `.selector`. The two
 * utilities that are plain English words (`glass`, `pressable`) count only
 * where they are written in a class list, so photo alt text about a glass
 * shower door is left alone.
 *
 * The examples in this file are classes the site already uses: Tailwind
 * reads class names from src/ only (see the @import in globals.css), but if
 * that scoping is ever lost, a new class typed here would get its own rule
 * in the site's stylesheet.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const BASELINE = path.join(ROOT, "scripts", "legacy-classes.baseline.json");
const BASELINE_REL = "scripts/legacy-classes.baseline.json";

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);

/** Retired theme colours: every shade of Tailwind's gray, plus the old brand names. */
const COLORS = [
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => `gray-${shade}`),
  "gold",
  "gold-dark",
  "surface",
  "surface-light",
];
/** The surface colour typed as an arbitrary value instead of `bg-surface`. */
const ARBITRARY_SURFACE = "[#F5F5F7]";
/** Hand-written utilities in src/app/globals.css that the redesign replaces. */
const UTILITIES = [
  "card-lift",
  "card-lift-hover",
  "card-lift-hover-subtle",
  "animate-hero-in",
  "section-py",
  "text-gradient",
  "text-gold-gradient",
  "glass",
  "word-mask",
  "word-mask-inner",
  "animate-underline-in",
  "logo-aura",
  "animate-marquee",
  "animate-marquee-reverse",
  "marquee-pausable",
  "pulse-emergency",
  "pressable",
];
/** Theme variables that go with them: the old easing the utilities above are built on. */
const VARIABLES = ["--ease-out-expo"];

/**
 * Every tracked token, in the order totals are printed and baselines are
 * written. A token added here starts above the baseline (which has no count
 * for it), so delete the baseline file and regenerate it in the same commit.
 */
const TOKENS = [...COLORS, ARBITRARY_SURFACE, ...UTILITIES, ...VARIABLES];

// Every utility root that takes a theme colour in Tailwind 4.1 (read from the
// design system's class list): `bg-`, `border-x-`, `ring-offset-`, `mask-b-from-`, …
const COLOR_ROOT =
  "(?:accent|bg|border(?:-[bselrtxy])?|caret|decoration|divide|drop-shadow|fill|from|inset-ring|inset-shadow" +
  "|mask-(?:[blrtxy]|conic|linear|radial)-(?:from|to)|outline|placeholder|ring(?:-offset)?|shadow|stroke" +
  "|text(?:-shadow)?|to|via)";

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const oneOf = (names) => names.map(escapeRe).join("|");

// A name starts and ends on a class boundary: `text-gold` is not a use inside
// `text-gold-gradient`, `my-text-gold` or `/images/text-gold.png`.
const BEFORE = "(?<![\\w/-])";
const AFTER = "(?![\\w-])";
const COLOR_UTILITY = new RegExp(`${BEFORE}${COLOR_ROOT}-(${oneOf(COLORS)})${AFTER}`, "g");
const UTILITY = new RegExp(`${BEFORE}(${oneOf(UTILITIES)})${AFTER}`, "g");
// A colour's theme variable anywhere except where it is being declared (`--color-gray-900: …`).
const VARIABLE = new RegExp(
  `(?<![\\w-])(?:--color-(${oneOf(COLORS)})|(${oneOf(VARIABLES)}))${AFTER}(?!["']?\\s*:)`,
  "g",
);
const ARBITRARY = new RegExp(escapeRe(ARBITRARY_SURFACE), "gi");

/** Utilities that are also ordinary words, so prose has to be told apart from a class list. */
const PLAIN_WORDS = new Set(UTILITIES.filter((name) => !name.includes("-")));
const CLASS_MARKER = /class(?:name)?\s*[=:]|\b(?:cn|clsx|twMerge|twJoin|cva)\s*\(/i;
const STOPWORD = /(?:^|\s)(?:a|an|and|are|for|in|is|of|on|or|our|the|to|we|with|your)(?=\s|$)/;

/** `rounded-xl`, `hover:text-white`, `aspect-[4/3]`, `-mt-4`, `flex` — but not `Tiled`, `niche.` or `door,`. */
function tailwindShaped(word) {
  const plain = word.replace(/\[[^\]]*\]|\([^)]*\)/g, "");
  return /^[a-z0-9:/_.%!*@-]*$/.test(plain) && !/[.:]$/.test(plain);
}

/**
 * Is the plain word at line[index, index + length) written in a class list?
 * Looks at the quoted string around it (or the whole line, for a continuation
 * line of a multi-line string): every word must be Tailwind-shaped, with no
 * English stopword, and either the line names a class attribute / helper, or
 * the word carries a variant, or it sits among at least two other hyphenated
 * or variant utilities.
 */
function inClassList(line, index, length) {
  const before = line.slice(0, index);
  const open = Math.max(before.lastIndexOf('"'), before.lastIndexOf("'"), before.lastIndexOf("`"));
  let start = 0;
  let end = line.length;
  if (open !== -1) {
    start = open + 1;
    const close = line.indexOf(line[open], index + length);
    if (close !== -1) end = close;
  } else {
    const close = line.slice(index + length).search(/["'`]/);
    if (close !== -1) end = index + length + close;
  }
  const segment = line.slice(start, end).replace(/\$\{[^}]*\}/g, " ");
  const words = segment.split(/\s+/).filter(Boolean);
  if (!words.every(tailwindShaped) || STOPWORD.test(segment)) return false;
  if (CLASS_MARKER.test(line) || line[index - 1] === ":") return true;
  return words.filter((word) => /[-:]/.test(word)).length >= 2;
}

/** Blank out the comment text on a CSS line (comments may span lines), keeping every column where it was. */
function withoutCssComments(line, open) {
  let out = "";
  let pos = 0;
  while (pos < line.length) {
    const next = open ? line.indexOf("*/", pos) : line.indexOf("/*", pos);
    const stop = next === -1 ? line.length : open ? next + 2 : next;
    out += open ? " ".repeat(stop - pos) : line.slice(pos, stop);
    if (next === -1) break;
    // Step over the opening `/*` so that `/*/` is not read as a whole comment.
    if (!open) out += "  ";
    pos = open ? stop : stop + 2;
    open = !open;
  }
  return { line: out, open };
}

/** The stretches of a CSS line that belong to an `@apply …;` statement (which may span lines). */
function applyRanges(line, open) {
  const ranges = [];
  let pos = 0;
  while (pos <= line.length) {
    if (!open) {
      const at = line.indexOf("@apply", pos);
      if (at === -1) break;
      pos = at + "@apply".length;
      open = true;
    }
    const rest = line.slice(pos).search(/[;}]/);
    if (rest === -1) {
      ranges.push([pos, line.length]);
      break;
    }
    ranges.push([pos, pos + rest]);
    pos += rest + 1;
    open = false;
  }
  return { ranges, open };
}

/** Every legacy use in one file's text, in reading order: [{ line, token, match }]. */
function scanText(text, ext) {
  const css = ext === ".css";
  const hits = [];
  let commentOpen = false;
  let applyOpen = false;

  text.split("\n").forEach((raw, i) => {
    let line = raw;
    let ranges = [];
    if (css) {
      ({ line, open: commentOpen } = withoutCssComments(raw, commentOpen));
      ({ ranges, open: applyOpen } = applyRanges(line, applyOpen));
    }
    // In CSS a class is used only inside @apply or as a `.selector`; the rest
    // is property names, keyframe names and the definitions themselves.
    const cssClassUse = (index) =>
      line[index - 1] === "." || ranges.some(([from, to]) => index >= from && index < to);

    const found = [];
    for (const m of line.matchAll(COLOR_UTILITY)) {
      if (css && !cssClassUse(m.index)) continue;
      found.push({ index: m.index, token: m[1], match: m[0] });
    }
    for (const m of line.matchAll(UTILITY)) {
      const asClass = css ? cssClassUse(m.index) : !PLAIN_WORDS.has(m[1]) || inClassList(line, m.index, m[0].length);
      if (asClass) found.push({ index: m.index, token: m[1], match: m[0] });
    }
    for (const m of line.matchAll(ARBITRARY)) found.push({ index: m.index, token: ARBITRARY_SURFACE, match: m[0] });
    for (const m of line.matchAll(VARIABLE)) found.push({ index: m.index, token: m[1] ?? m[2], match: m[0] });

    found.sort((a, b) => a.index - b.index);
    for (const { token, match } of found) hits.push({ line: i + 1, token, match });
  });

  return hits;
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SOURCE_EXT.has(path.extname(entry.name).toLowerCase()) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

const toPosix = (p) => p.split(path.sep).join("/");

/** { file: { token: count } } with tokens in TOKENS order; files without a hit are left out. */
function countPerFile(hitsByFile) {
  const perFile = {};
  for (const [rel, hits] of Object.entries(hitsByFile)) {
    if (hits.length === 0) continue;
    const counts = {};
    for (const token of TOKENS) {
      const n = hits.filter((hit) => hit.token === token).length;
      if (n > 0) counts[token] = n;
    }
    perFile[rel] = counts;
  }
  return perFile;
}

function totalsOf(perFile) {
  const totals = Object.fromEntries(TOKENS.map((token) => [token, 0]));
  for (const counts of Object.values(perFile)) {
    for (const [token, n] of Object.entries(counts)) {
      if (token in totals) totals[token] += n;
    }
  }
  return totals;
}

const sum = (totals) => Object.values(totals).reduce((a, b) => a + b, 0);

function printTotals(totals, baselineTotals, tokens = TOKENS) {
  const width = Math.max(...TOKENS.map((token) => token.length));
  for (const token of tokens) {
    const was = baselineTotals?.[token];
    const note = was !== undefined && was !== totals[token] ? `  (baseline ${was})` : "";
    console.log(`  ${token.padEnd(width)}  ${String(totals[token]).padStart(4)}${note}`);
  }
}

/** One file per line, so two branches that clean up different files rarely collide. */
function serializeBaseline(perFile) {
  const rows = Object.keys(perFile)
    .sort()
    .map((rel) => {
      const counts = Object.entries(perFile[rel])
        .map(([token, n]) => `${JSON.stringify(token)}: ${n}`)
        .join(", ");
      return `  ${JSON.stringify(rel)}: { ${counts} }`;
    });
  return rows.length ? `{\n${rows.join(",\n")}\n}\n` : "{}\n";
}

/** The committed baseline, or null when there is none yet. One that cannot be read as a baseline stops the run. */
async function readBaseline() {
  let raw;
  try {
    raw = await readFile(BASELINE, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    console.error(
      `legacy-classes: ${BASELINE_REL} is not a { file: { token: count } } object (an unresolved merge conflict?). Fix it by hand, then re-run --baseline.`,
    );
    process.exit(1);
  }
  return parsed;
}

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter((arg) => arg.startsWith("--"));
  const unknown = flags.filter((flag) => flag !== "--strict" && flag !== "--baseline");
  if (unknown.length || flags.length > 1) {
    console.error(`legacy-classes: expected at most one of --strict or --baseline, got ${flags.join(" ")}`);
    process.exit(2);
  }
  const mode = flags[0] === "--strict" ? "strict" : flags[0] === "--baseline" ? "baseline" : "report";
  const only = args
    .filter((arg) => !arg.startsWith("--"))
    .map((arg) => toPosix(path.relative(ROOT, path.resolve(arg))).replace(/\/+$/, ""));
  if (only.length && mode !== "report") {
    console.error("legacy-classes: a path filter only works in report mode; --strict and --baseline cover all of src/");
    process.exit(2);
  }

  const files = (await walk(SRC))
    .map((file) => toPosix(path.relative(ROOT, file)))
    .filter((rel) => only.length === 0 || only.some((prefix) => rel === prefix || rel.startsWith(prefix + "/")))
    .sort();
  if (only.length && files.length === 0) {
    console.error(`legacy-classes: no source file under ${only.join(", ")} (paths are relative to the current directory)`);
    process.exit(2);
  }

  const hitsByFile = {};
  for (const rel of files) {
    const text = await readFile(path.join(ROOT, rel), "utf8");
    hitsByFile[rel] = scanText(text, path.extname(rel).toLowerCase());
  }

  const perFile = countPerFile(hitsByFile);
  const totals = totalsOf(perFile);
  const total = sum(totals);
  const fileCount = Object.keys(perFile).length;

  if (mode === "report") {
    for (const [rel, hits] of Object.entries(hitsByFile)) {
      const byLine = new Map();
      for (const hit of hits) byLine.set(hit.line, [...(byLine.get(hit.line) ?? []), hit.match]);
      for (const [line, matches] of byLine) console.log(`${rel}:${line}: ${matches.join(", ")}`);
    }
    // The full report lists every token, so a zero shows what is ready to delete;
    // a filtered one only lists what is left under that path.
    if (only.length) {
      console.log(`legacy-classes: totals under ${only.join(", ")}`);
      printTotals(totals, undefined, TOKENS.filter((token) => totals[token] > 0));
    } else {
      console.log("legacy-classes: totals");
      printTotals(totals);
    }
    console.log(`legacy-classes: ${total} legacy use(s) in ${fileCount} file(s)`);
    return;
  }

  const baseline = await readBaseline();
  const baselineTotals = baseline ? totalsOf(baseline) : null;

  if (mode === "baseline") {
    const raised = baselineTotals ? TOKENS.filter((token) => totals[token] > baselineTotals[token]) : [];
    if (raised.length) {
      console.error("legacy-classes: not writing the baseline — these totals went UP, and the ratchet only goes down:");
      for (const token of raised) console.error(`  ${token}: ${baselineTotals[token]} -> ${totals[token]}`);
      console.error(
        `Run without a flag to list every use and remove the new ones. If the increase is deliberate, delete ${BASELINE_REL}, re-run --baseline and say why in the commit.`,
      );
      process.exit(1);
    }
    await writeFile(BASELINE, serializeBaseline(perFile));
    printTotals(totals, baselineTotals);
    console.log(`legacy-classes: baseline written (${total} legacy use(s) in ${fileCount} file(s))`);
    return;
  }

  // strict: compare against the baseline ratchet, per file and per token
  const failures = [];
  for (const [rel, counts] of Object.entries(perFile)) {
    for (const [token, count] of Object.entries(counts)) {
      const ceiling = baseline?.[rel]?.[token] ?? 0;
      if (count > ceiling) failures.push({ rel, token, count, ceiling });
    }
  }
  if (failures.length) {
    console.error("legacy-classes: legacy styling may only be removed, never added. Above the baseline:");
    for (const { rel, token, count, ceiling } of failures) {
      const lines = [...new Set(hitsByFile[rel].filter((hit) => hit.token === token).map((hit) => hit.line))];
      console.error(`  ${rel}: ${token} used ${count}x, baseline allows ${ceiling} (line ${lines.join(", ")})`);
    }
    if (!baseline) console.error(`(${BASELINE_REL} is missing, so every use counts as new.)`);
    console.error(
      "Use the redesign's tokens and components instead. If code only moved between files, re-run with --baseline (site-wide totals may not rise).",
    );
    process.exit(1);
  }
  printTotals(totals, baselineTotals);
  const slack = sum(baselineTotals ?? totals) - total;
  console.log(
    `legacy-classes: ok (${total} legacy use(s) in ${fileCount} file(s), none above the baseline` +
      (slack > 0 ? `; ${slack} below it — run --baseline to lower the ceiling)` : ")"),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
