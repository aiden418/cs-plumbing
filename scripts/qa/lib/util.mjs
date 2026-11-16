/** Small shared helpers for the QA scripts. No dependencies. */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

export function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

export function writeFile(file, data) {
  mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  writeFileSync(file, data);
}

export function writeJson(file, value) {
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function readJsonIfExists(file) {
  return existsSync(file) ? readJson(file) : null;
}

/**
 * parseArgs wrapper: prints `usage` and exits on --help or a bad flag.
 * Every option may also be passed as `multiple` to collect repeats.
 */
export function cli(usage, options, { allowPositionals = false } = {}) {
  try {
    const parsed = parseArgs({
      options: { help: { type: "boolean", short: "h" }, ...options },
      allowPositionals,
    });
    if (parsed.values.help) {
      process.stdout.write(`${usage.trim()}\n`);
      process.exit(0);
    }
    return parsed;
  } catch (err) {
    process.stderr.write(`${err.message}\n\n${usage.trim()}\n`);
    process.exit(2);
  }
}

/** "a,b" and repeated flags -> ["a", "b"]. */
export function listArg(value) {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((v) => String(v).split(","))
    .map((v) => v.trim())
    .filter(Boolean);
}

export function intArg(value, name, fallback) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`--${name} needs a number, got "${value}"`);
  return n;
}

/** "http://localhost:3111/" -> "http://localhost:3111"; throws on anything that is not an http(s) origin. */
export function normalizeBase(base) {
  if (!base) throw new Error("--base is required, e.g. --base http://localhost:3111");
  const url = new URL(base);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`--base must be http(s): ${base}`);
  return url.origin;
}

/**
 * The same server under another loopback name, e.g. c3.localhost:3111, so a
 * cold run starts with no cache, storage or open connection for its origin.
 * Returns null when the base is not a localhost origin.
 */
export function freshOrigin(base, label) {
  const url = new URL(base);
  const host = url.hostname;
  if (host !== "localhost" && host !== "127.0.0.1" && !host.endsWith(".localhost")) return null;
  url.hostname = `${label}.localhost`;
  return url.origin;
}

/** "/" -> "home", "/services/water-heaters" -> "services_water-heaters", "/?intro=1" -> "home~intro-1". */
export function routeSlug(route) {
  const [pathname, query = ""] = route.split("?");
  const base = pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_") || "home";
  const clean = (s) => s.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return query ? `${clean(base)}~${clean(query)}` : clean(base);
}

export function stats(values) {
  const list = values.filter((v) => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
  if (list.length === 0) return { n: 0, median: null, min: null, max: null };
  const mid = Math.floor(list.length / 2);
  const median = list.length % 2 ? list[mid] : (list[mid - 1] + list[mid]) / 2;
  return { n: list.length, median, min: list[0], max: list[list.length - 1] };
}

/** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
export async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/** Facts about the machine and moment a measurement was taken. */
export function hostFacts() {
  return {
    date: new Date().toISOString(),
    node: process.version,
    platform: `${os.platform()} ${os.release()} ${os.arch()}`,
    cpus: os.cpus().length,
    loadavg: os.loadavg().map((n) => Math.round(n * 100) / 100),
  };
}

export function kb(bytes, digits = 1) {
  return bytes === null || bytes === undefined ? "–" : (bytes / 1024).toFixed(digits);
}

/** Escape a value for a Markdown table cell. */
export function cell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

export function truncate(text, max = 160) {
  const s = String(text ?? "");
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function progress(message) {
  process.stderr.write(`${message}\n`);
}
