#!/usr/bin/env node
/**
 * Measures the fallback metrics for the display face (Archivo), so headlines
 * keep their line breaks when the web font arrives.
 *
 * Nothing here is estimated. The script loads the Archivo file from the
 * production build into headless Chrome, sets every real H1 and H2 of the
 * site (read from the prerendered HTML) in Archivo and in the local fonts
 * the fallback can resolve to, and compares advance widths and line metrics.
 *
 * It prints
 *   1. the `@font-face` for "Archivo Fallback" tuned to the default headline
 *      (weight 700, width 108%), and what is left over when that one rule
 *      has to stand in for the other widths and weights;
 *   2. the whole family that goes in src/app/globals.css: the same rule plus
 *      one per width (and for the heavy weight), selected by the browser
 *      through `font-stretch` / `font-weight` ranges;
 *   3. both built in the browser and measured again.
 *
 *   npx next build
 *   node scripts/fonts/measure-fallback.mjs           # the report
 *   node scripts/fonts/measure-fallback.mjs --check   # does globals.css still match? (exit 1 if not)
 *   node scripts/fonts/measure-fallback.mjs --json
 *
 * Re-run after changing the display face, its axes, the width utilities in
 * globals.css, or a lot of headline copy, and paste the family over the old
 * one.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { withChrome } from "./chrome.mjs";
import { ROOT, headings, latinFace } from "./build-output.mjs";

const JSON_OUT = process.argv.includes("--json");

/** What h1 and h2 get by default (globals.css). */
const DEFAULT = { weight: 700, width: 108 };

/**
 * The family: one rule per band, each tuned at the value the design system
 * actually uses inside it. Bands touch without overlapping, so every
 * `font-stretch` / `font-weight` an element can ask for selects exactly one.
 *   94  display-tight      100  font-display on its own   104  display-normal
 *   108 h1, h2, label-tech (112% at weight 600 lands within 1.5% of it)
 *   120 display-wide       800  font-black (the old page headers)
 */
const WIDTH_BANDS = [
  { range: "50% 97%", tune: 94 },
  { range: "97.01% 102%", tune: 100 },
  { range: "102.01% 106%", tune: 104 },
  { range: "106.01% 114%", tune: 108 },
  { range: "114.01% 200%", tune: 120 },
];
const WEIGHT_BANDS = [
  { range: "100 749", tune: 700 },
  { range: "750 900", tune: 800 },
];

/** Every combination the design system sets type in, for the final check. */
const IN_USE = [
  { use: "h1, h2 (default)", weight: 700, width: 108 },
  { use: "display-normal", weight: 700, width: 104 },
  { use: "display-tight", weight: 700, width: 94 },
  { use: "display-wide", weight: 700, width: 120 },
  { use: "font-display alone", weight: 700, width: 100 },
  { use: "label-tech", weight: 600, width: 112 },
  { use: "font-black headline", weight: 800, width: 108 },
  { use: "font-black + display-normal", weight: 800, width: 104 },
  { use: "font-black + display-tight", weight: 800, width: 94 },
  { use: "font-black + display-wide", weight: 800, width: 120 },
];

/**
 * Local fonts the fallback may resolve to, in the order of the `src` list.
 * The first one installed wins in the browser, so the rules are tuned to the
 * first one found here (Arial Bold on macOS, Windows and iOS).
 */
const LOCAL_FONTS = [
  { name: "Arial Bold", src: ["Arial Bold", "Arial-BoldMT"] },
  { name: "Helvetica Neue Bold", src: ["Helvetica Neue Bold", "HelveticaNeue-Bold"] },
  { name: "Roboto Bold", src: ["Roboto Bold", "Roboto-Bold"] },
];
const FALLBACK_SRC = LOCAL_FONTS.flatMap((f) => f.src)
  .map((name) => `local("${name}")`)
  .join(", ");

