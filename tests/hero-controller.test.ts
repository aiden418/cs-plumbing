/** The hero film's pure state machine (src/lib/hero-controller.ts): every transition. */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  audienceFor,
  controlsFor,
  filmVisible,
  heroReducer,
  initialHeroModel,
  sourcesFor,
  toSources,
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

test("initial model is idle with no files", () => {
  assert.deepEqual(initialHeroModel(), { status: "idle", source: 0, sources: 0, visible: true });
});

test("ARM: idle → loading when on screen, armed when not; ignored without files or outside idle", () => {
  assert.equal(heroReducer(initialHeroModel(), { type: "ARM", sources: 2 }).status, "loading");
  assert.equal(heroReducer(initialHeroModel(false), { type: "ARM", sources: 2 }).status, "armed");
  assert.equal(heroReducer(initialHeroModel(), { type: "ARM", sources: 0 }).status, "idle");
  assert.equal(heroReducer(at("playing"), { type: "ARM", sources: 2 }).status, "playing");
  assert.equal(heroReducer(initialHeroModel(), { type: "ARM", sources: 2 }).sources, 2);
});

test("armed → loading when the frame comes on screen", () => {
  assert.equal(run(initialHeroModel(false), { type: "ARM", sources: 1 }, { type: "VISIBLE" }).status, "loading");
});

test("REST and PREF_OFF from idle", () => {
  assert.equal(heroReducer(initialHeroModel(), { type: "REST", sources: 1 }).status, "resting");
  assert.equal(heroReducer(initialHeroModel(), { type: "REST", sources: 0 }).status, "idle");
  assert.equal(heroReducer(initialHeroModel(), { type: "PREF_OFF", sources: 2 }).status, "paused-user");
  assert.equal(heroReducer(initialHeroModel(), { type: "PREF_OFF", sources: 0 }).status, "idle");
  assert.equal(heroReducer(at("playing"), { type: "PREF_OFF", sources: 2 }).status, "playing");
});

test("ADOPT the film the inline script started", () => {
  const adopt = (o: Partial<Extract<HeroEvent, { type: "ADOPT" }>>, visible = true) =>
    heroReducer(initialHeroModel(visible), { type: "ADOPT", sources: 2, source: 0, playing: false, ended: false, error: false, ...o });
  assert.equal(adopt({ playing: true }).status, "playing");
  assert.equal(adopt({ playing: true }, false).status, "paused-auto");
  assert.equal(adopt({}).status, "loading");
  assert.equal(adopt({ ended: true }).status, "resting");
  assert.deepEqual([adopt({ error: true }).status, adopt({ error: true }).source], ["loading", 1]);
  assert.equal(adopt({ error: true, source: 1 }).status, "failed");
  assert.equal(adopt({ source: 9 }).source, 1, "source index clamped");
  assert.equal(heroReducer(initialHeroModel(), { type: "ADOPT", sources: 0, source: 0, playing: true, ended: false, error: false }).status, "idle");
  assert.equal(heroReducer(at("resting"), { type: "ADOPT", sources: 2, source: 0, playing: true, ended: false, error: false }).status, "resting");
});

test("loading → playing on the first frame (paused-auto when off screen)", () => {
  assert.equal(heroReducer(at("loading"), { type: "FIRST_FRAME" }).status, "playing");
  assert.equal(heroReducer(at("loading", { visible: false }), { type: "FIRST_FRAME" }).status, "paused-auto");
  assert.equal(heroReducer(at("resting"), { type: "FIRST_FRAME" }).status, "resting");
});

test("playing ⇄ paused-auto with visibility", () => {
  const hidden = heroReducer(at("playing"), { type: "HIDDEN" });
  assert.deepEqual([hidden.status, hidden.visible], ["paused-auto", false]);
  const back = heroReducer(hidden, { type: "VISIBLE" });
  assert.deepEqual([back.status, back.visible], ["playing", true]);
  // visibility is tracked in other states without changing them
  const r = heroReducer(at("resting"), { type: "HIDDEN" });
  assert.deepEqual([r.status, r.visible], ["resting", false]);
  assert.equal(heroReducer(r, { type: "VISIBLE" }).visible, true);
  const same = at("resting");
  assert.equal(heroReducer(same, { type: "VISIBLE" }), same, "no-op returns the same object");
});

test("the film ends: resting (from playing or paused-auto)", () => {
  assert.equal(heroReducer(at("playing"), { type: "ENDED" }).status, "resting");
  assert.equal(heroReducer(at("paused-auto"), { type: "ENDED" }).status, "resting");
  assert.equal(heroReducer(at("loading"), { type: "ENDED" }).status, "loading");
});

test("autoplay refused: blocked; Play starts loading again", () => {
  const blocked = heroReducer(at("loading"), { type: "BLOCKED" });
  assert.equal(blocked.status, "blocked");
  assert.equal(heroReducer(blocked, { type: "USER_PLAY" }).status, "loading");
  assert.equal(heroReducer(at("playing"), { type: "BLOCKED" }).status, "playing");
});

