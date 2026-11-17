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

const [bold, semi, photo, logo] = await Promise.all([
  b64("src/assets/fonts/archivo-latin-800-normal.woff"),
  b64("src/assets/fonts/archivo-latin-600-normal.woff"),
  b64("public/images/gallery/rheem-water-heater.jpg"),
  b64("public/images/logos/logo-512.png"),
]);

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Archivo;font-weight:800;src:url(data:font/woff;base64,${bold})}
@font-face{font-family:Archivo;font-weight:600;src:url(data:font/woff;base64,${semi})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;display:flex;font-family:Archivo,sans-serif;background:#0A1730;color:#fff;overflow:hidden}
.copy{width:735px;padding:52px 0 48px 64px;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:1}
.brand{display:flex;align-items:center;gap:16px;font-weight:600;font-size:26px}
.brand img{width:84px;height:84px;object-fit:contain;background:#fff;border-radius:14px;padding:5px}
.eyebrow{font-weight:600;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#D4BC8A}
h1{font-weight:800;font-size:86px;line-height:.98;letter-spacing:-.02em;margin-top:14px}
h1 span{color:#D4BC8A}
.row{display:flex;align-items:center;gap:22px}
.pill{background:#D4BC8A;color:#0A1730;font-weight:800;font-size:30px;padding:14px 26px;border-radius:12px;white-space:nowrap}
.note{font-weight:600;font-size:24px;color:#C9D3E6;line-height:1.25}
.photo{position:absolute;right:0;top:0;width:520px;height:630px;background:url(data:image/jpeg;base64,${photo}) center 22%/cover}
.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0A1730 0%,rgba(10,23,48,.55) 22%,rgba(10,23,48,0) 55%)}
</style>
<div class="copy">
  <div class="brand"><img src="data:image/png;base64,${logo}" alt="">C&amp;S Plumbing of Lee</div>
  <div>
    <div class="eyebrow">Anniversary Giveaway</div>
    <h1>Win a New Water Heater, <span>Installed Free</span></h1>
  </div>
  <div class="row"><div class="pill">Enter by ${ends}</div><div class="note">Free to enter<br>SWFL homeowners</div></div>
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
