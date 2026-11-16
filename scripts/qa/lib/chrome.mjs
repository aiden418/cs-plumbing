/**
 * Dependency-free Chrome driver for the QA harness.
 *
 * Launches the installed Chrome headless with a throwaway profile, talks to it
 * over the DevTools protocol on Node's global WebSocket, and exposes the few
 * page helpers the scripts in scripts/qa need. No npm packages.
 *
 *   const browser = await launchChrome();
 *   try {
 *     const page = await browser.newPage({ width: 390, height: 844, mobile: true, touch: true });
 *     const nav = await page.goto("http://localhost:3111/", { waitUntil: "networkidle" });
 *     const title = await page.evaluate(() => document.title);
 *     await page.screenshot({ path: "home.jpg", fullPage: true });
 *     await page.close();
 *   } finally {
 *     await browser.close();          // or browser.kill(); both remove the profile dir
 *   }
 *
 * Analytics and ad tags are never allowed to reach their vendors:
 *   1. every page (and every out-of-process frame or worker it spawns) gets
 *      Network.setBlockedURLs for TAG_HOSTS, so an attempt is recorded as
 *      "blocked by inspector" and never leaves the renderer;
 *   2. Chrome itself is started with host-resolver rules that make the same
 *      hosts unresolvable, so nothing can slip past (1).
 * launchChrome() proves (1) with a self-test before it returns.
 *
 * Letting a tag through takes two deliberate steps, and no script in
 * scripts/qa takes them: launchChrome({ allowTagHosts: true }) AND
 * newPage({ blockTagHosts: false }). That exists only for weighing a build
 * that carries placeholder tag ids; never use it on a build with real ids.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const CHROME_PATH = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));

/**
 * Meta, OpenAI and Google tag hosts. An entry is a host (matches the host and
 * every subdomain) or host/path-prefix.
 */
export const TAG_HOSTS = [
  "connect.facebook.net",
  "www.facebook.com",
  "facebook.com/tr",
  "bzrcdn.openai.com",
  "bzr.openai.com",
  "www.googletagmanager.com",
  "google-analytics.com",
  "googleads.g.doubleclick.net",
  "googleadservices.com",
  "doubleclick.net",
];

const TAG_RULES = TAG_HOSTS.map((entry) => {
  const slash = entry.indexOf("/");
  return slash === -1
    ? { entry, host: entry, path: "" }
    : { entry, host: entry.slice(0, slash), path: entry.slice(slash) };
});

/** The TAG_HOSTS entry a URL falls under, or null. */
export function tagHostFor(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase();
  for (const rule of TAG_RULES) {
    if (host !== rule.host && !host.endsWith(`.${rule.host}`)) continue;
    if (rule.path && !u.pathname.startsWith(rule.path)) continue;
    return rule.entry;
  }
  return null;
}

export function isTagUrl(url) {
  return tagHostFor(url) !== null;
}

/** URLs the launch self-test must see blocked: one per way a tag host can be spelled. */
const TAG_SELF_TEST_URLS = [
  "https://connect.facebook.net/en_US/fbevents.js",
  "https://www.facebook.com/tr?id=0&ev=PageView",
  "https://facebook.com/tr?id=0&ev=PageView",
  "https://bzrcdn.openai.com/sdk/oaiq.min.js",
  "https://bzr.openai.com/v1/events",
  "https://www.googletagmanager.com/gtag/js?id=G-QA",
  "https://www.google-analytics.com/g/collect",
  "https://region1.google-analytics.com/g/collect",
  "https://googleads.g.doubleclick.net/pagead/viewthroughconversion/0/",
  "https://www.googleadservices.com/pagead/conversion.js",
  "https://stats.g.doubleclick.net/g/collect",
  "http://td.doubleclick.net/td/ga/rul",
];

/** Old-style Network.setBlockedURLs patterns ("*" wildcards, substring match). */
const TAG_WILDCARDS = TAG_HOSTS.map((entry) => `*${entry}*`);

/** URLPattern-style patterns for Chrome builds that take `urlPatterns`. */
const TAG_URL_PATTERNS = TAG_RULES.flatMap((rule) => {
  const tail = rule.path ? `${rule.path}*` : "/*";
  return [`*://${rule.host}${tail}`, `*://*.${rule.host}${tail}`];
});

/** `--host-resolver-rules` value that makes every tag host unresolvable. */
const TAG_RESOLVER_RULES = [...new Set(TAG_RULES.map((rule) => rule.host))]
  .flatMap((host) => [`MAP ${host} ~NOTFOUND`, `MAP *.${host} ~NOTFOUND`])
  .join(", ");

/** DevTools throttling presets (bytes per second, milliseconds). */
export const NETWORK_PRESETS = {
  fast4g: {
    label: "Fast 4G",
    latency: 165,
    downloadThroughput: (9 * 1000 * 1000 * 0.9) / 8,
    uploadThroughput: (1.5 * 1000 * 1000 * 0.9) / 8,
    connectionType: "cellular4g",
  },
  slow4g: {
    label: "Slow 4G",
    latency: 562.5,
    downloadThroughput: (1.6 * 1000 * 1000 * 0.9) / 8,
    uploadThroughput: (750 * 1000 * 0.9) / 8,
    connectionType: "cellular3g",
  },
};

/** Named viewports shared by every script. */
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, touch: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, touch: true },
};

/**
 * Viewport for an arbitrary size. Below 768 px wide, or with a short side under
 * 500 px (a phone held sideways), it is emulated as a phone: mobile viewport,
 * touch, 2x pixels unless told otherwise.
 */
export function viewportForWidth(width, { height, deviceScaleFactor } = {}) {
  const phone = width < 768 || (height !== undefined && height < 500);
  return {
    width,
    height: height ?? (phone ? 812 : 900),
    deviceScaleFactor: deviceScaleFactor ?? (phone ? 2 : 1),
    mobile: phone,
    touch: phone,
  };
}

/**
 * Resolve viewport names and sizes to { label, ...viewport }:
 * "desktop", "mobile", "1280" (a width) or "844x390" (width x height).
 */
