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
 * The expected base markup is written out on purpose. The call forwarding
 * configuration is checked by running the Google tag's queued commands.
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

function assertGoogleTags(loader: Loader, ids: TagIds) {
  const { tags } = render(loader);
  const body = String(tags[1].body);
  const dataLayer: IArguments[] = [];
  runInNewContext(body, { window: { dataLayer }, dataLayer });
  const commands = dataLayer.map((args) => Array.from(args));
  assert.equal(commands.shift()?.[0], "js");
  assert.deepEqual(commands.slice(0, 2), [["config", ids.ga], ["config", ids.googleAds]]);
  if (ids.googleAds === REAL.googleAds) {
    assert.equal(commands.length, 3);
    const [command, destination, settings] = commands[2];
    assert.equal(command, "config");
    assert.equal(destination, "AW-16467696873/V3DdCPHyq7wdEOm5tKw9");
    assert.equal(settings.phone_conversion_number, "833-PLUMB-IT");
    assert.equal(typeof settings.phone_conversion_callback, "function");
  } else {
    assert.equal(commands.length, 2, "placeholder builds cannot request a forwarding number");
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

// ── the single call-tracking listener and the route-change page view ────────

test("one document-level tel: listener in every mode; a call tap reports once per platform", () => {
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

      handler(clickOn('a[href^="tel:"]'));
      assert.deepEqual(
        calls,
        [
          ["fbq", "track", "Contact", { content_name: "Phone Call", content_category: "Lead" }],
          ["oaiq", "measure", "lead_created", { type: "customer_action" }],
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
