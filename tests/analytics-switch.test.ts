import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { PLACEHOLDER_TAG_IDS, analyticsMode, tagIds, type TagIds } from "../src/lib/pixel";

// The live properties. Public ids, pinned here so a refactor cannot change
// what production reports to without a test saying so.
const REAL: TagIds = {
  ga: "G-2V9GN3FQ5B",
  googleAds: "AW-16467696873",
  meta: "1372903383968668",
  openai: "DMBS1D5TFZstmLgAtY2XcW",
};
const ADS_SERVICE_LEAD = "AW-16467696873/wFO8CMD-hKcdEOm5tKw9";

// ── analyticsMode(): the switch itself ──────────────────────────────────────

test("a missing, blank or unrecognised value leaves the tags on", () => {
  const ignored = [
    undefined,
    "",
    " ",
    "on",
    "true",
    "false",
    "0",
    "1",
    "no",
    "none",
    "disabled",
    "production",
    "review",
    "of",
    "offf",
    "0ff",
    "off!",
    '"off"',
    "'off'",
    "o f f",
    "turn off",
    "off,placeholder",
    "placeholders",
    "place holder",
    '"placeholder"',
    "undefined",
    "null",
  ];
  for (const value of ignored) {
    assert.equal(analyticsMode(value), "on", `NEXT_PUBLIC_ANALYTICS=${JSON.stringify(value)}`);
  }
});

test("only the words off and placeholder change the mode, whatever their case or padding", () => {
  for (const value of ["off", "OFF", "Off", " off ", "off\n"]) {
    assert.equal(analyticsMode(value), "off", JSON.stringify(value));
  }
  for (const value of ["placeholder", "PLACEHOLDER", "Placeholder", "\tplaceholder "]) {
    assert.equal(analyticsMode(value), "placeholder", JSON.stringify(value));
  }
});

// ── tagIds(): what the loaders render with ──────────────────────────────────

test("tags on: the loaders get the real ids, untouched", () => {
  assert.equal(tagIds("on", REAL), REAL);
  assert.deepEqual(tagIds("on", REAL), {
    ga: "G-2V9GN3FQ5B",
    googleAds: "AW-16467696873",
    meta: "1372903383968668",
    openai: "DMBS1D5TFZstmLgAtY2XcW",
  });
});

test("tags off: the loaders get nothing to render with", () => {
  assert.equal(tagIds("off", REAL), null);
  assert.equal(tagIds("off", { ...REAL, ga: "" }), null);
});

test("placeholder: every id is fake, and shaped like the id it stands in for", () => {
  const ids = tagIds("placeholder", REAL);
  assert.deepEqual(ids, PLACEHOLDER_TAG_IDS);
  const shape = (id: string) => id.replace(/[A-Z]/g, "A").replace(/[a-z]/g, "a").replace(/\d/g, "9");
  for (const key of Object.keys(REAL) as (keyof TagIds)[]) {
    assert.notEqual(PLACEHOLDER_TAG_IDS[key], REAL[key], `${key} must not be the live id`);
    assert.equal(PLACEHOLDER_TAG_IDS[key].length, REAL[key].length, `${key} length`);
  }
  // Same prefix and character classes where the vendor's format has them.
  assert.match(PLACEHOLDER_TAG_IDS.ga, /^G-[A-Z0-9]{10}$/);
  assert.equal(shape(PLACEHOLDER_TAG_IDS.googleAds), shape(REAL.googleAds));
  assert.equal(shape(PLACEHOLDER_TAG_IDS.meta), shape(REAL.meta));
  assert.match(PLACEHOLDER_TAG_IDS.openai, /^[A-Za-z0-9]{22}$/);
  // Obviously fake: zeros, or the word itself.
  for (const id of Object.values(PLACEHOLDER_TAG_IDS)) assert.match(id, /0{10}|PLACEHOLDER/);
});

test("placeholder never lets a real GA id through, even one supplied by the GA variable", () => {
  assert.equal(tagIds("placeholder", { ...REAL, ga: "G-SOMEOTHER1" })?.ga, PLACEHOLDER_TAG_IDS.ga);
});

