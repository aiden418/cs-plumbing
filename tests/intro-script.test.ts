/**
 * The Opening's two inline scripts (src/lib/intro.ts), run in node:vm
 * against fake window / document / localStorage / matchMedia / navigator
 * objects: every eligibility rule, every skip path, the play → settle → done
 * sequence, and the frame script's measuring and file choice.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  FIRST_FRAME_CAP_MS,
  HERO_SOURCES,
  HOLD_MS,
  INTRO_SCRIPT,
  SEEN_KEY,
  buildIntroScript,
  frameScript,
} from "../src/lib/intro";
import { MOTION_KEY, PHONE_MEDIA, audienceFor } from "../src/lib/hero-controller";

const DAY = 864e5;

type Listener = (e: FakeEvent) => void;
type FakeEvent = { type: string; target?: unknown; propertyName?: string };

type EnvOptions = {
  path?: string;
  search?: string;
  hash?: string;
  width?: number;
  height?: number;
  storage?: Record<string, string>;
  storageThrows?: boolean;
  reducedMotion?: boolean;
  coarse?: boolean;
  connection?: { saveData?: boolean; effectiveType?: string } | null;
  navEntry?: { type?: string; requestStart?: number; responseStart?: number } | null;
  visibility?: "visible" | "hidden";
  webdriver?: boolean;
  script?: string;
};

function makeEl(opts: { id?: string; skip?: boolean; keep?: boolean; focus?: boolean } = {}) {
  const attrs = new Map<string, string>();
  const style = new Map<string, string>();
  const listeners: Record<string, Listener[]> = {};
  const el = {
    id: opts.id ?? "",
    focused: false,
    attrs,
    styleMap: style,
    style: { setProperty: (k: string, v: string) => style.set(k, v) },
    setAttribute: (k: string, v: string) => attrs.set(k, String(v)),
    getAttribute: (k: string) => (attrs.has(k) ? attrs.get(k)! : null),
    removeAttribute: (k: string) => attrs.delete(k),
    hasAttribute: (k: string) => attrs.has(k),
    closest(sel: string) {
      if (sel === "[data-intro-skip]") return opts.skip ? el : null;
      return opts.keep ? el : null;
    },
    focus() {
      el.focused = true;
    },
    addEventListener(t: string, f: Listener) {
      (listeners[t] ??= []).push(f);
    },
    removeEventListener(t: string, f: Listener) {
      listeners[t] = (listeners[t] ?? []).filter((g) => g !== f);
    },
    emit(t: string) {
      for (const f of [...(listeners[t] ?? [])]) f({ type: t, target: el });
    },
  };
  return el;
}

function makeEnv(o: EnvOptions = {}) {
  const width = o.width ?? 1440;
  const height = o.height ?? 900;
  const storage = new Map(Object.entries(o.storage ?? {}));
  const html = makeEl();
  const winListeners: Record<string, Listener[]> = {};
  const docListeners: Record<string, Listener[]> = {};
  const events: string[] = [];
  const marks: string[] = [];
  let now = 0;
  let timerId = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const focusTarget = makeEl({ focus: true });
  const byId = new Map<string, unknown>();

  const add = (bag: Record<string, Listener[]>) => (t: string, f: Listener) => {
    (bag[t] ??= []).push(f);
  };
  const remove = (bag: Record<string, Listener[]>) => (t: string, f: Listener) => {
    bag[t] = (bag[t] ?? []).filter((g) => g !== f);
  };

  const document = {
    documentElement: html,
    visibilityState: o.visibility ?? "visible",
    activeElement: null as unknown,
    addEventListener: add(docListeners),
    removeEventListener: remove(docListeners),
    dispatchEvent(e: FakeEvent) {
      events.push(e.type);
      for (const f of [...(docListeners[e.type] ?? [])]) f(e);
      return true;
    },
    querySelector: (sel: string) => (sel === "[data-intro-focus]" ? focusTarget : null),
    getElementById: (id: string) => byId.get(id) ?? null,
    fonts: undefined as unknown,
  };

  const connection = o.connection === undefined ? { effectiveType: "4g", saveData: false } : o.connection;
  const nav = o.navEntry === undefined ? { type: "navigate", requestStart: 10, responseStart: 60 } : o.navEntry;

  const win: Record<string, unknown> = {
    document,
    location: { pathname: o.path ?? "/", search: o.search ?? "", hash: o.hash ?? "" },
    navigator: { ...(connection ? { connection } : {}), webdriver: o.webdriver ?? false },
    localStorage: o.storageThrows
      ? {
          getItem() {
            throw new Error("SecurityError");
          },
          setItem() {
            throw new Error("SecurityError");
          },
        }
      : {
          getItem: (k: string) => (storage.has(k) ? storage.get(k)! : null),
          setItem: (k: string, v: string) => storage.set(k, String(v)),
        },
    matchMedia: (q: string) => ({
      matches:
        (q === "(prefers-reduced-motion: reduce)" && !!o.reducedMotion) ||
        (q === "(pointer: coarse)" && !!o.coarse) ||
        (q === PHONE_MEDIA && width <= 767 && height > width),
    }),
    performance: {
      mark: (m: string) => marks.push(m),
      getEntriesByType: (t: string) => (t === "navigation" && nav ? [nav] : []),
    },
    innerWidth: width,
    innerHeight: height,
    addEventListener: add(winListeners),
    removeEventListener: remove(winListeners),
    setTimeout: (fn: () => void, ms: number) => {
      timerId += 1;
      timers.set(timerId, { at: now + ms, fn });
      return timerId;
    },
    clearTimeout: (id: number) => timers.delete(id),
    Event: class {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
    },
  };
  win.window = win;
  const context = vm.createContext(win);
  vm.runInContext(o.script ?? INTRO_SCRIPT, context);

  const env = {
    win,
    context,
    html,
    document,
    storage,
    events,
    marks,
    focusTarget,
    byId,
    get intro() {
      return html.getAttribute("data-intro");
    },
    get hero() {
      return win.__csHero as { intro: string; file: string; autoplay: string; state: string };
    },
    get handle() {
      return win.__csIntro as { s: string | null; r: string; why?: string; play(): void; skip(w: string): void };
    },
    listenerCount: () =>
      Object.values(winListeners).reduce((n, l) => n + l.length, 0) + Object.values(docListeners).reduce((n, l) => n + l.length, 0),
    /** Advance the fake clock, running due timers in order. */
    tick(ms: number) {
      const until = now + ms;
      for (;;) {
        let next: [number, { at: number; fn: () => void }] | undefined;
        for (const entry of timers) if (entry[1].at <= until && (!next || entry[1].at < next[1].at)) next = entry;
        if (!next) break;
        timers.delete(next[0]);
        now = next[1].at;
        next[1].fn();
      }
      now = until;
    },
    fireWin(type: string, target?: unknown) {
      for (const f of [...(winListeners[type] ?? [])]) f({ type, target });
    },
    fireDoc(type: string, target?: unknown, extra: Partial<FakeEvent> = {}) {
      for (const f of [...(docListeners[type] ?? [])]) f({ type, target, ...extra });
    },
  };
  return env;
}

