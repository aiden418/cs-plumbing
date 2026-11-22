import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { PLACEHOLDER_TAG_IDS, type TagIds } from "../src/lib/pixel";

/**
 * What the three tag loaders render in each NEXT_PUBLIC_ANALYTICS mode.
 *
 * The loaders are called as plain functions with stand-ins for React's hooks,
 * the JSX runtime, next/script and next/navigation, so a test sees the exact
 * <Script> props (id, strategy, src, inline body) and the <noscript> beacon a
 * page would get, and can run the effects by hand. No browser, no network.
 *
 * The expected base markup is written out on purpose. The start of Google's
 * call script is checked by running the Google tag's inline script against a
 * stand-in window and document.
 *
 * The last two tests read the source tree instead: the switch covers the
 * whole site only while these loaders are the only tags, each mounted once.
 */

const REAL: TagIds = {
  ga: "G-2V9GN3FQ5B",
  googleAds: "AW-16467696873",
  meta: "1372903383968668",
  openai: "DMBS1D5TFZstmLgAtY2XcW",
};

/** Google's call-tracking loader and the "C&S Website Phone Calls" conversion it is started for. */
const CALL_SCRIPT = "https://www.gstatic.com/wcm/loader.js";
const CALL_CONVERSION = { ak: "16467696873", cl: "V3DdCPHyq7wdEOm5tKw9" };

const lines = (...text: string[]) => text.join("\n");

const googleTags = (ids: TagIds) => [
  {
    tag: "Script",
    id: "ga4-src",
    src: `https://www.googletagmanager.com/gtag/js?id=${ids.ga}`,
    strategy: "afterInteractive",
  },
  {
    tag: "Script",
    id: "ga4-init",
    strategy: "afterInteractive",
    body: lines(
      "",
      "          window.dataLayer = window.dataLayer || [];",
      "          function gtag(){dataLayer.push(arguments);}",
      "          gtag('js', new Date());",
      `          gtag('config', '${ids.ga}');`,
      `          gtag('config', '${ids.googleAds}');`,
      "        ",
    ),
  },
];

const metaTags = (ids: TagIds) => [
  {
    tag: "Script",
    id: "meta-pixel",
    strategy: "lazyOnload",
    body: lines(
      "",
      "          !function(f,b,e,v,n,t,s)",
      "          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?",
      "          n.callMethod.apply(n,arguments):n.queue.push(arguments)};",
      "          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';",
      "          n.queue=[];t=b.createElement(e);t.async=!0;",
      "          t.src=v;s=b.getElementsByTagName(e)[0];",
      "          s.parentNode.insertBefore(t,s)}(window, document,'script',",
      "          'https://connect.facebook.net/en_US/fbevents.js');",
      `          fbq('init', '${ids.meta}');`,
      "          fbq('track', 'PageView');",
      "        ",
    ),
  },
  {
    tag: "noscript",
    img: {
      height: "1",
      width: "1",
      style: { display: "none" },
      src: `https://www.facebook.com/tr?id=${ids.meta}&ev=PageView&noscript=1`,
      alt: "",
    },
  },
];

const openaiTags = (ids: TagIds) => [
  {
    tag: "Script",
    id: "openai-pixel",
    strategy: "afterInteractive",
    body: lines(
      "",
      "        !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};",
      "        q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=!0;j.src=u;",
      "        var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}",
      '        (window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");',
      `        oaiq("init",{pixelId:"${ids.openai}",debug:false});`,
      "      ",
    ),
  },
];

// ── stand-ins ───────────────────────────────────────────────────────────────

type Element = { type: unknown; props: Record<string, unknown> };
type Effect = () => void | (() => void);

const Fragment = Symbol("Fragment");
const element = (type: unknown, props: Record<string, unknown>): Element => ({ type, props });
/** Stands in for next/script: only ever compared against, never called. */
function Script(): null {
  return null;
}
let effects: Effect[] = [];

