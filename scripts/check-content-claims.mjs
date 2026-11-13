#!/usr/bin/env node
/**
 * Content-claims guard.
 *
 * Published prices live in src/lib/pricing.ts and customer promises in
 * src/lib/claims.ts. This script scans everything else for a dollar figure
 * typed as a literal, or a minute-based response-time claim, and reports or
 * fails on what it finds.
 *
 *   node scripts/check-content-claims.mjs            # report, exit 0
 *   node scripts/check-content-claims.mjs --strict   # fail on any hit above the baseline
 *   node scripts/check-content-claims.mjs --baseline # write scripts/content-claims.baseline.json
 *
 * Strict mode is a ratchet: a file may not have MORE hits than the baseline
 * records for it, and a file absent from the baseline must have none. Each
 * cleanup pass re-runs --baseline so the ceiling only goes down.
 *
 * A line that carries `claim-ok` (e.g. `// claim-ok: documented job`) is
 * skipped — use it for historical case-study costs, calculator modifiers,
 * form budget options and the like. ALLOW lists files whose hits are
 * expected (the Terms are a legal document with their own numbers).
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const BASELINE = path.join(ROOT, "scripts", "content-claims.baseline.json");

const SKIP_FILES = new Set(["src/lib/pricing.ts", "src/lib/claims.ts"]);
/** file → regex that is allowed there (or "*" for the whole file). */
const ALLOW = {
  "src/lib/terms.ts": "*",
  "src/lib/terms-meta.ts": "*",
  "src/components/ui/CouponPopup.tsx": /\$50\b/,
  "src/app/builder-portal/BuilderPortalPage.tsx": /\$\d+K/,
};

const DOLLAR = /\$\d[\d,]*/g;
// "30–60 minute", "within 60 minutes", "15 min response" — only when the
// line talks about responding/arriving/dispatch, so how-to prose ("wait 15
// minutes") and drive times are left alone.
const MINUTES = /(?<![.\w-])\d{1,2}(?:\s*[–-]\s*\d{1,2})?\s*(?:min\b(?!-)|minutes?\b)/g;
const RESPONSE_WORDS = /respon|arriv|dispatch|on our way|on-site|onsite|show up/i;

const SOURCE_EXT = new Set([".ts", ".tsx"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SOURCE_EXT.has(path.extname(entry.name)) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

function hitsInLine(line) {
  if (line.includes("claim-ok")) return [];
  const hits = [];
  for (const m of line.matchAll(DOLLAR)) hits.push(m[0]);
  if (RESPONSE_WORDS.test(line)) {
    for (const m of line.matchAll(MINUTES)) hits.push(m[0]);
  }
  return hits;
}

async function main() {
  const mode = process.argv.includes("--strict")
    ? "strict"
    : process.argv.includes("--baseline")
      ? "baseline"
      : "report";

  const files = (await walk(SRC)).map((f) => path.relative(ROOT, f)).sort();
  const perFile = {};
  const details = [];

  for (const rel of files) {
    if (SKIP_FILES.has(rel)) continue;
    const allow = ALLOW[rel];
    if (allow === "*") continue;
    const text = await readFile(path.join(ROOT, rel), "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      let hits = hitsInLine(line);
      if (allow instanceof RegExp && allow.test(line)) hits = [];
      if (hits.length) {
        perFile[rel] = (perFile[rel] ?? 0) + hits.length;
        details.push(`${rel}:${i + 1}: ${hits.join(", ")}`);
      }
    });
  }

  const total = Object.values(perFile).reduce((a, b) => a + b, 0);

  if (mode === "baseline") {
    await writeFile(BASELINE, JSON.stringify(perFile, null, 2) + "\n");
    console.log(`content-claims: baseline written (${total} literal(s) across ${Object.keys(perFile).length} file(s))`);
    return;
  }

  if (mode === "report") {
    for (const d of details) console.log(d);
    console.log(`content-claims: ${total} literal price/response-time figure(s) in ${Object.keys(perFile).length} file(s)`);
    return;
  }

  // strict: compare against the baseline ratchet
  let baseline = {};
  try {
    baseline = JSON.parse(await readFile(BASELINE, "utf8"));
  } catch {
    baseline = {};
  }
  const failures = [];
  for (const [rel, count] of Object.entries(perFile)) {
    const ceiling = baseline[rel] ?? 0;
    if (count > ceiling) failures.push(`${rel}: ${count} literal(s), baseline allows ${ceiling}`);
  }
  if (failures.length) {
    console.error("content-claims: literal prices or response-time claims found outside src/lib/pricing.ts and src/lib/claims.ts:");
    for (const f of failures) console.error("  " + f);
    for (const d of details.filter((d) => failures.some((f) => d.startsWith(f.split(":")[0] + ":")))) {
      console.error("    " + d);
    }
    console.error("Use range()/rangeInline() from src/lib/pricing.ts or CLAIMS from src/lib/claims.ts, or mark a deliberate literal with `claim-ok: <reason>`.");
    process.exit(1);
  }
  console.log(`content-claims: ok (${total} literal(s) within baseline)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
