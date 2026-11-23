import { test } from "node:test";
import assert from "node:assert/strict";
import {
  acceptedLead,
  acceptOnce,
  isTestFlag,
  LEAD_ID_SHAPE,
  leadHeaderHtml,
  leadIdFor,
  resetAcceptedLeads,
  subjectFor,
} from "../src/lib/api/lead";
import { homeownerLeadType, isSubmissionKey, isUtilityService, newSubmissionKey } from "../src/lib/lead";

// One inquiry, one Lead ID: the form sends a key with every attempt, the
// server turns the key into the ID and sends the office email once per key.

const KEY_A = "3f2b8c1e-7a4d-4c9b-9e21-5d6f7a8b9c0d";
const KEY_B = "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";

test("a submission key always gives the same Lead ID, in the shape the office reads", () => {
  const id = leadIdFor(KEY_A);
  assert.match(id, LEAD_ID_SHAPE);
  assert.equal(leadIdFor(KEY_A), id);
  assert.equal(leadIdFor(KEY_A.toUpperCase()), id, "letter case of the key does not matter");
  assert.notEqual(leadIdFor(KEY_B), id);
  // No letter that is misheard or misread: I, L, O and U are never used.
  for (let i = 0; i < 200; i += 1) assert.doesNotMatch(leadIdFor(newSubmissionKey()).slice(3), /[ILOU]/);
});

test("without a usable key every request gets its own ID", () => {
  const ids = new Set<string>();
  for (const bad of [undefined, "", "abc", 42, null, "not-a-uuid-at-all", `${KEY_A}x`]) {
    const id = leadIdFor(bad);
    assert.match(id, LEAD_ID_SHAPE);
    ids.add(id);
  }
  assert.equal(ids.size, 7);
  assert.equal(isSubmissionKey(KEY_A), true);
  assert.equal(isSubmissionKey("abc"), false);
  assert.equal(isSubmissionKey(newSubmissionKey()), true);
});

function counter() {
  let runs = 0;
  const run = async () => {
    runs += 1;
    return acceptedLead(leadIdFor(KEY_A), "homeowner_request", false);
  };
  return { run, runs: () => runs };
}

test("success: one run, one answer with one ID", async () => {
  resetAcceptedLeads();
  const c = counter();
  const lead = await acceptOnce(KEY_A, c.run);
  assert.equal(c.runs(), 1);
  assert.deepEqual(lead, { success: true, leadId: leadIdFor(KEY_A), eventId: leadIdFor(KEY_A), leadType: "homeowner_request" });
});

test("retry of a request the office already has: the first answer again, nothing sent twice", async () => {
  resetAcceptedLeads();
  const c = counter();
  const first = await acceptOnce(KEY_A, c.run);
  const second = await acceptOnce(KEY_A, c.run);
  const third = await acceptOnce(KEY_A.toUpperCase(), c.run);
  assert.equal(c.runs(), 1, "the office email goes out once");
  assert.equal(second.leadId, first.leadId);
  assert.equal(second.duplicate, true);
  assert.equal(third.duplicate, true);
  assert.equal(first.duplicate, undefined);
});

test("double tap: two requests in flight share one send", async () => {
  resetAcceptedLeads();
  let runs = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  const run = async () => {
    runs += 1;
    await gate;
    return acceptedLead(leadIdFor(KEY_A), "homeowner_request", false);
  };
  const a = acceptOnce(KEY_A, run);
  const b = acceptOnce(KEY_A, run);
  release();
  const [first, second] = await Promise.all([a, b]);
  assert.equal(runs, 1);
  assert.equal(first.leadId, second.leadId);
  assert.deepEqual([first.duplicate, second.duplicate], [undefined, true]);
});

test("failed submission: nothing is remembered, and the retry goes through once", async () => {
  resetAcceptedLeads();
  let attempts = 0;
  const failing = async () => {
    attempts += 1;
    throw new Error("Resend rejected the office email");
  };
  await assert.rejects(acceptOnce(KEY_A, failing));
  await assert.rejects(acceptOnce(KEY_A, failing));
  assert.equal(attempts, 2, "a failure is never treated as accepted");
  const c = counter();
  const lead = await acceptOnce(KEY_A, c.run);
  assert.equal(c.runs(), 1);
  assert.equal(lead.duplicate, undefined, "the first accepted attempt is the lead");
  assert.equal((await acceptOnce(KEY_A, c.run)).duplicate, true);
  assert.equal(c.runs(), 1);
});

test("different submissions are different leads; a request with no key is never held back", async () => {
  resetAcceptedLeads();
  let runs = 0;
  const run = (key?: string) => async () => {
    runs += 1;
    return acceptedLead(leadIdFor(key), "homeowner_request", false);
  };
  const a = await acceptOnce(KEY_A, run(KEY_A));
  const b = await acceptOnce(KEY_B, run(KEY_B));
  assert.notEqual(a.leadId, b.leadId);
  await acceptOnce(undefined, run());
  await acceptOnce(undefined, run());
  await acceptOnce("garbage", run());
  assert.equal(runs, 5);
});

test("an accepted submission is forgotten after half an hour", async () => {
  resetAcceptedLeads();
  const c = counter();
  let clock = 1_000_000;
  const now = () => clock;
  await acceptOnce(KEY_A, c.run, now);
  clock += 29 * 60 * 1000;
  assert.equal((await acceptOnce(KEY_A, c.run, now)).duplicate, true);
  clock += 2 * 60 * 1000;
  assert.equal((await acceptOnce(KEY_A, c.run, now)).duplicate, undefined);
  assert.equal(c.runs(), 2);
});

test("homeowner forms file a UEP connection as a utility estimate, everything else as a homeowner request", () => {
  for (const service of ["uep", "uep-utilities", "UEP", " uep-connection "]) {
    assert.equal(isUtilityService(service), true, service);
    assert.equal(homeownerLeadType(service), "utility_estimate", service);
  }
  for (const service of ["water-heater", "repipe", "leak", "residential", "new-construction", "", undefined]) {
    assert.equal(homeownerLeadType(service), "homeowner_request", String(service));
  }
});

test("a marked test request says so in the subject and at the top of the office email", () => {
  assert.equal(isTestFlag(true), true);
  assert.equal(isTestFlag("true"), true);
  assert.equal(isTestFlag("1"), true);
  for (const no of [false, "false", "", undefined, null, "yes", 1]) assert.equal(isTestFlag(no), false, String(no));
  assert.equal(subjectFor("Service request: Leak Repair — Pat", "CS-7K3M9Q2X", false), "Service request: Leak Repair — Pat [CS-7K3M9Q2X]");
  assert.equal(subjectFor("Service request: Leak Repair — Pat", "CS-7K3M9Q2X", true), "[TEST] Service request: Leak Repair — Pat [CS-7K3M9Q2X]");
  const live = leadHeaderHtml({ leadId: "CS-7K3M9Q2X", leadType: "utility_estimate", form: "utility_estimate", test: false });
  assert.match(live, /Utility connection estimate/);
  assert.match(live, /CS-7K3M9Q2X/);
  assert.doesNotMatch(live, /TEST REQUEST/);
  const marked = leadHeaderHtml({ leadId: "CS-7K3M9Q2X", leadType: "builder_bid", form: "builder_bid", test: true });
  assert.match(marked, /TEST REQUEST/);
  assert.match(marked, /Builder bid request/);
  assert.deepEqual(acceptedLead("CS-7K3M9Q2X", "builder_bid", true), {
    success: true,
    leadId: "CS-7K3M9Q2X",
    eventId: "CS-7K3M9Q2X",
    leadType: "builder_bid",
    test: true,
  });
});
