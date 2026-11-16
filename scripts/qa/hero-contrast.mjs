#!/usr/bin/env node
/**
 * Measured text contrast on photo heroes.
 *   node scripts/qa/hero-contrast.mjs http://localhost:3111 390,768,1024,1440 /about,/builders [--json out.json] [--shots dir]
 * For each route and width: load the page, note every piece of text that sits
 * directly on the hero photograph or in the transparent header over it (text
 * with its own solid surface, like a button label, is skipped), make that text
 * invisible, screenshot the composited picture + scrim, and compare each
 * text's own colour with the LIGHTEST pixel behind it.
 * Prints the worst text per route and every text under 4.5:1.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { launchChrome, viewportForWidth, sleep } from "./lib/chrome.mjs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const jsonOut = flag("--json");
const shotsDir = flag("--shots");
const [base, widthList, routeList] = argv;
const widths = widthList.split(",").map(Number);
const routes = routeList.split(",");
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const COLLECT = `(() => {
  const hero = document.querySelector("section[data-hero-photo]");
  if (!hero) return null;
  const header = document.querySelector(".site-header");
  const heroRect = hero.getBoundingClientRect();
  const out = [];
  const solid = (el, stop) => {
    for (let n = el; n && n !== stop; n = n.parentElement) {
      const s = getComputedStyle(n);
      const m = s.backgroundColor.match(/rgba?\\(([^)]+)\\)/);
      const parts = m ? m[1].split(/[ ,/]+/).map(Number) : [0, 0, 0, 0];
      const alpha = parts.length > 3 ? parts[3] : 1;
      if (alpha > 0.05 || s.backgroundImage !== "none") return true;
    }
    return false;
  };
  const walk = (root, where) => {
    if (!root) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = tw.nextNode(); node; node = tw.nextNode()) {
      const text = node.nodeValue.replace(/\\s+/g, " ").trim();
      if (!text) continue;
      const el = node.parentElement;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) continue;
      if (solid(el, root)) continue;
      let clipped = false;
      for (let n = el; n && n !== root; n = n.parentElement) {
        const cs = getComputedStyle(n); const b = n.getBoundingClientRect();
        if ((cs.overflow !== "visible" || cs.clipPath !== "none" || cs.clip !== "auto") && (b.width <= 2 || b.height <= 2)) { clipped = true; break; }
      }
      if (clipped) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 4 || r.height < 6) continue;
        if (r.bottom <= heroRect.top || r.top >= heroRect.bottom) continue;
        out.push({ where, text: text.slice(0, 60), color: s.color, size: parseFloat(s.fontSize), weight: Number(s.fontWeight) || 400,
          x: r.left, y: r.top + scrollY, w: r.width, h: r.height });
      }
    }
  };
  walk(hero, "hero");
  walk(header, "header");
  return { hero: { x: heroRect.left, y: heroRect.top + scrollY, w: heroRect.width, h: heroRect.height }, items: out };
})()`;

const HIDE = `(() => {
  const s = document.createElement("style");
  s.textContent = "section[data-hero-photo] *, .site-header * { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; text-decoration-color: transparent !important; } section[data-hero-photo] svg, .site-header svg { opacity: 0 !important; } section[data-hero-photo] a:not([class*=bg-]), section[data-hero-photo] a:not([class*=bg-]) *, section[data-hero-photo] p, section[data-hero-photo] span, section[data-hero-photo] [class*=underline], section[data-hero-photo] [class*=border-b] { border-color: transparent !important; text-decoration: none !important; box-shadow: none !important; background-image: none !important; } .preview-ribbon, .preview-tab, .request-fab, nextjs-portal { display: none !important; } .qa-nounder::after, .qa-nounder::before, .qa-nounder *::after, .qa-nounder *::before { background: transparent !important; border-color: transparent !important; } video { }";
  document.head.append(s);
  // Fixed chrome other than the site header (the phone dock, floating buttons) can sit over the bottom of a hero on a short screen: not part of the picture.
  const hdr = document.querySelector(".site-header");
  for (const n of document.querySelectorAll("body *")) {
    if (getComputedStyle(n).position === "fixed" && !(hdr && (hdr === n || hdr.contains(n)))) n.style.setProperty("visibility", "hidden", "important");
  }
  for (const link of document.querySelectorAll("section[data-hero-photo] a, section[data-hero-photo] button")) {
    const m = getComputedStyle(link).backgroundColor.match(/rgba?\\(([^)]+)\\)/);
    const p = m ? m[1].split(/[ ,/]+/).map(Number) : [0, 0, 0, 0];
    if ((p.length > 3 ? p[3] : 1) > 0.05) continue;
    link.classList.add("qa-nounder");
    for (const n of [link, ...link.querySelectorAll("*")]) {
      n.style.setProperty("text-decoration", "none", "important");
      n.style.setProperty("border-color", "transparent", "important");
      n.style.setProperty("box-shadow", "none", "important");
      n.style.setProperty("background-image", "none", "important");
    }
  }
})()`;

const results = [];
const browser = await launchChrome();
try {
  for (const route of routes) {
    for (const width of widths) {
      const vp = viewportForWidth(width);
      const page = await browser.newPage({ width: vp.width, height: vp.height, deviceScaleFactor: vp.deviceScaleFactor, mobile: vp.mobile, touch: vp.touch });
      try {
        await page.goto(base + route, { waitUntil: "networkidle", timeout: 90000 });
        await page.evaluate(() => document.fonts.ready.then(() => true));
        await sleep(500);
        const info = await page.evaluate(COLLECT);
        if (!info) { results.push({ route, width, photo: false }); console.log(`${route} @${width}: no photo hero`); continue; }
        await page.evaluate(HIDE);
        await sleep(350);
        const clip = { x: 0, y: 0, width: vp.width, height: Math.ceil(info.hero.y + info.hero.h), scale: 1 };
        const { data } = await page.session.send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true });
        const png = Buffer.from(data, "base64");
        if (shotsDir) writeFileSync(path.join(shotsDir, `${route.replace(/\W+/g, "_") || "home"}-${width}.png`), png);
        const { data: raw, info: meta } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        const k = meta.width / clip.width;
        const rows = [];
        for (const it of info.items) {
          const m = it.color.match(/rgba?\(([^)]+)\)/);
          const p = m[1].split(/[ ,/]+/).map(Number);
          const [tr, tg, tb] = p; const ta = p.length > 3 ? p[3] : 1;
          if (ta === 0) continue;
          const x0 = Math.max(0, Math.floor(it.x * k)), x1 = Math.min(meta.width, Math.ceil((it.x + it.w) * k));
          const y0 = Math.max(0, Math.floor(it.y * k)), y1 = Math.min(meta.height, Math.ceil((it.y + it.h) * k));
          let worst = Infinity, at = null;
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
            const i = (y * meta.width + x) * 3;
            const br = raw[i], bg = raw[i + 1], bb = raw[i + 2];
            const fr = tr * ta + br * (1 - ta), fg = tg * ta + bg * (1 - ta), fb = tb * ta + bb * (1 - ta);
            const c = ratio(lum(fr, fg, fb), lum(br, bg, bb));
            if (c < worst) { worst = c; at = [br, bg, bb]; }
          }
          if (at) rows.push({ ...it, contrast: Number(worst.toFixed(2)), behind: at, large: it.size >= 24 || (it.size >= 18.66 && it.weight >= 700) });
        }
        rows.sort((a, b) => a.contrast - b.contrast);
        const fails = rows.filter((r) => r.contrast < 4.5);
        const worst = rows[0];
        results.push({ route, width, photo: true, texts: rows.length, worst, fails });
        console.log(`${route} @${width}: ${rows.length} texts, worst ${worst?.contrast}:1 "${worst?.text}" (${worst?.where}, ${worst?.size}px/${worst?.weight}, behind rgb ${worst?.behind})` +
          (fails.length ? `  UNDER 4.5: ${fails.length} [${[...new Set(fails.map((f) => `${f.contrast} ${f.where}:${f.text.slice(0, 22)}`))].slice(0, 6).join(" | ")}]` : ""));
      } catch (err) {
        console.log(`${route} @${width}: ERROR ${err.message}`);
        results.push({ route, width, error: err.message });
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.fails?.length);
console.log(`\n${results.filter((r) => r.photo).length} photo heroes measured; ${bad.length} with text under 4.5:1; lowest ${Math.min(...results.filter((r) => r.worst).map((r) => r.worst.contrast))}:1`);
