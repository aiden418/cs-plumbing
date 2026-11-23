import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { BUSINESS, OFFICE_CONTACTS } from "../src/lib/business";
import { EMERGENCY_CLAIMS } from "../src/lib/claims";
import { SERVICE_LANDINGS } from "../src/lib/constants";
import { UEP_STATUS } from "../src/lib/uep-status";
import { LOCAL_JOBS, LOCAL_JOB_SECTIONS, localJobsForArea, localJobsForService } from "../src/content/local-jobs";
import { ROOT, listSourceFiles, rel } from "./support/source-scan";

// Facts customers rely on, corrected 2026-11-22. Each test names the rule so
// the next edit to these pages cannot quietly undo it.

const source = (file: string) => readFileSync(file, "utf8");

// ── the office ───────────────────────────────────────────────────────────────

test("the office is Aiden and Lonnie, each with what they handle, on the shared line and inbox", () => {
  assert.deepEqual(OFFICE_CONTACTS.map((person) => person.name), ["Aiden Pellechio", "Lonnie"]);
  assert.match(OFFICE_CONTACTS[0].handles, /estimates, pricing and project questions/i);
  assert.match(OFFICE_CONTACTS[1].handles, /scheduling and routine service follow-up/i);
  assert.equal(BUSINESS.email, "office@csplumbinglee.com");
  assert.equal(`${BUSINESS.phone} (${BUSINESS.phoneDigits})`, "833-PLUMB-IT (833-758-6248)");
});

test("nobody who has left is named anywhere in the site source", () => {
  const former = /feltman/i;
  const hits = listSourceFiles().filter((file) => former.test(source(file))).map(rel);
  assert.deepEqual(hits, []);
});

// ── Cape Coral UEP status ────────────────────────────────────────────────────