test("errors: HEVC retries once as H.264, then failed; watchdog fails loading", () => {
  const retry = heroReducer(at("loading", { source: 0, sources: 2 }), { type: "ERROR" });
  assert.deepEqual([retry.status, retry.source], ["loading", 1]);
  assert.equal(heroReducer(retry, { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("loading", { sources: 1 }), { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("playing", { sources: 1 }), { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(at("failed"), { type: "ERROR" }).status, "failed");
  assert.equal(heroReducer(initialHeroModel(), { type: "ERROR" }).status, "idle");
  assert.equal(heroReducer(at("loading"), { type: "TIMEOUT" }).status, "failed");
  assert.equal(heroReducer(at("playing"), { type: "TIMEOUT" }).status, "playing");
});

test("failed is final for automatic events", () => {
  const failed = at("failed");
  for (const type of ["VISIBLE", "FIRST_FRAME", "ENDED", "BLOCKED", "TIMEOUT", "USER_PAUSE", "USER_PLAY", "REPLAY"] as const) {
    assert.equal(heroReducer(failed, { type } as HeroEvent).status, "failed", type);
  }
});

test("Pause by the user from loading, playing, paused-auto and armed", () => {
  for (const s of ["loading", "playing", "paused-auto", "armed"] as const) {
    assert.equal(heroReducer(at(s), { type: "USER_PAUSE" }).status, "paused-user", s);
  }
  assert.equal(heroReducer(at("resting"), { type: "USER_PAUSE" }).status, "resting");
  // a hidden frame does not resume a user pause
  assert.equal(run(at("paused-user"), { type: "HIDDEN" }, { type: "VISIBLE" }).status, "paused-user");
});

test("Play by the user from paused-user, blocked and resting", () => {
  for (const s of ["paused-user", "blocked", "resting"] as const) {
    assert.equal(heroReducer(at(s, { visible: false }), { type: "USER_PLAY" }).status, "loading", s);
  }
  assert.equal(heroReducer(at("playing"), { type: "USER_PLAY" }).status, "playing");
});

test("Replay from resting, playing, paused and blocked", () => {
  for (const s of ["resting", "playing", "paused-user", "paused-auto", "blocked"] as const) {
    assert.equal(heroReducer(at(s), { type: "REPLAY" }).status, "loading", s);
  }
  assert.equal(heroReducer(at("failed"), { type: "REPLAY" }).status, "failed");
  assert.equal(heroReducer(initialHeroModel(), { type: "REPLAY" }).status, "idle");
});

test("a full returning visit: arm → load → play → off screen → back → end → replay", () => {
  const states = [
    { type: "ARM", sources: 2 },
    { type: "FIRST_FRAME" },
    { type: "HIDDEN" },
    { type: "VISIBLE" },
    { type: "ENDED" },
    { type: "REPLAY" },
    { type: "FIRST_FRAME" },
  ] as HeroEvent[];
  let m = initialHeroModel();
  const seen: HeroStatus[] = [];
  for (const e of states) {
    m = heroReducer(m, e);
    seen.push(m.status);
  }
  assert.deepEqual(seen, ["loading", "playing", "paused-auto", "playing", "resting", "loading", "playing"]);
});

test("controls per state", () => {
  assert.deepEqual(controlsFor("idle"), { toggle: null, replay: false });
  assert.deepEqual(controlsFor("armed"), { toggle: null, replay: false });
  assert.deepEqual(controlsFor("loading"), { toggle: "pause", replay: false });
  assert.deepEqual(controlsFor("playing"), { toggle: "pause", replay: true });
  assert.deepEqual(controlsFor("paused-auto"), { toggle: "play", replay: true });
  assert.deepEqual(controlsFor("paused-user"), { toggle: "play", replay: true });
  assert.deepEqual(controlsFor("blocked"), { toggle: "play", replay: false });
  assert.deepEqual(controlsFor("resting"), { toggle: null, replay: true });
  assert.deepEqual(controlsFor("failed"), { toggle: null, replay: false });
  assert.equal(filmVisible("playing"), true);
  assert.equal(filmVisible("resting"), false);
  assert.equal(filmVisible("failed"), false);
});

test("sources from variants.json: audiences, HEVC flag and try order", () => {
  const table = toSources(variants);
  assert.equal(table.length, 5);
  const phone = sourcesFor(table, "portrait-phone", true);
  assert.deepEqual(phone.map((s) => s.hevc), [true, false]);
  assert.deepEqual(sourcesFor(table, "portrait-phone", false).map((s) => s.hevc), [false]);
  const desktop = sourcesFor(table, "desktop", true);
  assert.deepEqual(desktop.map((s) => s.file), ["/videos/hero-loop.mp4"]);
  for (const a of ["portrait-phone", "up-to-1023"] as const) {
    assert.ok(!sourcesFor(table, a, true).some((s) => s.file === "/videos/hero-loop.mp4"), `${a} never gets the original`);
  }
  assert.ok(table.every((s) => s.bitrate > 0));
});

test("audience: upright phones, up to 1023 px or touch, desktop", () => {
  assert.equal(audienceFor({ phone: true, width: 390, coarse: true }), "portrait-phone");
  assert.equal(audienceFor({ phone: false, width: 844, coarse: true }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1023, coarse: false }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1366, coarse: true }), "up-to-1023");
  assert.equal(audienceFor({ phone: false, width: 1024, coarse: false }), "desktop");
});
