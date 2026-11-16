#!/usr/bin/env node
/**
 * The homepage Opening, measured in Chrome (tags blocked): the forced first
 * visit (marks, LCP, CLS, hero image requests), every skip path, the header
 * Call and the dock during the beat, the returning visit (film plays once,
 * Pause remembered), the light paths (reduced motion, Save-Data, blocked
 * video, ?intro=0) and the settled layout at many widths. Screenshots of the
 * states go to --shots.
 *
 *   node scripts/qa/opening-check.mjs --base http://127.0.0.1:3143 --shots DIR [--only a,b,c,d,e,f] [--json FILE]
 *
 * Loads pages and dispatches input; never submits a form. tel:/sms: clicks
 * are cancelled in the page so nothing leaves the browser.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launchChrome, sleep } from "./lib/chrome.mjs";
import { cli, run } from "./lib/util.mjs";

const PHONE = { name: "phone", width: 390, height: 844, deviceScaleFactor: 3, mobile: true, touch: true };
const DESKTOP = { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, touch: false };

/** Collects LCP, CLS, FCP, input times and the data-intro history from the first byte. */
function collector(opts) {
  window.__qa = { lcp: [], cls: 0, shifts: [], fcp: null, inputs: [], intro: [], clicks: [] };
  const q = window.__qa;
  if (opts.webdriverOff) Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });
  if (opts.saveData && window.NetworkInformation) {
    Object.defineProperty(NetworkInformation.prototype, "saveData", { get: () => true });
  }
  if (opts.storage) {
    for (const [k, v] of Object.entries(opts.storage)) {
      try {
        localStorage.setItem(k, v === "@now" ? String(Date.now()) : v);
      } catch {}
    }
  }
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      q.lcp.push({ t: Math.round(e.startTime), size: e.size, url: (e.url || "").slice(0, 120), tag: e.element ? e.element.tagName : null, cls: e.element ? String(e.element.className || "") : null });
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
  const record = () => {
    const h = document.documentElement;
    if (!h) return;
    const key = (h.getAttribute("data-intro") || "none") + (h.hasAttribute("data-intro-settle") ? "+settle" : "");
    const last = q.intro[q.intro.length - 1];
    if (!last || last.v !== key) q.intro.push({ v: key, t: Math.round(performance.now()) });
  };
  new MutationObserver(record).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-intro", "data-intro-settle"] });
  for (const t of ["keydown", "wheel", "touchstart", "pointerdown"])
    window.addEventListener(t, () => q.inputs.push({ type: t, t: Math.round(performance.now()) }), { capture: true, passive: true });
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target && e.target.closest && e.target.closest("a");
      q.clicks.push({ href: a ? a.getAttribute("href") : null, intro: document.documentElement.getAttribute("data-intro") });
      if (a && /^(tel|sms):/.test(a.getAttribute("href") || "")) e.preventDefault();
    },
    true,
  );
}

async function open(browser, vp, { url, init = {}, reducedMotion = false, video = "pass", waitUntil = "domcontentloaded" }) {
  const page = await browser.newPage({ ...vp, reducedMotion });
  if (video !== "pass") {
    await page.session.send("Fetch.enable", { patterns: [{ urlPattern: "*/videos/*" }] });
    page.session.on("Fetch.requestPaused", ({ requestId }) => {
      if (video === "block") page.session.send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" }).catch(() => {});
      else setTimeout(() => page.session.send("Fetch.continueRequest", { requestId }).catch(() => {}), video);
    });
  }
  await page.addInitScript(collector, [init]);
  await page.goto(url, { waitUntil });
  return page;
}

const state = (page) =>
  page.evaluate(() => {
    const img = document.querySelector(".cs-hero-still");
    const frame = document.getElementById("cs-hero-frame");
    return {
      intro: document.documentElement.getAttribute("data-intro"),
      hero: window.__csHero ? { ...window.__csHero } : null,
      film: frame ? frame.getAttribute("data-film") : null,
      still: img ? { complete: img.complete, w: img.naturalWidth, src: (img.currentSrc || "").replace(/^.*url=/, "").slice(0, 70) } : null,
      controls: [...document.querySelectorAll(".cs-hero-controls button")].map((b) => b.getAttribute("aria-label")),
      qa: window.__qa,
      marks: performance.getEntriesByType("mark").map((m) => [m.name, Math.round(m.startTime)]),
    };
  });

const waitFor = (page, fnSource, timeout = 8000) =>
  page.evaluate(
    `new Promise((res) => { const t0 = performance.now(); const tick = () => { let v; try { v = (${fnSource})(); } catch (e) {} if (v) return res(v); if (performance.now() - t0 > ${timeout}) return res(null); setTimeout(tick, 16); }; tick(); })`,
  );

