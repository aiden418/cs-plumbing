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

/** Run `body` against recording stand-ins for the tag globals. */
async function record(
  globals: "present" | "absent",
  body: () => Promise<void> | void,
): Promise<{ calls: Call[]; dataLayer: unknown }> {
  const calls: Call[] = [];
  const stub =
    (name: string) =>
    (...args: unknown[]) => {
      calls.push([name, ...args]);
    };
  const win: TagWindow =
    globals === "present" ? { fbq: stub("fbq"), oaiq: stub("oaiq"), gtag: stub("gtag") } : {};
  const scope = globalThis as { window?: unknown };
  const before = scope.window;
  scope.window = win;
  try {
    await body();
    return { calls, dataLayer: win.dataLayer };
  } finally {
    if (before === undefined) delete scope.window;
    else scope.window = before;
  }
}

/** Run every helper once. */
function exercise(pixel: Pixel, globals: "present" | "absent") {
  return record(globals, async () => {
    pixel.trackPhoneClick();
    pixel.trackTextClick();
    await pixel.trackContactForm({ eventId: "CS-CONTACT1", email: " Owner@Example.com " });
    await pixel.trackQuoteBuilder({ eventId: "CS-QUOTE001" });
    await pixel.trackEstimateRequest({ eventId: "CS-ESTIMAT1" });
    await pixel.trackPreferredTimeRequest({ eventId: "CS-PREFTIME" });
    await pixel.trackUtilityEstimate({ eventId: "CS-UTILITY1" });
    await pixel.trackContactForm(); // honeypot path: the server issued no id
    await pixel.trackPreferredTimeRequest({ email: "owner@example.com" }); // likewise
    pixel.trackBuilderLead({ units: "12", community: "Test Community", source: "builders-hub" }, { eventId: "CS-BUILDER1" });
    pixel.trackBuilderLead({ units: "12" }); // no id
    pixel.trackEvent("ViewContent", { content_name: "Coupon" });
    pixel.trackCouponClick(); // a button click
    pixel.trackEvent("Lead", { content_name: "Coupon Popup CTA" }); // the old coupon call: refused without an id
  });
}