const STAND_INS: Record<string, unknown> = {
  "react/jsx-runtime": { jsx: element, jsxs: element, Fragment },
  "react/jsx-dev-runtime": { jsxDEV: element, Fragment },
  react: {
    useEffect: (effect: Effect) => {
      effects.push(effect);
    },
    useRef: <T>(current: T) => ({ current }),
  },
  "next/script": Object.assign(Script, { __esModule: true, default: Script }),
  "next/navigation": { usePathname: () => "/" },
};

const nodeRequire = createRequire(import.meta.url);
const LOADED_FRESH = [
  "../src/lib/pixel",
  "../src/components/analytics/GoogleAnalytics",
  "../src/components/analytics/MetaPixel",
  "../src/components/analytics/OpenAIPixel",
].map((request) => nodeRequire.resolve(request));

function setEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

type Loader = () => unknown;
interface Loaders {
  pixel: typeof import("../src/lib/pixel");
  GoogleAnalytics: Loader;
  MetaPixel: Loader;
  OpenAIPixel: Loader;
}

/**
 * Load pixel.ts and the three loaders as a production build would see them
 * for the given variables (both are read once, at load). The stand-ins are
 * only in place while loading, and nothing is left in the module cache.
 */
function load(env: { analytics?: string; ga?: string } = {}): Loaders {
  const vars = {
    NODE_ENV: "production",
    NEXT_PUBLIC_ANALYTICS: env.analytics,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: env.ga,
  };
  const savedEnv = Object.keys(vars).map((name) => [name, process.env[name]] as const);
  const savedModules = Object.keys(STAND_INS).map((request) => {
    const filename = nodeRequire.resolve(request);
    return [filename, nodeRequire.cache[filename]] as const;
  });
  for (const [name, value] of Object.entries(vars)) setEnv(name, value);
  Object.entries(STAND_INS).forEach(([, exports], i) => {
    const filename = savedModules[i][0];
    nodeRequire.cache[filename] = { id: filename, filename, loaded: true, exports } as unknown as NodeJS.Module;
  });
  for (const filename of LOADED_FRESH) delete nodeRequire.cache[filename];
  try {
    const [pixel, ga, meta, openai] = LOADED_FRESH.map((filename) => nodeRequire(filename));
    return { pixel, GoogleAnalytics: ga.default, MetaPixel: meta.default, OpenAIPixel: openai.default };
  } finally {
    for (const filename of LOADED_FRESH) delete nodeRequire.cache[filename];
    for (const [filename, saved] of savedModules) {
      if (saved) nodeRequire.cache[filename] = saved;
      else delete nodeRequire.cache[filename];
    }
    for (const [name, value] of savedEnv) setEnv(name, value);
  }
}

type Tag = Record<string, unknown>;

/** The <Script> and <noscript> elements in a rendered tree, in order. Anything else is an error. */
function tagsIn(node: unknown): Tag[] {
  if (node === null || node === undefined || node === false) return [];
  if (Array.isArray(node)) return node.flatMap(tagsIn);
  const { type, props } = node as Element;
  if (type === Fragment) return tagsIn(props.children);
  if (type === Script) {
    const { children, ...rest } = props;
    return [{ tag: "Script", ...rest, ...(children === undefined ? {} : { body: children }) }];
  }
  if (type === "noscript") {
    const img = props.children as Element;
    assert.equal(img.type, "img", "the noscript fallback holds one <img> beacon");
    return [{ tag: "noscript", img: img.props }];
  }
  throw new Error(`a tag loader rendered something unexpected: ${String(type)}`);
}

function render(loader: Loader): { tree: unknown; tags: Tag[]; effects: Effect[] } {
  effects = [];
  const tree = loader();
  return { tree, tags: tagsIn(tree), effects };
}

type ForwardingCallback = (formatted?: unknown, mobile?: unknown) => void;

/**
 * A window and document for the Google tag's inline script: the gtag commands
 * it queues and the scripts it adds. `documentParts` are the DOM calls a test
 * page supplies on top.
 */
