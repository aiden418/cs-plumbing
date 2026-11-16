#!/usr/bin/env node
/**
 * Tells Bing which pages of the live site changed, through IndexNow
 * (https://www.indexnow.org). ChatGPT and Copilot read Bing's copy of the
 * site, so this is what keeps their answers from quoting old numbers.
 *
 *   npm run indexnow -- changed          send only the pages whose content differs from the last run
 *   npm run indexnow -- all              send every page in the sitemap (after a redesign)
 *   npm run indexnow -- <url> [<url>…]   send these pages
 *
 *   --dry-run   print what would be sent, send nothing, save nothing
 *   --no-wait   (GitHub only) do not wait for the Vercel deploy first
 *
 * .github/workflows/indexnow.yml runs `changed` after every push to main. It
 * waits until Vercel reports the production deploy as finished, reads every
 * page in the live sitemap, and compares a fingerprint of each page's content
 * (title, description, the words and image descriptions inside <main>, the
 * JSON-LD) with the fingerprints saved by the last run. Style, script and
 * layout changes do not count, so a design tweak does not resend the site.
 * A first run has nothing to compare with and sends every page once.
 *
 * Nothing here is secret. The key only proves the sender controls the site,
 * because the same key is published at /<key>.txt (public/<key>.txt).
 */
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE = "https://www.csplumbinglee.com";
/** Also the name of the key file: public/<KEY>.txt holds exactly this text. */
export const KEY = "4a2bcf991e705b1adda9e82f0ea174e2";
export const KEY_URL = `${SITE}/${KEY}.txt`;
/** Bing's IndexNow address. Bing passes each notice on to the other IndexNow search engines. */
export const ENDPOINT = "https://www.bing.com/indexnow";
/** IndexNow takes at most this many addresses in one request. */
const MAX_PER_REQUEST = 10_000;
const USER_AGENT = "cs-plumbing-indexnow/1.0 (+https://www.csplumbinglee.com)";
/** After Vercel reports the deploy, give the CDN a moment to serve the new pages everywhere. */
const SETTLE_MS = 45_000;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ pages -- */

const hash = (text) => createHash("sha256").update(text).digest("hex").slice(0, 20);

/** JSON with object keys in a fixed order, so reordered keys are not a change. */
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function attributes(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) out[m[1].toLowerCase()] = m[2];
  return out;
}

const tagsOf = (html, name) => (html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? []).map(attributes);
const squeeze = (text) => text.replace(/\s+/g, " ").trim();

/**
 * What a page says, without how it looks: the parts a search engine reads.
 * Everything else in the HTML (styles, scripts and their hashed file names,
 * class names, the header and footer, React's comment markers) is left out.
 */
export function pageContent(html) {
  const meta = tagsOf(html, "meta");
  const named = (name) => meta.find((m) => m.name === name)?.content ?? "";
  const canonical = tagsOf(html, "link").find((l) => l.rel === "canonical")?.href ?? "";
  const title = squeeze(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");

  const jsonLd = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try {
        return stable(JSON.parse(m[1]));
      } catch {
        return squeeze(m[1]);
      }
    })
    .sort();

  const start = html.search(/<main[\s>]/i);
  const from = start === -1 ? html.search(/<body[\s>]/i) : start;
  const end = start === -1 ? html.lastIndexOf("</body>") : html.lastIndexOf("</main>");
  const body = html.slice(Math.max(from, 0), end > from ? end : undefined);

  const images = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => attributes(m[0]).alt ?? "").filter(Boolean);
  const text = squeeze(
    body
      .replace(/<(script|style|template|noscript|svg)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " "),
  );

  return { title, description: named("description"), robots: named("robots"), canonical, text, images, jsonLd };
}

export const fingerprint = (html) => hash(stable(pageContent(html)));

/** The page addresses in a sitemap. Image entries (<image:loc>) are not pages. */
export function urlsFromSitemap(xml) {
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  return [...new Set(urls)].filter((url) => url === SITE || url.startsWith(`${SITE}/`));
}

/**
 * Which pages to send: new ones, ones whose content changed, and ones that
 * left the sitemap (so the search engine learns they moved or are gone).
 * With no earlier fingerprints every page counts as new.
 * @param {Record<string, string> | null} previous
 * @param {Record<string, string>} current
 */
export function comparePages(previous, current) {
  const now = Object.keys(current).sort();
  if (!previous) return { firstRun: true, added: now, changed: [], removed: [] };
  return {
    firstRun: false,
    added: now.filter((url) => !(url in previous)),
    changed: now.filter((url) => url in previous && previous[url] !== current[url]),
    removed: Object.keys(previous)
      .filter((url) => !(url in current))
      .sort(),
  };
}

