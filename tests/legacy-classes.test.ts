import { after, test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// scripts/check-legacy-classes.mjs scans the src/ folder next to its own
// scripts/ folder, so a copy of it inside a throwaway project is the real
// command running against fixtures — nothing here touches the site's files.
const SCRIPT = fileURLToPath(new URL("../scripts/check-legacy-classes.mjs", import.meta.url));
const projects: string[] = [];
after(() => {
  for (const dir of projects) rmSync(dir, { recursive: true, force: true });
});

function project(files: Record<string, string>) {
  const dir = mkdtempSync(path.join(tmpdir(), "legacy-classes-"));
  projects.push(dir);
  mkdirSync(path.join(dir, "scripts"));
  cpSync(SCRIPT, path.join(dir, "scripts", "check-legacy-classes.mjs"));
  const write = (rel: string, text: string) => {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), text);
  };
  for (const [rel, text] of Object.entries(files)) write(rel, text);
  const run = (...args: string[]) => {
    const result = spawnSync(process.execPath, ["scripts/check-legacy-classes.mjs", ...args], {
      cwd: dir,
      encoding: "utf8",
    });
    return { code: result.status, out: result.stdout, err: result.stderr };
  };
  const baseline = () => readFileSync(path.join(dir, "scripts", "legacy-classes.baseline.json"), "utf8");
  return { dir, write, run, baseline };
}

test("legacy gate: the class names in these fixtures stay out of the site's stylesheet", () => {
  // Tailwind writes a rule for every class-like string it reads, wherever it
  // finds one. The import in globals.css limits it to src/; without that,
  // the fixtures below (and scripts, docs) would each add rules to the site.
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(
    css,
    /@import\s+"tailwindcss"\s+source\("\.\."\)\s*;/,
    'src/app/globals.css must import Tailwind with source("..") so only src/ is scanned for class names',
  );
});

/** The "file:line: match, match" rows of a report, as { "file:line": ["match", …] }. */
function hits(report: string) {
  const rows: Record<string, string[]> = {};
  for (const row of report.split("\n")) {
    const m = row.match(/^(src\/[^:]+:\d+): (.+)$/);
    if (m) rows[m[1]] = m[2].split(", ");
  }
  return rows;
}