function googlePage(documentParts: Record<string, unknown> = {}) {
  const dataLayer: IArguments[] = [];
  const scripts: Record<string, unknown>[] = [];
  const window: Record<string, unknown> = { dataLayer };
  const document = {
    ...documentParts,
    createElement: (tag: string): Record<string, unknown> => ({ tag }),
    head: {
      appendChild(script: Record<string, unknown>) {
        scripts.push(script);
      },
    },
  };
  return {
    window,
    document,
    scripts,
    /** Run the tag's inline script on this page. */
    run(body: string, globals: Record<string, unknown> = {}) {
      runInNewContext(body, { ...globals, window, document, dataLayer });
    },
    commands: () => dataLayer.map((args) => Array.from(args)),
  };
}

/**
 * The site started Google's call script itself: one loader added to the page
 * and one queued call, the same one Google's tag makes for a website call
 * conversion. Returns the callback that call hands to Google.
 */
function assertCallTrackingStarted(page: ReturnType<typeof googlePage>): ForwardingCallback {
  const queue = page.window._googWcmImpl as { q?: IArguments[] } | undefined;
  assert.equal(typeof queue, "function");
  assert.equal(page.window._googWcmAk, CALL_CONVERSION.ak);
  assert.deepEqual(page.scripts, [{ tag: "script", async: true, src: CALL_SCRIPT }]);
  assert.equal(queue?.q?.length, 1, "one call waits for the script");
  const [version, callback, conversion, number, unused, askedAt, ...rest] = Array.from(queue?.q?.[0] ?? []);
  assert.equal(version, 2);
  assert.equal(typeof callback, "function");
  // Copied first: the tag runs in its own context, so its objects have another realm's prototypes.
  assert.deepEqual(JSON.parse(JSON.stringify(conversion)), CALL_CONVERSION);
  assert.equal(number, "833-PLUMB-IT");
  assert.equal(unused, null);
  assert.equal(Object.prototype.toString.call(askedAt), "[object Date]");
  assert.deepEqual(rest, []);
  return callback as ForwardingCallback;
}

function assertGoogleTags(loader: Loader, ids: TagIds) {
  const { tags } = render(loader);
  const body = String(tags[1].body);
  const page = googlePage();
  page.run(body);
  const commands = page.commands();
  assert.equal(commands.shift()?.[0], "js");
  // The Google tag gets the two base commands and nothing else: the account's
  // tag ignores a second Ads config, so call tracking is not sent through it.
  assert.deepEqual(commands, [["config", ids.ga], ["config", ids.googleAds]]);
  if (ids.googleAds === REAL.googleAds) {
    assertCallTrackingStarted(page);
  } else {
    assert.equal(page.window._googWcmImpl, undefined, "placeholder builds cannot request a forwarding number");
    assert.deepEqual(page.scripts, []);
  }
  const afterBaseConfig = body.indexOf(`gtag('config', '${ids.googleAds}');`)
    + `gtag('config', '${ids.googleAds}');`.length;
  tags[1].body = body.slice(0, afterBaseConfig) + "\n        ";
  assert.deepEqual(tags, googleTags(ids));
}

type Call = [name: string, ...args: unknown[]];

/** Run `body` with a stand-in `window` (with or without the tag globals) and `document`. */
function onPage<T>(globals: "tags loaded" | "no tags", body: (page: { calls: Call[]; listeners: Call[] }) => T): T {
  const calls: Call[] = [];
  const listeners: Call[] = [];
  const record =
    (log: Call[], name: string) =>
    (...args: unknown[]) => {
      log.push([name, ...args]);
    };
  const scope = globalThis as { window?: unknown; document?: unknown };
  const saved = { window: scope.window, document: scope.document };
  scope.window =
    globals === "tags loaded"
      ? { fbq: record(calls, "fbq"), oaiq: record(calls, "oaiq"), gtag: record(calls, "gtag") }
      : {};
  scope.document = {
    addEventListener: record(listeners, "add"),
    removeEventListener: record(listeners, "remove"),
  };
  try {
    return body({ calls, listeners });
  } finally {
    if (saved.window === undefined) delete scope.window;
    else scope.window = saved.window;
    if (saved.document === undefined) delete scope.document;
    else scope.document = saved.document;
  }
}