/** The request bodies IndexNow expects, at most 10,000 addresses each. */
export function requestBodies(urls) {
  const foreign = urls.filter((url) => url !== SITE && !url.startsWith(`${SITE}/`));
  if (foreign.length) throw new Error(`Only pages of ${SITE} can be sent. Not ours: ${foreign.slice(0, 3).join(", ")}`);
  const bodies = [];
  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    bodies.push({ host: new URL(SITE).host, key: KEY, keyLocation: KEY_URL, urlList: urls.slice(i, i + MAX_PER_REQUEST) });
  }
  return bodies;
}

/* ---------------------------------------------------------------- network -- */

export class SecurityCheckError extends Error {
  constructor(url) {
    super(
      `${url} answered with Vercel's security check instead of the page, so the live pages could not be read. ` +
        "Nothing was sent. If this keeps happening, look at Vercel → the project → Firewall: " +
        "a check that stops this script can also stop search and AI crawlers.",
    );
    this.name = "SecurityCheckError";
  }
}

const realDeps = {
  fetch: (...args) => fetch(...args),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  log: (line) => console.log(line),
};

/** GET with two retries for network errors and 5xx answers. */
async function get(url, deps, accept = "text/html,application/xhtml+xml") {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await deps.sleep(2_000 * attempt);
    try {
      const res = await deps.fetch(url, { headers: { "user-agent": USER_AGENT, accept }, redirect: "manual" });
      const body = await res.text();
      if ((res.status === 403 || res.status === 429) && (res.headers.get("x-vercel-mitigated") || /Security Checkpoint/i.test(body))) {
        throw new SecurityCheckError(url);
      }
      if (res.status >= 500) {
        lastError = new Error(`${url} answered ${res.status}`);
        continue;
      }
      return { status: res.status, location: res.headers.get("location") ?? "", body };
    } catch (error) {
      if (error instanceof SecurityCheckError) throw error;
      lastError = error;
    }
  }
  throw new Error(`Could not read ${url}: ${lastError?.message ?? lastError}`);
}

/**
 * One fingerprint per page in the live sitemap.
 * @returns {Promise<Record<string, string>>}
 */
export async function readLiveSite(deps = realDeps) {
  const sitemap = await get(`${SITE}/sitemap.xml`, deps, "application/xml,text/xml");
  if (sitemap.status !== 200) throw new Error(`${SITE}/sitemap.xml answered ${sitemap.status}`);
  const urls = urlsFromSitemap(sitemap.body);
  if (urls.length === 0) throw new Error("The live sitemap lists no pages.");

  /** @type {Record<string, string>} */
  const pages = {};
  const queue = [...urls];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const page = await get(url, deps);
      // A page that redirects or is gone is recorded as such, so the day it
      // stops (or starts) answering 200 counts as a change.
      pages[url] = page.status === 200 ? fingerprint(page.body) : `status ${page.status} ${page.location}`.trim();
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return pages;
}

/** True when the key file is on the live site and holds the key. IndexNow rejects notices without it. */
export async function keyFileIsLive(deps = realDeps) {
  const res = await get(KEY_URL, deps, "text/plain");
  return res.status === 200 && res.body.trim() === KEY;
}

const ANSWERS = {
  400: "the request was not in the format IndexNow expects",
  403: `the key was not accepted (is ${KEY_URL} live and unchanged?)`,
  422: "the addresses do not belong to this site, or the key does not match",
  429: "too many requests; IndexNow asks to wait before sending again",
};

/** Sends the addresses. 200 = accepted; 202 = accepted, the key file will be checked first. */
export async function send(urls, deps = realDeps) {
  for (const body of requestBodies(urls)) {
    const res = await deps.fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8", "user-agent": USER_AGENT },
      body: JSON.stringify(body),
    });
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`Bing did not accept the notice (HTTP ${res.status}): ${ANSWERS[res.status] ?? "unexpected answer"}.`);
    }
  }
}

/**
 * Waits until Vercel has reported the production deploy of this commit to
 * GitHub. Vercel records the deployment and its "success" status together,
 * when the deploy is finished. Returns "live", "failed", or "none" when no
 * production deploy for the commit shows up in time (a skipped build).
 * @param {{ repo?: string, sha?: string, token?: string, timeoutMs?: number, everyMs?: number }} options
 * @returns {Promise<"live" | "failed" | "none">}
 */
