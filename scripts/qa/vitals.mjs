#!/usr/bin/env node
/**
 * Page-load measurements on the production build, per route and viewport.
 *
 *   node scripts/qa/vitals.mjs --base http://localhost:3111 --out vitals.json \
 *     --routes /,/about --viewports desktop,mobile --cpu 4 --network fast4g --throttle mobile
 *
 * Each route/viewport gets N cold runs and M warm runs:
 *   cold  a new browser context (empty cache, storage, sockets) on an origin
 *         this browser has never used: c1.localhost:PORT, c2.localhost:PORT, …
 *   warm  another tab in the context and origin of the last cold run, so the
 *         HTTP cache is primed.
 *
 * A probe installed before any page script records, per run: navigation
 * timing (TTFB, DOMContentLoaded, load), first contentful paint, the final
 * largest-contentful-paint entry (time, size, URL, element, and that
 * resource's transfer size), cumulative layout shift with its sources, long
 * tasks, resources by kind (first- and third-party), DOM size and any
 * performance.mark named "intro:*" or "video:*". The page is read `--settle`
 * ms after its load event (default 5000) once the network has gone quiet.
 *
 * Tag hosts are blocked, so tag scripts weigh nothing here; attempts are
 * counted. Output: JSON with every run, and a Markdown table of medians.
 */

import { launchChrome, NETWORK_PRESETS, resolveViewports, sleep } from "./lib/chrome.mjs";
import {
  cell,
  cli,
  freshOrigin,
  hostFacts,
  intArg,
  isMain,
  kb,
  listArg,
  normalizeBase,
  pairsArg,
  progress,
  run,
  stats,
  UsageError,
  writeFile,
  writeJson,
} from "./lib/util.mjs";

const USAGE = `
Usage: node scripts/qa/vitals.mjs --base http://localhost:PORT --out FILE.json --routes LIST [options]

  --base URL          origin of the running production build (localhost, so fresh origins can be used)
  --out FILE.json     every run plus the medians; the Markdown table goes next to it (FILE.md) unless --md is given
  --md FILE.md        where to write the Markdown table
  --routes LIST       comma separated paths, e.g. /,/about (a query string is allowed: "/?intro=1")
  --viewports LIST    desktop (1440x900 @1x), mobile (390x844 @2x, mobile + touch), a width, or WxH; default desktop,mobile
  --cold N            cold runs per route and viewport, default 5
  --warm M            warm runs per route and viewport, default 3
  --cpu RATE          CPU slowdown, e.g. 4 (Emulation.setCPUThrottlingRate)
  --network PRESET    fast4g or slow4g (Network.emulateNetworkConditions)
  --throttle LIST     viewports that --cpu and --network apply to (default: all of them)
  --reduced-motion    emulate prefers-reduced-motion: reduce
  --storage LIST      localStorage entries set before load, key=value ("now" = current time in ms)
  --settle MS         read the page this long after its load event, default 5000
  --timeout MS        load timeout, default 60000
`;

/** Installed before any page script; records what cannot be read back later. */
export function installProbe() {
  if (window.top !== window || window.__qaVitals) return;
  const describe = (node) => {
    if (!node || node.nodeType !== 1) return null;
    const cls = typeof node.className === "string" ? node.className.trim() : "";
    return { tag: node.tagName.toLowerCase(), id: node.id || null, class: cls ? cls.slice(0, 160) : null };
  };
  const box = (r) => (r ? { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } : null);
  const store = (window.__qaVitals = { lcp: [], shifts: [], longTasks: [] });
  try {
    performance.setResourceTimingBufferSize(4000);
  } catch {
    // keep the default buffer
  }
  const observe = (type, record) => {
    try {
      new PerformanceObserver((list) => list.getEntries().forEach(record)).observe({ type, buffered: true });
    } catch {
      // entry type not supported
    }
  };
  observe("largest-contentful-paint", (e) =>
    store.lcp.push({ time: e.startTime, renderTime: e.renderTime, loadTime: e.loadTime, size: e.size, url: e.url || null, element: describe(e.element) })
  );
  observe("layout-shift", (e) =>
    store.shifts.push({
      time: e.startTime,
      value: e.value,
      hadRecentInput: e.hadRecentInput,
      sources: (e.sources || []).slice(0, 4).map((s) => ({ node: describe(s.node), from: box(s.previousRect), to: box(s.currentRect) })),
    })
  );
  observe("longtask", (e) => store.longTasks.push({ time: e.startTime, duration: e.duration }));
}

