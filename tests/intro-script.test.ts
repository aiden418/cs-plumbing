/**
 * What is left of the Opening (src/lib/intro.ts): the head script, run in
 * node:vm against a fake window and document, and the film table.
 * The stage, the title card, "Skip intro" and the settle are gone (v2).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { HERO_SOURCES, INTRO_SCRIPT } from "../src/lib/intro";
import { toSources } from "../src/lib/hero-controller";
import variants from "../public/videos/hero/variants.json";

type Listener = () => void;

function makeEnv(readyState: "loading" | "interactive" | "complete", existing?: Record<string, unknown>) {
  const winListeners: Record<string, Listener[]> = {};
  const fired: string[] = [];
  const timers: Listener[] = [];
  class FakeEvent {
    constructor(public type: string) {}
  }
  const doc = {
    readyState,
    dispatchEvent: (e: FakeEvent) => {
      fired.push(e.type);
      return true;
    },
  };
  const win: Record<string, unknown> = {
    __csHero: existing,
    addEventListener: (type: string, fn: Listener) => (winListeners[type] ??= []).push(fn),
  };
  const context = vm.createContext({
    window: win,
    document: doc,
    Event: FakeEvent,
    setTimeout: (fn: Listener) => timers.push(fn),
  });
  vm.runInContext(INTRO_SCRIPT, context);
  return {
    win,
    fired,
    load: () => (winListeners.load ?? []).forEach((fn) => fn()),
    flush: () => timers.splice(0).forEach((fn) => fn()),
  };
}

test("the head script creates window.__csHero for the preview ribbon", () => {
  const env = makeEnv("loading");
  assert.deepEqual(JSON.parse(JSON.stringify(env.win.__csHero)), { intro: "none", file: "none", autoplay: "n/a", state: "idle" });
});

test("an existing __csHero record is kept", () => {
  const record = { intro: "film", file: "x", autoplay: "ok", state: "playing" };
  const env = makeEnv("loading", record);
  assert.equal(env.win.__csHero, record);
});

test("cs:intro-done fires once, at the window's load event", () => {
  const env = makeEnv("loading");
  assert.deepEqual(env.fired, []);
  env.load();
  env.load();
  assert.deepEqual(env.fired, ["cs:intro-done"]);
});

test("cs:intro-done still fires when the script runs after load", () => {
  const env = makeEnv("complete");
  assert.deepEqual(env.fired, []);
  env.flush();
  assert.deepEqual(env.fired, ["cs:intro-done"]);
});

test("the head script stays small and sets no <html> state", () => {
  assert.ok(INTRO_SCRIPT.length < 512, `${INTRO_SCRIPT.length} bytes`);
  assert.ok(!/data-intro|setAttribute|localStorage/.test(INTRO_SCRIPT));
});

test("HERO_SOURCES is variants.json in try order", () => {
  assert.deepEqual(HERO_SOURCES, toSources(variants));
  assert.ok(HERO_SOURCES.length > 0);
});