test("conversion helpers report exactly the same events in every mode", async () => {
  const on = await exercise(loadPixel(), "present");
  const off = await exercise(loadPixel({ analytics: "off" }), "present");
  const placeholder = await exercise(loadPixel({ analytics: "placeholder" }), "present");
  assert.deepEqual(off, on);
  assert.deepEqual(placeholder, on);

  // Spot checks on the shared log, so "the same" cannot quietly mean "nothing".
  const named = (name: string) => on.calls.filter((c) => c[0] === name);
  // Call and Text taps are interactions: Meta "Contact", GA4 "phone_tap" /
  // "text_tap" (never GA4's key events "contact" or "generate_lead"), nothing to OpenAI.
  const phone = { content_name: "Phone Call", content_category: "Interaction" };
  const text = { content_name: "Text Message", content_category: "Interaction" };
  assert.deepEqual(on.calls.slice(0, 4), [
    ["fbq", "track", "Contact", phone],
    ["gtag", "event", "phone_tap", phone],
    ["fbq", "track", "Contact", text],
    ["gtag", "event", "text_tap", text],
  ]);
  // OpenAI hears only about inquiries the server accepted, each with the
  // server's Lead ID so the browser event and the Conversions API copy count
  // once. A preferred-time request is a lead: nothing is reported as scheduled.
  const customerAction = { type: "customer_action" };
  assert.equal(named("oaiq")[0][1], "init", "the submitter's hashed email goes on init, before the event");
  assert.deepEqual(Object.keys((named("oaiq")[0][2] as { user: object }).user), ["email_sha256"]);
  assert.deepEqual(named("oaiq").slice(1), [
    ["oaiq", "measure", "lead_created", customerAction, { event_id: "CS-CONTACT1" }],
    ["oaiq", "measure", "lead_created", customerAction, { event_id: "CS-QUOTE001" }],
    ["oaiq", "measure", "lead_created", customerAction, { event_id: "CS-ESTIMAT1" }],
    ["oaiq", "measure", "lead_created", customerAction, { event_id: "CS-PREFTIME" }],
    ["oaiq", "measure", "lead_created", customerAction, { event_id: "CS-UTILITY1" }],
  ]);
  assert.ok(!JSON.stringify(on.calls).match(/appointment_scheduled|book_appointment|"Schedule"/));
  // GA4 leads: one generate_lead per accepted homeowner or utility form, each
  // with its Lead ID, its funnel and its form.
  const gaLeads = named("gtag").filter((c) => c[2] === "generate_lead").map((c) => c[3]);
  assert.deepEqual(gaLeads, [
    { content_name: "Contact Form", content_category: "Service Request", lead_type: "homeowner_request", form: "contact", event_id: "CS-CONTACT1" },
    { content_name: "Quote Builder", content_category: "Quote Request", lead_type: "homeowner_request", form: "quote_builder", event_id: "CS-QUOTE001" },
    { content_name: "Estimate Request", content_category: "Quote Request", lead_type: "homeowner_request", form: "estimate", event_id: "CS-ESTIMAT1" },
    { content_name: "Preferred Time Request", content_category: "Service Request", lead_type: "homeowner_request", form: "preferred_time", event_id: "CS-PREFTIME" },
    { content_name: "Utility Connection Estimate", content_category: "Utility Estimate", lead_type: "utility_estimate", form: "utility_estimate", event_id: "CS-UTILITY1" },
  ]);
  // Meta gets the same five leads, each deduplicated on the Lead ID.
  const metaLeads = named("fbq").filter((c) => c[2] === "Lead");
  assert.deepEqual(
    metaLeads.map((c) => c[4]),
    ["CS-CONTACT1", "CS-QUOTE001", "CS-ESTIMAT1", "CS-PREFTIME", "CS-UTILITY1"].map((eventID) => ({ eventID })),
  );
  // The builder bid request is its own event everywhere, never a homeowner lead.
  const builder = {
    content_name: "Builder Bid Request",
    content_category: "Builder Lead",
    lead_type: "builder_bid",
    units: "12",
    community: "Test Community",
    source: "builders-hub",
  };
  assert.deepEqual(named("fbq").filter((c) => c[1] === "trackCustom" && c[2] === "builder_lead"), [
    ["fbq", "trackCustom", "builder_lead", builder, { eventID: "CS-BUILDER1" }],
  ]);
  assert.deepEqual(named("gtag").filter((c) => c[2] === "builder_lead"), [
    ["gtag", "event", "builder_lead", { ...builder, event_id: "CS-BUILDER1" }],
  ]);
  assert.deepEqual(on.dataLayer, [{ event: "builder_lead", event_id: "CS-BUILDER1", ...builder }]);
  // The coupon button is an interaction on Meta and GA4. The old call, a
  // "Lead" with no server id, reports nothing at all.
  const coupon = { content_name: "Coupon Popup CTA", content_category: "Interaction" };
  assert.deepEqual(on.calls.slice(-3), [
    ["fbq", "track", "ViewContent", { content_name: "Coupon" }],
    ["fbq", "trackCustom", "CouponClick", coupon],
    ["gtag", "event", "coupon_click", coupon],
  ]);
  // Accepted homeowner and utility inquiries go to the real Google Ads
  // conversion, deduplicated by the Lead ID. Builder bids and clicks do not.
  const adsConversions = named("gtag").filter((c) => c[2] === "conversion");
  assert.deepEqual(
    adsConversions.map((c) => c[3]),
    ["CS-CONTACT1", "CS-QUOTE001", "CS-ESTIMAT1", "CS-PREFTIME", "CS-UTILITY1"].map((transaction_id) => ({
      send_to: ADS_SERVICE_LEAD,
      transaction_id,
    })),
  );
  // No placeholder id ever reaches a helper call.
  const logged = JSON.stringify(placeholder);
  for (const fake of Object.values(PLACEHOLDER_TAG_IDS)) assert.ok(!logged.includes(fake), fake);
});

// ── one inquiry, one lead ───────────────────────────────────────────────────

