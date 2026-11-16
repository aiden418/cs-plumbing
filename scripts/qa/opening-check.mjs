#!/usr/bin/env node
/**
 * The homepage hero (v2 "Opening, simplified"), measured in Chrome with the
 * tag hosts blocked, at 390x844 and 1440x900:
 *
 *   a  first load: FCP, every LCP entry (the last must be the still), LCP − FCP,
 *      CLS, hero image requests (must be one), film files requested, the film
 *      state and console errors
 *   p  Pause remembered: press Pause, reload (same profile): the still with
 *      Play and no film request; press Play: the film again
 *   e  the light paths: reduced motion, Save-Data, blocked video: the still,
 *      no film request (or a failed one), no control, no page errors
 *   c  contrast of the rating line, the H1 and the lead against what is behind
 *      them: the text is made transparent, the viewport is captured, and every
 *      pixel under each text line box is read. Reported per element as the
 *      contrast of white against the 95th-percentile and the brightest pixel.
 *      Measured on the still (reduced motion) and on three frames of the film.
 *
 *   node scripts/qa/opening-check.mjs --base http://127.0.0.1:3183 [--only a,p,e,c] [--shots DIR] [--json FILE]
 *
 * Loads pages and presses the film button only; never submits a form.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launchChrome, sleep } from "./lib/chrome.mjs";
import { cli, run } from "./lib/util.mjs";

const PHONE = { name: "phone", width: 390, height: 844, deviceScaleFactor: 3, mobile: true, touch: true };
const DESKTOP = { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, touch: false };
const FILM_TIMES = [1.5, 5, 8.5];
const TEXT = { rating: ".home-hero-rating", h1: "#hero-title", lead: ".home-hero-lead" };

/** Collects LCP, CLS and FCP from the first byte; optional Save-Data and storage. */
function collector(opts) {
  window.__qa = { lcp: [], cls: 0, shifts: [], fcp: null };
  const q = window.__qa;
  if (opts.saveData && window.NetworkInformation) {
    Object.defineProperty(NetworkInformation.prototype, "saveData", { get: () => true });
  }
  try {
    localStorage.setItem("cs-coupon-seen", String(Date.now()));
    for (const [k, v] of Object.entries(opts.storage || {})) localStorage.setItem(k, v);
  } catch {}
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      q.lcp.push({ t: Math.round(e.startTime), size: e.size, url: (e.url || "").replace(/^.*url=/, "").slice(0, 80), tag: e.element ? e.element.tagName : null, cls: e.element ? String(e.element.className || "") : null });
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (!e.hadRecentInput) {
        q.cls += e.value;
        q.shifts.push({ t: Math.round(e.startTime), v: e.value, nodes: (e.sources || []).map((s) => (s.node ? s.node.nodeName + "." + String(s.node.className || "").slice(0, 40) : "?")) });
      }
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.name === "first-contentful-paint") q.fcp = Math.round(e.startTime);
  }).observe({ type: "paint", buffered: true });
}

async function open(browser, vp, { url, init = {}, reducedMotion = false, video = "pass" }) {
  const page = await browser.newPage({ ...vp, reducedMotion });
  if (video === "block") {
    await page.session.send("Fetch.enable", { patterns: [{ urlPattern: "*/videos/*" }] });
    page.session.on("Fetch.requestPaused", ({ requestId }) => {
      page.session.send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" }).catch(() => {});
    });
  }
  await page.addInitScript(collector, [init]);
  await page.goto(url, { waitUntil: "load" });
  return page;
}