/** Runs in the page when the run is over. */
export function readProbe() {
  const store = window.__qaVitals ?? { lcp: [], shifts: [], longTasks: [] };
  const nav = performance.getEntriesByType("navigation")[0];
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  return {
    href: location.href,
    origin: location.origin,
    readyState: document.readyState,
    visibility: document.visibilityState,
    navigation: nav
      ? {
          type: nav.type,
          protocol: nav.nextHopProtocol,
          redirectCount: nav.redirectCount,
          responseStart: nav.responseStart,
          domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
          loadEventEnd: nav.loadEventEnd,
          transferSize: nav.transferSize,
          encodedBodySize: nav.encodedBodySize,
          decodedBodySize: nav.decodedBodySize,
        }
      : null,
    paints: Object.fromEntries(performance.getEntriesByType("paint").map((p) => [p.name, p.startTime])),
    lcp: store.lcp,
    shifts: store.shifts,
    longTasks: store.longTasks,
    resources: performance.getEntriesByType("resource").map((r) => ({
      name: r.name,
      initiatorType: r.initiatorType,
      transferSize: r.transferSize,
      encodedBodySize: r.encodedBodySize,
      decodedBodySize: r.decodedBodySize,
      startTime: r.startTime,
      responseEnd: r.responseEnd,
    })),
    marks: performance
      .getEntriesByType("mark")
      .filter((m) => /^(intro|video):/.test(m.name))
      .map((m) => ({ name: m.name, time: m.startTime })),
    domElements: document.getElementsByTagName("*").length,
    // The biggest images on the first screen, whatever the LCP heuristics made of them.
    firstScreenImages: [...document.images]
      .map((img) => {
        const r = img.getBoundingClientRect();
        const w = Math.max(0, Math.min(r.right, viewport.width) - Math.max(r.left, 0));
        const h = Math.max(0, Math.min(r.bottom, viewport.height) - Math.max(r.top, 0));
        return {
          src: img.currentSrc || img.getAttribute("src") || "",
          area: Math.round(w * h),
          loading: img.loading,
          fetchPriority: img.fetchPriority,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        };
      })
      .filter((img) => img.area > 0 && img.src && !img.src.startsWith("data:"))
      .sort((a, b) => b.area - a.area)
      .slice(0, 4),
    intro: document.documentElement.getAttribute("data-intro"),
    videos: [...document.querySelectorAll("video")].map((video) => {
      const r = video.getBoundingClientRect();
      return {
        src: video.currentSrc || null,
        readyState: video.readyState,
        paused: video.paused,
        ended: video.ended,
        currentTime: video.currentTime,
        width: Math.round(r.width),
        height: Math.round(r.height),
        inFirstScreen: r.width > 0 && r.height > 0 && r.top < viewport.height && r.bottom > 0,
      };
    }),
  };
}

const BUCKETS = ["document", "js", "css", "font", "img", "video", "other"];
const CDP_BUCKET = { Script: "js", Stylesheet: "css", Font: "font", Image: "img", Media: "video", Document: "document" };

function bucketOf(url, cdpType) {
  if (CDP_BUCKET[cdpType]) return CDP_BUCKET[cdpType];
  let pathname = "";
  try {
    pathname = new URL(url).pathname.toLowerCase();
  } catch {
    return "other";
  }
  if (/\.(m?js)$/.test(pathname)) return "js";
  if (/\.css$/.test(pathname)) return "css";
  if (/\.(woff2?|ttf|otf|eot)$/.test(pathname)) return "font";
  if (pathname === "/_next/image" || /\.(png|jpe?g|gif|webp|avif|svg|ico)$/.test(pathname)) return "img";
  if (/\.(mp4|webm|mov|m4v)$/.test(pathname)) return "video";
  return "other";
}