export function resolveViewports(specs, { height, deviceScaleFactor } = {}) {
  return specs.map((spec) => {
    const text = String(spec).trim();
    if (VIEWPORTS[text]) {
      return { label: text, ...VIEWPORTS[text], ...(deviceScaleFactor ? { deviceScaleFactor } : {}) };
    }
    const m = /^(\d+)(?:x(\d+))?$/.exec(text);
    if (!m) throw new Error(`Unknown viewport "${text}" (use ${Object.keys(VIEWPORTS).join(", ")}, a width like 1280, or WIDTHxHEIGHT)`);
    const w = Number(m[1]);
    const h = m[2] ? Number(m[2]) : height;
    return { label: m[2] ? `${w}x${m[2]}` : `w${w}`, ...viewportForWidth(w, { height: h, deviceScaleFactor }) };
  });
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* CDP connection                                                      */
/* ------------------------------------------------------------------ */

class Connection {
  constructor(ws) {
    this.ws = ws;
    this.lastId = 0;
    this.pending = new Map();
    this.listeners = new Map(); // sessionId ("" = browser) -> method -> Set<fn>
    this.closed = false;
    this.handlerErrors = [];
    ws.addEventListener("message", (event) => this.#onMessage(event.data));
    ws.addEventListener("close", () => this.#onClose());
  }

  static open(wsUrl, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      const timer = setTimeout(() => {
        ws.close();
        reject(new Error(`Timed out connecting to ${wsUrl}`));
      }, timeout);
      ws.addEventListener("open", () => {
        clearTimeout(timer);
        resolve(new Connection(ws));
      });
      ws.addEventListener("error", (event) => {
        clearTimeout(timer);
        reject(new Error(`DevTools websocket error: ${event.message ?? "could not connect"}`));
      });
    });
  }

  send(method, params = {}, sessionId) {
    if (this.closed) return Promise.reject(new Error(`${method}: DevTools connection is closed`));
    const id = ++this.lastId;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify(message));
    });
  }

  on(method, fn, sessionId = "") {
    let byMethod = this.listeners.get(sessionId);
    if (!byMethod) this.listeners.set(sessionId, (byMethod = new Map()));
    let set = byMethod.get(method);
    if (!set) byMethod.set(method, (set = new Set()));
    set.add(fn);
    return () => set.delete(fn);
  }

  dropSession(sessionId) {
    this.listeners.delete(sessionId);
  }

  close() {
    if (!this.closed) this.ws.close();
  }

  #onMessage(data) {
    const message = JSON.parse(typeof data === "string" ? data : Buffer.from(data).toString("utf8"));
    if (message.id !== undefined) {
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) {
        const detail = message.error.data ? ` (${message.error.data})` : "";
        entry.reject(new Error(`${entry.method}: ${message.error.message}${detail}`));
      } else {
        entry.resolve(message.result);
      }
      return;
    }
    const handlers = this.listeners.get(message.sessionId ?? "")?.get(message.method);
    if (!handlers) return;
    for (const fn of [...handlers]) {
      try {
        fn(message.params ?? {});
      } catch (err) {
        this.handlerErrors.push(`${message.method}: ${err?.stack ?? err}`);
      }
    }
  }

  #onClose() {
    this.closed = true;
    for (const entry of this.pending.values()) {
      entry.reject(new Error(`${entry.method}: DevTools connection closed`));
    }
    this.pending.clear();
  }
}

/** One flattened DevTools session (a page, an out-of-process frame, a worker). */
class Session {
  constructor(connection, id) {
    this.connection = connection;
    this.id = id;
  }

  send(method, params) {
    return this.connection.send(method, params, this.id);
  }

  on(method, fn) {
    return this.connection.on(method, fn, this.id);
  }

  waitFor(method, { predicate, timeout = 30000 } = {}) {
    return new Promise((resolve, reject) => {
      const off = this.on(method, (params) => {
        if (predicate && !predicate(params)) return;
        clearTimeout(timer);
        off();
        resolve(params);
      });
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out after ${timeout} ms waiting for ${method}`));
      }, timeout);
    });
  }
}

/* ------------------------------------------------------------------ */
/* Launch                                                              */
/* ------------------------------------------------------------------ */

const LIVE_BROWSERS = new Set();
let exitHooksInstalled = false;

function installExitHooks() {
  if (exitHooksInstalled) return;
  exitHooksInstalled = true;
  process.on("exit", () => {
    for (const browser of [...LIVE_BROWSERS]) browser.kill();
  });
  for (const [signal, code] of [
    ["SIGINT", 130],
    ["SIGTERM", 143],
    ["SIGHUP", 129],
  ]) {
    process.once(signal, () => {
      for (const browser of [...LIVE_BROWSERS]) browser.kill();
      process.exit(code);
    });
  }
}

/**
 * Start headless Chrome on a throwaway profile and connect to it.
 *
 * By default the tag hosts are unresolvable for the whole browser, whatever a
 * page asks for, so a page opened with blockTagHosts: false still cannot
 * reach a vendor (newPage refuses that combination outright).
 *
 * @param {object} [options]
 * @param {boolean} [options.headless=true]
 * @param {string[]} [options.args] extra Chrome flags
 * @param {boolean} [options.allowTagHosts=false] leave the tag hosts resolvable,
 *   so that a page opened with blockTagHosts: false can load them. Only for a
 *   build that carries placeholder tag ids.
 */
export async function launchChrome({ headless = true, args = [], allowTagHosts = false } = {}) {
  if (!CHROME_PATH) throw new Error("Chrome not found. Set CHROME_PATH.");
  installExitHooks();

  const profileDir = mkdtempSync(path.join(os.tmpdir(), "cs-qa-chrome-"));
  const argv = [
    headless ? "--headless=new" : null,
    "--remote-debugging-port=0",
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--hide-scrollbars",
    // Keep every tab running at full speed whether or not it has focus.
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    // No sign-in, sync, updates, extensions, crash upload or keychain prompts.
    "--disable-sync",
    "--disable-default-apps",
    "--disable-component-update",
    "--disable-extensions",
    "--disable-breakpad",
    "--metrics-recording-only",
    "--password-store=basic",
    "--use-mock-keychain",
    "--mute-audio",
    "--force-color-profile=srgb",
    "--disable-features=Translate,MediaRouter,OptimizationHints",
    allowTagHosts ? null : `--host-resolver-rules=${TAG_RESOLVER_RULES}`,
    ...args,
    "about:blank",
  ].filter(Boolean);

  const child = spawn(CHROME_PATH, argv, { stdio: ["ignore", "ignore", "pipe"] });
  const browser = new Browser({ child, profileDir, allowTagHosts });
  LIVE_BROWSERS.add(browser);

  try {
    const wsUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Chrome printed no DevTools URL within 20 s.\n${browser.stderrTail()}`)),
        20000
      );
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        browser.stderr = (browser.stderr + chunk).slice(-16384);
        const match = browser.stderr.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) {
          clearTimeout(timer);
          resolve(match[1]);
        }
      });
      child.once("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
      child.once("exit", (code, signal) => {
        clearTimeout(timer);
        reject(
          new Error(`Chrome exited before DevTools was ready (code ${code}, signal ${signal}).\n${browser.stderrTail()}`)
        );
      });
    });

    browser.wsUrl = wsUrl;
    browser.connection = await Connection.open(wsUrl);
    browser.version = await browser.connection.send("Browser.getVersion");
    if (allowTagHosts) {
      // The self-test fires requests at the tag hosts, which is only safe while
      // they cannot resolve. Learn the working block mode from a locked-down
      // twin of this Chrome instead of testing in this one.
      const twin = await launchChrome({ headless, args });
      browser.blockMode = twin.blockMode;
      await twin.close();
    } else {
      await browser.selfTestTagBlocking();
    }
    return browser;
  } catch (err) {
    browser.kill();
    throw err;
  }
}