test("legacy gate: counts retired colours, the arbitrary surface value, retired utilities and their variables", () => {
  const { run } = project({
    "src/a.tsx": [
      `const a = "text-gray-500 hover:border-gray-300 bg-gold/15 to-surface";`,
      `const b = "bg-[#F5F5F7] sm:from-[#f5f5f7]";`,
      `const c = "card-lift card-lift-hover card-lift-hover-subtle md:section-py";`,
      `const d = "hover:bg-gold-dark ring-offset-gray-100 border-x-gray-200 text-gray-950/60";`,
      `const e = { transitionTimingFunction: "var(--ease-out-expo)", color: "var(--color-gold)" };`,
      `const f = "ease-[var(--ease-out-expo)] bg-(--color-surface-light) text-gold-gradient";`,
    ].join("\n"),
  });
  const report = run();
  assert.equal(report.code, 0);
  assert.deepEqual(hits(report.out), {
    "src/a.tsx:1": ["text-gray-500", "border-gray-300", "bg-gold", "to-surface"],
    "src/a.tsx:2": ["[#F5F5F7]", "[#f5f5f7]"],
    "src/a.tsx:3": ["card-lift", "card-lift-hover", "card-lift-hover-subtle", "section-py"],
    "src/a.tsx:4": ["bg-gold-dark", "ring-offset-gray-100", "border-x-gray-200", "text-gray-950"],
    "src/a.tsx:5": ["--ease-out-expo", "--color-gold"],
    "src/a.tsx:6": ["--ease-out-expo", "--color-surface-light", "text-gold-gradient"],
  });
  assert.match(report.out, /^ {2}gold +2$/m, "bg-gold/15 and var(--color-gold); text-gold-gradient is its own token");
  assert.match(report.out, /^ {2}\[#F5F5F7\] +2$/m);
  assert.match(report.out, /^ {2}--ease-out-expo +2$/m);
  assert.match(report.out, /^ {2}glass +0$/m, "the full report lists every token, used or not");
  assert.match(report.out, /legacy-classes: 19 legacy use\(s\) in 1 file\(s\)/);
});

test("legacy gate: prop values, longer names, paths and prose are not uses", () => {
  const { run } = project({
    "src/lookalikes.tsx": [
      `export const x = <Button variant="gold" tone="surface" accent="gray" />;`,
      `const names = "text-golden my-text-gold text-gray-5000 bg-surfaces solid-surface rose-gold";`,
      `const img = "/images/bg-gold.png";`,
      `const alt = "Tiled shower with a frameless glass door beside a glass mosaic niche";`,
      `const keywords = ["frameless glass shower door", "walk-in glass shower"];`,
      `const material = "glass";`,
      `const label = <p className="text-sm">Shower glass and pressable fittings</p>;`,
      `const wrapped = (`,
      `  <p>`,
      `    wall-mount glass and tub-surround panels`,
      `  </p>`,
      `);`,
    ].join("\n"),
  });
  const report = run();
  assert.deepEqual(hits(report.out), {});
  assert.match(report.out, /legacy-classes: 0 legacy use\(s\) in 0 file\(s\)/);
});

test("legacy gate: the plain-word utilities count where they are written in a class list", () => {
  const { run } = project({
    "src/words.tsx": [
      `const a = <div className="py-2 rounded-xl glass shadow-lg" />;`,
      `const b = cn("pressable", open && "glass");`,
      `const c = <div className={\``,
      `  glass rounded-xl shadow-lg`,
      `  \${open ? "md:pressable" : ""}`,
      `\`} />;`,
    ].join("\n"),
  });
  assert.deepEqual(hits(run().out), {
    "src/words.tsx:1": ["glass"],
    "src/words.tsx:2": ["pressable", "glass"],
    "src/words.tsx:4": ["glass"],
    "src/words.tsx:5": ["pressable"],
  });
});

test("legacy gate: in CSS only @apply, selectors and variable references count — not definitions or comments", () => {
  const { run } = project({
    "src/app/globals.css": [
      `@theme inline {`,
      `  --color-gold: #E8A427;`,
      `  --color-brand: var(--color-gold);`,
      `  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);`,
      `}`,
      `@utility glass { background: white; }`,
      `@keyframes logo-aura { from { opacity: 0; } }`,
      `@utility logo-aura { animation: logo-aura 10s infinite; }`,
      `/* .card-lift and bg-surface are retired;`,
      `   so is var(--ease-out-expo) */`,
      `.promo {`,
      `  @apply bg-surface text-gray-500`,
      `    card-lift;`,
      `  transition: transform 1s var(--ease-out-expo);`,
      `  background-image: url("bg-gold.png");`,
      `}`,
      `.marquee-pausable:hover .animate-marquee { animation-play-state: paused; }`,
    ].join("\n"),
  });
  assert.deepEqual(hits(run().out), {
    "src/app/globals.css:3": ["--color-gold"],
    "src/app/globals.css:12": ["bg-surface", "text-gray-500"],
    "src/app/globals.css:13": ["card-lift"],
    "src/app/globals.css:14": ["--ease-out-expo"],
    "src/app/globals.css:17": ["marquee-pausable", "animate-marquee"],
  });
});

test("legacy gate: strict mode is a per-file, per-token ratchet and the baseline only goes down", () => {
  const one = `export const one = "text-gray-500 bg-gold";\n`;
  const { run, write, baseline } = project({ "src/one.tsx": one, "src/clean.tsx": `export const ok = "text-primary";\n` });

  const missing = run("--strict");
  assert.equal(missing.code, 1, "without a baseline every use is new");
  assert.match(missing.err, /legacy-classes\.baseline\.json is missing/);

  assert.equal(run("--baseline").code, 0);
  assert.equal(baseline(), `{\n  "src/one.tsx": { "gray-500": 1, "gold": 1 }\n}\n`);
  const ok = run("--strict");
  assert.equal(ok.code, 0);
  assert.match(ok.out, /legacy-classes: ok \(2 legacy use\(s\) in 1 file\(s\), none above the baseline\)/);

  // One more use of a token the file already has.
  write("src/one.tsx", one + `export const two = "border-gold";\n`);
  const more = run("--strict");
  assert.equal(more.code, 1);
  assert.match(more.err, /src\/one\.tsx: gold used 2x, baseline allows 1 \(line 1, 2\)/);
  const refused = run("--baseline");
  assert.equal(refused.code, 1, "--baseline must not paper over an increase");
  assert.match(refused.err, /gold: 1 -> 2/);
  assert.equal(baseline(), `{\n  "src/one.tsx": { "gray-500": 1, "gold": 1 }\n}\n`, "refused baseline is left untouched");

  // A different token in the same file, with the file's total unchanged.
  write("src/one.tsx", `export const one = "text-gray-500 card-lift";\n`);
  const swapped = run("--strict");
  assert.equal(swapped.code, 1);
  assert.match(swapped.err, /src\/one\.tsx: card-lift used 1x, baseline allows 0/);

  // A file the baseline has never seen.
  write("src/one.tsx", one);
  write("src/clean.tsx", `export const ok = "text-gray-500";\n`);
  const fresh = run("--strict");
  assert.equal(fresh.code, 1);
  assert.match(fresh.err, /src\/clean\.tsx: gray-500 used 1x, baseline allows 0 \(line 1\)/);

  // The same use moved to another file: strict objects until the baseline is
  // rewritten, and rewriting is allowed because no site-wide total went up.
  write("src/one.tsx", `export const one = "bg-gold";\n`);
  assert.equal(run("--strict").code, 1);
  assert.equal(run("--baseline").code, 0);
  assert.equal(baseline(), `{\n  "src/clean.tsx": { "gray-500": 1 },\n  "src/one.tsx": { "gold": 1 }\n}\n`);
  assert.equal(run("--strict").code, 0);

  // Cleaning up passes straight away and can then be locked in.
  write("src/clean.tsx", `export const ok = "text-primary";\n`);
  const cleaner = run("--strict");
  assert.equal(cleaner.code, 0);
  assert.match(cleaner.out, /1 below it — run --baseline to lower the ceiling/);
  assert.match(cleaner.out, /^ {2}gray-500 +0 {2}\(baseline 1\)$/m);
  assert.equal(run("--baseline").code, 0);
  assert.equal(baseline(), `{\n  "src/one.tsx": { "gold": 1 }\n}\n`);
});

test("legacy gate: a baseline that does not parse stops the run instead of passing or being overwritten", () => {
  const { run, write, baseline } = project({ "src/one.tsx": `export const one = "bg-gold";\n` });
  const conflicted = `<<<<<<< HEAD\n{}\n=======\n{ "src/one.tsx": { "gold": 9 } }\n>>>>>>> branch\n`;
  write("scripts/legacy-classes.baseline.json", conflicted);
  assert.equal(run("--strict").code, 1);
  const rewrite = run("--baseline");
  assert.equal(rewrite.code, 1);
  assert.match(rewrite.err, /unresolved merge conflict/);
  assert.equal(baseline(), conflicted);
});

test("legacy gate: a mistyped flag is an error, not a silent pass", () => {
  const { run } = project({ "src/one.tsx": `export const one = "bg-gold";\n` });
  assert.equal(run("--strcit").code, 2);
  assert.equal(run("--strict", "--baseline").code, 2);
  assert.equal(run("--strict", "src").code, 2, "strict always covers all of src/");
  assert.equal(run("src/nowhere").code, 2);
  const filtered = run("src/one.tsx");
  assert.equal(filtered.code, 0);
  assert.match(filtered.out, /legacy-classes: totals under src\/one\.tsx\n {2}gold +1\nlegacy-classes: 1 legacy use/);
});