// --- eligibility --------------------------------------------------------------

test("first visit on a capable desktop: wait, seen flag written, debug record and mark", () => {
  const env = makeEnv();
  assert.equal(env.intro, "wait");
  assert.equal(env.handle.s, "wait");
  assert.equal(env.hero.intro, "played");
  assert.deepEqual(
    { file: env.hero.file, autoplay: env.hero.autoplay, state: env.hero.state },
    { file: "none", autoplay: "n/a", state: "idle" },
  );
  assert.ok(Number(env.storage.get(SEEN_KEY)) >= 0, "seen flag written when the intro starts");
  assert.deepEqual(env.marks, ["intro:start"]);
  assert.ok(env.events.includes("cs:hero-debug"));
  assert.ok(env.listenerCount() > 0);
});

const ineligible: [string, EnvOptions, string][] = [
  ["?intro=0 forces it off", { search: "?intro=0" }, "param"],
  ["another page", { path: "/about" }, "path"],
  ["a hash", { hash: "#faq" }, "path"],
  ["back/forward navigation", { navEntry: { type: "back_forward", requestStart: 1, responseStart: 2 } }, "history"],
  ["seen 3 days ago", { storage: { [SEEN_KEY]: String(Date.now() - 3 * DAY) } }, "seen"],
  ["storage throws (counts as seen)", { storageThrows: true }, "seen"],
  ["reduced motion", { reducedMotion: true }, "reduced-motion"],
  ["Save-Data", { connection: { saveData: true, effectiveType: "4g" } }, "save-data"],
  ["3g", { connection: { effectiveType: "3g" } }, "slow"],
  ["slow-2g", { connection: { effectiveType: "slow-2g" } }, "slow"],
  ["no connection API and a slow document response", { connection: null, navEntry: { requestStart: 10, responseStart: 900 } }, "slow"],
  ["no connection API and no navigation timing", { connection: null, navEntry: null }, "slow"],
  ["hidden tab", { visibility: "hidden" }, "hidden"],
  ["short window", { width: 1440, height: 400 }, "short"],
  ["phone held sideways under 420 px", { width: 844, height: 390, coarse: true }, "short"],
  ["navigator.webdriver", { webdriver: true }, "webdriver"],
  ["film paused earlier", { storage: { [MOTION_KEY]: "off" } }, "paused"],
];