const pct = (fraction, digits = 2) => (Math.abs(fraction) < 0.00005 ? "0%" : `${(fraction * 100).toFixed(digits)}%`);
const signed = (fraction) => `${fraction >= 0 ? "+" : ""}${(fraction * 100).toFixed(2)}%`;
const sum = (list) => list.reduce((a, b) => a + b, 0);
const spread = (list) => {
  const sorted = [...list].sort((a, b) => a - b);
  const at = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  return { min: sorted[0], p05: at(0.05), p95: at(0.95), max: sorted.at(-1), meanAbs: sum(list.map(Math.abs)) / list.length };
};

const face = latinFace("Archivo");
const { routes, h1, h2 } = headings();
const strings = [...new Set([...h1, ...h2].map((h) => h.text))];
const h1Strings = new Set(h1.map((h) => h.text));

const combos = new Map();
for (const c of [DEFAULT, ...IN_USE, ...WEIGHT_BANDS.flatMap((w) => WIDTH_BANDS.map((s) => ({ weight: w.tune, width: s.tune })))]) {
  combos.set(`${c.weight}/${c.width}`, { weight: c.weight, width: c.width });
}

/** Runs in the page: loads the fonts and leaves measuring helpers on `window.__m`. */
function inPage(input) {
  const { fontData, weightRange, stretchRange, localFonts, strings } = input;
  const SIZE = 200; // px for advance widths
  const METRIC_SIZE = 1000; // px for ascent/descent, so rounding is 0.1% of an em

  const addStyle = (css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
  };
  addStyle(
    `@font-face { font-family: "M Archivo"; src: url(data:font/woff2;base64,${fontData}) format("woff2"); font-weight: ${weightRange}; font-stretch: ${stretchRange}; }\n` +
      localFonts
        .map((f, i) => `@font-face { font-family: "M Local ${i}"; src: ${f.src.map((n) => `local("${n}")`).join(", ")}; font-weight: 100 900; font-stretch: 50% 200%; }`)
        .join("\n")
  );

  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;font-size:${SIZE}px;letter-spacing:0;font-kerning:normal;font-synthesis:none;`;
  document.body.append(probe);
  /** Advance width of every headline, in em. */
  const widths = (family, weight, stretch) => {
    probe.style.fontFamily = `"${family}"`;
    probe.style.fontWeight = String(weight);
    probe.style.fontStretch = `${stretch}%`;
    return strings.map((s) => {
      probe.textContent = s;
      return probe.getBoundingClientRect().width / SIZE;
    });
  };

  // Ascent and descent are the content area of an inline box around a
  // baseline marker; the line gap is what `line-height: normal` adds.
  const line = document.createElement("div");
  line.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;font-size:${METRIC_SIZE}px;line-height:normal;font-synthesis:none;`;
  line.innerHTML = `<span><i style="display:inline-block;width:0;height:0;vertical-align:baseline"></i>Hxgp</span>`;
  document.body.append(line);
  /** Line metrics in em. */
  const lineMetrics = (family, weight, stretch) => {
    line.style.fontFamily = `"${family}"`;
    line.style.fontWeight = String(weight);
    line.style.fontStretch = `${stretch}%`;
    const box = line.getBoundingClientRect();
    const inline = line.firstElementChild.getBoundingClientRect();
    const baseline = line.querySelector("i").getBoundingClientRect().top;
    const ascent = (baseline - inline.top) / METRIC_SIZE;
    const descent = (inline.bottom - baseline) / METRIC_SIZE;
    return { ascent, descent, lineGap: box.height / METRIC_SIZE - ascent - descent, lineHeight: box.height / METRIC_SIZE };
  };

  window.__m = {
    widths,
    lineMetrics,
    addStyle,
    both: (family, weight, stretch) => ({ widths: widths(family, weight, stretch), line: lineMetrics(family, weight, stretch) }),
  };

  return (async () => {
    await Promise.allSettled([...document.fonts].map((f) => f.load()));
    const status = Object.fromEntries([...document.fonts].map((f) => [f.family.replace(/"/g, ""), f.status]));
    if (status["M Archivo"] !== "loaded") throw new Error("Archivo did not load in the measuring page.");
    return localFonts.map((f, i) => status[`M Local ${i}`] === "loaded");
  })();
}

const result = await withChrome(async (browser) => {
  const page = await browser.newPage();
  const call = (expression) => page.evaluate(expression);
  const installedFlags = await call(
    `(${inPage.toString()})(${JSON.stringify({
      fontData: readFileSync(face.file).toString("base64"),
      weightRange: face.weight,
      stretchRange: face.stretch,
      localFonts: LOCAL_FONTS,
      strings,
    })})`
  );
  const locals = LOCAL_FONTS.map((f, i) => ({ ...f, installed: installedFlags[i], family: `M Local ${i}` }));
  const installed = locals.filter((l) => l.installed);
  if (!installed.length) throw new Error("None of the fallback's local fonts is installed on this machine.");

  const archivo = {};
  for (const [key, c] of combos) archivo[key] = await call(`window.__m.both("M Archivo", ${c.weight}, ${c.width})`);
  for (const local of installed) Object.assign(local, await call(`window.__m.both(${JSON.stringify(local.family)}, 700, 100)`));

  /** size-adjust and overrides that make `local` stand in for Archivo at one weight and width. */
  const tune = (local, key) => {
    const target = archivo[key];
    const sizeAdjust = sum(target.widths) / sum(local.widths);
    // Overrides are fractions of the size-adjusted em, so divide to land on Archivo's own metrics.
    return { sizeAdjust: pct(sizeAdjust), ascent: pct(target.line.ascent / sizeAdjust), descent: pct(target.line.descent / sizeAdjust), lineGap: pct(target.line.lineGap / sizeAdjust) };
  };
  const compare = (measured, key) => {
    const target = archivo[key];
    const each = target.widths.map((w, i) => (measured.widths[i] - w) / w);
    return { total: (sum(measured.widths) - sum(target.widths)) / sum(target.widths), each: spread(each), errors: each, line: measured.line, archivoLine: target.line };
  };
  const cssRule = (family, rule, weightRange, stretchRange) =>
    `@font-face {\n  font-family: "${family}";\n  src: ${FALLBACK_SRC};\n  font-weight: ${weightRange};\n  font-stretch: ${stretchRange};\n  size-adjust: ${rule.sizeAdjust};\n  ascent-override: ${rule.ascent};\n  descent-override: ${rule.descent};\n  line-gap-override: ${rule.lineGap};\n}`;

  const primary = installed[0];
  const defaultKey = `${DEFAULT.weight}/${DEFAULT.width}`;

  // 1. The one rule for the default headline, measured against everything.
  const single = tune(primary, defaultKey);
  await call(`window.__m.addStyle(${JSON.stringify(cssRule("M Single", single, "100 900", "50% 200%"))})`);
  const singleCheck = compare(await call(`window.__m.both("M Single", ${DEFAULT.weight}, ${DEFAULT.width})`), defaultKey);
  const worst = singleCheck.errors
    .map((e, i) => ({ e, text: strings[i] }))
    .sort((a, b) => Math.abs(b.e) - Math.abs(a.e))
    .slice(0, 5);
  const singleElsewhere = [];
  for (const use of IN_USE) {
    const key = `${use.weight}/${use.width}`;
    const row = { ...use, byLocal: {} };
    for (const local of installed) {
      // the same size-adjust applied to another local font the src list can resolve to
      const scaled = { widths: local.widths.map((w) => w * (parseFloat(single.sizeAdjust) / 100)), line: null };
      const c = compare(scaled, key);
      row.byLocal[local.name] = { total: c.total, min: c.each.min, max: c.each.max };
    }
    singleElsewhere.push(row);
  }

  // 2. The family: one rule per band.
  const rules = [];
  for (const weightBand of WEIGHT_BANDS) {
    for (const widthBand of WIDTH_BANDS) {
      const rule = tune(primary, `${weightBand.tune}/${widthBand.tune}`);
      rules.push({ weight: weightBand, width: widthBand, rule, css: cssRule("Archivo Fallback", rule, weightBand.range, widthBand.range) });
    }
  }
  await call(`window.__m.addStyle(${JSON.stringify(rules.map((r) => r.css.replace('"Archivo Fallback"', '"M Family"')).join("\n"))})`);
  const familyCheck = [];
  for (const use of IN_USE) {
    const c = compare(await call(`window.__m.both("M Family", ${use.weight}, ${use.width})`), `${use.weight}/${use.width}`);
    familyCheck.push({ ...use, total: c.total, min: c.each.min, max: c.each.max, p05: c.each.p05, p95: c.each.p95, meanAbs: c.each.meanAbs, line: c.line, archivoLine: c.archivoLine });
  }

  return {
    chrome: browser.version,
    font: { file: path.relative(ROOT, face.file), bytes: face.bytes, weight: face.weight, stretch: face.stretch },
    sample: { routes, h1: h1.length, h2: h2.length, unique: strings.length },
    locals: locals.map((l) => ({ name: l.name, installed: l.installed })),
    tunedTo: primary.name,
    single: {
      rule: single,
      css: cssRule("Archivo Fallback", single, "100 900", "50% 200%").replace("  font-stretch: 50% 200%;\n", ""),
      total: singleCheck.total,
      each: singleCheck.each,
      h1Only: spread(singleCheck.errors.filter((_, i) => h1Strings.has(strings[i]))),
      line: singleCheck.line,
      archivoLine: singleCheck.archivoLine,
      worst,
      elsewhere: singleElsewhere,
    },
    family: { rules: rules.map((r) => ({ weight: r.weight.range, width: r.width.range, tunedAt: `${r.weight.tune}/${r.width.tune}%`, ...r.rule })), css: rules.map((r) => r.css).join("\n\n"), check: familyCheck },
  };
});

/**
 * --check: compare the family in src/app/globals.css with what was just
 * measured. A tenth of a percentage point of drift is tolerated (another
 * Chrome or OS version can round differently); anything more, or a missing
 * or extra rule, fails.
 */
function checkStylesheet() {
  const css = readFileSync(path.join(ROOT, "src", "app", "globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const inFile = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)]
    .map((m) => Object.fromEntries(m[1].split(";").map((d) => d.split(/:(.*)/s).slice(0, 2).map((part) => part.trim())).filter((d) => d[0])))
    .filter((d) => d["font-family"]?.replace(/["']/g, "") === "Archivo Fallback");
  const problems = [];
  const number = (value) => parseFloat(value);
  for (const rule of result.family.rules) {
    const found = inFile.find((d) => d["font-weight"] === rule.weight && d["font-stretch"] === rule.width);
    if (!found) {
      problems.push(`missing rule for font-weight ${rule.weight}, font-stretch ${rule.width}`);
      continue;
    }
    if (found.src.replace(/\s+/g, " ") !== FALLBACK_SRC) problems.push(`${rule.tunedAt}: src differs`);
    for (const [descriptor, measured] of [
      ["size-adjust", rule.sizeAdjust],
      ["ascent-override", rule.ascent],
      ["descent-override", rule.descent],
      ["line-gap-override", rule.lineGap],
    ]) {
      if (Math.abs(number(found[descriptor]) - number(measured)) > 0.1) problems.push(`${rule.tunedAt}: ${descriptor} is ${found[descriptor]} in globals.css, measured ${measured}`);
    }
  }
  if (inFile.length !== result.family.rules.length) problems.push(`globals.css has ${inFile.length} "Archivo Fallback" rules, the family has ${result.family.rules.length}`);
  return problems;
}

if (process.argv.includes("--check")) {
  const problems = checkStylesheet();
  if (problems.length) {
    console.error(`"Archivo Fallback" in src/app/globals.css does not match the measurement:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`"Archivo Fallback" in src/app/globals.css matches the measurement (${result.family.rules.length} rules).`);
} else if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const s = result.single;
  const fmtLine = (l) => `ascent ${l.ascent.toFixed(3)} descent ${l.descent.toFixed(3)} gap ${l.lineGap.toFixed(3)} line-height:normal ${l.lineHeight.toFixed(3)}`;
  const short = (text) => (text.length > 40 ? `${text.slice(0, 40)}…` : text);
  console.log(result.chrome);
  console.log(`Archivo: ${result.font.file} (${result.font.bytes} bytes; weight ${result.font.weight}; width ${result.font.stretch})`);
  console.log(`Headlines: ${result.sample.h1} H1 and ${result.sample.h2} H2 on ${result.sample.routes} prerendered pages, ${result.sample.unique} different strings`);
  console.log(`Local fonts: ${result.locals.map((l) => `${l.name} ${l.installed ? "installed" : "NOT installed (not measured)"}`).join(" · ")}`);

  console.log(`\n1. ONE RULE — ${result.tunedTo} against Archivo ${DEFAULT.weight} at ${DEFAULT.width}% width\n`);
  console.log(s.css);
  console.log(`\n   Built in the browser and measured against Archivo ${DEFAULT.weight} at ${DEFAULT.width}%:`);
  console.log(`   width, all headlines  total ${signed(s.total)}; each line ${signed(s.each.min)} to ${signed(s.each.max)} (5th-95th percentile ${signed(s.each.p05)} to ${signed(s.each.p95)}, mean |error| ${pct(s.each.meanAbs)})`);
  console.log(`   width, H1 only        each line ${signed(s.h1Only.min)} to ${signed(s.h1Only.max)} (mean |error| ${pct(s.h1Only.meanAbs)})`);
  console.log(`   line metrics (em)     Archivo  ${fmtLine(s.archivoLine)}`);
  console.log(`                         fallback ${fmtLine(s.line)}`);
  console.log(`   furthest off: ${s.worst.map((w) => `${signed(w.e)} "${short(w.text)}"`).join("; ")}`);
  console.log(`\n   The same rule standing in for the other widths and weights (fallback width - Archivo width):`);
  const localNames = Object.keys(s.elsewhere[0].byLocal);
  console.log(`   ${"used by".padEnd(29)} ${"weight".padEnd(7)} ${"width".padEnd(6)} ${localNames.map((n) => `${n}: total (each line)`.padEnd(44)).join(" ")}`);
  for (const row of s.elsewhere) {
    console.log(
      `   ${row.use.padEnd(29)} ${String(row.weight).padEnd(7)} ${`${row.width}%`.padEnd(6)} ${localNames
        .map((n) => `${signed(row.byLocal[n].total)} (${signed(row.byLocal[n].min)} to ${signed(row.byLocal[n].max)})`.padEnd(44))
        .join(" ")}`
    );
  }

  console.log(`\n2. THE FAMILY — paste into src/app/globals.css\n`);
  console.log(result.family.css);
  console.log(`\n3. THE FAMILY, built in the browser and measured (fallback width - Archivo width):`);
  console.log(`   ${"used by".padEnd(29)} ${"weight".padEnd(7)} ${"width".padEnd(6)} ${"total".padEnd(8)} ${"each line".padEnd(20)} ${"5th-95th pct".padEnd(20)} line box`);
  for (const row of result.family.check) {
    const sameLine = Math.abs(row.line.ascent - row.archivoLine.ascent) < 0.0015 && Math.abs(row.line.descent - row.archivoLine.descent) < 0.0015 && Math.abs(row.line.lineHeight - row.archivoLine.lineHeight) < 0.0015;
    console.log(
      `   ${row.use.padEnd(29)} ${String(row.weight).padEnd(7)} ${`${row.width}%`.padEnd(6)} ${signed(row.total).padEnd(8)} ${`${signed(row.min)} to ${signed(row.max)}`.padEnd(20)} ${`${signed(row.p05)} to ${signed(row.p95)}`.padEnd(20)} ${sameLine ? "same as Archivo" : `DIFFERS (${fmtLine(row.line)})`}`
    );
  }
}