const emptyBuckets = () =>
  Object.fromEntries(BUCKETS.map((b) => [b, { count: 0, transferSize: 0, encodedBodySize: 0, decodedBodySize: 0 }]));

/** Largest burst of layout shifts: shifts under 1 s apart, 5 s at most (the Core Web Vitals definition). */
function sessionCls(shifts) {
  let best = 0;
  let sum = 0;
  let start = 0;
  let last = -Infinity;
  for (const shift of shifts) {
    if (shift.time - last > 1000 || shift.time - start > 5000) {
      sum = 0;
      start = shift.time;
    }
    sum += shift.value;
    last = shift.time;
    best = Math.max(best, sum);
  }
  return best;
}

export function digest(raw, page) {
  const local = (url) => {
    try {
      const u = new URL(url);
      return u.origin === raw.origin ? u.pathname + u.search : url;
    } catch {
      return url;
    }
  };
  const isFirstParty = (url) => {
    try {
      return new URL(url).origin === raw.origin;
    } catch {
      return false;
    }
  };
  const cdpType = new Map();
  for (const request of page.requests) cdpType.set(request.url, request.type);

  const firstParty = emptyBuckets();
  const thirdParty = emptyBuckets();
  const tally = (target, bucket, entry) => {
    target[bucket].count += 1;
    target[bucket].transferSize += entry.transferSize ?? 0;
    target[bucket].encodedBodySize += entry.encodedBodySize ?? 0;
    target[bucket].decodedBodySize += entry.decodedBodySize ?? 0;
  };
  if (raw.navigation) tally(firstParty, "document", raw.navigation);
  const sized = [];
  // JavaScript requested before the load event: what the page itself needs,
  // as opposed to widgets and route prefetches that start once it is idle.
  const jsByLoad = { count: 0, transferSize: 0, encodedBodySize: 0 };
  const loadEnd = raw.navigation?.loadEventEnd || Infinity;
  for (const resource of raw.resources) {
    const bucket = bucketOf(resource.name, cdpType.get(resource.name));
    const mine = isFirstParty(resource.name);
    tally(mine ? firstParty : thirdParty, bucket === "document" ? "other" : bucket, resource);
    sized.push({ url: local(resource.name), bucket, firstParty: mine, transferSize: resource.transferSize, encodedBodySize: resource.encodedBodySize });
    if (mine && bucket === "js" && resource.startTime <= loadEnd) {
      jsByLoad.count += 1;
      jsByLoad.transferSize += resource.transferSize ?? 0;
      jsByLoad.encodedBodySize += resource.encodedBodySize ?? 0;
    }
  }
  const firstScreenImages = raw.firstScreenImages.map((img) => {
    const timing = raw.resources.find((r) => r.name === img.src);
    return {
      url: local(img.src),
      area: img.area,
      loading: img.loading,
      fetchPriority: img.fetchPriority,
      loaded: img.complete && img.naturalWidth > 0,
      responseEnd: timing ? timing.responseEnd : null,
      transferSize: timing ? timing.transferSize : null,
    };
  });
  const total = (buckets) =>
    Object.values(buckets).reduce(
      (sum, b) => ({ count: sum.count + b.count, transferSize: sum.transferSize + b.transferSize, encodedBodySize: sum.encodedBodySize + b.encodedBodySize }),
      { count: 0, transferSize: 0, encodedBodySize: 0 }
    );

  // The same weights as the network saw them (bytes on the wire, headers included).
  const wire = { firstParty: emptyBuckets(), thirdParty: emptyBuckets() };
  for (const request of page.requests) {
    if (request.tagHost) continue;
    const side = isFirstParty(request.url) ? wire.firstParty : wire.thirdParty;
    const bucket = bucketOf(request.url, request.type);
    side[bucket].count += 1;
    side[bucket].transferSize += request.encodedDataLength ?? 0;
  }
  const wireBytes = (side) => Object.fromEntries(BUCKETS.map((b) => [b, { count: side[b].count, bytes: side[b].transferSize }]));

  const final = raw.lcp.length ? raw.lcp[raw.lcp.length - 1] : null;
  const lcpResource = final?.url ? raw.resources.find((r) => r.name === final.url) : null;
  const shifts = raw.shifts.filter((s) => !s.hadRecentInput);
  const tasks = raw.longTasks;
  const heroVideo = raw.videos.find((v) => v.inFirstScreen && v.src && (v.readyState >= 2 || v.currentTime > 0));
  const tags = page.tagAttempts();

  return {
    ttfb: raw.navigation?.responseStart ?? null,
    dcl: raw.navigation?.domContentLoadedEventEnd ?? null,
    load: raw.navigation?.loadEventEnd || null,
    fcp: raw.paints["first-contentful-paint"] ?? null,
    lcp: final
      ? {
          time: final.time,
          size: final.size,
          url: final.url ? local(final.url) : null,
          element: final.element,
          resource: lcpResource
            ? { transferSize: lcpResource.transferSize, encodedBodySize: lcpResource.encodedBodySize, decodedBodySize: lcpResource.decodedBodySize, responseEnd: lcpResource.responseEnd }
            : null,
          candidates: raw.lcp.map((c) => ({ time: Math.round(c.time), size: c.size, tag: c.element?.tag ?? null, url: c.url ? local(c.url) : null })),
        }
      : null,
    cls: sessionCls(shifts),
    clsTotal: shifts.reduce((sum, s) => sum + s.value, 0),
    shiftCount: shifts.length,
    shifts: [...shifts]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((s) => ({ time: Math.round(s.time), value: Number(s.value.toFixed(5)), sources: s.sources })),
    longTasks: {
      count: tasks.length,
      maxMs: tasks.reduce((max, t) => Math.max(max, t.duration), 0),
      totalMs: tasks.reduce((sum, t) => sum + t.duration, 0),
      sumOver50Ms: tasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0),
    },
    resources: { firstParty, thirdParty, firstPartyTotal: total(firstParty), thirdPartyTotal: total(thirdParty), jsByLoad },
    firstScreenImages,
    wire: { firstParty: wireBytes(wire.firstParty), thirdParty: wireBytes(wire.thirdParty) },
    largest: sized
      .filter((r) => r.transferSize > 0)
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 8),
    domElements: raw.domElements,
    marks: raw.marks.map((m) => ({ name: m.name, time: Math.round(m.time) })),
    path: {
      intro: raw.intro, // <html data-intro> when the page was read; null when the attribute is absent
      introRan: raw.marks.some((m) => m.name.startsWith("intro:")),
      hero: heroVideo ? "video" : "still",
      video: raw.videos.map((v) => ({ ...v, src: v.src ? local(v.src) : null })),
    },
    navigation: raw.navigation ? { type: raw.navigation.type, protocol: raw.navigation.protocol } : null,
    tags: { attempts: tags.length, blocked: tags.filter((t) => t.blocked).length, hosts: [...new Set(tags.map((t) => t.host))].sort(), leaks: page.tagLeaks().length },
    consoleErrors: page.consoleErrors().length,
    failedFirstPartyRequests: page.failedFirstPartyRequests().length,
  };
}