const clickOn = (selectorThatMatches: string | null) => ({
  target: { closest: (selector: string) => (selector === selectorThatMatches ? {} : null) },
});

// ── (a) switch unset: production's tags, unchanged ──────────────────────────

test("switch unset: the three loaders render exactly production's tags", () => {
  const { GoogleAnalytics, MetaPixel, OpenAIPixel } = load();
  assertGoogleTags(GoogleAnalytics, REAL);
  assert.deepEqual(render(MetaPixel).tags, metaTags(REAL));
  assert.deepEqual(render(OpenAIPixel).tags, openaiTags(REAL));
});

test("a blank or unrecognised switch value renders the same as unset", () => {
  for (const analytics of ["", "on", "true", "false", "0", "disabled", "offf"]) {
    const { GoogleAnalytics, MetaPixel, OpenAIPixel } = load({ analytics });
    assertGoogleTags(GoogleAnalytics, REAL);
    assert.deepEqual(render(MetaPixel).tags, metaTags(REAL), JSON.stringify(analytics));
    assert.deepEqual(render(OpenAIPixel).tags, openaiTags(REAL), JSON.stringify(analytics));
  }
});

// ── (b) off: nothing rendered, listener still mounted ───────────────────────

test("NEXT_PUBLIC_ANALYTICS=off: no loader renders a script or a beacon", () => {
  const { GoogleAnalytics, MetaPixel, OpenAIPixel } = load({ analytics: "off" });
  for (const loader of [GoogleAnalytics, MetaPixel, OpenAIPixel]) {
    const { tree, tags } = render(loader);
    assert.equal(tree, null, loader.name);
    assert.deepEqual(tags, [], loader.name);
  }
});

test("NEXT_PUBLIC_ANALYTICS=off: the tel: listener stays mounted and a call tap is harmless", () => {
  const { MetaPixel } = load({ analytics: "off" });
  const { effects: mounted } = render(MetaPixel);
  assert.equal(mounted.length, 1);
  onPage("no tags", ({ calls, listeners }) => {
    mounted[0]();
    assert.deepEqual(listeners.map(([op, type]) => [op, type]), [["add", "click"]]);
    const handler = listeners[0][2] as (event: unknown) => void;
    assert.doesNotThrow(() => handler(clickOn('a[href^="tel:"]')));
    assert.deepEqual(calls, []);
  });
});

// ── (c) placeholder: same tags, fake ids ────────────────────────────────────

test("NEXT_PUBLIC_ANALYTICS=placeholder: fake IDs and no call forwarding", () => {
  const { GoogleAnalytics, MetaPixel, OpenAIPixel } = load({ analytics: "placeholder" });
  const rendered = [render(GoogleAnalytics).tags, render(MetaPixel).tags, render(OpenAIPixel).tags];
  assertGoogleTags(GoogleAnalytics, PLACEHOLDER_TAG_IDS);
  assert.deepEqual(rendered[1], metaTags(PLACEHOLDER_TAG_IDS));
  assert.deepEqual(rendered[2], openaiTags(PLACEHOLDER_TAG_IDS));
  const markup = JSON.stringify(rendered);
  for (const id of Object.values(REAL)) assert.ok(!markup.includes(id), `real id ${id} in a placeholder build`);
});

// ── NEXT_PUBLIC_GA_MEASUREMENT_ID=off still works ───────────────────────────

test("NEXT_PUBLIC_GA_MEASUREMENT_ID=off removes the Google tag, and only that, in every mode", () => {
  const on = load({ ga: "off" });
  assert.deepEqual(render(on.GoogleAnalytics).tags, []);
  assert.deepEqual(render(on.MetaPixel).tags, metaTags(REAL));
  assert.deepEqual(render(on.OpenAIPixel).tags, openaiTags(REAL));

  const placeholder = load({ analytics: "placeholder", ga: "off" });
  assert.deepEqual(render(placeholder.GoogleAnalytics).tags, []);
  assert.deepEqual(render(placeholder.MetaPixel).tags, metaTags(PLACEHOLDER_TAG_IDS));
  assert.deepEqual(render(placeholder.OpenAIPixel).tags, openaiTags(PLACEHOLDER_TAG_IDS));

  const off = load({ analytics: "off", ga: "off" });
  for (const loader of [off.GoogleAnalytics, off.MetaPixel, off.OpenAIPixel]) assert.deepEqual(render(loader).tags, []);
});