test("a click can never be counted as a lead", async () => {
  const pixel = loadPixel();
  const { calls } = await record("present", () => {
    pixel.trackEvent("Lead", { content_name: "Coupon Popup CTA" });
    pixel.trackEvent("Schedule", { content_name: "Anything" });
    pixel.trackEvent("Lead", { content_name: "Anything" }, {});
    pixel.trackCouponClick();
    pixel.trackPhoneClick();
    pixel.trackTextClick();
  });
  const names = calls.map((c) => String(c[2]));
  assert.deepEqual(names, ["CouponClick", "coupon_click", "Contact", "phone_tap", "Contact", "text_tap"]);
  for (const forbidden of ["Lead", "generate_lead", "conversion", "contact", "lead_created"]) {
    assert.ok(!names.includes(forbidden), forbidden);
  }
});

test("the same Lead ID is reported once, however many answers carry it", async () => {
  const pixel = loadPixel();
  const { calls } = await record("present", async () => {
    // A double tap answered twice, then a retry of a request the office already had.
    await pixel.trackContactForm({ eventId: "CS-SAMELEAD" });
    await pixel.trackContactForm({ eventId: "CS-SAMELEAD" });
    await pixel.trackPreferredTimeRequest({ eventId: "CS-SAMELEAD" });
    pixel.trackBuilderLead({ source: "builders-hub" }, { eventId: "CS-SAMEBID1" });
    pixel.trackBuilderLead({ source: "builders-hub" }, { eventId: "CS-SAMEBID1" });
  });
  const count = (match: (c: Call) => boolean) => calls.filter(match).length;
  assert.equal(count((c) => c[0] === "gtag" && c[2] === "generate_lead"), 1);
  assert.equal(count((c) => c[0] === "gtag" && c[2] === "conversion"), 1);
  assert.equal(count((c) => c[0] === "fbq" && c[2] === "Lead"), 1);
  assert.equal(count((c) => c[0] === "oaiq" && c[1] === "measure"), 1);
  assert.equal(count((c) => c[0] === "gtag" && c[2] === "builder_lead"), 1);
  assert.equal(count((c) => c[0] === "fbq" && c[2] === "builder_lead"), 1);
});

test("a failed or refused submission (no Lead ID in the answer) reports nothing", async () => {
  const pixel = loadPixel();
  const { calls } = await record("present", async () => {
    await pixel.trackContactForm({ email: "owner@example.com" });
    await pixel.trackQuoteBuilder({});
    await pixel.trackEstimateRequest();
    await pixel.trackPreferredTimeRequest({ leadType: "homeowner_request" });
    await pixel.trackUtilityEstimate({});
    pixel.trackBuilderLead({ source: "builders-hub" }, {});
  });
  assert.deepEqual(calls, []);
});

test("the server's funnel decides the label: a UEP request on any homeowner form is a utility estimate", async () => {
  const pixel = loadPixel();
  const { calls } = await record("present", async () => {
    await pixel.trackPreferredTimeRequest({ eventId: "CS-UEPBOOK1", leadType: "utility_estimate" });
    await pixel.trackContactForm({ eventId: "CS-HOMEOWN1", leadType: "homeowner_request" });
  });
  const leads = calls.filter((c) => c[0] === "gtag" && c[2] === "generate_lead").map((c) => c[3] as Record<string, string>);
  assert.deepEqual(leads.map((l) => [l.lead_type, l.content_category, l.form, l.event_id]), [
    ["utility_estimate", "Utility Estimate", "preferred_time", "CS-UEPBOOK1"],
    ["homeowner_request", "Service Request", "contact", "CS-HOMEOWN1"],
  ]);
});

test("a marked test visit is visible in GA4 as test_lead and counted nowhere", async () => {
  const pixel = loadPixel();
  const { calls, dataLayer } = await record("present", async () => {
    await pixel.trackContactForm({ eventId: "CS-TESTLEAD", email: "tester@example.com", test: true });
    pixel.trackBuilderLead({ source: "builders-hub" }, { eventId: "CS-TESTBID1", test: true });
  });
  assert.deepEqual(calls.map((c) => [c[0], c[2]]), [
    ["gtag", "test_lead"],
    ["gtag", "test_lead"],
  ]);
  assert.equal((calls[0][3] as Record<string, string>).event_id, "CS-TESTLEAD");
  assert.equal(dataLayer, undefined);
});

test("with no tag globals on the page (a tags-off build) no helper throws or reports", async () => {
  for (const analytics of [undefined, "off", "placeholder"]) {
    const { calls } = await exercise(loadPixel({ analytics }), "absent");
    assert.deepEqual(calls, [], String(analytics));
  }
});
