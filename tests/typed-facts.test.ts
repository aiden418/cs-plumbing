import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { BUSINESS } from "../src/lib/business";
import { LICENSE } from "../src/lib/claims";
import { ROOT, listSourceFiles, parseSource, rel, textNodes } from "./support/source-scan";

// The phone number, both license numbers, the street address and the office
// email are typed once, in src/lib/business.ts (the licenses in
// src/lib/claims.ts), and every page, form email, JSON-LD block, social image
// and llms.txt reads them from BUSINESS. They used to be typed in several
// hundred places, so changing the phone number meant finding every copy.
//
// This test reads every string, template string and JSX text in src/ (never
// comments) and fails when one of those values is typed again. Write
//   `Call ${BUSINESS.phone}.`          in a string
//   {BUSINESS.phone}                   in JSX
//   href={BUSINESS.phoneHref}          for a link that dials the company
// instead. The values checked are whatever BUSINESS holds today, so the rule
// follows the number if it ever changes.
//
// Only the exact values are checked. The street spelled out as "951 Pondella
// Road" and mentions of "Pondella Rd" without the number are ordinary prose
// about the neighborhood and are left as written.

const FACTS: { name: string; value: string; use: string }[] = [
  { name: "the phone number (vanity spelling)", value: BUSINESS.phone, use: "BUSINESS.phone" },
  { name: "the phone number (dashed digits)", value: BUSINESS.phoneDigits, use: "BUSINESS.phoneDigits" },
  { name: "the phone number (ten digits)", value: BUSINESS.phoneRaw, use: "BUSINESS.phoneHref for a link, BUSINESS.phoneRaw or phoneE164 otherwise" },
  { name: "the company license number", value: LICENSE.company, use: "BUSINESS.license" },
  { name: "the founder's license number", value: LICENSE.founder, use: "BUSINESS.license2" },
  { name: "the street address", value: BUSINESS.address, use: "BUSINESS.address" },
  { name: "the office email", value: BUSINESS.email, use: "BUSINESS.email" },
];

/** Where the values are written. */
const SOURCE_OF_TRUTH = ["src/lib/business.ts", "src/lib/claims.ts"];

/**
 * Typed copies that are still there, with the most each file may hold. The
 * number only goes down: when a file is next edited, interpolate the value
 * and lower or delete its entry.
 */
const STILL_TYPED: Record<string, { max: number; what: string }> = {
  // Form routes: the dial link reads BUSINESS.phoneHref; the rest of each
  // email and response still has its typed copies.
  "src/app/api/quote/route.ts": { max: 2, what: "license number and street address in the customer email footer" },
  "src/app/api/builder-portal/route.ts": { max: 2, what: "phone number in the two error responses" },
  "src/app/api/contact/route.ts": { max: 1, what: "office email as the recipient of the lead email" },
  "src/app/builder-portal/BuilderPortalPage.tsx": { max: 1, what: "phone number in the submit-failure alert" },
};

interface Hit {
  file: string;
  line: number;
  fact: (typeof FACTS)[number];
}

function typedFacts(file: string): Hit[] {
  const hits: Hit[] = [];
  for (const node of textNodes(parseSource(file))) {
    for (const fact of FACTS) {
      let from = 0;
      for (;;) {
        const at = node.raw.indexOf(fact.value, from);
        if (at === -1) break;
        hits.push({ file: rel(file), line: node.line, fact });
        from = at + fact.value.length;
      }
    }
  }
  return hits;
}

const byFile = new Map<string, Hit[]>();
for (const file of listSourceFiles()) {
  const hits = typedFacts(file);
  if (hits.length > 0) byFile.set(rel(file), hits);
}

test("each business fact is typed exactly once, in business.ts or claims.ts", () => {
  for (const fact of FACTS) {
    const places = SOURCE_OF_TRUTH.flatMap((file) => (byFile.get(file) ?? []).filter((hit) => hit.fact === fact));
    assert.equal(
      places.length,
      1,
      `${fact.name} ("${fact.value}") should be typed once in ${SOURCE_OF_TRUTH.join(" / ")}; found ${places.length}: ${places.map((p) => `${p.file}:${p.line}`).join(", ")}`,
    );
  }
});

test("no other source file types a business fact", () => {
  const offenders: string[] = [];
  for (const [file, hits] of byFile) {
    if (SOURCE_OF_TRUTH.includes(file) || file in STILL_TYPED) continue;
    for (const hit of hits) offenders.push(`${hit.file}:${hit.line} types ${hit.fact.name} "${hit.fact.value}"; use ${hit.fact.use}`);
  }
  assert.deepEqual(
    offenders,
    [],
    "A business fact is typed outside src/lib/business.ts. Read it from BUSINESS instead, for example `Call ${BUSINESS.phone}.` in a string or {BUSINESS.phone} in JSX.",
  );
});

test("files that still hold typed copies do not gain more", (t) => {
  for (const [file, allowed] of Object.entries(STILL_TYPED)) {
    const hits = byFile.get(file) ?? [];
    assert.ok(
      hits.length <= allowed.max,
      `${file} may hold ${allowed.max} typed fact(s) (${allowed.what}) and now has ${hits.length}: ${hits.map((h) => `line ${h.line} "${h.fact.value}"`).join(", ")}. Read the new one from BUSINESS.`,
    );
    if (!existsSync(path.join(ROOT, file))) t.diagnostic(`${file} no longer exists: delete its STILL_TYPED entry`);
    else if (hits.length < allowed.max) t.diagnostic(`${file} now has ${hits.length} typed fact(s): lower its STILL_TYPED entry from ${allowed.max}`);
  }
});