test("a GA id supplied by NEXT_PUBLIC_GA_MEASUREMENT_ID is used when the tags are on, never in placeholder mode", () => {
  const custom = { ...REAL, ga: "G-OVERRIDE01" };
  assertGoogleTags(load({ ga: "G-OVERRIDE01" }).GoogleAnalytics, custom);
  assertGoogleTags(
    load({ analytics: "placeholder", ga: "G-OVERRIDE01" }).GoogleAnalytics,
    PLACEHOLDER_TAG_IDS,
  );
});

// ── the Google Ads forwarding number: what the callback does to the page ────
//
// Google's call-tracking script (gstatic.com/call-tracking) calls the callback
// it was handed, callback(formatted, mobile), only when its server returned a
// forwarding number, and calls it again on its refresh timer and every time
// the tab becomes visible. These tests run the callback exactly as the tag
// ships it, against a stand-in page.

const COMPANY_TEL = "tel:+18337586248";
const COMPANY_SMS = "sms:+18337586248?&body=Hi%20C%26S%20Plumbing%2C%20I%20need%20help%20with%20";

interface PageLink {
  attrs: Record<string, string>;
  texts: { data: string }[];
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
}

/** A page of links, with the DOM calls the callback uses and a way to play a DOM change. */
function forwardingPage() {
  type Observer = { notify: () => void; observing: boolean };
  const observers: Observer[] = [];
  const links: PageLink[] = [];
  /** The callback disconnects its observer before it writes, so its own writes never re-trigger it. */
  const assertNotObserved = () =>
    assert.ok(observers.every((o) => !o.observing), "the page was written to while the observer was connected");

  function link(href: string, texts: string[], label?: string): PageLink {
    const attrs: Record<string, string> = { href, ...(label ? { "aria-label": label } : {}) };
    const made: PageLink = {
      attrs,
      texts: texts.map((text) => {
        let data = text;
        return {
          get data() {
            return data;
          },
          set data(next: string) {
            assertNotObserved();
            data = next;
          },
        };
      }),
      getAttribute: (name) => attrs[name] ?? null,
      setAttribute: (name, value) => {
        assertNotObserved();
        attrs[name] = value;
      },
    };
    links.push(made);
    return made;
  }

  class MutationObserver {
    private readonly self: Observer;
    constructor(callback: () => void) {
      this.self = { notify: callback, observing: false };
      observers.push(this.self);
    }
    observe(target: unknown, options: Record<string, unknown>) {
      assert.equal(target, document.body);
      // Copied first: the tag runs in its own context, so its objects have another realm's prototypes.
      assert.deepEqual(JSON.parse(JSON.stringify(options)), {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["href", "aria-label"],
      });
      this.self.observing = true;
    }
    disconnect() {
      this.self.observing = false;
    }
  }

  const document = {
    body: {},
    querySelectorAll(selector: string) {
      const parts = selector.split(", ");
      const hrefs = parts.map((part) => /^a\[href="([^"\]]+)"\]$/.exec(part)?.[1]);
      assert.ok(hrefs.every(Boolean), `unexpected selector: ${selector}`);
      return links.filter((l) => hrefs.includes(l.attrs.href));
    },
    createTreeWalker(root: PageLink, whatToShow: number) {
      assert.equal(whatToShow, 4);
      let index = -1;
      return {
        currentNode: root as unknown,
        nextNode() {
          index += 1;
          if (index >= root.texts.length) return null;
          this.currentNode = root.texts[index];
          return this.currentNode;
        },
      };
    },
  };

  return {
    link,
    observers,
    globals: { document, NodeFilter: { SHOW_TEXT: 4 }, MutationObserver },
    /** A DOM change (a route change, an opened menu, React re-rendering a link). */
    domChanged: () => observers.filter((o) => o.observing).forEach((o) => o.notify()),
    text: (l: PageLink) => l.texts.map((t) => t.data).join(""),
  };
}