class Browser {
  constructor({ child, profileDir, allowTagHosts = false }) {
    this.child = child;
    this.profileDir = profileDir;
    this.allowTagHosts = allowTagHosts;
    this.connection = null;
    this.wsUrl = null;
    this.version = null;
    this.stderr = "";
    /** "urlPatterns" | "urls": which Network.setBlockedURLs form this Chrome honoured. */
    this.blockMode = null;
    this.killed = false;
    this.helper = null;
    this.stitching = Promise.resolve();
  }

  stderrTail() {
    return this.stderr ? `Chrome stderr (tail):\n${this.stderr.slice(-2000)}` : "Chrome wrote nothing to stderr.";
  }

  /** Facts about this browser for a result file. */
  info() {
    return {
      product: this.version?.product ?? null,
      userAgent: this.version?.userAgent ?? null,
      protocolVersion: this.version?.protocolVersion ?? null,
      blockMode: this.blockMode,
      tagHostsResolvable: this.allowTagHosts,
    };
  }

  /** A fresh incognito-like context: its own cookies, storage, HTTP cache and sockets. */
  async newContext() {
    const { browserContextId } = await this.connection.send("Target.createBrowserContext", { disposeOnDetach: true });
    return browserContextId;
  }

  /** Dispose a context made by newContext() once every page in it is closed. */
  async disposeContext(browserContextId) {
    try {
      await this.connection.send("Target.disposeBrowserContext", { browserContextId });
    } catch {
      // already gone
    }
  }

  /**
   * Open a page in its own incognito-like browser context (own cookies,
   * storage and HTTP cache) unless `browserContextId` reuses an existing one.
   *
   * @param {object} [options]
   * @param {number} [options.width=1440]
   * @param {number} [options.height=900]
   * @param {number} [options.deviceScaleFactor=1]
   * @param {boolean} [options.mobile=false] mobile viewport emulation (meta viewport, coarse pointer, no hover)
   * @param {boolean} [options.touch=false] touch events
   * @param {boolean} [options.reducedMotion=false] prefers-reduced-motion: reduce
   * @param {number} [options.cpuThrottle=1] Emulation.setCPUThrottlingRate
   * @param {"fast4g"|"slow4g"|object|null} [options.network] Network.emulateNetworkConditions preset
   * @param {boolean} [options.blockTagHosts=true]
   * @param {Record<string,string>|null} [options.extraHeaders]
   * @param {string|null} [options.browserContextId] share storage and cache with an earlier page
   * @param {string|null} [options.userAgent]
   * @param {string|null} [options.media] emulated CSS media type, e.g. "print"
   */
  async newPage(options = {}) {
    const opts = {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
      touch: false,
      reducedMotion: false,
      cpuThrottle: 1,
      network: null,
      blockTagHosts: true,
      extraHeaders: null,
      browserContextId: null,
      userAgent: null,
      media: null,
      ...options,
    };
    if (!opts.blockTagHosts && !this.allowTagHosts) {
      throw new Error(
        "newPage({ blockTagHosts: false }) needs launchChrome({ allowTagHosts: true }); without it the tag hosts cannot resolve."
      );
    }
    const conn = this.connection;
    const ownsContext = !opts.browserContextId;
    const browserContextId = opts.browserContextId ?? (await this.newContext());
    const { targetId } = await conn.send("Target.createTarget", {
      url: "about:blank",
      browserContextId,
      width: opts.width,
      height: opts.height,
    });
    const { sessionId } = await conn.send("Target.attachToTarget", { targetId, flatten: true });
    const page = new Page(this, { targetId, browserContextId, ownsContext, session: new Session(conn, sessionId), opts });
    try {
      await page.init();
    } catch (err) {
      await page.close().catch(() => {});
      throw err;
    }
    return page;
  }

  /** Block the tag hosts on one session; returns the form Chrome accepted. */
  async blockTagHosts(session) {
    if (this.blockMode !== "urls") {
      try {
        await session.send("Network.setBlockedURLs", {
          urlPatterns: TAG_URL_PATTERNS.map((urlPattern) => ({ urlPattern, block: true })),
        });
        return "urlPatterns";
      } catch (err) {
        if (this.blockMode === "urlPatterns") throw err;
      }
    }
    await session.send("Network.setBlockedURLs", { urls: TAG_WILDCARDS });
    return "urls";
  }