async function measure(browser, { url, profile, browserContextId, options }) {
  const started = Date.now();
  const page = await browser.newPage({
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: profile.deviceScaleFactor,
    mobile: profile.mobile,
    touch: profile.touch,
    reducedMotion: options.reducedMotion,
    cpuThrottle: profile.cpuThrottle,
    network: profile.network,
    browserContextId,
  });
  try {
    await page.addInitScript(installProbe);
    await page.seedLocalStorage(options.storage);
    const nav = await page.goto(url, { waitUntil: "load", timeout: options.timeout });
    const loadedAt = Date.now();
    const idle = await page.waitForNetworkIdle({ idleMs: 500, timeout: 20000 });
    const rest = options.settle - (Date.now() - loadedAt);
    if (rest > 0) await sleep(rest);
    const raw = await page.evaluate(readProbe);
    const env = await page.env();
    return {
      status: nav.status,
      networkIdle: idle,
      readAfterLoadMs: Date.now() - loadedAt,
      env: {
        webdriver: env.webdriver,
        userAgent: env.userAgent,
        effectiveType: env.effectiveType,
        downlink: env.downlink,
        rtt: env.rtt,
        saveData: env.saveData,
        devicePixelRatio: env.devicePixelRatio,
        innerWidth: env.innerWidth,
        innerHeight: env.innerHeight,
        reducedMotion: env.reducedMotion,
        pointerCoarse: env.pointerCoarse,
        visibilityState: env.visibilityState,
      },
      ...digest(raw, page),
      ms: Date.now() - started,
    };
  } finally {
    await page.close();
  }
}