for (const [name, opts, reason] of ineligible) {
  test(`ineligible: ${name}`, () => {
    const env = makeEnv(opts);
    assert.equal(env.intro, null, "no data-intro");
    assert.equal(env.hero.intro, `ineligible:${reason}`);
    assert.equal(env.handle.r, reason);
    assert.equal(env.handle.s, null);
    assert.equal(env.listenerCount(), 0, "no listeners");
    assert.deepEqual(env.marks, []);
    if (!opts.storage && !opts.storageThrows) assert.equal(env.storage.has(SEEN_KEY), false, "seen flag not written");
  });
}

test("ineligible: no film variant for this viewport class", () => {
  const script = buildIntroScript(HERO_SOURCES.filter((s) => s.audience !== "portrait-phone"));
  const env = makeEnv({ script, width: 390, height: 844, coarse: true });
  assert.equal(env.hero.intro, "ineligible:no-variant");
});

const eligible: [string, EnvOptions][] = [
  ["seen more than 30 days ago", { storage: { [SEEN_KEY]: String(Date.now() - 31 * DAY) } }],
  ["?intro=1 bypasses the seen flag", { search: "?intro=1", storage: { [SEEN_KEY]: String(Date.now()) } }],
  ["?intro=1 bypasses webdriver", { search: "?a=b&intro=1", webdriver: true }],
  ["no connection API but a quick document response", { connection: null, navEntry: { requestStart: 10, responseStart: 120 } }],
  ["upright phone", { width: 390, height: 844, coarse: true }],
  ["tablet", { width: 768, height: 1024, coarse: true }],
];

for (const [name, opts] of eligible) {
  test(`eligible: ${name}`, () => {
    const env = makeEnv(opts);
    assert.equal(env.intro, "wait");
    assert.equal(env.hero.intro, "played");
  });
}

test("?intro=1 does not bypass reduced motion, Save-Data or ?intro=0 rules", () => {
  assert.equal(makeEnv({ search: "?intro=1", reducedMotion: true }).hero.intro, "ineligible:reduced-motion");
  assert.equal(makeEnv({ search: "?intro=1", connection: { saveData: true } }).hero.intro, "ineligible:save-data");
  assert.equal(makeEnv({ search: "?intro=1", path: "/services" }).hero.intro, "ineligible:path");
});

// --- skip ---------------------------------------------------------------------

function assertSkippedThenDone(env: ReturnType<typeof makeEnv>, why: string) {
  assert.equal(env.intro, "skip");
  assert.equal(env.handle.why, why);
  assert.equal(env.hero.intro, "skipped");
  env.tick(260);
  assert.equal(env.intro, null, "attribute removed");
  assert.equal(env.handle.s, "done");
  assert.ok(env.events.includes("cs:intro-done"));
  assert.ok(env.marks.includes("intro:done"));
  assert.equal(env.listenerCount(), 0, "listeners removed");
}

