/** The hero film's pure logic (src/lib/hero-controller.ts): file choice, when the film may play, every transition. */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  QUICK_RESPONSE_MS,
  audienceFor,
  controlFor,
  filmBlock,
  filmVisible,
  heroReducer,
  initialHeroModel,
  sourcesFor,
  toSources,
  type FilmEnvironment,
  type HeroEvent,
  type HeroModel,
  type HeroStatus,
} from "../src/lib/hero-controller";
import variants from "../public/videos/hero/variants.json";

const at = (status: HeroStatus, extra: Partial<HeroModel> = {}): HeroModel => ({
  status,
  source: 0,
  sources: 2,
  visible: true,
  ...extra,
});
const run = (model: HeroModel, ...events: HeroEvent[]) => events.reduce(heroReducer, model);

/* ---- may the film play at all ------------------------------------------- */

const fast: FilmEnvironment = { reducedMotion: false, saveData: false, effectiveType: "4g", responseMs: 120 };

test("filmBlock: a capable visit may play", () => {
  assert.equal(filmBlock(fast), null);
});

test("filmBlock: reduced motion and Save-Data keep the still, in that order of precedence", () => {
  assert.equal(filmBlock({ ...fast, reducedMotion: true }), "reduced-motion");
  assert.equal(filmBlock({ ...fast, saveData: true }), "save-data");
  assert.equal(filmBlock({ ...fast, reducedMotion: true, saveData: true }), "reduced-motion");
});

test("filmBlock: 2g / 3g connections are slow; 4g is not, whatever the response time", () => {
  for (const t of ["slow-2g", "2g", "3g"]) assert.equal(filmBlock({ ...fast, effectiveType: t }), "slow", t);
  assert.equal(filmBlock({ ...fast, effectiveType: "4g", responseMs: 5000 }), null);
});

test("filmBlock: without navigator.connection the page's own response must have been quick", () => {
  const none = { ...fast, effectiveType: null };
  assert.equal(filmBlock({ ...none, responseMs: 80 }), null);
  assert.equal(filmBlock({ ...none, responseMs: QUICK_RESPONSE_MS - 1 }), null);
  assert.equal(filmBlock({ ...none, responseMs: QUICK_RESPONSE_MS }), "slow");
  assert.equal(filmBlock({ ...none, responseMs: null }), "slow", "no evidence: keep the still");
  assert.equal(filmBlock({ ...none, responseMs: -1 }), "slow");
});

/* ---- which file ------------------------------------------------------------ */

test("sources from variants.json: audiences, HEVC flag and try order", () => {
  const table = toSources(variants);
  assert.equal(table.length, 5);
  assert.deepEqual(sourcesFor(table, "portrait-phone", true).map((s) => s.hevc), [true, false]);
  assert.deepEqual(sourcesFor(table, "portrait-phone", false).map((s) => s.hevc), [false]);
  assert.deepEqual(sourcesFor(table, "desktop", true).map((s) => s.file), ["/videos/hero-loop.mp4"]);
  for (const a of ["portrait-phone", "up-to-1023"] as const) {
    assert.ok(!sourcesFor(table, a, true).some((s) => s.file === "/videos/hero-loop.mp4"), `${a} never gets the original`);
  }
  assert.ok(sourcesFor(table, "portrait-phone", true).every((s) => s.height > s.width), "phones get the portrait cut");
  assert.ok(sourcesFor(table, "up-to-1023", true).every((s) => s.height <= 720), "tablets get the 720p cut");
  assert.ok(table.every((s) => s.bitrate > 0));
});

test("audience: upright phones, up to 1023 px or touch, desktop", () => {
  assert.equal(audienceFor({ phone: true, width: 390, coarse: true }), "portrait-phone");
  assert.equal(audienceFor({ phone: false, width: 844, coarse: true }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1023, coarse: false }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1366, coarse: true }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1024, coarse: false }), "desktop");
});

/* ---- the state machine ------------------------------------------------------ */

test("initial model is idle with no files", () => {
  assert.deepEqual(initialHeroModel(), { status: "idle", source: 0, sources: 0, visible: true });
});

test("START: idle → loading on screen, waiting off screen; ignored without files or outside idle", () => {
  assert.equal(heroReducer(initialHeroModel(), { type: "START", sources: 2 }).status, "loading");
  assert.equal(heroReducer(initialHeroModel(false), { type: "START", sources: 2 }).status, "waiting");
  assert.equal(heroReducer(initialHeroModel(), { type: "START", sources: 0 }).status, "idle");
  assert.equal(heroReducer(at("playing"), { type: "START", sources: 2 }).status, "playing");
  assert.equal(heroReducer(initialHeroModel(), { type: "START", sources: 2 }).sources, 2);
});

test("waiting → loading when the hero comes on screen and the tab is visible", () => {
  assert.equal(run(initialHeroModel(false), { type: "START", sources: 1 }, { type: "VISIBLE" }).status, "loading");
});