/* ------------------------------ summary ------------------------------ */

const METRICS = {
  ttfb: (r) => r.ttfb,
  fcp: (r) => r.fcp,
  lcp: (r) => r.lcp?.time,
  cls: (r) => r.cls,
  dcl: (r) => r.dcl,
  load: (r) => r.load,
  longTaskCount: (r) => r.longTasks.count,
  longTaskMaxMs: (r) => r.longTasks.maxMs,
  longTaskSumOver50Ms: (r) => r.longTasks.sumOver50Ms,
  lcpSize: (r) => r.lcp?.size,
  lcpTransfer: (r) => r.lcp?.resource?.transferSize,
  firstScreenImageLoaded: (r) => r.firstScreenImages[0]?.responseEnd,
  firstScreenImageTransfer: (r) => r.firstScreenImages[0]?.transferSize,
  jsByLoadTransfer: (r) => r.resources.jsByLoad.transferSize,
  jsByLoadCount: (r) => r.resources.jsByLoad.count,
  domElements: (r) => r.domElements,
  requests: (r) => r.resources.firstPartyTotal.count,
  transfer: (r) => r.resources.firstPartyTotal.transferSize,
  thirdPartyRequests: (r) => r.resources.thirdPartyTotal.count,
  thirdPartyTransfer: (r) => r.resources.thirdPartyTotal.transferSize,
  ...Object.fromEntries(BUCKETS.map((b) => [`${b}Transfer`, (r) => r.resources.firstParty[b].transferSize])),
  ...Object.fromEntries(BUCKETS.map((b) => [`${b}Encoded`, (r) => r.resources.firstParty[b].encodedBodySize])),
  ...Object.fromEntries(BUCKETS.map((b) => [`${b}Count`, (r) => r.resources.firstParty[b].count])),
};