  /**
   * Prove that a page really blocks every tag host before any site is loaded.
   * The requests cannot reach the vendors even if this fails: the resolver
   * rules already make the hosts unresolvable.
   */
  async selfTestTagBlocking() {
    const failures = [];
    for (const mode of ["urlPatterns", "urls"]) {
      this.blockMode = mode;
      let page;
      try {
        page = await this.newPage({ width: 400, height: 300 });
      } catch (err) {
        failures.push(`${mode}: ${err.message}`);
        continue;
      }
      try {
        await page.evaluate(async (urls) => {
          await Promise.all(urls.map((url) => fetch(url, { mode: "no-cors" }).catch(() => null)));
        }, [TAG_SELF_TEST_URLS]);
        await page.waitForNetworkIdle({ idleMs: 100, timeout: 5000 });
        const missed = TAG_SELF_TEST_URLS.filter((url) => {
          const request = page.requests.find((r) => r.url === url);
          return !request || request.blockedReason !== "inspector";
        });
        if (missed.length === 0) return;
        failures.push(`${mode}: not blocked by the inspector: ${missed.join(", ")}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
    this.blockMode = null;
    throw new Error(`Tag-host blocking self-test failed.\n  ${failures.join("\n  ")}`);
  }

  /**
   * Stitch screenshot tiles (top to bottom, PNG base64) into one image on a
   * canvas in a blank helper page. Every tile but the last contributes exactly
   * `rowsPerTile` pixel rows, so the seams land on whole pixels.
   *
   * @returns {{ buffer: Buffer, width: number, height: number }}
   */
  stitch(tiles, options) {
    // One at a time: every stitch uses the same helper page.
    const run = this.stitching.then(() => this.#stitch(tiles, options));
    this.stitching = run.catch(() => {});
    return run;
  }

  async #stitch(tiles, { rowsPerTile, format, quality }) {
    if (!this.helper) this.helper = await this.newPage({ width: 400, height: 300 });
    const helper = this.helper;
    await helper.evaluate(() => {
      window.__qaTiles = [];
    });
    try {
      for (const data of tiles) {
        await helper.evaluate(async (base64) => {
          const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          window.__qaTiles.push(await createImageBitmap(new Blob([bytes], { type: "image/png" })));
        }, [data]);
      }
      const out = await helper.evaluate(
        async (rows, type, q) => {
          const bitmaps = window.__qaTiles;
          const last = bitmaps[bitmaps.length - 1];
          // Chrome rounds a tile's height itself; a row either way is a rounding
          // difference, more than that means the tiles are not what was asked for.
          const odd = bitmaps.slice(0, -1).find((b) => Math.abs(b.height - rows) > 1);
          if (odd) throw new Error(`a screenshot tile is ${odd.height} px tall, expected ${rows}`);
          const width = Math.max(...bitmaps.map((b) => b.width));
          const height = (bitmaps.length - 1) * rows + last.height;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error(`no ${width}x${height} canvas available`);
          bitmaps.forEach((bitmap, i) => {
            const isLast = i === bitmaps.length - 1;
            const sourceRows = isLast ? bitmap.height : Math.min(bitmap.height, rows);
            const targetRows = isLast ? bitmap.height : rows;
            ctx.drawImage(bitmap, 0, 0, bitmap.width, sourceRows, 0, i * rows, bitmap.width, targetRows);
          });
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, q));
          if (!blob) throw new Error(`could not encode a ${width}x${height} ${type}`);
          const bytes = new Uint8Array(await blob.arrayBuffer());
          let binary = "";
          for (let i = 0; i < bytes.length; i += 0x8000) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
          }
          return { base64: btoa(binary), width, height };
        },
        [rowsPerTile, `image/${format}`, quality / 100]
      );
      return { buffer: Buffer.from(out.base64, "base64"), width: out.width, height: out.height };
    } finally {
      await helper
        .evaluate(() => {
          for (const bitmap of window.__qaTiles ?? []) bitmap.close();
          window.__qaTiles = null;
        })
        .catch(() => {});
    }
  }

  /** Ask Chrome to quit, then make sure it is gone and the profile dir is removed. */
  async close() {
    if (this.killed) return;
    const exited = new Promise((resolve) => {
      if (this.child.exitCode !== null || this.child.signalCode !== null) resolve();
      else this.child.once("exit", resolve);
    });
    try {
      if (this.connection && !this.connection.closed) {
        this.connection.send("Browser.close").catch(() => {});
      }
      await Promise.race([exited, sleep(5000)]);
    } finally {
      this.kill();
    }
  }

  /** Synchronous: SIGKILL Chrome if it is still running and always remove the profile dir. */
  kill() {
    if (this.killed) return;
    this.killed = true;
    LIVE_BROWSERS.delete(this);
    try {
      this.connection?.close();
    } catch {
      // already closed
    }
    if (this.child.exitCode === null && this.child.signalCode === null) {
      try {
        this.child.kill("SIGKILL");
      } catch {
        // already gone
      }
    }
    try {
      rmSync(this.profileDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
    } catch {
      // Chrome helpers can still be flushing files; one more attempt below.
      try {
        rmSync(this.profileDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });
      } catch (err) {
        process.stderr.write(`qa: could not remove ${this.profileDir}: ${err.message}\n`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const IDLE_IGNORED_TYPES = new Set(["Media", "EventSource", "WebSocket"]);

function remoteObjectText(arg) {
  if ("value" in arg) return typeof arg.value === "string" ? arg.value : JSON.stringify(arg.value);
  return arg.description ?? arg.unserializableValue ?? arg.type;
}

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

class Page {
  constructor(browser, { targetId, browserContextId, ownsContext, session, opts }) {
    this.browser = browser;
    this.targetId = targetId;
    this.browserContextId = browserContextId;
    this.ownsContext = ownsContext;
    this.session = session;
    this.options = opts;
    this.closed = false;
    this.url = "about:blank";
    this.origin = null;
    this.mainFrameId = null;

    /** Console API calls and browser log entries, in order. */
    this.console = [];
    /** Uncaught exceptions. */
    this.errors = [];
    /** Every request this page and its child targets made, in order. */
    this.requests = [];

    this.byRequestKey = new Map();
    this.inflight = new Set();
    this.lastNetworkActivity = Date.now();
    this.childSessions = new Map();
    this.navigation = null;
  }

  async init() {
    const { session, options: o } = this;
    this.#trackNetwork(session, "page");
    this.#trackConsole(session);
    session.on("Target.attachedToTarget", (event) => {
      this.#adoptChild(event).catch(() => {});
    });
    session.on("Target.detachedFromTarget", ({ sessionId }) => this.#dropChild(sessionId));

    await Promise.all([
      session.send("Page.enable"),
      session.send("Runtime.enable"),
      session.send("Log.enable"),
      session.send("Network.enable"),
    ]);
    await session.send("Page.setLifecycleEventsEnabled", { enabled: true });
    // Every page behaves as the focused, visible tab even when several are open.
    await session.send("Emulation.setFocusEmulationEnabled", { enabled: true });
    if (o.blockTagHosts) await this.browser.blockTagHosts(session);
    await session.send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });

    await session.send("Emulation.setDeviceMetricsOverride", {
      width: o.width,
      height: o.height,
      deviceScaleFactor: o.deviceScaleFactor,
      mobile: o.mobile,
      screenWidth: o.width,
      screenHeight: o.height,
    });
    if (o.touch) await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    if (o.userAgent) await session.send("Emulation.setUserAgentOverride", { userAgent: o.userAgent });
    if (o.reducedMotion || o.media) await this.emulateMedia({ media: o.media, reducedMotion: o.reducedMotion });
    if (o.extraHeaders) await session.send("Network.setExtraHTTPHeaders", { headers: o.extraHeaders });
    if (o.network) {
      const preset = typeof o.network === "string" ? NETWORK_PRESETS[o.network] : o.network;
      if (!preset) throw new Error(`Unknown network preset "${o.network}" (use ${Object.keys(NETWORK_PRESETS).join(", ")})`);
      await session.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: preset.latency,
        downloadThroughput: preset.downloadThroughput,
        uploadThroughput: preset.uploadThroughput,
        connectionType: preset.connectionType,
      });
    }
    if (o.cpuThrottle && o.cpuThrottle !== 1) {
      await session.send("Emulation.setCPUThrottlingRate", { rate: o.cpuThrottle });
    }
  }

  /** Emulate a CSS media type and/or prefers-reduced-motion. */
  async emulateMedia({ media = null, reducedMotion = false } = {}) {
    await this.session.send("Emulation.setEmulatedMedia", {
      media: media ?? "",
      features: [{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "" }],
    });
  }

  /** Change the emulated viewport of an open page. */
  async setViewport({ width, height, deviceScaleFactor, mobile } = {}) {
    const o = this.options;
    Object.assign(o, {
      width: width ?? o.width,
      height: height ?? o.height,
      deviceScaleFactor: deviceScaleFactor ?? o.deviceScaleFactor,
      mobile: mobile ?? o.mobile,
    });
    await this.session.send("Emulation.setDeviceMetricsOverride", {
      width: o.width,
      height: o.height,
      deviceScaleFactor: o.deviceScaleFactor,
      mobile: o.mobile,
      screenWidth: o.width,
      screenHeight: o.height,
    });
  }

  /** Run a script in every new document before any page script. */
  async addInitScript(fnOrSource, args = []) {
    const source =
      typeof fnOrSource === "function" ? `(${fnOrSource.toString()})(${serializeArgs(args)});` : String(fnOrSource);
    await this.session.send("Page.addScriptToEvaluateOnNewDocument", { source });
  }

  /**
   * Navigate and wait.
   *
   * @param {string} url
   * @param {object} [options]
   * @param {"load"|"domcontentloaded"|"networkidle"} [options.waitUntil="load"]
   *   "networkidle" = load event, then no request in flight for 500 ms.
   * @param {number} [options.timeout=30000] for the load event
   * @param {number} [options.idleTimeout=10000] extra wait for "networkidle"
   * @returns {{ url, status, finalUrl, idle, ms }} status of the main document
   *   (after redirects); `idle` is false when the network never went quiet.
   */
  async goto(url, { waitUntil = "load", timeout = 30000, idleTimeout = 10000 } = {}) {
    const started = Date.now();
    const wanted = waitUntil === "domcontentloaded" ? "DOMContentLoaded" : "load";
    const seen = [];
    let recheck = null;
    const off = this.session.on("Page.lifecycleEvent", (event) => {
      seen.push(event);
      recheck?.();
    });
    try {
      const nav = await this.session.send("Page.navigate", { url });
      if (nav.errorText) throw new Error(`Navigation to ${url} failed: ${nav.errorText}`);
      this.url = url;
      this.origin = originOf(url);
      this.mainFrameId = nav.frameId;
      this.navigation = { loaderId: nav.loaderId, frameId: nav.frameId };
      const done = () =>
        seen.some((e) => e.name === wanted && e.frameId === nav.frameId && (!nav.loaderId || e.loaderId === nav.loaderId));
      await new Promise((resolve, reject) => {
        if (done()) return resolve();
        const timer = setTimeout(
          () => reject(new Error(`Timed out after ${timeout} ms waiting for ${wanted} on ${url}`)),
          Math.max(1, timeout - (Date.now() - started))
        );
        recheck = () => {
          if (!done()) return;
          clearTimeout(timer);
          resolve();
        };
      });
    } finally {
      off();
    }
    let idle = null;
    if (waitUntil === "networkidle") idle = await this.waitForNetworkIdle({ timeout: idleTimeout });
    const doc = this.mainDocument();
    return { url, status: doc?.status ?? null, finalUrl: doc?.url ?? url, idle, ms: Date.now() - started };
  }

  /** The request that produced the current main document (last hop of any redirect chain). */
  mainDocument() {
    const loaderId = this.navigation?.loaderId;
    for (let i = this.requests.length - 1; i >= 0; i--) {
      const r = this.requests[i];
      if (r.target === "page" && r.type === "Document" && r.id === loaderId) return r;
    }
    return null;
  }

  /**
   * Resolve true once the page itself has had nothing in flight for `idleMs`;
   * false on timeout. Media streams and requests made inside out-of-process
   * frames (a maps embed keeps connections open) do not count.
   */
  async waitForNetworkIdle({ idleMs = 500, timeout = 10000 } = {}) {
    const deadline = Date.now() + timeout;
    for (;;) {
      const quiet = Date.now() - this.lastNetworkActivity;
      if (this.inflight.size === 0 && quiet >= idleMs) return true;
      if (Date.now() >= deadline) return false;
      await sleep(this.inflight.size === 0 ? Math.max(10, idleMs - quiet) : 50);
    }
  }

  /** URLs still in flight on the page itself (for diagnosing a network that never idles). */
  inflightUrls() {
    return [...this.inflight].map((k) => this.byRequestKey.get(k)?.url).filter(Boolean);
  }

  /** Set localStorage entries before any page script runs; the value "now" becomes Date.now(). */
  async seedLocalStorage(entries) {
    const pairs = Object.entries(entries ?? {});
    if (pairs.length === 0) return;
    await this.addInitScript((list) => {
      if (window.top !== window) return;
      try {
        for (const [key, value] of list) localStorage.setItem(key, value === "now" ? String(Date.now()) : value);
      } catch {
        // storage unavailable on this document (about:blank, sandboxed frame)
      }
    }, [pairs]);
  }

  /**
   * Evaluate in the page. Pass a function (serialized with its JSON-able
   * `args`) or an expression string; promises are awaited and the value is
   * returned by value.
   */
  async evaluate(fnOrExpression, args = []) {
    const expression =
      typeof fnOrExpression === "function"
        ? `(${fnOrExpression.toString()})(${serializeArgs(args)})`
        : String(fnOrExpression);
    const result = await this.session.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      const d = result.exceptionDetails;
      throw new Error(`Page evaluation failed: ${d.exception?.description ?? d.text}`);
    }
    return result.result.value;
  }

  /** navigator.webdriver, user agent, connection type and the emulation the page actually sees. */
  env() {
    return this.evaluate(() => ({
      webdriver: navigator.webdriver ?? null,
      userAgent: navigator.userAgent,
      effectiveType: navigator.connection?.effectiveType ?? null,
      downlink: navigator.connection?.downlink ?? null,
      rtt: navigator.connection?.rtt ?? null,
      saveData: navigator.connection?.saveData ?? null,
      visibilityState: document.visibilityState,
      devicePixelRatio: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      hoverNone: matchMedia("(hover: none)").matches,
      pointerCoarse: matchMedia("(pointer: coarse)").matches,
      maxTouchPoints: navigator.maxTouchPoints,
    }));
  }

  /**
   * Scroll to the bottom in steps and back to the top, so lazy images load and
   * scroll-triggered reveals fire, waiting for the network to go quiet at the
   * bottom and again at the top.
   *
   * @returns {{ steps, scrollHeight, idle, unloadedImages }} `unloadedImages`
   *   counts rendered <img> elements that never started loading (lazy images
   *   in carousel slides that stay off-screen sideways).
   */
  async steppedScroll({ stepRatio = 0.8, delay = 120, settle = 400, idleTimeout = 12000, maxSteps = 400 } = {}) {
    const down = await this.evaluate(
      async (ratio, wait, cap) => {
        const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const root = document.scrollingElement ?? document.documentElement;
        const step = Math.max(100, Math.round(window.innerHeight * ratio));
        let steps = 0;
        let y = 0;
        while (steps < cap) {
          const max = root.scrollHeight - window.innerHeight;
          if (y >= max) break;
          y = Math.min(y + step, max);
          window.scrollTo({ top: y, left: 0, behavior: "instant" });
          steps += 1;
          await pause(wait);
        }
        return { steps };
      },
      [stepRatio, delay, maxSteps]
    );
    await sleep(settle);
    const idleBottom = await this.waitForNetworkIdle({ idleMs: 300, timeout: idleTimeout });
    const up = await this.evaluate(
      async (settleMs) => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, settleMs));
        const root = document.scrollingElement ?? document.documentElement;
        const unloadedImages = [...document.images].filter(
          (img) => !img.complete && img.getClientRects().length > 0
        ).length;
        return { scrollHeight: root.scrollHeight, unloadedImages };
      },
      [settle]
    );
    const idleTop = await this.waitForNetworkIdle({ idleMs: 300, timeout: idleTimeout });
    return { steps: down.steps, scrollHeight: up.scrollHeight, idle: idleBottom && idleTop, unloadedImages: up.unloadedImages };
  }

  /** scrollHeight / scrollWidth of the document and whether it is wider than the viewport. */
  layoutMetrics() {
    return this.evaluate(() => {
      const root = document.documentElement;
      const viewportWidth = window.innerWidth;
      const scrollWidth = Math.max(root.scrollWidth, document.body ? document.body.scrollWidth : 0);
      // html/body may clip sideways overflow (overflow-x: clip), which hides it
      // from scrollWidth. Lift the clip for one measurement to see what is cut off.
      const style = document.createElement("style");
      style.textContent = "html,body{overflow-x:visible!important}";
      document.head.append(style);
      const unclippedScrollWidth = Math.max(root.scrollWidth, document.body ? document.body.scrollWidth : 0);
      style.remove();
      return {
        viewportWidth,
        viewportHeight: window.innerHeight,
        scrollHeight: root.scrollHeight,
        scrollWidth,
        overflowsViewport: scrollWidth > viewportWidth,
        unclippedScrollWidth,
        clippedOverflow: unclippedScrollWidth > viewportWidth,
      };
    });
  }

  /**
   * Capture the viewport or the full page.
   *
   * Full-page captures leave the viewport size alone (so vh units, fixed and
   * sticky elements render as on a real screen) and are taken in tiles that
   * stay under the GPU texture limit, then stitched into one image.
   *
   * A single capture taller than the GPU texture limit (16,384 device px)
   * silently repeats the top of the page below that line, which is why tall
   * pages are tiled. Each capture makes Chrome fire one `resize` event at the
   * page (the window size it reports does not change).
   *
   * @param {object} [options]
   * @param {string} [options.path] file to write
   * @param {boolean} [options.fullPage=false]
   * @param {"jpeg"|"png"|"webp"} [options.format="jpeg"]
   * @param {number} [options.quality=80] jpeg/webp only
   * @returns {{ path, width, height, pixelWidth, pixelHeight, bytes, tiles, scale, buffer }}
   *   width/height in CSS px; pixelWidth/pixelHeight of the image written;
   *   scale < 1 only when the page was too tall for one image at full size.
   */
  async screenshot({ path: file, fullPage = false, format = "jpeg", quality = 80 } = {}) {
    if (!["jpeg", "png", "webp"].includes(format)) throw new Error(`Unknown screenshot format "${format}"`);
    const lossy = format !== "png";
    const base = { format, ...(lossy ? { quality } : {}) };
    const dpr = this.options.deviceScaleFactor;
    let buffer;
    let width = this.options.width;
    let height = this.options.height;
    let pixelWidth = Math.round(width * dpr);
    let pixelHeight = Math.round(height * dpr);
    let tiles = 1;
    let scale = 1;

    if (!fullPage) {
      const { data } = await this.session.send("Page.captureScreenshot", base);
      buffer = Buffer.from(data, "base64");
    } else {
      const metrics = await this.session.send("Page.getLayoutMetrics");
      width = Math.ceil(metrics.cssLayoutViewport.clientWidth);
      height = Math.max(Math.ceil(metrics.cssContentSize.height), metrics.cssLayoutViewport.clientHeight);
      const deviceWidth = width * dpr;
      const deviceHeight = height * dpr;
      // WebP stops at 16,383 px a side; JPEG, PNG-on-canvas and the canvas itself at 65,535.
      const maxSide = format === "webp" ? 16383 : MAX_IMAGE_SIDE;
      const fit = Math.min(
        1,
        maxSide / deviceHeight,
        maxSide / deviceWidth,
        Math.sqrt(MAX_CANVAS_AREA / (deviceWidth * deviceHeight))
      );
      if (deviceHeight * fit <= MAX_TILE_DEVICE_PX) {
        scale = fit;
        const { data } = await this.session.send("Page.captureScreenshot", {
          ...base,
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height, scale },
        });
        buffer = Buffer.from(data, "base64");
        pixelWidth = Math.round(deviceWidth * scale);
        pixelHeight = Math.round(deviceHeight * scale);
      } else {
        // Whole CSS px per tile, and a scale that turns one tile into a whole
        // number of pixel rows, so tiles meet without a seam.
        const tileCss = Math.max(1, Math.floor(MAX_TILE_DEVICE_PX / dpr));
        const rowsPerTile = Math.max(1, Math.floor(tileCss * dpr * fit + 1e-6));
        scale = rowsPerTile / (tileCss * dpr);
        const parts = [];
        for (let y = 0; y < height; y += tileCss) {
          const { data } = await this.session.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: true,
            clip: { x: 0, y, width, height: Math.min(tileCss, height - y), scale },
          });
          parts.push(data);
        }
        tiles = parts.length;
        const stitched = await this.browser.stitch(parts, { rowsPerTile, format, quality });
        buffer = stitched.buffer;
        pixelWidth = stitched.width;
        pixelHeight = stitched.height;
      }
    }

    if (file) {
      mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
      writeFileSync(file, buffer);
    }
    return { path: file ?? null, width, height, pixelWidth, pixelHeight, bytes: buffer.length, tiles, scale, buffer };
  }

  /** Print the page to PDF with Chrome's print pipeline; returns a Buffer. */
  async pdf(options = {}) {
    const { data } = await this.session.send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      ...options,
    });
    return Buffer.from(data, "base64");
  }

  /** console.error calls, browser-level error log entries and uncaught exceptions. */
  consoleErrors({ includeHarness = false } = {}) {
    const fromConsole = this.console.filter((entry) => entry.level === "error" && (includeHarness || !entry.harness));
    const uncaught = this.errors.map((entry) => ({ source: "exception", level: "error", ...entry }));
    return [...fromConsole, ...uncaught];
  }

  /** Requests to this page's own origin that failed or returned 4xx/5xx (aborted ones excluded). */
  failedFirstPartyRequests() {
    return this.requests
      .filter((r) => this.isFirstParty(r.url) && ((r.failed && !r.canceled) || (r.status !== null && r.status >= 400)))
      .map((r) => ({ url: r.url, type: r.type, status: r.status, errorText: r.errorText }));
  }

  isFirstParty(url) {
    return this.origin !== null && originOf(url) === this.origin;
  }

  /** Every request aimed at a tag host and what became of it. */
  tagAttempts() {
    return this.requests
      .filter((r) => r.tagHost)
      .map((r) => ({
        url: r.url,
        host: r.tagHost,
        type: r.type,
        blocked: r.blockedReason === "inspector",
        // Got a response, or finished without failing: the request left the browser.
        leaked: r.status !== null || (r.finished && !r.failed),
        errorText: r.errorText,
        status: r.status,
        target: r.target,
      }));
  }

  /** Tag requests that got an answer from the network. Must always be empty. */
  tagLeaks() {
    return this.tagAttempts().filter((a) => a.leaked);
  }

  /** Compact record of what this page saw, for a result file. */
  report() {
    const attempts = this.tagAttempts();
    return {
      consoleErrors: this.consoleErrors(),
      failedFirstPartyRequests: this.failedFirstPartyRequests(),
      requestCount: this.requests.length,
      tagAttempts: attempts.length,
      tagAttemptsBlocked: attempts.filter((a) => a.blocked).length,
      tagAttemptHosts: [...new Set(attempts.map((a) => a.host))].sort(),
      tagLeaks: this.tagLeaks(),
    };
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    const conn = this.browser.connection;
    try {
      await conn.send("Target.closeTarget", { targetId: this.targetId });
    } catch {
      // target already gone
    }
    if (this.ownsContext) {
      try {
        await conn.send("Target.disposeBrowserContext", { browserContextId: this.browserContextId });
      } catch {
        // context already gone
      }
    }
    for (const sessionId of this.childSessions.keys()) conn.dropSession(sessionId);
    conn.dropSession(this.session.id);
  }

  /* -------------------------- internals --------------------------- */

  #trackConsole(session) {
    session.on("Runtime.consoleAPICalled", (event) => {
      const frame = event.stackTrace?.callFrames?.[0];
      this.console.push({
        source: "console",
        level: event.type === "warning" ? "warning" : event.type,
        text: event.args.map(remoteObjectText).join(" "),
        url: frame?.url || null,
        harness: false,
      });
    });
    session.on("Runtime.exceptionThrown", ({ exceptionDetails: d }) => {
      this.errors.push({
        text: d.exception?.description ?? d.text,
        url: d.url ?? d.stackTrace?.callFrames?.[0]?.url ?? null,
      });
    });
    session.on("Log.entryAdded", ({ entry }) => {
      this.console.push({
        source: entry.source,
        level: entry.level,
        text: entry.text,
        url: entry.url ?? null,
        // The harness itself causes "failed to load" noise for the tags it blocks.
        harness: Boolean(entry.url && isTagUrl(entry.url)),
      });
    });
  }

  #trackNetwork(session, target) {
    const key = (requestId) => `${session.id}:${requestId}`;
    // Only the page's own requests decide when the network is idle.
    const countsForIdle = target === "page";
    const settle = (k) => {
      if (this.inflight.delete(k)) this.lastNetworkActivity = Date.now();
    };

    session.on("Network.requestWillBeSent", (event) => {
      const url = event.request.url;
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      const k = key(event.requestId);
      const previous = this.byRequestKey.get(k);
      let redirects = [];
      if (previous && event.redirectResponse) {
        previous.status = event.redirectResponse.status;
        previous.redirectedTo = url;
        previous.finished = true;
        redirects = [...previous.redirects, { url: previous.url, status: previous.status }];
      }
      const record = {
        id: event.requestId,
        url,
        method: event.request.method,
        type: event.type ?? "Other",
        target,
        frameId: event.frameId ?? null,
        initiator: event.initiator?.type ?? null,
        priority: event.request.initialPriority ?? null,
        startTime: event.timestamp,
        endTime: null,
        status: null,
        mimeType: null,
        protocol: null,
        contentEncoding: null,
        fromCache: null,
        encodedDataLength: 0,
        finished: false,
        failed: false,
        canceled: false,
        errorText: null,
        blockedReason: null,
        redirects,
        redirectedTo: null,
        tagHost: tagHostFor(url),
      };
      this.requests.push(record);
      this.byRequestKey.set(k, record);
      if (!countsForIdle) return;
      if (!IDLE_IGNORED_TYPES.has(record.type)) this.inflight.add(k);
      this.lastNetworkActivity = Date.now();
    });

    session.on("Network.responseReceived", (event) => {
      const record = this.byRequestKey.get(key(event.requestId));
      if (!record) return;
      const response = event.response;
      record.status = response.status;
      record.mimeType = response.mimeType ?? null;
      record.protocol = response.protocol ?? null;
      const headers = response.headers ?? {};
      record.contentEncoding = headers["content-encoding"] ?? headers["Content-Encoding"] ?? null;
      if (response.fromDiskCache) record.fromCache = "disk";
      else if (response.fromPrefetchCache) record.fromCache = "prefetch";
      else if (response.fromServiceWorker) record.fromCache = "service-worker";
      if (event.type) record.type = event.type;
    });

    session.on("Network.requestServedFromCache", (event) => {
      const record = this.byRequestKey.get(key(event.requestId));
      if (record) record.fromCache = "memory";
    });

    session.on("Network.loadingFinished", (event) => {
      const k = key(event.requestId);
      const record = this.byRequestKey.get(k);
      if (!record) return;
      record.finished = true;
      record.endTime = event.timestamp;
      record.encodedDataLength = event.encodedDataLength ?? 0;
      settle(k);
    });

    session.on("Network.loadingFailed", (event) => {
      const k = key(event.requestId);
      const record = this.byRequestKey.get(k);
      if (!record) return;
      record.finished = true;
      record.failed = true;
      record.endTime = event.timestamp;
      record.canceled = Boolean(event.canceled);
      record.errorText = event.errorText ?? null;
      record.blockedReason = event.blockedReason ?? null;
      settle(k);
    });
  }

  /** Out-of-process frames and workers: watch and block them like the page itself. */
  async #adoptChild({ sessionId, targetInfo }) {
    const child = new Session(this.browser.connection, sessionId);
    this.childSessions.set(sessionId, child);
    const label = `${targetInfo.type}:${targetInfo.url}`.slice(0, 200);
    if (targetInfo.type === "iframe") {
      // A cross-origin frame's document request starts in this page's session
      // and finishes in the frame's own; stop waiting for it here.
      for (const k of [...this.inflight]) {
        const record = this.byRequestKey.get(k);
        if (record && record.type === "Document" && record.frameId === targetInfo.targetId) {
          record.handedOff = true;
          this.inflight.delete(k);
          this.lastNetworkActivity = Date.now();
        }
      }
    }
    try {
      this.#trackNetwork(child, label);
      child.on("Target.attachedToTarget", (event) => {
        this.#adoptChild(event).catch(() => {});
      });
      child.on("Target.detachedFromTarget", (event) => this.#dropChild(event.sessionId));
      await child.send("Network.enable");
      if (this.options.blockTagHosts) await this.browser.blockTagHosts(child);
      await child.send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
    } catch {
      // Short-lived targets can vanish mid-setup; nothing to watch then.
    } finally {
      child.send("Runtime.runIfWaitingForDebugger").catch(() => {});
    }
  }

  #dropChild(sessionId) {
    if (!this.childSessions.delete(sessionId)) return;
    const prefix = `${sessionId}:`;
    for (const k of [...this.inflight]) if (k.startsWith(prefix)) this.inflight.delete(k);
    this.browser.connection.dropSession(sessionId);
  }
}

/** Tallest screenshot tile in device pixels; comfortably under the 16,384 px GPU texture limit. */
const MAX_TILE_DEVICE_PX = 8192;
/** Longest side of a JPEG, and of a canvas in Chrome. */
const MAX_IMAGE_SIDE = 65535;
/** Largest canvas Chrome will allocate, in pixels. */
const MAX_CANVAS_AREA = 268435456;

function serializeArgs(args) {
  const list = Array.isArray(args) ? args : [args];
  return list.map((value) => (value === undefined ? "undefined" : JSON.stringify(value))).join(",");
}