export async function waitForDeploy({ repo, sha, token, timeoutMs = 15 * 60_000, everyMs = 10_000 }, deps = realDeps) {
  const headers = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": USER_AGENT,
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
  const api = async (pathAndQuery) => {
    const res = await deps.fetch(`https://api.github.com/repos/${repo}/${pathAndQuery}`, { headers });
    if (res.status === 401 || res.status === 403) throw new Error(`GitHub refused the deployment lookup (HTTP ${res.status}).`);
    return res.ok ? res.json() : [];
  };

  for (let waited = 0; ; waited += everyMs) {
    const deployments = await api(`deployments?sha=${sha}&environment=Production&per_page=5`);
    for (const deployment of deployments) {
      const [latest] = await api(`deployments/${deployment.id}/statuses?per_page=5`);
      if (latest?.state === "success") return "live";
      if (latest?.state === "failure" || latest?.state === "error") return "failed";
    }
    if (waited >= timeoutMs) return "none";
    await deps.sleep(everyMs);
  }
}

/* -------------------------------------------------------------------- CLI -- */

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** Console output, and the run's summary page on GitHub when there is one. */
function report(lines) {
  for (const line of lines) console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}

const USAGE = `Usage:
  npm run indexnow -- changed [--dry-run] [--no-wait]
  npm run indexnow -- all [--dry-run]
  npm run indexnow -- <url> [<url>…] [--dry-run]`;

export async function main(argv, deps = realDeps) {
  const flags = argv.filter((a) => a.startsWith("--"));
  const args = argv.filter((a) => !a.startsWith("--"));
  const unknown = flags.filter((f) => f !== "--dry-run" && f !== "--no-wait");
  if (unknown.length || args.length === 0) {
    console.error(unknown.length ? `Unknown option ${unknown[0]}\n\n${USAGE}` : USAGE);
    return 2;
  }
  const dryRun = flags.includes("--dry-run");
  const mode = args[0] === "changed" || args[0] === "all" ? args[0] : "urls";

  const stateDir = process.env.INDEXNOW_STATE_DIR || path.join(ROOT, ".indexnow");
  const stateFile = path.join(stateDir, "state.json");
  const previousFile = process.env.INDEXNOW_PREVIOUS || stateFile;

  // On GitHub, a push runs this before Vercel has finished building.
  if (mode === "changed" && process.env.GITHUB_ACTIONS && !flags.includes("--no-wait")) {
    const sha = process.env.GITHUB_SHA;
    deps.log(`Waiting for Vercel to finish the production deploy of ${sha?.slice(0, 7)}…`);
    const outcome = await waitForDeploy({ repo: process.env.GITHUB_REPOSITORY, sha, token: process.env.GITHUB_TOKEN }, deps);
    if (outcome !== "live") {
      report([
        outcome === "failed"
          ? "The production deploy of this commit failed, so the live site did not change. Nothing was sent."
          : "No production deploy of this commit showed up within 15 minutes. Nothing was sent; the next run compares against the same saved fingerprints, so nothing is lost.",
      ]);
      return 0;
    }
    await deps.sleep(SETTLE_MS);
  }

  let urls;
  let pages = null;
  let heading;
  if (mode === "urls") {
    urls = args;
    requestBodies(urls); // refuses addresses that are not this site's, before anything else happens
    heading = `${urls.length} page${urls.length === 1 ? "" : "s"} named on the command line`;
  } else {
    deps.log("Reading the live pages…");
    pages = await readLiveSite(deps);
    const all = Object.keys(pages).sort();
    if (mode === "all") {
      urls = all;
      heading = `every page in the sitemap (${all.length})`;
    } else {
      const previous = readJson(previousFile)?.pages ?? null;
      const result = comparePages(previous, pages);
      urls = [...result.added, ...result.changed, ...result.removed];
      heading = result.firstRun
        ? `no saved fingerprints yet, so every page in the sitemap (${all.length})`
        : `${result.changed.length} changed, ${result.added.length} new, ${result.removed.length} removed, of ${all.length} pages`;
    }
  }

  if (urls.length && !dryRun) {
    if (!(await keyFileIsLive(deps))) {
      throw new Error(`${KEY_URL} is not live or does not hold the key. Publish public/${KEY}.txt first.`);
    }
    await send(urls, deps);
  }

  const verb = dryRun ? "Would send" : urls.length ? "Sent to Bing" : "Nothing to send";
  report([`${verb}: ${heading}.`, ...urls.slice(0, 200).map((url) => `- ${url}`), ...(urls.length > 200 ? [`- … and ${urls.length - 200} more`] : [])]);

  // The fingerprints become the next run's baseline only after a real send
  // (or a real "nothing changed"), so a failed or dry run loses nothing.
  if (pages && !dryRun) {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(stateFile, `${JSON.stringify({ site: SITE, commit: process.env.GITHUB_SHA ?? null, savedAt: new Date().toISOString(), pages }, null, 1)}\n`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, "saved=true\n");
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error) => {
      console.error(error?.message ?? error);
      if (process.env.GITHUB_STEP_SUMMARY && existsSync(process.env.GITHUB_STEP_SUMMARY)) {
        appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Nothing was sent: ${error?.message ?? error}\n`);
      }
      process.exit(1);
    },
  );
}