const state = (page) =>
  page.evaluate(() => {
    const img = document.querySelector(".home-hero-still");
    const media = document.getElementById("cs-hero-frame");
    const video = document.getElementById("cs-hero-video");
    const toggle = document.querySelector(".home-hero-toggle");
    let pref = null;
    try {
      pref = localStorage.getItem("cs-hero-motion");
    } catch {}
    return {
      hero: window.__csHero ? { ...window.__csHero } : null,
      film: media ? media.getAttribute("data-film") : null,
      video: video ? { src: video.getAttribute("src"), paused: video.paused, t: Number(video.currentTime.toFixed(2)) } : null,
      control: toggle ? toggle.getAttribute("aria-label") : null,
      pref,
      still: img ? { complete: img.complete, w: img.naturalWidth, src: decodeURIComponent(img.currentSrc || "").replace(/^.*url=/, "").slice(0, 80) } : null,
      heroBox: (() => {
        const s = document.querySelector("[data-hero-photo]");
        if (!s) return null;
        const r = s.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      qa: window.__qa,
    };
  });

const waitFor = (page, fnSource, timeout = 8000) =>
  page.evaluate(
    `new Promise((res) => { const t0 = performance.now(); const tick = () => { let v; try { v = (${fnSource})(); } catch (e) {} if (v) return res(v); if (performance.now() - t0 > ${timeout}) return res(null); setTimeout(tick, 25); }; tick(); })`,
  );

const heroImageRequests = (page) =>
  page.requests.filter((r) => /drone-construction|home\.hero\.mobile/.test(decodeURIComponent(r.url))).map((r) => decodeURIComponent(r.url).replace(/^.*url=/, "").slice(0, 90));
const videoRequests = (page) => [...new Set(page.requests.filter((r) => /\/videos\//.test(r.url)).map((r) => r.url.replace(/^https?:\/\/[^/]+/, "")))];
const pageErrors = (page) =>
  page.consoleErrors().filter((e) => !/\/videos\//.test(`${e.text ?? ""} ${e.url ?? ""}`)).map((e) => String(e.text ?? e.message ?? "").slice(0, 160));

async function press(page, vp, selector) {
  const p = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, [selector]);
  if (!p) return false;
  if (vp.touch) {
    await page.session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [p] });
    await page.session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.session.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...p });
    await page.session.send("Input.dispatchMouseEvent", { type: "mousePressed", ...p, button: "left", clickCount: 1 });
    await page.session.send("Input.dispatchMouseEvent", { type: "mouseReleased", ...p, button: "left", clickCount: 1 });
  }
  return true;
}

const PLAYING = `() => window.__csHero && window.__csHero.state === "playing" && document.getElementById("cs-hero-frame").getAttribute("data-film") === "on"`;

// --- a: first load -------------------------------------------------------------------
async function firstLoad(browser, vp, base, shots) {
  const page = await open(browser, vp, { url: `${base}/` });
  const playing = await waitFor(page, PLAYING, 10000);
  await sleep(800);
  const s = await state(page);
  if (shots) await page.screenshot({ path: join(shots, `hero-${vp.name}-film.jpg`) });
  const last = s.qa.lcp[s.qa.lcp.length - 1];
  const out = {
    fcp: s.qa.fcp,
    lcp: s.qa.lcp,
    lastLcpIsStill: !!last && /home-hero-still/.test(last.cls ?? ""),
    lcpMinusFcp: last && s.qa.fcp !== null ? last.t - s.qa.fcp : null,
    cls: Number(s.qa.cls.toFixed(4)),
    shifts: s.qa.shifts,
    heroImageRequests: heroImageRequests(page),
    videoRequests: videoRequests(page),
    filmPlaying: Boolean(playing),
    final: { hero: s.hero, film: s.film, control: s.control, still: s.still, heroBox: s.heroBox },
    errors: pageErrors(page),
    tagLeaks: page.report().tagLeaks.length,
  };
  await page.close();
  return out;
}

// --- p: Pause remembered -----------------------------------------------------------------
async function pauseRemembered(browser, vp, base) {
  const page = await open(browser, vp, { url: `${base}/` });
  const out = { startedPlaying: Boolean(await waitFor(page, PLAYING, 10000)) };
  out.pressedPause = await press(page, vp, ".home-hero-toggle");
  await sleep(400);
  const paused = await state(page);
  out.afterPause = { state: paused.hero?.state, pref: paused.pref, videoPaused: paused.video?.paused, control: paused.control, film: paused.film };
  const before = page.requests.length;
  await page.goto(`${base}/`, { waitUntil: "load" });
  await sleep(2500);
  const again = await state(page);
  out.afterReload = {
    state: again.hero?.state,
    control: again.control,
    film: again.film,
    videoSrc: again.video?.src ?? null,
    videoRequestsAfterReload: page.requests.slice(before).filter((r) => /\/videos\//.test(r.url)).length,
  };
  await press(page, vp, ".home-hero-toggle");
  out.afterPlay = { playing: Boolean(await waitFor(page, PLAYING, 10000)), pref: (await state(page)).pref };
  out.errors = pageErrors(page);
  await page.close();
  return out;
}

// --- e: light paths ---------------------------------------------------------------------
async function lightPaths(browser, vp, base) {
  const out = {};
  const cases = {
    reducedMotion: { reducedMotion: true },
    saveData: { init: { saveData: true } },
    blockedVideo: { video: "block" },
  };
  for (const [name, opts] of Object.entries(cases)) {
    const page = await open(browser, vp, { url: `${base}/`, ...opts });
    await sleep(name === "blockedVideo" ? 6000 : 3000);
    const s = await state(page);
    const last = s.qa.lcp[s.qa.lcp.length - 1];
    out[name] = {
      hero: s.hero,
      film: s.film,
      control: s.control,
      stillLoaded: Boolean(s.still?.complete && s.still?.w > 0),
      lastLcpIsStill: !!last && /home-hero-still/.test(last.cls ?? ""),
      cls: Number(s.qa.cls.toFixed(4)),
      videoRequests: videoRequests(page),
      heroImageRequests: heroImageRequests(page).length,
      errors: pageErrors(page),
    };
    await page.close();
  }
  return out;
}

// --- c: contrast ----------------------------------------------------------------------------
const HIDE_TEXT = `.preview-ribbon { visibility: hidden !important; }
.home-hero-body, .home-hero-body * { color: transparent !important; text-shadow: none !important; }
.home-hero-key { background-image: none !important; } .home-hero-rating svg { visibility: hidden !important; }`;

async function textRects(page) {
  return page.evaluate((sels) => {
    const out = {};
    for (const [key, sel] of Object.entries(sels)) {
      const el = document.querySelector(sel);
      const rects = [];
      if (el) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) rects.push({ x: r.left, y: r.top, w: r.width, h: r.height });
        }
      }
      out[key] = rects;
    }
    return out;
  }, [TEXT]);
}