test("skip: any key (including Tab)", () => {
  const env = makeEnv();
  env.fireWin("keydown", makeEl());
  assertSkippedThenDone(env, "keydown");
});

test("skip: wheel, touch and scroll", () => {
  for (const type of ["wheel", "touchstart", "scroll"]) {
    const env = makeEnv();
    env.fireWin(type, makeEl());
    assertSkippedThenDone(env, type);
  }
});

test("skip: a press outside the header and dock controls", () => {
  const env = makeEnv();
  env.fireWin("pointerdown", makeEl());
  assertSkippedThenDone(env, "pointerdown");
});

test("no skip: a press or touch on the header Call/logo or a dock link", () => {
  const env = makeEnv();
  env.fireWin("pointerdown", makeEl({ keep: true }));
  env.fireWin("touchstart", makeEl({ keep: true }));
  assert.equal(env.intro, "wait");
});

test("skip: the Skip button by pointer, by click (assistive tech) and focus moves to the hero Call", () => {
  const env = makeEnv();
  const button = makeEl({ skip: true, keep: false });
  env.fireDoc("click", button);
  env.document.activeElement = button;
  assertSkippedThenDone(env, "button");
  assert.equal(env.focusTarget.focused, true);

  const env2 = makeEnv();
  env2.fireWin("pointerdown", makeEl({ skip: true }));
  assert.equal(env2.handle.why, "button");
});

test("skip: no first frame within the cap", () => {
  const env = makeEnv();
  env.tick(FIRST_FRAME_CAP_MS - 1);
  assert.equal(env.intro, "wait");
  env.tick(1);
  assertSkippedThenDone(env, "no-frame");
});

test("skip: the tab is hidden during the beat", () => {
  const env = makeEnv();
  env.document.visibilityState = "hidden";
  env.fireDoc("visibilitychange");
  assertSkippedThenDone(env, "hidden");
});

test("skip ends early on the frame's transitionend", () => {
  const env = makeEnv();
  env.fireWin("keydown", makeEl());
  env.fireDoc("transitionend", { id: "cs-hero-frame" }, { propertyName: "transform" });
  assert.equal(env.intro, null);
});

test("focus elsewhere is left alone at the end", () => {
  const env = makeEnv();
  env.document.activeElement = makeEl();
  env.fireWin("keydown", makeEl());
  env.tick(300);
  assert.equal(env.focusTarget.focused, false);
});

// --- play → settle → done ------------------------------------------------------

test("play: first frame → hold → settle → done on the frame's transitionend", () => {
  const env = makeEnv();
  env.handle.play();
  assert.equal(env.intro, "play");
  assert.deepEqual(env.marks, ["intro:start", "intro:first-frame"]);
  env.tick(FIRST_FRAME_CAP_MS + 10);
  assert.equal(env.intro, "play", "the 1 s cap no longer applies");
  const env2 = makeEnv();
  env2.handle.play();
  env2.tick(HOLD_MS.desktop - 1);
  assert.equal(env2.html.hasAttribute("data-intro-settle"), false);
  env2.tick(1);
  assert.equal(env2.html.hasAttribute("data-intro-settle"), true);
  assert.ok(env2.marks.includes("intro:settle-start"));
  env2.fireDoc("transitionend", { id: "other" }, { propertyName: "transform" });
  assert.equal(env2.intro, "play");
  env2.fireDoc("transitionend", { id: "cs-hero-frame" }, { propertyName: "transform" });
  assert.equal(env2.intro, null);
  assert.equal(env2.html.hasAttribute("data-intro-settle"), false);
  assert.equal(env2.hero.intro, "played");
  assert.deepEqual(env2.marks, ["intro:start", "intro:first-frame", "intro:settle-start", "intro:done"]);
  assert.ok(env2.events.includes("cs:intro-done"));
});

