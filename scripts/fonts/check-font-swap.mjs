#!/usr/bin/env node
/**
 * Proves in a real browser that headlines do not move when Archivo arrives.
 *
 * For each page and screen width it holds the Archivo request back (3 s by
 * default), so the page first paints in "Archivo Fallback", then lets the
 * font through and compares:
 *   - the H1: number of lines and box height, before and after the swap
 *   - every h1 and h2 on the page: how many changed their line count or height
 *   - the page height
 *   - cumulative layout shift recorded after the font was released
 * and it names the font files Chrome really drew the H1 with at both moments.
 *
 * Needs a production build and a running server:
 *   npx next build && npx next start -p 3121
 *   node scripts/fonts/check-font-swap.mjs http://localhost:3121
 *   node scripts/fonts/check-font-swap.mjs http://localhost:3121 --routes=/,/about --delay=3000 --json
 *
 * Exit code 1 when a headline changes its line count or the swap shifts the
 * layout by more than 0.02.
 */

import path from "node:path";
import { renderedFonts, sleep, withChrome } from "./chrome.mjs";
import { firstBlogPost, latinFace, longestH1 } from "./build-output.mjs";

const args = process.argv.slice(2);
const BASE = args.find((a) => /^https?:\/\//.test(a))?.replace(/\/$/, "");
if (!BASE) {
  console.error("Usage: node scripts/fonts/check-font-swap.mjs <base-url> [--routes=/a,/b] [--delay=3000] [--json]");
  process.exit(2);
}
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const DELAY = Number(option("delay", "3000"));
const JSON_OUT = args.includes("--json");
const CLS_LIMIT = 0.02;

const archivo = latinFace("Archivo");
const archivoFile = path.basename(archivo.file);
const longest = longestH1();
const ROUTES = option("routes")?.split(",") ?? [...new Set(["/", longest.route, firstBlogPost()].filter(Boolean))];
const VIEWPORTS = [
  { name: "390", width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  { name: "1440", width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
];

/** Injected before any page script: records every layout shift with what moved. */
const RECORDER = `
  window.__shifts = [];
  try { localStorage.setItem("cs-coupon-seen", String(Date.now())); localStorage.setItem("cs-giveaway-seen", String(Date.now())); } catch (e) {}
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__shifts.push({
        at: Math.round(entry.startTime),
        value: entry.value,
        input: entry.hadRecentInput,
        moved: entry.sources.slice(0, 3).map((s) => {
          const n = s.node && (s.node.nodeType === 1 ? s.node : s.node.parentElement);
          return n ? n.tagName.toLowerCase() + (typeof n.className === "string" && n.className ? "." + n.className.trim().split(/\\s+/).slice(0, 3).join(".") : "") : "?";
        }),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
`;

/** Evaluated in the page: the state of every headline right now. */
const SNAPSHOT = `(() => {
  const lines = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tops = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).map((r) => r.top).sort((a, b) => a - b);
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2;
    let count = 0;
    let last = -Infinity;
    for (const top of tops) if (top - last > lineHeight * 0.6) { count++; last = top; }
    return count;
  };
  const describe = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: el.textContent.replace(/\\s+/g, " ").trim().slice(0, 80),
      lines: lines(el),
      width: +rect.width.toFixed(2),
      height: +rect.height.toFixed(2),
      visible: rect.width > 0 && rect.height > 0,
      weight: style.fontWeight,
      stretch: style.fontStretch,
      size: style.fontSize,
    };
  };
  const headings = [...document.querySelectorAll("h1, h2")].map(describe).filter((h) => h.visible);
  return {
    now: Math.round(performance.now()),
    h1: document.querySelector("h1") ? describe(document.querySelector("h1")) : null,
    headings,
    pageHeight: document.documentElement.scrollHeight,
    archivoReady: document.fonts.check('700 32px "Archivo"'),
    shifts: window.__shifts.slice(),
  };
})()`;

const total = (shifts) => shifts.filter((s) => !s.input).reduce((sum, s) => sum + s.value, 0);
const fontNames = (fonts) => fonts.map((f) => `${f.postScriptName} (${f.webFont ? "web font" : "local"})`).join(", ") || "none";

const results = await withChrome(async (browser) => {
  const out = [];
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: viewport.deviceScaleFactor, mobile: viewport.mobile });
      await page.send("Page.addScriptToEvaluateOnNewDocument", { source: RECORDER });

      // Hold the Archivo file; let every other font through at once.
      let heldAt = null;
      let releasedAt = null;
      await page.send("Fetch.enable", { patterns: [{ urlPattern: "*", resourceType: "Font", requestStage: "Request" }] });
      page.on("Fetch.requestPaused", async ({ requestId, request }) => {
        if (request.url.endsWith(archivoFile)) {
          heldAt ??= Date.now();
          await sleep(Math.max(0, heldAt + DELAY - Date.now()));
          releasedAt ??= Date.now();
        }
        await page.send("Fetch.continueRequest", { requestId }).catch(() => {});
      });

      const started = Date.now();
      await page.send("Page.navigate", { url: BASE + route });
      while (heldAt === null && Date.now() - started < 10000) await sleep(20);
      if (heldAt === null) throw new Error(`${route}: the page never asked for ${archivoFile}. Is the server running this build?`);

      // Just before the font is released: the page as it stands in the fallback.
      await sleep(Math.max(0, heldAt + DELAY - 400 - Date.now()));
      const before = await page.evaluate(SNAPSHOT);
      const fontsBefore = await renderedFonts(page, "h1");

      while (releasedAt === null) await sleep(20);
      const waitStart = Date.now();
      while (!(await page.evaluate(`document.fonts.check('700 32px "Archivo"') && [...document.fonts].some((f) => f.family.replace(/"/g, "") === "Archivo" && f.status === "loaded")`))) {
        if (Date.now() - waitStart > 10000) throw new Error(`${route}: Archivo did not load after it was released.`);
        await sleep(30);
      }
      await sleep(700);
      const after = await page.evaluate(SNAPSHOT);
      const fontsAfter = await renderedFonts(page, "h1");
      await page.close();

      const changedLines = [];
      const changedHeight = [];
      after.headings.forEach((heading, i) => {
        const was = before.headings[i];
        if (!was || was.text !== heading.text) return;
        if (was.lines !== heading.lines) changedLines.push({ tag: heading.tag, text: heading.text, lines: [was.lines, heading.lines] });
        else if (Math.abs(was.height - heading.height) > 0.5) changedHeight.push({ tag: heading.tag, text: heading.text, height: [was.height, heading.height] });
      });
      const swapShifts = after.shifts.slice(before.shifts.length);
      out.push({
        route,
        viewport: viewport.name,
        heldFor: releasedAt - heldAt,
        h1: {
          text: after.h1?.text,
          weight: after.h1?.weight,
          stretch: after.h1?.stretch,
          size: after.h1?.size,
          lines: [before.h1?.lines, after.h1?.lines],
          height: [before.h1?.height, after.h1?.height],
          width: [before.h1?.width, after.h1?.width],
          fonts: [fontNames(fontsBefore), fontNames(fontsAfter)],
        },
        fallbackWasShowing: !before.archivoReady && after.archivoReady,
        headings: after.headings.length,
        headingsSameCount: before.headings.length === after.headings.length,
        changedLines,
        changedHeight,
        pageHeight: [before.pageHeight, after.pageHeight],
        clsBeforeSwap: +total(before.shifts).toFixed(4),
        clsFromSwap: +total(swapShifts).toFixed(4),
        swapShifts,
      });
    }
  }
  return out;
});