async function hideText(page, on) {
  await page.evaluate((css, on) => {
    let s = document.getElementById("qa-hide-text");
    if (on && !s) {
      s = document.createElement("style");
      s.id = "qa-hide-text";
      s.textContent = css;
      document.head.appendChild(s);
    } else if (!on && s) s.remove();
  }, [HIDE_TEXT, on]);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** Reads the pixels under the text boxes of a PNG in a blank helper page (no CSP there). */
async function measure(helper, png, rects, dpr) {
  return helper.evaluate(
    async (b64, rects, dpr) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const lin = (v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      const ratio = (L) => Number((1.05 / (L + 0.05)).toFixed(2));
      const out = {};
      for (const [key, list] of Object.entries(rects)) {
        const L = [];
        for (const r of list) {
          const x0 = Math.max(0, Math.floor(r.x * dpr));
          const y0 = Math.max(0, Math.floor(r.y * dpr));
          const w = Math.min(c.width - x0, Math.ceil(r.w * dpr));
          const h = Math.min(c.height - y0, Math.ceil(r.h * dpr));
          if (w <= 0 || h <= 0) continue;
          const d = g.getImageData(x0, y0, w, h).data;
          for (let i = 0; i < d.length; i += 4) L.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
        }
        L.sort((a, b) => a - b);
        out[key] = L.length
          ? { pixels: L.length, p95: ratio(L[Math.floor(L.length * 0.95)]), brightest: ratio(L[L.length - 1]), median: ratio(L[Math.floor(L.length / 2)]) }
          : null;
      }
      return out;
    },
    [png.toString("base64"), rects, dpr],
  );
}

async function contrast(browser, vp, base, shots) {
  const helper = await browser.newPage({ width: 400, height: 300 });
  await helper.goto("about:blank");
  const out = {};
  // The still: reduced motion keeps the film off.
  let page = await open(browser, vp, { url: `${base}/`, reducedMotion: true });
  await sleep(1500);
  let rects = await textRects(page);
  await hideText(page, true);
  let shot = await page.screenshot({ format: "png" });
  if (shots) writeFileSync(join(shots, `contrast-${vp.name}-still.png`), shot.buffer);
  out.still = await measure(helper, shot.buffer, rects, vp.deviceScaleFactor);
  await page.close();
  // Three frames of the film.
  page = await open(browser, vp, { url: `${base}/` });
  if (await waitFor(page, PLAYING, 10000)) {
    rects = await textRects(page);
    out.file = (await state(page)).hero?.file;
    for (const t of FILM_TIMES) {
      await page.evaluate(
        (t) =>
          new Promise((res) => {
            const v = document.getElementById("cs-hero-video");
            v.pause();
            v.addEventListener("seeked", () => requestAnimationFrame(() => requestAnimationFrame(res)), { once: true });
            v.currentTime = t;
          }),
        [t],
      );
      await hideText(page, true);
      shot = await page.screenshot({ format: "png" });
      if (shots) writeFileSync(join(shots, `contrast-${vp.name}-film-${t}s.png`), shot.buffer);
      out[`film@${t}s`] = await measure(helper, shot.buffer, rects, vp.deviceScaleFactor);
      await hideText(page, false);
    }
  } else out.film = "the film never played";
  await page.close();
  await helper.close();
  return out;
}

const USAGE = "node scripts/qa/opening-check.mjs --base URL [--only a,p,e,c] [--shots DIR] [--json FILE]";

run(async () => {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    shots: { type: "string" },
    only: { type: "string" },
    json: { type: "string" },
  });
  const base = (values.base ?? "http://127.0.0.1:3183").replace(/\/$/, "");
  const only = new Set((values.only ?? "a,p,e,c").split(","));
  if (values.shots) mkdirSync(values.shots, { recursive: true });
  const browser = await launchChrome();
  const result = {};
  try {
    for (const vp of [PHONE, DESKTOP]) {
      const r = (result[vp.name] = {});
      if (only.has("a")) r.firstLoad = await firstLoad(browser, vp, base, values.shots);
      if (only.has("p")) r.pauseRemembered = await pauseRemembered(browser, vp, base);
      if (only.has("e")) r.lightPaths = await lightPaths(browser, vp, base);
      if (only.has("c")) r.contrast = await contrast(browser, vp, base, values.shots);
    }
  } finally {
    await browser.close();
  }
  const text = JSON.stringify(result, null, 1);
  if (values.json) writeFileSync(values.json, text);
  console.log(text);
});