/** The callback from the production tag, bound to a stand-in page. */
function forwardingCallback(page: ReturnType<typeof forwardingPage>): ForwardingCallback {
  const body = String(render(load().GoogleAnalytics).tags[1].body);
  const { document, ...globals } = page.globals;
  const google = googlePage(document);
  google.run(body, globals);
  return assertCallTrackingStarted(google);
}

test("the site starts Google's call script itself, and does not load it twice", () => {
  const body = String(render(load().GoogleAnalytics).tags[1].body);
  // No second Ads config rides along: if Google's tag ever acted on one again, the script would be asked twice.
  assert.ok(!body.includes("phone_conversion"), "call tracking is not sent through gtag");

  const fresh = googlePage();
  fresh.run(body);
  assertCallTrackingStarted(fresh);

  // Something has already started the script: the call goes to it and no loader is added.
  const started = googlePage();
  const calls: unknown[][] = [];
  started.window._googWcmImpl = (...args: unknown[]) => {
    calls.push(args);
  };
  started.run(body);
  assert.deepEqual(started.scripts, []);
  assert.equal(started.window._googWcmAk, undefined);
  assert.equal(calls.length, 1);
  assert.deepEqual([calls[0][0], typeof calls[0][1], calls[0][3]], [2, "function", "833-PLUMB-IT"]);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][2])), CALL_CONVERSION);
});

test("a forwarding number from Google replaces the number on every company call link, and only there", () => {
  const page = forwardingPage();
  const heroCall = page.link(COMPANY_TEL, ["Call", " ", "833-PLUMB-IT"]);
  const footer = page.link(COMPANY_TEL, ["833-PLUMB-IT"]);
  const digits = page.link(COMPANY_TEL, ["833-758-6248"]);
  const dock = page.link(COMPANY_TEL, ["Call"], "Call 833-758-6248 (833-PLUMB-IT)");
  const text = page.link(COMPANY_SMS, ["Text"], "Text us");
  const partner = page.link("tel:2395551234", ["(239) 555-1234"]);
  const booking = page.link("/booking", ["Request a Repair"]);

  forwardingCallback(page)("(239) 555-0142", "+12395550142");

  for (const l of [heroCall, footer, digits, dock]) assert.equal(l.attrs.href, "tel:+12395550142");
  assert.equal(page.text(heroCall), "Call (239) 555-0142");
  assert.equal(page.text(footer), "(239) 555-0142");
  assert.equal(page.text(digits), "(239) 555-0142");
  assert.equal(page.text(dock), "Call");
  assert.equal(dock.attrs["aria-label"], "Call (239) 555-0142", "the label reads the number once");
  // Text links keep the business number; other people's numbers and page links are not touched.
  assert.deepEqual(text.attrs, { href: COMPANY_SMS, "aria-label": "Text us" });
  assert.deepEqual(partner.attrs, { href: "tel:2395551234" });
  assert.equal(page.text(partner), "(239) 555-1234");
  assert.deepEqual(booking.attrs, { href: "/booking" });
  assert.equal(page.observers.length, 1);
  assert.equal(page.observers[0].observing, true, "the page is watched for links rendered later");
});

