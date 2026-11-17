#!/usr/bin/env node
/**
 * Builds the link-preview picture of the water heater giveaway:
 * public/og/water-heater-giveaway.jpg (1200 x 630 JPEG).
 *
 * A committed JPEG, not a generated PNG like the other pages' cards: it
 * carries a photograph, and a photo as PNG is several times heavier, which
 * some messaging apps refuse to preview. Run it again when the end date in
 * src/lib/giveaway.ts changes:
 *
 *   node scripts/build-giveaway-share-image.mjs "December 8"
 *
 * Needs Playwright with Chromium (any dev machine that runs scripts/qa).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Playwright is a tool of the machine, not a dependency of the site.
let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
} catch {
  console.error("This script needs Playwright with Chromium: npm i -g playwright && npx playwright install chromium");
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ends = process.argv[2] ?? "December 8";
const b64 = async (rel) => (await readFile(path.join(ROOT, rel))).toString("base64");

const [bold, semi, regular, photo, logo] = await Promise.all([
  b64("src/assets/fonts/archivo-latin-800-normal.woff"),
  b64("src/assets/fonts/archivo-latin-600-normal.woff"),
  b64("src/assets/fonts/archivo-latin-400-normal.woff"),
  b64("public/images/gallery/rheem-water-heater.jpg"),
  b64("src/assets/og/logo-emblem.png"),
]);

// Same look as the generated cards in src/lib/og.tsx: ink field, brass
// accents, Archivo. The photograph (the prize) takes the emblem's place.
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Archivo;font-weight:800;src:url(data:font/woff;base64,${bold})}
@font-face{font-family:Archivo;font-weight:600;src:url(data:font/woff;base64,${semi})}
@font-face{font-family:Archivo;font-weight:400;src:url(data:font/woff;base64,${regular})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;display:flex;font-family:Archivo,sans-serif;background:linear-gradient(120deg,#0A1730 0%,#0A1730 55%,#12244A 100%);color:#fff;overflow:hidden}
.copy{width:760px;padding:52px 28px 52px 72px;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:1}
.logo{width:150px;height:auto;margin-left:-6px}
.rule{width:56px;height:3px;background:#D4BC8A;margin-bottom:22px}
.eyebrow{font-weight:600;font-size:21px;letter-spacing:.19em;text-transform:uppercase;color:#D4BC8A}
h1{font-weight:800;font-size:68px;line-height:1.02;letter-spacing:-.02em;margin-top:16px}
.sub{font-weight:400;font-size:27px;line-height:1.35;color:#B9C4D9;margin-top:18px}
.sub b{font-weight:600;color:#fff}
.foot{font-size:21px;font-weight:600;display:flex;gap:14px;align-items:center}
.foot span{color:#8492AE;font-weight:400}
.photo{position:absolute;right:0;top:0;width:470px;height:630px;background:url(data:image/jpeg;base64,${photo}) center 22%/cover}
.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0E1D3B 0%,rgba(14,29,59,.6) 18%,rgba(14,29,59,.12) 55%,rgba(10,23,48,.25) 100%)}
</style>
<div class="copy">
  <img class="logo" src="data:image/png;base64,${logo}" alt="">
  <div>
    <div class="rule"></div>
    <div class="eyebrow">Anniversary Giveaway</div>
    <h1>Wanted: SWFL&rsquo;s Oldest Working Water Heater</h1>
    <div class="sub">The oldest one wins <b>a new one, installed free.</b></div>
  </div>
  <div class="foot">Enter by ${ends}<span>&middot;</span><span>Cape Coral &middot; Fort Myers &middot; North Fort Myers</span></div>
</div>
<div class="photo"></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const out = path.join(ROOT, "public/og/water-heater-giveaway.jpg");
await writeFile(out, await page.screenshot({ type: "jpeg", quality: 84 }));
await browser.close();
console.log(`wrote ${path.relative(ROOT, out)}`);
