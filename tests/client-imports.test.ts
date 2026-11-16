import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  SRC,
  importsOf,
  isClientModule,
  listSourceFiles,
  parseSource,
  rel,
  resolveImport,
} from "./support/source-scan";

// A "use client" file is sent to the browser together with every module it
// imports, directly or through other modules. src/lib/constants.ts alone is
// about 300 KB of page copy, so a single import of it from a client component
// puts every FAQ, blog post and landing page into that page's JavaScript.
//
// Client code takes business facts from the small modules (@/lib/business,
// @/lib/awards, @/lib/claims, @/lib/uep-status). Page data is read in a
// server component, which passes the client component what it needs as props.
//
// This is a ratchet. client-imports.baseline.json lists the client files that
// reached a heavy data module when the rule was introduced; the test fails
// when a client file reaches one that is not recorded for it. Entries are
// only ever removed:
//
//   PRUNE_CLIENT_IMPORTS_BASELINE=1 npm test
//
// rewrites the baseline without the entries that no longer apply.

const BASELINE_FILE = path.join(ROOT, "tests", "client-imports.baseline.json");
const HEAVY_FILES = new Set(
  ["constants.ts", "service-city-landings.ts", "landing-indexing.ts", "projects.ts"].map((name) =>
    path.join(SRC, "lib", name),
  ),
);
const GENERATED = path.join(SRC, "generated") + path.sep;
const isHeavy = (file: string) => HEAVY_FILES.has(file) || file.startsWith(GENERATED);

/** Project files a module loads at runtime (type-only imports are erased and skipped). */
const runtimeImportCache = new Map<string, string[]>();
function runtimeImports(file: string): string[] {
  let targets = runtimeImportCache.get(file);
  if (!targets) {
    targets = [];
    if (/\.(ts|tsx|mts)$/.test(file)) {
      for (const imported of importsOf(parseSource(file))) {
        if (imported.typeOnly) continue;
        const target = resolveImport(file, imported.specifier);
        if (target !== null && target !== "unresolved") targets.push(target);
      }
    }
    runtimeImportCache.set(file, targets);
  }
  return targets;
}

/**
 * Heavy modules the browser would load for one client file, each with the
 * import chain that leads to it. The walk stops at a heavy module: what that
 * module imports in turn is not listed again.
 */
function heavyModulesReached(clientFile: string): Map<string, string> {
  const via = new Map<string, string | null>([[clientFile, null]]);
  const queue = [clientFile];
  const reached = new Map<string, string>();
  while (queue.length > 0) {
    const at = queue.shift()!;
    for (const target of runtimeImports(at)) {
      if (via.has(target)) continue;
      via.set(target, at);
      if (isHeavy(target)) {
        const chain: string[] = [];
        for (let step: string | null = target; step !== null; step = via.get(step) ?? null) chain.unshift(rel(step));
        reached.set(rel(target), chain.join(" → "));
      } else queue.push(target);
    }
  }
  return reached;
}

const clientFiles = listSourceFiles().filter((file) => isClientModule(parseSource(file)));
const current = new Map<string, Map<string, string>>();
for (const file of clientFiles) {
  const reached = heavyModulesReached(file);
  if (reached.size > 0) current.set(rel(file), reached);
}
const baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8")) as Record<string, string[]>;

test("the scan finds the client components", () => {
  assert.ok(clientFiles.length > 0, 'no file under src/ starts with "use client": the scan is broken');
});

test("no client file reaches a heavy data module beyond the recorded baseline", () => {
  const offenders: string[] = [];
  for (const [file, reached] of current) {
    for (const [heavy, chain] of reached) {
      if (!(baseline[file] ?? []).includes(heavy)) offenders.push(`${file} now loads ${heavy} in the browser (${chain})`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    'A "use client" file imports page data, directly or through a module it imports. For business facts use @/lib/business (awards: @/lib/awards, promises: @/lib/claims). For page data, read it in a server component and pass the client component what it needs as props. Do not add the file to tests/client-imports.baseline.json: that list only shrinks.',
  );
});

test("the baseline shrinks as client files are fixed", (t) => {
  const pruned: Record<string, string[]> = {};
  const stale: string[] = [];
  for (const file of Object.keys(baseline).sort()) {
    const still = baseline[file].filter((heavy) => current.get(file)?.has(heavy));
    for (const heavy of baseline[file]) {
      if (!still.includes(heavy)) {
        stale.push(existsSync(path.join(ROOT, file)) ? `${file} no longer loads ${heavy}` : `${file} no longer exists`);
      }
    }
    if (still.length > 0) pruned[file] = still;
  }
  if (stale.length === 0) return;
  if (process.env.PRUNE_CLIENT_IMPORTS_BASELINE === "1") {
    writeFileSync(BASELINE_FILE, JSON.stringify(pruned, null, 2) + "\n");
    t.diagnostic(`client-imports.baseline.json rewritten without ${stale.length} entr${stale.length === 1 ? "y" : "ies"}`);
    return;
  }
  // Not a failure: a branch that deletes or fixes a client file should not have to touch the baseline to merge.
  t.diagnostic(
    `${stale.length} baseline entr${stale.length === 1 ? "y" : "ies"} can go (run PRUNE_CLIENT_IMPORTS_BASELINE=1 npm test): ${[...new Set(stale)].join("; ")}`,
  );
});