test("an empty GA id (NEXT_PUBLIC_GA_MEASUREMENT_ID=off) stays empty in every mode that renders", () => {
  assert.equal(tagIds("on", { ...REAL, ga: "" })?.ga, "");
  assert.equal(tagIds("placeholder", { ...REAL, ga: "" })?.ga, "");
  // ...and the other three placeholders are unaffected by it.
  assert.deepEqual(tagIds("placeholder", { ...REAL, ga: "" }), { ...PLACEHOLDER_TAG_IDS, ga: "" });
});

// ── the module as built: one fresh copy per environment ─────────────────────
// pixel.ts reads both variables once, when it loads (Next inlines them at
// build time), so each case below loads its own copy.

type Pixel = typeof import("../src/lib/pixel");
const nodeRequire = createRequire(import.meta.url);
const PIXEL_PATH = nodeRequire.resolve("../src/lib/pixel");

function setEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function loadPixel(env: { analytics?: string; ga?: string } = {}): Pixel {
  const saved = {
    analytics: process.env.NEXT_PUBLIC_ANALYTICS,
    ga: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
  setEnv("NEXT_PUBLIC_ANALYTICS", env.analytics);
  setEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", env.ga);
  try {
    delete nodeRequire.cache[PIXEL_PATH];
    return nodeRequire(PIXEL_PATH) as Pixel;
  } finally {
    delete nodeRequire.cache[PIXEL_PATH];
    setEnv("NEXT_PUBLIC_ANALYTICS", saved.analytics);
    setEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", saved.ga);
  }
}

test("switch unset: mode on, and the loaders' ids are the real constants", () => {
  for (const analytics of [undefined, "", "on", "false", "0", "disabled"]) {
    const pixel = loadPixel({ analytics });
    assert.equal(pixel.ANALYTICS_MODE, "on", JSON.stringify(analytics));
    assert.deepEqual(pixel.TAG_IDS, REAL, JSON.stringify(analytics));
  }
});

test("NEXT_PUBLIC_ANALYTICS=off: mode off, nothing for the loaders", () => {
  const pixel = loadPixel({ analytics: "off" });
  assert.equal(pixel.ANALYTICS_MODE, "off");
  assert.equal(pixel.TAG_IDS, null);
});

test("NEXT_PUBLIC_ANALYTICS=placeholder: mode placeholder, fake ids for the loaders", () => {
  const pixel = loadPixel({ analytics: "placeholder" });
  assert.equal(pixel.ANALYTICS_MODE, "placeholder");
  assert.deepEqual(pixel.TAG_IDS, PLACEHOLDER_TAG_IDS);
});

test("NEXT_PUBLIC_GA_MEASUREMENT_ID keeps working beside the switch", () => {
  assert.equal(loadPixel({ ga: "off" }).GA_MEASUREMENT_ID, "");
  assert.deepEqual(loadPixel({ ga: "off" }).TAG_IDS, { ...REAL, ga: "" });
  assert.deepEqual(loadPixel({ ga: "G-OVERRIDE01" }).TAG_IDS, { ...REAL, ga: "G-OVERRIDE01" });
  assert.equal(loadPixel({ analytics: "off", ga: "off" }).TAG_IDS, null);
  assert.equal(loadPixel({ analytics: "off", ga: "G-OVERRIDE01" }).TAG_IDS, null);
  assert.deepEqual(loadPixel({ analytics: "placeholder", ga: "off" }).TAG_IDS, { ...PLACEHOLDER_TAG_IDS, ga: "" });
  assert.deepEqual(loadPixel({ analytics: "placeholder", ga: "G-OVERRIDE01" }).TAG_IDS, PLACEHOLDER_TAG_IDS);
});

test("the real id constants are the same in every mode (helpers and the server-side API use them)", () => {
  for (const analytics of [undefined, "off", "placeholder"]) {
    const pixel = loadPixel({ analytics });
    assert.equal(pixel.GOOGLE_ADS_ID, REAL.googleAds, String(analytics));
    assert.equal(pixel.META_PIXEL_ID, REAL.meta, String(analytics));
    assert.equal(pixel.OPENAI_PIXEL_ID, REAL.openai, String(analytics));
    assert.equal(pixel.GA_MEASUREMENT_ID, REAL.ga, String(analytics));
  }
});

// ── the conversion helpers do not know about the switch ─────────────────────

type Call = [name: string, ...args: unknown[]];
type TagWindow = { fbq?: unknown; oaiq?: unknown; gtag?: unknown; dataLayer?: unknown[] };

/** Run every helper once against recording stand-ins for the tag globals. */
async function exercise(pixel: Pixel, globals: "present" | "absent"): Promise<{ calls: Call[]; dataLayer: unknown }> {
  const calls: Call[] = [];
  const record =
    (name: string) =>
    (...args: unknown[]) => {
      calls.push([name, ...args]);
    };
  const win: TagWindow =
    globals === "present" ? { fbq: record("fbq"), oaiq: record("oaiq"), gtag: record("gtag") } : {};
  const scope = globalThis as { window?: unknown };
  const before = scope.window;
  scope.window = win;
  try {
    pixel.trackPhoneClick();
    pixel.trackTextClick();
    await pixel.trackContactForm({ eventId: "evt-contact", email: " Owner@Example.com " });
    await pixel.trackQuoteBuilder({ eventId: "evt-quote" });
    await pixel.trackEstimateRequest({ eventId: "evt-estimate" });
    await pixel.trackBooking({ eventId: "evt-booking" });
    await pixel.trackContactForm(); // honeypot path: the server issued no id
    await pixel.trackBooking({ email: "owner@example.com" }); // likewise
    pixel.trackBuilderLead({ units: "12", community: "Test Community", source: "builders-hub" }, { eventId: "evt-builder" });
    pixel.trackBuilderLead({ units: "12" }); // no id
    pixel.trackEvent("ViewContent", { content_name: "Coupon" });
    return { calls, dataLayer: win.dataLayer };
  } finally {
    if (before === undefined) delete scope.window;
    else scope.window = before;
  }
}

test("conversion helpers report exactly the same events in every mode", async () => {
  const on = await exercise(loadPixel(), "present");
  const off = await exercise(loadPixel({ analytics: "off" }), "present");
  const placeholder = await exercise(loadPixel({ analytics: "placeholder" }), "present");
  assert.deepEqual(off, on);
  assert.deepEqual(placeholder, on);

  // Spot checks on the shared log, so "the same" cannot quietly mean "nothing".
  const named = (name: string) => on.calls.filter((c) => c[0] === name);
  assert.equal(named("fbq").length, 8);
  assert.equal(named("oaiq").length, 7);
  assert.equal(named("gtag").length, 11);
  assert.deepEqual(on.calls[0], ["fbq", "track", "Contact", { content_name: "Phone Call", content_category: "Lead" }]);
  assert.deepEqual(on.calls[1], ["oaiq", "measure", "lead_created", { type: "customer_action" }]);
  assert.deepEqual(on.calls[2], ["gtag", "event", "contact", { content_name: "Phone Call", content_category: "Lead" }]);
  // Confirmed inquiries still go to the real Google Ads conversion, deduplicated by the server's id.
  const adsConversions = named("gtag").filter((c) => c[2] === "conversion");
  assert.deepEqual(
    adsConversions.map((c) => c[3]),
    ["evt-contact", "evt-quote", "evt-estimate", "evt-booking"].map((transaction_id) => ({
      send_to: ADS_SERVICE_LEAD,
      transaction_id,
    })),
  );
  // No placeholder id ever reaches a helper call.
  const logged = JSON.stringify(placeholder);
  for (const fake of Object.values(PLACEHOLDER_TAG_IDS)) assert.ok(!logged.includes(fake), fake);
});

test("with no tag globals on the page (a tags-off build) no helper throws or reports", async () => {
  for (const analytics of [undefined, "off", "placeholder"]) {
    const { calls } = await exercise(loadPixel({ analytics }), "absent");
    assert.deepEqual(calls, [], String(analytics));
  }
});