const heroImageRequests = (page) =>
  page.requests.filter((r) => /drone-construction|home\.hero\.mobile/.test(decodeURIComponent(r.url))).map((r) => r.url.replace(/^.*url=/, "").slice(0, 90));
const videoRequests = (page) => page.requests.filter((r) => /\/videos\//.test(r.url)).map((r) => r.url.replace(/^https?:\/\/[^/]+/, ""));

async function center(page, selector) {
  return page.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility === "visible";
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const top = document.elementFromPoint(x, y);
    return { x, y, hit: !!top && (top === el || el.contains(top)), href: el.getAttribute("href") };
  }, [selector]);
}

async function tap(page, vp, x, y) {
  if (vp.touch) {
    await page.session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await page.session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.session.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    await page.session.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
    await page.session.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  }
}

async function freezeAnimations(page) {
  await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
}

// --- (a) forced first visit, no input --------------------------------------------
async function firstVisit(browser, vp, base, shots) {
  const page = await open(browser, vp, { url: `${base}/?intro=1`, waitUntil: "load" });
  await sleep(6000);
  const s = await state(page);
  if (shots) await page.screenshot({ path: join(shots, `${vp.name}-settled.jpg`) });
  const lastLcp = s.qa.lcp[s.qa.lcp.length - 1];
  const out = {
    introHistory: s.qa.intro,
    marks: Object.fromEntries(s.marks),
    fcp: s.qa.fcp,
    lcpEntries: s.qa.lcp,
    lastLcpIsStill: !!lastLcp && /cs-hero-still/.test(lastLcp.cls ?? ""),
    lcpMinusFcp: lastLcp ? lastLcp.t - s.qa.fcp : null,
    cls: Number(s.qa.cls.toFixed(4)),
    shifts: s.qa.shifts,
    heroImageRequests: heroImageRequests(page),
    videoRequests: videoRequests(page),
    final: { intro: s.intro, hero: s.hero, film: s.film, controls: s.controls, still: s.still },
    report: page.report(),
  };
  await page.close();
  return out;
}

// --- screenshots of the wait state and mid-beat ---------------------------------------
async function beatShots(browser, vp, base, shots) {
  const out = {};
  // wait: hold the film back so the title card stays up
  let page = await open(browser, vp, { url: `${base}/?intro=1`, video: 900 });
  out.wait = await waitFor(page, `() => { const i = document.querySelector('.cs-hero-still'); return document.documentElement.getAttribute('data-intro') === 'wait' && i && i.complete && i.naturalWidth > 0 && 'wait'; }`, 900);
  if (out.wait) {
    await freezeAnimations(page);
    if (shots) await page.screenshot({ path: join(shots, `${vp.name}-wait.jpg`) });
    out.waitStillHeld = (await state(page)).intro;
  }
  await page.close();
  // mid-beat: 350 ms into the settle
  page = await open(browser, vp, { url: `${base}/?intro=1` });
  out.mid = await waitFor(page, `() => document.documentElement.hasAttribute('data-intro-settle') && 'settle'`, 5000);
  if (out.mid) {
    await sleep(330);
    await freezeAnimations(page);
    if (shots) await page.screenshot({ path: join(shots, `${vp.name}-mid-beat.jpg`) });
  }
  await page.close();
  // skip state: 80 ms after a key press
  page = await open(browser, vp, { url: `${base}/?intro=1`, video: 900 });
  if (await waitFor(page, `() => document.documentElement.getAttribute('data-intro') === 'wait'`, 900)) {
    await page.session.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await sleep(80);
    await freezeAnimations(page);
    if (shots) await page.screenshot({ path: join(shots, `${vp.name}-skip.jpg`) });
    out.skipShot = true;
  }
  await page.close();
  return out;
}

// --- (b) skip paths ----------------------------------------------------------------------
async function skips(browser, vp, base) {
  const results = {};
  const paths = {
    button: async (page) => {
      const c = await center(page, "[data-intro-skip]");
      await tap(page, vp, c.x, c.y);
    },
    key: (page) => page.session.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }),
    scroll: async (page) => {
      if (vp.touch) {
        await page.session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 500 }] });
        await page.session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: 380 }] });
        await page.session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      } else {
        await page.session.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 700, y: 450, deltaX: 0, deltaY: 120 });
      }
    },
    "click-outside": (page) => tap(page, vp, 6, Math.round(vp.height / 2)),
  };
  for (const [name, act] of Object.entries(paths)) {
    for (const phase of ["wait", "play"]) {
      const page = await open(browser, vp, { url: `${base}/?intro=1`, video: phase === "wait" ? 900 : "pass" });
      const ok = await waitFor(page, `() => document.documentElement.getAttribute('data-intro') === '${phase}'`, 3000);
      if (!ok) {
        results[`${name}/${phase}`] = { error: `never reached ${phase}` };
        await page.close();
        continue;
      }
      await act(page);
      await sleep(600);
      const s = await state(page);
      const input = s.qa.inputs[0];
      const skip = s.qa.intro.find((e) => e.v === "skip");
      const end = s.qa.intro.find((e, i) => e.v === "none" && i > 0);
      const focus = await page.evaluate(() => document.activeElement && (document.activeElement.getAttribute("href") || document.activeElement.tagName));
      results[`${name}/${phase}`] = {
        inputToSkipMs: input && skip ? skip.t - input.t : null,
        inputToSettledMs: input && end ? end.t - input.t : null,
        final: s.intro,
        heroIntro: s.hero && s.hero.intro,
        focus: name === "button" ? focus : undefined,
      };
      await page.close();
    }
  }
  return results;
}

