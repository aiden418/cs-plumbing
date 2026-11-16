import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { ROOT, SRC, importsOf, parseSource, rel, resolveImport } from "./support/source-scan";

// next.config.ts imports src/lib/landing-indexing.ts to declare the redirects
// for retired landings, and that pulls in src/lib/service-city-landings.ts.
// Everything on that chain is loaded every time the config is read (build,
// dev, `next start`, these tests), by a loader that knows nothing about the
// "@/…" alias, React or the bundler. So the chain stays small and plain: the
// page data in src/lib/constants.ts and anything under src/generated/ must
// never be reachable from it.

const ENTRY = path.join(ROOT, "next.config.ts");
const CONSTANTS = path.join(SRC, "lib", "constants.ts");
const GENERATED = path.join(SRC, "generated") + path.sep;
const NOT_AT_CONFIG_TIME = new Set(["fs", "node:fs", "fs/promises", "node:fs/promises", "server-only"]);

interface Reached {
  /** The module whose import first reached this one (null for the entry). */
  via: string | null;
  /** Runtime imports as written, with what they resolve to (null = a package). */
  imports: { specifier: string; line: number; target: string | null | "unresolved" }[];
}

/**
 * Follows runtime imports from next.config.ts, breadth first. Type-only
 * imports are erased before the config runs and are not followed;
 * `import()` / `require()` calls are, because they load the module all the same.
 */
function configGraph(): Map<string, Reached> {
  const graph = new Map<string, Reached>();
  const queue: [string, string | null][] = [[ENTRY, null]];
  while (queue.length > 0) {
    const [file, via] = queue.shift()!;
    if (graph.has(file)) continue;
    const imports: Reached["imports"] = [];
    if (/\.(ts|tsx|mts|js|mjs)$/.test(file)) {
      for (const imported of importsOf(parseSource(file))) {
        if (imported.typeOnly) continue;
        const target = resolveImport(file, imported.specifier);
        imports.push({ specifier: imported.specifier, line: imported.line, target });
        if (target !== null && target !== "unresolved") queue.push([target, file]);
      }
    }
    graph.set(file, { via, imports });
  }
  return graph;
}

/** "next.config.ts → src/lib/a.ts → src/lib/b.ts" for a reached module. */
function chainTo(graph: Map<string, Reached>, file: string): string {
  const chain: string[] = [];
  for (let at: string | null = file; at !== null; at = graph.get(at)?.via ?? null) chain.unshift(rel(at));
  return chain.join(" → ");
}

const graph = configGraph();

test("the walk really follows the config chain", () => {
  const reached = [...graph.keys()].map(rel);
  for (const expected of [
    "next.config.ts",
    "src/lib/landing-indexing.ts",
    "src/lib/service-city-landings.ts",
    "src/lib/business.ts",
  ]) {
    assert.ok(reached.includes(expected), `${expected} should be reachable from next.config.ts; reached: ${reached.join(", ")}`);
  }
  const unresolved = [...graph.entries()].flatMap(([file, node]) =>
    node.imports.filter((i) => i.target === "unresolved").map((i) => `${rel(file)}:${i.line} "${i.specifier}"`),
  );
  assert.deepEqual(unresolved, [], "every project import on the chain resolves to a file");
});

test("next.config.ts never loads src/lib/constants.ts or generated data", () => {
  const offenders = [...graph.keys()].filter((file) => file === CONSTANTS || file.startsWith(GENERATED));
  assert.deepEqual(
    offenders.map((file) => chainTo(graph, file)),
    [],
    "Something next.config.ts loads now imports the page data. Import business facts from src/lib/business.ts (or another small module such as awards.ts or uep-status.ts) instead of constants.ts, and keep generated data out of this chain.",
  );
});

test("modules loaded by next.config.ts use plain relative imports, are not .tsx and do not load fs or server-only", () => {
  const problems: string[] = [];
  for (const [file, node] of graph) {
    if (file === ENTRY) continue;
    if (file.endsWith(".tsx")) problems.push(`${chainTo(graph, file)}: a .tsx module is on the config chain`);
    for (const imported of node.imports) {
      const where = `${rel(file)}:${imported.line}`;
      if (NOT_AT_CONFIG_TIME.has(imported.specifier)) {
        problems.push(`${where} imports "${imported.specifier}", which must not load while the config is read`);
      } else if (!imported.specifier.startsWith(".")) {
        problems.push(`${where} imports "${imported.specifier}"; modules on the config chain import each other by relative path only (the config loader has no "@/" alias and no bundler)`);
      }
    }
  }
  assert.deepEqual(problems, []);
});