test("the UEP status is dated, and says where it was read", () => {
  assert.match(UEP_STATUS.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(UEP_STATUS.checkedOn >= "2026-11-22");
  // The label is the same day, written out, so pages show the date checked.
  const [year, month, day] = UEP_STATUS.checkedOn.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  assert.equal(UEP_STATUS.checkedOnLabel, `${months[month - 1]} ${day}, ${year}`);
  for (const url of [UEP_STATUS.sourceUrl, UEP_STATUS.faqUrl, UEP_STATUS.north1Url, UEP_STATUS.north3Url, UEP_STATUS.north3Decision.sourceUrl]) {
    assert.match(url, /^https:\/\/www\.capecoral\.gov\//, url);
  }
});

test("North 3 carries the council decision and no forecast start date", () => {
  assert.equal(UEP_STATUS.north3Decision.date, "2026-11-02");
  assert.match(UEP_STATUS.north3, /no construction start date/i);
  assert.match(UEP_STATUS.north3, /revise the North 3 design and solicit new construction bids/);
  const everything = JSON.stringify(UEP_STATUS);
  // The forecast the decision replaced must not come back from an old page.
  assert.doesNotMatch(everything, /end of 2026|start(ing)? by|construction to (start|begin)/i);
});

test("North 1 West explains the homeowner's own notice date, with the city's rule quoted", () => {
  const notice = UEP_STATUS.noticeDate;
  assert.match(UEP_STATUS.summary, /date printed on its own letter/);
  assert.equal(notice.steps.length, 4);
  assert.match(notice.steps[0].title, /date on your Notice of Availability/i);
  assert.match(notice.steps[1].title, /180 days/);
  assert.equal(UEP_STATUS.connectionWindowDays, 180);
  assert.match(notice.cityRule, /within 180 days of the date on the Notice of Availability Letter/);
});

test("no UEP page types its own phase dates: they all read UEP_STATUS", () => {
  const stale = /by the end of 2026|construction to start by|180-day (connection )?window (there )?is already (running|open)/i;
  // uep-status.ts itself quotes the city's out-of-date page in a comment, to say why it is not repeated.
  const hits = listSourceFiles()
    .filter((file) => rel(file) !== "src/lib/uep-status.ts" && stale.test(source(file)))
    .map(rel);
  assert.deepEqual(hits, []);
});

// ── arrival times ────────────────────────────────────────────────────────────

test("one arrival sentence, and no page promises minutes or hours to arrive", () => {
  assert.equal(EMERGENCY_CLAIMS.arrival, "Call the office for current availability and an estimated arrival time.");
  // "arrive within 1-2 hours", "reach … within the hour", "response is 30–60 minutes", "in 20–30 minutes".
  const window = /(arriv\w*|reach\w*|respon\w*|on[- ]site)[^.`"]{0,80}?\b(within|in)\s+(the hour|an hour|\d+\s*[–-]\s*\d+\s*(hours?|minutes?)|\d+\s*(hours?|minutes?))/i;
  const hits: string[] = [];
  for (const file of listSourceFiles()) {
    const name = rel(file);
    // The Terms are a legal document with their own figures; claims.ts holds the sentence itself.
    if (name === "src/lib/claims.ts" || name.startsWith("src/lib/terms")) continue;
    source(file)
      .split("\n")
      .forEach((line, i) => {
        if (line.includes("claim-ok")) return;
        if (window.test(line)) hits.push(`${name}:${i + 1}`);
      });
  }
  assert.deepEqual(hits, []);
});

test("the leak-repair page no longer gives two different arrival windows", () => {
  const leak = SERVICE_LANDINGS.find((landing) => landing.slug === "leak-repair");
  assert.ok(leak);
  const text = JSON.stringify(leak);
  assert.doesNotMatch(text, /1-2 hours|30–60 minutes|same-day service/i);
  const mentions = text.split(EMERGENCY_CLAIMS.arrival).length - 1;
  assert.ok(mentions >= 2, "the approved sentence answers both arrival questions");
});

// ── local job examples ───────────────────────────────────────────────────────

test("every local job has a home on the site, a request button, and a real photo file when it shows one", () => {
  const ids = LOCAL_JOBS.map((job) => job.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const job of LOCAL_JOBS) {
    assert.ok(job.services.length > 0, job.id);
    assert.ok(job.estimateCovered.length >= 3, `${job.id}: what the estimate covered`);
    assert.match(job.cta.label, /^Request a /, job.id);
    for (const slug of job.services) {
      assert.ok(SERVICE_LANDINGS.some((landing) => landing.slug === slug), `${job.id}: /services/${slug}`);
      assert.ok(LOCAL_JOB_SECTIONS[slug], `${job.id}: a heading for /services/${slug}`);
    }
    if (job.area) assert.ok(LOCAL_JOB_SECTIONS[job.area.slug], `${job.id}: a heading for /areas/${job.area.slug}`);
    if (job.photo) assert.ok(existsSync(path.join(ROOT, "public", job.photo.src)), `${job.id}: ${job.photo.src}`);
    if (job.replacesCaseStudy) {
      const titles = SERVICE_LANDINGS.flatMap((landing) => landing.caseStudies ?? []).map((study) => study.title);
      assert.ok(titles.includes(job.replacesCaseStudy), `${job.id}: replaces "${job.replacesCaseStudy}"`);
    }
  }
  assert.deepEqual(localJobsForService("water-heaters").map((job) => job.area?.city), ["Fort Myers", "Cape Coral"]);
  assert.deepEqual(localJobsForService("tankless-water-heaters").map((job) => job.area?.city), ["Cape Coral"]);
  assert.equal(localJobsForArea("fort-myers")[0]?.primaryService.slug, "water-heaters");
  assert.equal(localJobsForArea("cape-coral")[0]?.primaryService.slug, "tankless-water-heaters");
});

test("a job is either checked against its record or lists what the office still has to confirm", (t) => {
  const open: string[] = [];
  for (const job of LOCAL_JOBS) {
    if (job.verified) {
      assert.match(job.verified.on, /^\d{4}-\d{2}-\d{2}$/, job.id);
      assert.ok(job.verified.by, job.id);
      // A checked job shows a photo of that job, or none.
      if (job.photo) assert.equal(job.photo.ofThisJob, true, `${job.id}: a verified job shows its own photo`);
    } else {
      assert.ok(job.needs.length > 0, `${job.id}: not verified, so it must say what is missing`);
      // Until then the caption must not claim the photo is of this job.
      if (job.photo) assert.equal(job.photo.ofThisJob, false, job.id);
      open.push(`${job.id}: ${job.needs.length} open item(s)`);
    }
  }
  if (open.length > 0) t.diagnostic(`local jobs waiting on the office: ${open.join("; ")}`);
});