// --- (c) header Call and dock during the beat ---------------------------------------------
async function chromeDuringBeat(browser, vp, base) {
  const page = await open(browser, vp, { url: `${base}/?intro=1`, video: 900 });
  await waitFor(page, `() => document.documentElement.getAttribute('data-intro') === 'wait'`, 900);
  const targets = await page.evaluate(() =>
    [...document.querySelectorAll('nav a[href^="tel:"], header a[href^="tel:"], [data-drawer-hide] a')]
      .filter((a) => {
        const r = a.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(a).visibility === "visible";
      })
      .map((a) => {
        const r = a.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const top = document.elementFromPoint(x, y);
        return { href: a.getAttribute("href").slice(0, 24), x, y, onTop: !!top && (top === a || a.contains(top)) };
      }),
  );
  const clicked = [];
  for (const t of targets) {
    if (!t.href.startsWith("tel:") && !t.href.startsWith("sms:")) continue; // never follow a page link here
    await tap(page, vp, t.x, t.y);
    await sleep(30);
  }
  const s = await state(page);
  for (const c of s.qa.clicks) clicked.push(c);
  await page.close();
  return { targets, clicks: clicked, introAfterClicks: s.qa.intro.map((e) => e.v) };
}

// --- (d) returning visit ------------------------------------------------------------------
async function returning(browser, vp, base) {
  const out0 = {};
  const init = { webdriverOff: true, storage: { "cs-intro-seen": "@now" } };
  let page = await open(browser, vp, { url: `${base}/`, init });
  // The phone frame sits below the actions: bring it on screen (the film waits until it is).
  await sleep(500);
  out0.before = (await state(page)).hero;
  await page.evaluate(() => document.getElementById("cs-hero-frame").scrollIntoView({ block: "center" }));
  const playing = await waitFor(page, `() => window.__csHero && window.__csHero.state === 'playing' && document.getElementById('cs-hero-frame').getAttribute('data-film') === 'on' && 'playing'`, 8000);
  let s = await state(page);
  const out = { ...out0, introAttr: s.qa.intro.map((e) => e.v), playing: !!playing, file: s.hero && s.hero.file, controlsWhilePlaying: s.controls };
  const rested = await waitFor(page, `() => window.__csHero && window.__csHero.state === 'resting' && 'resting'`, 14000);
  s = await state(page);
  out.rested = !!rested;
  out.filmAfterEnd = s.film;
  out.controlsAfterEnd = s.controls;
  await page.close();

  // Pause, then reload in the same context
  const context = await browser.newContext();
  page = await open(browser, { ...vp, browserContextId: context }, { url: `${base}/`, init });
  await page.evaluate(() => document.getElementById("cs-hero-frame").scrollIntoView({ block: "center" }));
  await waitFor(page, `() => window.__csHero && window.__csHero.state === 'playing' && 'p'`, 8000);
  const c = await center(page, '.cs-hero-controls button[aria-label="Pause the film"]');
  out.pauseButton = c ? { hit: c.hit } : null;
  if (c) await tap(page, vp, c.x, c.y);
  await sleep(300);
  s = await state(page);
  out.afterPause = { state: s.hero && s.hero.state, pref: await page.evaluate(() => localStorage.getItem("cs-hero-motion")), controls: s.controls };
  const before = page.requests.length;
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.evaluate(() => document.getElementById("cs-hero-frame").scrollIntoView({ block: "center" }));
  await sleep(1500);
  s = await state(page);
  out.afterReload = {
    state: s.hero && s.hero.state,
    controls: s.controls,
    film: s.film,
    videoRequestsAfterReload: page.requests.slice(before).filter((r) => /\/videos\//.test(r.url)).length,
  };
  out.report = page.report();
  await page.close();
  await browser.disposeContext(context);
  return out;
}

// --- (e) the light paths -------------------------------------------------------------------
async function lightPaths(browser, vp, base, shots) {
  const cases = {
    "reduced-motion": { url: `${base}/?intro=1`, reducedMotion: true },
    "save-data": { url: `${base}/?intro=1`, init: { saveData: true } },
    "blocked-video": { url: `${base}/?intro=1`, video: "block" },
    "intro=0": { url: `${base}/?intro=0` },
  };
  const out = {};
  for (const [name, opt] of Object.entries(cases)) {
    const page = await open(browser, vp, { ...opt, waitUntil: "load" });
    await sleep(2500);
    const s = await state(page);
    if (shots && name === "reduced-motion") await page.screenshot({ path: join(shots, `${vp.name}-reduced-motion.jpg`) });
    out[name] = {
      introHistory: s.qa.intro.map((e) => e.v),
      final: s.intro,
      hero: s.hero,
      film: s.film,
      still: s.still,
      controls: s.controls,
      heroImageRequests: heroImageRequests(page).length,
      videoRequests: videoRequests(page).length,
      consoleErrors: page.consoleErrors().map((e) => String(e.text || e.message || "").slice(0, 120)),
      pageErrors: page.errors.length,
    };
    await page.close();
  }
  return out;
}

// --- (f) widths -------------------------------------------------------------------------------
async function widths(browser, base, shots) {
  const sizes = [
    [320, 568, true], [360, 740, true], [390, 844, true], [430, 932, true], [844, 390, true], [768, 1024, true],
    [1024, 768, false], [1120, 800, false], [1280, 800, false], [1440, 900, false], [1920, 1080, false], [2560, 1440, false],
  ];
  const out = {};
  for (const [w, h, touch] of sizes) {
    const vp = { name: `${w}x${h}`, width: w, height: h, deviceScaleFactor: 1, mobile: touch, touch };
    const page = await open(browser, vp, { url: `${base}/?intro=0`, waitUntil: "load" });
    await sleep(300);
    const r = await page.evaluate(() => {
      const frame = document.getElementById("cs-hero-frame").getBoundingClientRect();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) * 16 || 0;
      const dockEl = document.querySelector("[data-drawer-hide]");
      const dock = dockEl && getComputedStyle(dockEl).display !== "none" ? dockEl.getBoundingClientRect().height : 0;
      const copy = [...document.querySelectorAll(".cs-hero [data-intro-in]:not(figcaption), .cs-hero h1")];
      const overlaps = copy
        .map((el) => [el.tagName, el.getBoundingClientRect()])
        .filter(([, b]) => b.right > frame.left + 1 && b.left < frame.right - 1 && b.bottom > frame.top + 1 && b.top < frame.bottom - 1)
        .map(([t]) => t);
      return {
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        frame: { w: Math.round(frame.width), h: Math.round(frame.height), top: Math.round(frame.top) },
        roomBetweenHeaderAndDock: Math.round(innerHeight - nav - dock),
        frameFits: frame.height <= innerHeight - nav - dock,
        textOnPhoto: overlaps,
      };
    });
    if (shots && (w === 320 || w === 844)) await page.screenshot({ path: join(shots, `settled-${w}x${h}.jpg`) });
    out[vp.name] = r;
    await page.close();
  }
  return out;
}