test("without a usable forwarding number the published number stays and nothing is watched", () => {
  const unusable: [formatted: unknown, mobile: unknown][] = [
    [undefined, undefined],
    ["", ""],
    ["833-PLUMB-IT", "+18337586248"], // the company number itself
    ["833-758-6248", "8337586248"],
    ["833-758-6248", "18337586248"],
    ["999-PLUMB-IT", "+999"], // what the "Force" button of Google's debug panel sends for a lettered number
    ["(239) 555-0142", "(239) 555-0142"], // not a dialable string
    ["x", "+1239555014x"],
  ];
  for (const [formatted, mobile] of unusable) {
    const page = forwardingPage();
    const call = page.link(COMPANY_TEL, ["Call ", "833-PLUMB-IT"], "Call 833-758-6248 (833-PLUMB-IT)");
    const sms = page.link(COMPANY_SMS, ["Text"]);
    forwardingCallback(page)(formatted, mobile);
    assert.equal(call.attrs.href, COMPANY_TEL, JSON.stringify(mobile));
    assert.equal(call.attrs["aria-label"], "Call 833-758-6248 (833-PLUMB-IT)");
    assert.equal(page.text(call), "Call 833-PLUMB-IT");
    assert.equal(sms.attrs.href, COMPANY_SMS);
    assert.deepEqual(page.observers, []);
  }
  // Google never calls the callback for a visitor it has no number for: the page is simply left alone.
  const page = forwardingPage();
  const call = page.link(COMPANY_TEL, ["833-PLUMB-IT"]);
  forwardingCallback(page);
  assert.equal(call.attrs.href, COMPANY_TEL);
  assert.equal(page.text(call), "833-PLUMB-IT");
  assert.deepEqual(page.observers, []);
});

test("a forwarding number with no formatted form is shown as sent", () => {
  const page = forwardingPage();
  const call = page.link(COMPANY_TEL, ["Call ", "833-PLUMB-IT"]);
  forwardingCallback(page)("", "12395550142");
  assert.equal(call.attrs.href, "tel:12395550142");
  assert.equal(page.text(call), "Call 12395550142");
});

test("call links rendered after the swap (client-side navigation, the mobile menu) get the forwarding number", () => {
  const page = forwardingPage();
  const header = page.link(COMPANY_TEL, ["833-PLUMB-IT"]);
  forwardingCallback(page)("(239) 555-0142", "+12395550142");

  // A route change renders the next page's links with the published number.
  const nextPageHero = page.link(COMPANY_TEL, ["Call ", "833-PLUMB-IT"]);
  const nextPageText = page.link(COMPANY_SMS, ["Text"]);
  page.domChanged();
  assert.equal(nextPageHero.attrs.href, "tel:+12395550142");
  assert.equal(page.text(nextPageHero), "Call (239) 555-0142");
  assert.equal(nextPageText.attrs.href, COMPANY_SMS);

  // React re-renders a link it owns back to the published number.
  header.attrs.href = COMPANY_TEL;
  header.texts[0] = { data: "833-PLUMB-IT" };
  page.domChanged();
  assert.equal(header.attrs.href, "tel:+12395550142");
  assert.equal(page.text(header), "(239) 555-0142");
  assert.equal(page.observers.length, 1);
  assert.equal(page.observers[0].observing, true);
});

test("Google calling again adds no second observer, and a changed number replaces the first", () => {
  const page = forwardingPage();
  const call = page.link(COMPANY_TEL, ["Call ", "833-PLUMB-IT"], "Call 833-758-6248 (833-PLUMB-IT)");
  const callback = forwardingCallback(page);

  // The refresh timer and every return to the tab repeat the same number.
  for (let i = 0; i < 4; i++) callback("(239) 555-0142", "+12395550142");
  assert.equal(page.observers.length, 1);
  assert.equal(call.attrs.href, "tel:+12395550142");
  assert.equal(page.text(call), "Call (239) 555-0142");

  // A new number from a later refresh takes over, on old links and new ones.
  callback("(239) 555-0177", "+12395550177");
  const later = page.link(COMPANY_TEL, ["833-758-6248"]);
  page.domChanged();
  for (const l of [call, later]) assert.equal(l.attrs.href, "tel:+12395550177");
  assert.equal(page.text(call), "Call (239) 555-0177");
  assert.equal(call.attrs["aria-label"], "Call (239) 555-0177");
  assert.equal(page.text(later), "(239) 555-0177");

  // A later unusable answer leaves the last good number in place.
  callback("", "");
  assert.equal(call.attrs.href, "tel:+12395550177");
  assert.equal(page.observers.length, 1);
});

// ── the single call-tracking listener and the route-change page view ────────