test("PREF_OFF: a remembered Pause keeps the still with Play; nothing loads", () => {
  const m = heroReducer(initialHeroModel(), { type: "PREF_OFF", sources: 2 });
  assert.equal(m.status, "paused-user");
  assert.equal(controlFor(m.status), "play");
  assert.equal(heroReducer(at("playing"), { type: "PREF_OFF", sources: 2 }).status, "playing");
  assert.equal(heroReducer(initialHeroModel(), { type: "PREF_OFF", sources: 0 }).status, "idle");
});

test("FIRST_FRAME: loading → playing, or paused-auto when it arrives off screen", () => {
  assert.equal(heroReducer(at("loading"), { type: "FIRST_FRAME" }).status, "playing");
  assert.equal(heroReducer(at("loading", { visible: false }), { type: "FIRST_FRAME" }).status, "paused-auto");
  assert.equal(heroReducer(at("idle"), { type: "FIRST_FRAME" }).status, "idle");
});

test("off screen or hidden tab pauses, back on screen resumes", () => {
  const off = heroReducer(at("playing"), { type: "HIDDEN" });
  assert.equal(off.status, "paused-auto");
  assert.equal(off.visible, false);
  assert.equal(heroReducer(off, { type: "VISIBLE" }).status, "playing");
  // HIDDEN elsewhere only records visibility
  assert.equal(heroReducer(at("paused-user"), { type: "HIDDEN" }).status, "paused-user");
  const same = at("paused-user", { visible: false });
  assert.equal(heroReducer(same, { type: "HIDDEN" }), same);
  assert.equal(heroReducer(at("paused-user", { visible: false }), { type: "VISIBLE" }).status, "paused-user");
});

test("the visitor's Pause and Play", () => {
  for (const s of ["loading", "playing", "paused-auto", "waiting"] as const) {
    assert.equal(heroReducer(at(s), { type: "USER_PAUSE" }).status, "paused-user", s);
  }
  assert.equal(heroReducer(at("failed"), { type: "USER_PAUSE" }).status, "failed");
  assert.equal(heroReducer(at("paused-user", { visible: false }), { type: "USER_PLAY" }).status, "loading");
  assert.equal(heroReducer(at("paused-user", { visible: false }), { type: "USER_PLAY" }).visible, true);
  assert.equal(heroReducer(at("blocked"), { type: "USER_PLAY" }).status, "loading");
  assert.equal(heroReducer(at("playing"), { type: "USER_PLAY" }).status, "playing");
});

test("refused autoplay: loading → blocked (the still, with Play)", () => {
  assert.equal(heroReducer(at("loading"), { type: "BLOCKED" }).status, "blocked");
  assert.equal(heroReducer(at("playing"), { type: "BLOCKED" }).status, "playing");
  assert.equal(controlFor("blocked"), "play");
});

test("errors: the next file once (HEVC → H.264), then failed; the watchdog fails a stuck load", () => {
  const next = heroReducer(at("loading"), { type: "ERROR" });
  assert.equal(next.status, "loading");
  assert.equal(next.source, 1);
  assert.equal(heroReducer(next, { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("loading", { sources: 1 }), { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("playing", { sources: 1 }), { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("idle"), { type: "ERROR" }).status, "idle");
  assert.equal(heroReducer(at("paused-user"), { type: "ERROR" }).status, "paused-user");
  assert.equal(heroReducer(at("loading"), { type: "TIMEOUT" }).status, "failed");
  assert.equal(heroReducer(at("playing"), { type: "TIMEOUT" }).status, "playing");
});

test("a whole visit: start → first frame → scrolled away → back → Pause → Play", () => {
  const events: HeroEvent[] = [
    { type: "START", sources: 2 },
    { type: "FIRST_FRAME" },
    { type: "HIDDEN" },
    { type: "VISIBLE" },
    { type: "USER_PAUSE" },
    { type: "USER_PLAY" },
    { type: "FIRST_FRAME" },
  ];
  let m = initialHeroModel();
  const seen: HeroStatus[] = [];
  for (const e of events) {
    m = heroReducer(m, e);
    seen.push(m.status);
  }
  assert.deepEqual(seen, ["loading", "playing", "paused-auto", "playing", "paused-user", "loading", "playing"]);
});

test("one control per state, and when the film layer may show", () => {
  const expected: Record<HeroStatus, "pause" | "play" | null> = {
    idle: null,
    waiting: null,
    loading: "pause",
    playing: "pause",
    "paused-auto": "pause",
    "paused-user": "play",
    blocked: "play",
    failed: null,
  };
  for (const [status, control] of Object.entries(expected)) assert.equal(controlFor(status as HeroStatus), control, status);
  assert.equal(filmVisible("playing"), true);
  assert.equal(filmVisible("paused-user"), true);
  assert.equal(filmVisible("loading"), false);
  assert.equal(filmVisible("blocked"), false);
  assert.equal(filmVisible("failed"), false);
});