const USAGE = "node scripts/qa/opening-check.mjs --base URL [--shots DIR] [--only a,b,c,d,e,f,s] [--json FILE]";

run(async () => {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    shots: { type: "string" },
    only: { type: "string" },
    json: { type: "string" },
  });
  const base = (values.base ?? "http://127.0.0.1:3143").replace(/\/$/, "");
  const only = new Set((values.only ?? "a,s,b,c,d,e,f").split(","));
  if (values.shots) mkdirSync(values.shots, { recursive: true });
  const browser = await launchChrome();
  const result = {};
  try {
    for (const vp of [PHONE, DESKTOP]) {
      const r = (result[vp.name] = {});
      if (only.has("a")) r.firstVisit = await firstVisit(browser, vp, base, values.shots);
      if (only.has("s")) r.beatShots = await beatShots(browser, vp, base, values.shots);
      if (only.has("b")) r.skips = await skips(browser, vp, base);
      if (only.has("c")) r.chromeDuringBeat = await chromeDuringBeat(browser, vp, base);
      if (only.has("d")) r.returning = await returning(browser, vp, base);
      if (only.has("e")) r.lightPaths = await lightPaths(browser, vp, base, values.shots);
    }
    if (only.has("f")) result.widths = await widths(browser, base, values.shots);
  } finally {
    await browser.close();
  }
  const text = JSON.stringify(result, null, 1);
  if (values.json) writeFileSync(values.json, text);
  console.log(text);
});