function summarize(runs) {
  const groups = new Map();
  for (const item of runs) {
    if (item.error) continue;
    const key = JSON.stringify([item.route, item.profile, item.kind]);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  /** "/_next/image?url=%2Fimages%2Fa.jpg&w=750&q=75" -> "/images/a.jpg (w750)". */
  const source = (url) => {
    if (!url) return "";
    const [pathname, query = ""] = url.split("?");
    if (pathname !== "/_next/image") return url;
    const params = new URLSearchParams(query);
    return `${params.get("url") ?? url} (w${params.get("w")})`;
  };
  /** The values seen across the runs, most common first, with counts when they differ. */
  const tallyLabels = (labels) => {
    const seen = new Map();
    for (const label of labels) seen.set(label, (seen.get(label) ?? 0) + 1);
    return [...seen].sort((a, b) => b[1] - a[1]).map(([label, n]) => (seen.size > 1 ? `${label} (${n}/${labels.length})` : label));
  };
  return [...groups].map(([key, list]) => {
    const [route, profile, kind] = JSON.parse(key);
    return {
      route,
      profile,
      kind,
      runs: list.length,
      metrics: Object.fromEntries(Object.entries(METRICS).map(([name, pick]) => [name, stats(list.map(pick))])),
      lcpElement: tallyLabels(
        list.map((item) => {
          const e = item.lcp?.element;
          if (!item.lcp) return "(no LCP entry)";
          const name = e ? `${e.tag}${e.id ? `#${e.id}` : ""}${e.class ? `.${e.class.split(/\s+/)[0]}` : ""}` : "(element gone)";
          return item.lcp.url ? `${name} ${source(item.lcp.url)}` : name;
        })
      ),
      firstScreenImage: tallyLabels(list.map((item) => (item.firstScreenImages[0] ? source(item.firstScreenImages[0].url) : "(none)"))),
      hero: [...new Set(list.map((r) => r.path.hero))],
      intro: [...new Set(list.map((r) => r.path.intro ?? "none"))],
      effectiveType: [...new Set(list.map((r) => r.env.effectiveType))],
    };
  });
}

function markdown(report) {
  const lines = [];
  const add = (line = "") => lines.push(line);
  const first = report.runs.find((r) => !r.error);
  const ms = (s) => (s.median === null ? "–" : s.min === s.max ? `${Math.round(s.median)}` : `${Math.round(s.median)} (${Math.round(s.min)}–${Math.round(s.max)})`);
  const shift = (s) => (s.median === null ? "–" : s.min === s.max ? s.median.toFixed(3) : `${s.median.toFixed(3)} (${s.min.toFixed(3)}–${s.max.toFixed(3)})`);
  const size = (s) => (s.median === null ? "–" : s.min === s.max ? kb(s.median) : `${kb(s.median)} (${kb(s.min)}–${kb(s.max)})`);
  const count = (s) => (s.median === null ? "–" : s.min === s.max ? `${s.median}` : `${s.median} (${s.min}–${s.max})`);

  add("# Page-load measurements");
  add();
  add(`- Base: ${report.base} — ${report.generatedAt}`);
  add(`- Browser: ${report.browser?.product}; navigator.webdriver ${first?.env.webdriver}`);
  add(`- User agent: \`${first?.env.userAgent}\``);
  add(`- Machine: ${report.host.platform}, ${report.host.cpus} CPUs, load average ${report.host.loadavg.join(" / ")} at the start`);
  add(`- Protocol: ${report.protocol.cold} cold run(s) on a fresh origin and browser context each (${report.protocol.freshOrigins ? "c1.localhost, c2.localhost, …" : "same origin: the base is not localhost"}), then ${report.protocol.warm} warm run(s) in the last cold run's context; each page is read ${report.protocol.settleMs} ms after its load event.`);
  add(`- Tag hosts are blocked: tag scripts weigh 0 here. Attempts seen: ${report.totals.tagAttempts} (${report.totals.tagBlocked} blocked, ${report.totals.tagLeaks} leaked) to ${report.totals.tagHosts.join(", ") || "no host"}.`);
  add(`- Sizes are KB (1024 bytes) of first-party transfer size from Resource Timing (body + headers, compressed); times are ms since navigation start. Values are the median, with (min–max) when the runs differ.`);
  add();
  for (const profile of report.profiles) {
    const throttle = [profile.cpuThrottle > 1 ? `CPU ${profile.cpuThrottle}x slower` : null, profile.network ? `network ${NETWORK_PRESETS[profile.network]?.label ?? profile.network}` : null].filter(Boolean).join(", ") || "no throttling";
    for (const kind of ["cold", "warm"]) {
      const rows = report.summary.filter((s) => s.profile === profile.name && s.kind === kind);
      if (!rows.length) continue;
      add(`## ${profile.name} — ${profile.width}x${profile.height} @${profile.deviceScaleFactor}x${profile.mobile ? ", mobile + touch" : ""}, ${throttle} — ${kind} (${rows[0].runs} run(s) per route)`);
      add();
      add(`connection.effectiveType: ${[...new Set(rows.flatMap((r) => r.effectiveType))].join(", ")}`);
      add();
      add("| Route | TTFB | FCP | LCP | CLS | DCL | Load | Long tasks | Longest task | Over 50 ms |");
      add("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
      for (const r of rows) {
        const m = r.metrics;
        add(`| \`${cell(r.route)}\` | ${ms(m.ttfb)} | ${ms(m.fcp)} | ${ms(m.lcp)} | ${shift(m.cls)} | ${ms(m.dcl)} | ${ms(m.load)} | ${count(m.longTaskCount)} | ${ms(m.longTaskMaxMs)} | ${ms(m.longTaskSumOver50Ms)} |`);
      }
      add();
      add("| Route | Requests | Total KB | HTML | JS | JS files | JS by load | JS files by load | CSS | Font | Img | Video | Other | 3rd-party KB | DOM elements |");
      add("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
      for (const r of rows) {
        const m = r.metrics;
        add(`| \`${cell(r.route)}\` | ${count(m.requests)} | ${size(m.transfer)} | ${size(m.documentTransfer)} | ${size(m.jsTransfer)} | ${count(m.jsCount)} | ${size(m.jsByLoadTransfer)} | ${count(m.jsByLoadCount)} | ${size(m.cssTransfer)} | ${size(m.fontTransfer)} | ${size(m.imgTransfer)} | ${size(m.videoTransfer)} | ${size(m.otherTransfer)} | ${size(m.thirdPartyTransfer)} | ${count(m.domElements)} |`);
      }
      add();
      add("| Route | LCP element | LCP size (px²) | LCP resource KB | Largest image on the first screen | …loaded at | …KB | Hero | Intro |");
      add("|---|---|---:|---:|---|---:|---:|---|---|");
      for (const r of rows) {
        const m = r.metrics;
        add(`| \`${cell(r.route)}\` | ${cell(r.lcpElement.join("; "))} | ${count(m.lcpSize)} | ${size(m.lcpTransfer)} | ${cell(r.firstScreenImage.join("; "))} | ${ms(m.firstScreenImageLoaded)} | ${size(m.firstScreenImageTransfer)} | ${r.hero.join(", ")} | ${r.intro.join(", ")} |`);
      }
      add();
    }
  }
  const failed = report.runs.filter((r) => r.error);
  if (failed.length) {
    add("## Failed runs");
    add();
    for (const r of failed) add(`- \`${r.route}\` ${r.profile} ${r.kind} #${r.index}: ${cell(r.error)}`);
    add();
  }
  add("\"JS by load\" is the JavaScript requested before the load event; \"JS\" also counts what arrives afterwards (deferred widgets, chunks for prefetched routes) until the page is read.");
  add("LCP is Chrome's final largest-contentful-paint entry. Chrome does not count an image that fills the whole viewport, so the largest image on the first screen is listed beside it with the time its download finished.");
  add("Long tasks: \"Over 50 ms\" is the sum of the part of each long task beyond 50 ms (what blocks input).");
  add("CLS: the largest burst of layout shifts (under 1 s apart, 5 s at most); the JSON also has the plain total and the shifting elements.");
  add("Hero: \"video\" when a <video> in the first screen had loaded frames when the page was read, otherwise \"still\". Intro: the value of <html data-intro>.");
  return `${lines.join("\n")}\n`;
}

/* ------------------------------ main ------------------------------ */

async function main() {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    out: { type: "string" },
    md: { type: "string" },
    routes: { type: "string", multiple: true },
    viewports: { type: "string", multiple: true },
    cold: { type: "string" },
    warm: { type: "string" },
    cpu: { type: "string" },
    network: { type: "string" },
    throttle: { type: "string", multiple: true },
    "reduced-motion": { type: "boolean" },
    storage: { type: "string", multiple: true },
    settle: { type: "string" },
    timeout: { type: "string" },
  });
  if (!values.out) throw new UsageError("--out is required");
  const base = normalizeBase(values.base);
  const routes = [...new Set(listArg(values.routes))];
  if (!routes.length) throw new UsageError("--routes is required, e.g. --routes /,/about");
  const bad = routes.filter((r) => !r.startsWith("/"));
  if (bad.length) throw new UsageError(`Routes must start with "/": ${bad.join(", ")}`);
  if (values.network && !NETWORK_PRESETS[values.network]) throw new UsageError(`--network must be one of ${Object.keys(NETWORK_PRESETS).join(", ")}`);
  const cold = intArg(values.cold, "cold", 5);
  const warm = intArg(values.warm, "warm", 3);
  if (cold < 1) throw new UsageError("--cold must be at least 1");
  const cpu = intArg(values.cpu, "cpu", 1);

  let viewports;
  try {
    viewports = resolveViewports(listArg(values.viewports).length ? listArg(values.viewports) : ["desktop", "mobile"]);
  } catch (err) {
    throw new UsageError(err.message);
  }
  const throttled = listArg(values.throttle);
  const unknown = throttled.filter((name) => !viewports.some((v) => v.label === name));
  if (unknown.length) throw new UsageError(`--throttle names a viewport that is not measured: ${unknown.join(", ")}`);
  const profiles = viewports.map((v) => {
    const applies = throttled.length === 0 || throttled.includes(v.label);
    return {
      name: v.label,
      width: v.width,
      height: v.height,
      deviceScaleFactor: v.deviceScaleFactor,
      mobile: v.mobile,
      touch: v.touch,
      cpuThrottle: applies ? cpu : 1,
      network: applies ? (values.network ?? null) : null,
    };
  });
  const options = {
    reducedMotion: Boolean(values["reduced-motion"]),
    storage: pairsArg(values.storage, "storage"),
    settle: intArg(values.settle, "settle", 5000),
    timeout: intArg(values.timeout, "timeout", 60000),
  };

  const total = routes.length * profiles.length * (cold + warm);
  progress(`Measuring ${routes.length} route(s) x ${profiles.map((p) => p.name).join(", ")}: ${cold} cold + ${warm} warm = ${total} page loads, one at a time`);
  const host = hostFacts();
  const browser = await launchChrome();
  const browserInfo = browser.info();
  const runs = [];
  let originCounter = 0;
  let freshOrigins = true;
  let done = 0;
  try {
    for (const profile of profiles) {
      for (const route of routes) {
        let context = null;
        let origin = base;
        for (let i = 1; i <= cold + warm; i++) {
          const kind = i <= cold ? "cold" : "warm";
          if (kind === "cold") {
            if (context) await browser.disposeContext(context);
            context = await browser.newContext();
            const fresh = freshOrigin(base, `c${++originCounter}`);
            if (!fresh) freshOrigins = false;
            origin = fresh ?? base;
          }
          const record = { route, profile: profile.name, kind, index: kind === "cold" ? i : i - cold, url: origin + route };
          try {
            Object.assign(record, await measure(browser, { url: record.url, profile, browserContextId: context, options }));
          } catch (err) {
            record.error = err.message;
          }
          runs.push(record);
          done += 1;
          progress(
            record.error
              ? `  [${done}/${total}] FAILED ${route} ${profile.name} ${kind}: ${record.error}`
              : `  [${done}/${total}] ${route} ${profile.name} ${kind} #${record.index}: TTFB ${Math.round(record.ttfb)} FCP ${Math.round(record.fcp)} LCP ${record.lcp ? Math.round(record.lcp.time) : "–"} CLS ${record.cls.toFixed(3)} load ${Math.round(record.load ?? 0)} JS ${kb(record.resources.firstParty.js.transferSize)} KB`
          );
        }
        if (context) await browser.disposeContext(context);
      }
    }
  } finally {
    await browser.close();
  }

  const good = runs.filter((r) => !r.error);
  const report = {
    kind: "cs-qa-vitals",
    version: 1,
    generatedAt: new Date().toISOString(),
    base,
    host,
    browser: browserInfo,
    protocol: { cold, warm, settleMs: options.settle, freshOrigins, reducedMotion: options.reducedMotion, storage: options.storage },
    profiles,
    totals: {
      runs: runs.length,
      failed: runs.length - good.length,
      tagAttempts: good.reduce((n, r) => n + r.tags.attempts, 0),
      tagBlocked: good.reduce((n, r) => n + r.tags.blocked, 0),
      tagLeaks: good.reduce((n, r) => n + r.tags.leaks, 0),
      tagHosts: [...new Set(good.flatMap((r) => r.tags.hosts))].sort(),
      notHttp200: good.filter((r) => r.status !== 200).length,
    },
    summary: summarize(runs),
    runs,
  };
  const mdFile = values.md ?? values.out.replace(/\.json$/i, "") + ".md";
  writeJson(values.out, report);
  writeFile(mdFile, markdown(report));
  process.stdout.write(
    `${good.length}/${runs.length} runs measured; ${report.totals.tagAttempts} tag request(s) attempted, ${report.totals.tagLeaks} leaked\n` +
      `  ${values.out}\n  ${mdFile}\n`
  );
  return report.totals.failed || report.totals.tagLeaks || report.totals.notHttp200 ? 1 : 0;
}

if (isMain(import.meta.url)) run(main);