test("play: watchdog ends the beat when no transitionend arrives; phones hold for less", () => {
  const env = makeEnv({ width: 390, height: 844, coarse: true });
  env.handle.play();
  env.tick(HOLD_MS.phone);
  assert.equal(env.html.hasAttribute("data-intro-settle"), true);
  env.tick(1300);
  assert.equal(env.intro, null);
  assert.ok(env.events.includes("cs:intro-done"));
});

test("skip during the settle restarts it short and keeps 'skipped'", () => {
  const env = makeEnv();
  env.handle.play();
  env.tick(HOLD_MS.desktop + 100);
  env.fireWin("wheel");
  assert.equal(env.intro, "skip");
  assert.equal(env.html.hasAttribute("data-intro-settle"), false);
  env.tick(260);
  assert.equal(env.intro, null);
  assert.equal(env.hero.intro, "skipped");
});

test("play() after a skip, and a second done, do nothing", () => {
  const env = makeEnv();
  env.fireWin("keydown");
  env.handle.play();
  assert.equal(env.intro, "skip");
  env.tick(500);
  const count = env.events.filter((e) => e === "cs:intro-done").length;
  (env.win.__csIntro as { done(): void }).done();
  assert.equal(env.events.filter((e) => e === "cs:intro-done").length, count);
});

// --- frame script --------------------------------------------------------------

function frameFixture(env: ReturnType<typeof makeEnv>, opts: { hevc?: { supported: boolean; powerEfficient: boolean } | null; playRejects?: string; rvfc?: boolean } = {}) {
  const frame = makeEl({ id: "cs-hero-frame" });
  const stage = makeEl({ id: "cs-intro-stage" });
  const video = makeEl({ id: "cs-hero-video" }) as ReturnType<typeof makeEl> & Record<string, unknown>;
  const fw = 600;
  const fh = 480;
  let tx = 0;
  Object.assign(frame, {
    offsetWidth: fw,
    offsetHeight: fh,
    getBoundingClientRect: () => ({ left: 700 + tx, top: 200, width: fw, height: fh }),
  });
  Object.assign(stage, { getBoundingClientRect: () => ({ left: 20, top: 92, width: 1400, height: 700 }) });
  let rvfc: (() => void) | null = null;
  Object.assign(video, {
    muted: false,
    src: "",
    canPlayType: (t: string) => (t.includes("hvc1") || t.includes("avc1") ? "probably" : ""),
    play: () => (opts.playRejects ? Promise.reject(Object.assign(new Error("x"), { name: opts.playRejects })) : Promise.resolve()),
    ...(opts.rvfc === false ? {} : { requestVideoFrameCallback: (cb: () => void) => (rvfc = cb) }),
  });
  env.byId.set("cs-hero-frame", frame);
  env.byId.set("cs-intro-stage", stage);
  env.byId.set("cs-hero-video", video);
  (env.win.navigator as Record<string, unknown>).mediaCapabilities =
    opts.hevc === null ? undefined : { decodingInfo: () => Promise.resolve(opts.hevc ?? { supported: false, powerEfficient: false }) };
  return {
    frame,
    video,
    stage,
    setTx: (x: number) => (tx = x),
    present: () => rvfc?.(),
    run: () => vm.runInContext(frameScript(HERO_SOURCES), env.context),
  };
}

const flush = () => new Promise((r) => setImmediate(r));

test("frame script: measures the stage and writes the transform variables", async () => {
  const env = makeEnv();
  const f = frameFixture(env);
  f.run();
  // stage centre (720, 442), frame centre (1000, 440), scale min(1400/600, 700/480)
  assert.equal(f.frame.styleMap.get("--intro-x"), "-280.0px");
  assert.equal(f.frame.styleMap.get("--intro-y"), "2.0px");
  assert.equal(f.frame.styleMap.get("--intro-k"), (700 / 480).toFixed(4));
  // a re-measure with the transform applied gives the same values
  f.setTx(-280);
  (env.win.__csIntro as { measure(): void }).measure();
  assert.equal(f.frame.styleMap.get("--intro-x"), "-280.0px");
  await flush();
});