test("one document-level tel: listener in every mode; a call tap reports once to Meta and GA4, never to OpenAI", () => {
  for (const analytics of [undefined, "off", "placeholder"]) {
    const { MetaPixel, GoogleAnalytics, OpenAIPixel } = load({ analytics });
    assert.equal(render(GoogleAnalytics).effects.length, 0, `GoogleAnalytics effects (${analytics})`);
    assert.equal(render(OpenAIPixel).effects.length, 1, `OpenAIPixel effects (${analytics})`);
    const { effects: mounted } = render(MetaPixel);
    assert.equal(mounted.length, 1, `MetaPixel effects (${analytics})`);

    onPage("tags loaded", ({ calls, listeners }) => {
      const unmount = mounted[0]();
      assert.deepEqual(listeners.map(([op, type]) => [op, type]), [["add", "click"]], String(analytics));
      const handler = listeners[0][2] as (event: unknown) => void;

      handler(clickOn(null)); // any other click
      assert.deepEqual(calls, [], String(analytics));

      // A tap is not a lead: Meta and GA4 hear about it, the OpenAI pixel does not.
      handler(clickOn('a[href^="tel:"]'));
      assert.deepEqual(
        calls,
        [
          ["fbq", "track", "Contact", { content_name: "Phone Call", content_category: "Lead" }],
          ["gtag", "event", "contact", { content_name: "Phone Call", content_category: "Lead" }],
        ],
        String(analytics),
      );

      assert.equal(typeof unmount, "function");
      (unmount as () => void)();
      assert.deepEqual(listeners.map(([op, type]) => [op, type]), [
        ["add", "click"],
        ["remove", "click"],
      ]);
      assert.equal(listeners[1][2], handler, "cleanup removes the listener it added");
    });
  }
});

test("the OpenAI route-change page view fires only after the first render, and only when the pixel exists", () => {
  for (const analytics of [undefined, "off", "placeholder"]) {
    const { OpenAIPixel } = load({ analytics });
    const { effects: mounted } = render(OpenAIPixel);
    onPage("tags loaded", ({ calls }) => {
      mounted[0](); // landing page: the SDK reports this one itself
      assert.deepEqual(calls, [], String(analytics));
      mounted[0](); // client-side navigation
      assert.deepEqual(calls, [["oaiq", "measure", "page_viewed", { type: "contents" }]], String(analytics));
    });
    const again = render(OpenAIPixel).effects;
    onPage("no tags", ({ calls }) => {
      again[0]();
      assert.doesNotThrow(() => again[0]());
      assert.deepEqual(calls, [], String(analytics));
    });
  }
});

// ── the switch only works if these three loaders are the only tags ──────────

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const LOADERS = ["GoogleAnalytics", "MetaPixel", "OpenAIPixel"];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

/** Files under src/ (as "components/x/Y.tsx") whose text matches. */
function filesMatching(pattern: RegExp): string[] {
  return sourceFiles(SRC)
    .filter((path) => pattern.test(readFileSync(path, "utf8")))
    .map((path) => relative(SRC, path).split(sep).join("/"))
    .sort();
}

test("no file outside the three loaders names a tag vendor's script or beacon host", () => {
  // A tag loaded from anywhere else would keep running with NEXT_PUBLIC_ANALYTICS=off.
  // Load a new tag from src/components/analytics behind the same TAG_IDS check, then list it here.
  const tagHosts =
    /googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|connect\.facebook\.net|facebook\.com\/tr\b|bzrcdn\.openai\.com/;
  assert.deepEqual(
    filesMatching(tagHosts),
    LOADERS.map((name) => `components/analytics/${name}.tsx`),
  );
});

test("each loader is mounted once, in the root layout, and nowhere else", () => {
  // MetaPixel carries the one tel: listener: a second mount would report every call tap twice.
  const layout = readFileSync(join(SRC, "app/layout.tsx"), "utf8");
  for (const name of LOADERS) {
    const mount = `<${name}[\\s/>]`;
    assert.deepEqual(filesMatching(new RegExp(mount)), ["app/layout.tsx"], `files that mount <${name} />`);
    assert.equal(layout.match(new RegExp(mount, "g"))?.length, 1, `<${name} /> mounts in src/app/layout.tsx`);
  }
});