const failed = results.filter((r) => !r.fallbackWasShowing || r.h1.lines[0] !== r.h1.lines[1] || r.changedLines.length || r.clsFromSwap > CLS_LIMIT);

if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, font: archivoFile, delay: DELAY, longestH1: longest, results }, null, 2));
} else {
  console.log(`Archivo (${archivoFile}, ${archivo.bytes} bytes) held back ${DELAY} ms on ${BASE}`);
  console.log(`Longest H1 in the build: ${longest.route} (${longest.text.length} characters) "${longest.text}"\n`);
  for (const r of results) {
    console.log(`${r.viewport.padEnd(5)} ${r.route}`);
    console.log(`      H1 "${r.h1.text}" (${r.h1.size}, weight ${r.h1.weight}, width ${r.h1.stretch})`);
    console.log(`      H1 lines ${r.h1.lines[0]} -> ${r.h1.lines[1]} · H1 height ${r.h1.height[0]} -> ${r.h1.height[1]} px · H1 width ${r.h1.width[0]} -> ${r.h1.width[1]} px`);
    console.log(`      drawn with ${r.h1.fonts[0]} -> ${r.h1.fonts[1]}${r.fallbackWasShowing ? "" : "   (!) the fallback was not on screen at the first reading"}`);
    console.log(
      `      all ${r.headings} h1/h2: ${r.changedLines.length} changed line count, ${r.changedHeight.length} changed height only · page height ${r.pageHeight[0]} -> ${r.pageHeight[1]} px`
    );
    console.log(`      layout shift: ${r.clsBeforeSwap} before the swap, ${r.clsFromSwap} from the swap${r.swapShifts.length ? ` (${r.swapShifts.map((s) => `${s.value.toFixed(4)} ${s.moved.join("+")}`).join("; ")})` : ""}`);
    for (const c of r.changedLines) console.log(`      (!) ${c.tag} "${c.text}" went from ${c.lines[0]} to ${c.lines[1]} lines`);
    for (const c of r.changedHeight) console.log(`      (~) ${c.tag} "${c.text}" height ${c.height[0]} -> ${c.height[1]} px`);
  }
  console.log(failed.length ? `\nFAILED on ${failed.length} of ${results.length} runs (a headline re-wrapped, or the swap shifted the layout by more than ${CLS_LIMIT}).` : `\nOK: no headline changed its line count and no swap shifted the layout by more than ${CLS_LIMIT} (${results.length} runs).`);
}
process.exit(failed.length ? 1 : 0);