test("frame script: desktop gets the original, muted, and the first frame starts the beat", async () => {
  const env = makeEnv();
  const f = frameFixture(env);
  f.run();
  await flush();
  assert.equal(f.video.src, "/videos/hero-loop.mp4");
  assert.equal(f.video.muted, true);
  assert.equal(env.hero.file, "/videos/hero-loop.mp4");
  f.present();
  assert.equal(f.frame.getAttribute("data-film"), "on");
  assert.equal(env.intro, "play");
  assert.equal(env.hero.autoplay, "ok");
  assert.ok(env.marks.includes("video:first-frame"));
  assert.ok(env.marks.includes("intro:first-frame"));
});

test("frame script: phones get the portrait cut, HEVC only when supported and power-efficient", async () => {
  const efficient = makeEnv({ width: 390, height: 844, coarse: true });
  const a = frameFixture(efficient, { hevc: { supported: true, powerEfficient: true } });
  a.run();
  await flush();
  assert.match(String(a.video.src), /hero-portrait\.hevc\./);

  const inefficient = makeEnv({ width: 390, height: 844, coarse: true });
  const b = frameFixture(inefficient, { hevc: { supported: true, powerEfficient: false } });
  b.run();
  await flush();
  assert.match(String(b.video.src), /hero-portrait\.h264\./);

  const none = makeEnv({ width: 390, height: 844, coarse: true });
  const c = frameFixture(none, { hevc: null });
  c.run();
  await flush();
  assert.match(String(c.video.src), /hero-portrait\.h264\./);
});

test("frame script: a touch device wider than 1023 px never gets the desktop file", async () => {
  const env = makeEnv({ width: 1180, height: 820, coarse: true });
  const f = frameFixture(env);
  f.run();
  await flush();
  assert.match(String(f.video.src), /hero-mid\.h264\./);
});

test("frame script: an HEVC error retries once as H.264, then gives up", async () => {
  const env = makeEnv({ width: 900, height: 700 });
  const f = frameFixture(env, { hevc: { supported: true, powerEfficient: true } });
  f.run();
  await flush();
  assert.match(String(f.video.src), /hero-mid\.hevc\./);
  f.video.emit("error");
  assert.match(String(f.video.src), /hero-mid\.h264\./);
  f.video.emit("error");
  assert.equal(env.hero.file, "none");
  env.tick(FIRST_FRAME_CAP_MS);
  assert.equal(env.intro, "skip");
});

test("frame script: refused autoplay skips at once and reports blocked", async () => {
  const env = makeEnv();
  const f = frameFixture(env, { playRejects: "NotAllowedError" });
  f.run();
  await flush();
  await flush();
  assert.equal(env.hero.autoplay, "blocked");
  assert.equal(env.intro, "skip");
  assert.equal(env.handle.why, "autoplay");
});

test("frame script: without requestVideoFrameCallback the playing event starts the beat", async () => {
  const env = makeEnv();
  const f = frameFixture(env, { rvfc: false });
  f.run();
  await flush();
  f.video.emit("playing");
  assert.equal(env.intro, "play");
});

test("frame script: does nothing when the Opening is not running", () => {
  const env = makeEnv({ reducedMotion: true });
  const f = frameFixture(env);
  f.run();
  assert.equal(f.video.src, "");
  assert.equal(f.frame.styleMap.size, 0);
});

test("the scripts and the controller agree on the audience", () => {
  const cases: [number, number, boolean][] = [
    [320, 568, true],
    [390, 844, true],
    [844, 390, true],
    [768, 1024, true],
    [1024, 768, false],
    [1180, 820, true],
    [1440, 900, false],
    [2560, 1440, false],
  ];
  for (const [w, h, coarse] of cases) {
    const env = makeEnv({ width: w, height: h, coarse, script: `${INTRO_SCRIPT.replace(/^\(function\(w,d\)\{/, "(function(w,d){w.__aud=function(){return aud(w)};")}` });
    const expected = audienceFor({ phone: w <= 767 && h > w, width: w, coarse });
    assert.equal((env.win.__aud as () => string)(), expected, `${w}x${h}`);
  }
});

test("the head script stays small", () => {
  assert.ok(INTRO_SCRIPT.length < 4096, `${INTRO_SCRIPT.length} bytes`);
});
