#!/usr/bin/env node
/**
 * Compares two content snapshots (scripts/qa/snapshot.mjs) and reports what
 * the second one lost or changed.
 *
 *   node scripts/qa/diff-snapshots.mjs BEFORE.json AFTER.json --md report.md
 *
 * MUST BE EQUAL on every route (any difference fails the run, exit 1):
 *   HTTP status, title, meta description, canonical, robots / googlebot,
 *   every og:* and twitter:* tag, the H1s (compared with whitespace removed)
 *   and every JSON-LD block. Also: robots.txt, sitemap.xml, llms.txt,
 *   llms-full.txt and the web manifest byte for byte, every redirect's status
 *   and Location, and no route may disappear.
 *
 * MUST STILL BE PRESENT on the same route (additions are fine; removals are
 * listed per item with the routes they vanished from, and fail the run only
 * with --strict):
 *   every text block of <main>, every internal and external link href, every
 *   tel:/sms:/mailto: target, every element id and every image source.
 *
 * Deliberately tolerant, and reported separately so nothing is hidden:
 *   - an og:image / twitter:image URL whose only change is Next's ?hash
 *     version suffix (it changes whenever the social image file is edited);
 *   - a text block whose words are all still on the page but in different
 *     markup (matched against the page's whole <main> text);
 *   - tel:/sms: links that dial the same number in another notation;
 *   - an image now served from /_next/static/media/<name>.<hash>.<ext>;
 *   - ids React generates (they change with the component tree);
 *   - the Meta <noscript> beacon.
 */

import { cell, cli, intArg, readJson, truncate, writeFile, writeJson } from "./lib/util.mjs";

const USAGE = `
Usage: node scripts/qa/diff-snapshots.mjs BEFORE.json AFTER.json [--md report.md] [--json diff.json] [--strict] [--list N]

  --md FILE     write the readable report (counts first) to FILE
  --json FILE   write the full machine-readable diff to FILE
  --strict      also exit 1 when anything that had to stay was removed
  --list N      items listed per section in the report (default 150; the JSON always has all)

Exit: 0 nothing that must be equal changed · 1 a must-equal rule was broken · 2 bad arguments or unreadable file
`;

const MUST_EQUAL_FILES = ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/manifest.webmanifest"];
const GENERATED_ID = /^(_R_|_r_|:r|«r|radix-|react-aria|headlessui-)/;
const SOCIAL_IMAGE_KEYS = new Set(["og:image", "og:image:url", "og:image:secure_url", "twitter:image", "twitter:image:src"]);

/** Whitespace and invisible format characters (zero-width spaces, soft hyphens) removed. */
const strip = (s) => String(s ?? "").replace(/[\p{Cf}\s]+/gu, "");
/** A value for the report: quoted and shortened, or "(none)". */
const show = (value, max = 400) => (value === null || value === undefined ? "(none)" : `"${truncate(value, max)}"`);

/* ------------------------------ helpers ------------------------------ */

/** Next appends ?<hash> to generated social image URLs; equal apart from that suffix? */
function sameApartFromVersion(a, b) {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    const versioned = (u) => /^\?[0-9a-zA-Z_-]{6,}$/.test(u.search) || u.search === "";
    return ua.origin === ub.origin && ua.pathname === ub.pathname && ua.search !== ub.search && versioned(ua) && versioned(ub);
  } catch {
    return false;
  }
}

/** Compare two tag lists (order ignored). Returns { changes: [...], versionOnly: [...] }. */
function diffTags(before = [], after = []) {
  const group = (list) => {
    const map = new Map();
    for (const { key, content } of list) map.set(key, [...(map.get(key) ?? []), content]);
    return map;
  };
  const a = group(before);
  const b = group(after);
  const changes = [];
  const versionOnly = [];
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    const left = [...(a.get(key) ?? [])].sort();
    const right = [...(b.get(key) ?? [])].sort();
    if (JSON.stringify(left) === JSON.stringify(right)) continue;
    if (
      SOCIAL_IMAGE_KEYS.has(key) &&
      left.length === right.length &&
      left.every((value, i) => value === right[i] || sameApartFromVersion(value, right[i]))
    ) {
      versionOnly.push({ key, before: left.join(" | "), after: right.join(" | ") });
      continue;
    }
    changes.push({ key, before: left.length ? left.join(" | ") : null, after: right.length ? right.join(" | ") : null });
  }
  return { changes, versionOnly };
}

/** First differing paths between two JSON values. */
function deepDiff(a, b, path = "", out = [], limit = 8) {
  if (out.length >= limit) return out;
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  const isObject = (v) => v && typeof v === "object";
  if (!isObject(a) || !isObject(b) || Array.isArray(a) !== Array.isArray(b)) {
    out.push({ path: path || "(root)", before: a, after: b });
    return out;
  }
  const keys = Array.isArray(a)
    ? Array.from({ length: Math.max(a.length, b.length) }, (_, i) => i)
    : [...new Set([...Object.keys(a), ...Object.keys(b)])];
  for (const key of keys) {
    deepDiff(a[key], b[key], Array.isArray(a) ? `${path}[${key}]` : path ? `${path}.${key}` : String(key), out, limit);
    if (out.length >= limit) break;
  }
  return out;
}

const ldLabel = (block) => {
  if (!block.data) return "(unparseable block)";
  const d = block.data;
  const type = Array.isArray(d["@type"]) ? d["@type"].join("+") : (d["@type"] ?? (d["@graph"] ? "@graph" : "untyped"));
  return d["@id"] ? `${type} ${d["@id"]}` : String(type);
};

function diffJsonLd(before = [], after = []) {
  const text = (block) => (block.data !== undefined ? JSON.stringify(block.data) : `raw:${block.raw}`);
  const remaining = after.map((block) => ({ block, text: text(block), used: false }));
  const unmatched = [];
  for (const block of before) {
    const t = text(block);
    const same = remaining.find((r) => !r.used && r.text === t);
    if (same) same.used = true;
    else unmatched.push(block);
  }
  const changes = [];
  for (const block of unmatched) {
    const label = ldLabel(block);
    const partner = remaining.find((r) => !r.used && ldLabel(r.block) === label);
    if (partner) {
      partner.used = true;
      changes.push({ block: label, kind: "changed", differences: deepDiff(block.data, partner.block.data) });
    } else {
      changes.push({ block: label, kind: "removed" });
    }
  }
  for (const r of remaining) if (!r.used) changes.push({ block: ldLabel(r.block), kind: "added" });
  return changes;
}

/** tel:/sms:/mailto: reduced to what it reaches, so "tel:8337586248" equals "tel:+18337586248". */
function contactKey(href) {
  const m = /^(tel|sms|mailto):([^?]*)(\?.*)?$/i.exec(href.trim());
  if (!m) return href;
  const scheme = m[1].toLowerCase();
  const params = new URLSearchParams((m[3] ?? "").replace(/^\?&?/, ""));
  const extras = [...params].map(([k, v]) => `${k.toLowerCase()}=${v.replace(/\s+/g, " ").trim()}`).sort();
  if (scheme === "mailto") return [`mailto:${decodeURIComponent(m[2]).toLowerCase()}`, ...extras].join(" ");
  // Keep an extension (",0" / ";ext=0") apart from the number itself.
  const [number, ...rest] = decodeURIComponent(m[2]).split(/[,;]/);
  let digits = number.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  const extension = rest.join(",").replace(/[^0-9a-z=,]/gi, "");
  return [`${scheme}:${digits}${extension ? `,${extension}` : ""}`, ...extras].join(" ");
}

/** "/_next/static/media/drone-construction.1a2b3c4d.jpg" and "/images/hero/drone-construction.jpg" -> "drone-construction.jpg". */
function fileKey(src) {
  const name = decodeURIComponent(String(src).split(/[?#]/)[0].split("/").pop() ?? "");
  return name.replace(/\.[0-9a-zA-Z_-]{8,}(\.[a-z0-9]+)$/i, "$1").toLowerCase();
}

function linkSet(record) {
  const set = new Set();
  for (const source of [record, record.rendered]) {
    if (!source?.links) continue;
    for (const list of Object.values(source.links)) for (const link of list) set.add(link.href);
  }
  return set;
}

const collect = (record, pick) => [...pick(record), ...(record.rendered ? pick(record.rendered) : [])];

/* ------------------------------ per route ------------------------------ */

function compareRoute(route, before, after) {
  const violations = [];
  const removals = [];
  const info = [];
  const violate = (field, was, now) => violations.push({ field, before: was, after: now });
  const removed = (category, item, extra) => removals.push({ category, item, ...(extra ?? {}) });

  if (before.status !== after.status) violate("HTTP status", before.status, after.status);
  if (before.title === undefined || after.title === undefined) {
    // One side is not an HTML page; nothing more can be compared.
    return { violations, removals, info, added: {} };
  }

  for (const field of ["title", "description", "canonical", "robots", "googlebot"]) {
    if ((before[field] ?? null) !== (after[field] ?? null)) violate(field, before[field] ?? null, after[field] ?? null);
  }
  for (const family of ["og", "twitter"]) {
    const { changes, versionOnly } = diffTags(before[family], after[family]);
    for (const change of changes) violate(change.key, change.before, change.after);
    for (const change of versionOnly) info.push({ kind: "social image version", ...change });
  }

  const h1Before = (before.h1 ?? []).map((h) => h.stripped);
  const h1After = (after.h1 ?? []).map((h) => h.stripped);
  if (JSON.stringify(h1Before) !== JSON.stringify(h1After)) {
    violate("H1", (before.h1 ?? []).map((h) => h.text).join(" | ") || null, (after.h1 ?? []).map((h) => h.text).join(" | ") || null);
  } else {
    (before.h1 ?? []).forEach((h, i) => {
      if (h.text !== after.h1[i].text) info.push({ kind: "H1 spacing", before: h.text, after: after.h1[i].text });
    });
  }

  for (const change of diffJsonLd(before.jsonLd, after.jsonLd)) {
    const side = (value) => truncate(JSON.stringify(value) ?? "(absent)", 120);
    const paths = (change.differences ?? []).map((d) => `${d.path}: ${side(d.before)} → ${side(d.after)}`).join("; ");
    violations.push({
      field: `JSON-LD ${change.block}`,
      note: change.kind === "changed" ? `block changed — ${paths}` : change.kind === "removed" ? "block removed" : "block added",
    });
  }

  /* --- must still be present --- */
  const afterBlocks = new Set(collect(after, (r) => r.text ?? []).map((b) => b.text));
  const afterMain = [after.mainText ?? "", after.rendered?.mainText ?? ""].join(" ");
  const afterMainStripped = strip(afterMain);
  let restructured = 0;
  const seenText = new Set();
  for (const block of collect(before, (r) => r.text ?? [])) {
    if (seenText.has(block.text)) continue;
    seenText.add(block.text);
    if (afterBlocks.has(block.text)) continue;
    if (afterMain.includes(block.text) || afterMainStripped.includes(strip(block.text))) restructured += 1;
    else removed("text", block.text, { tag: block.tag });
  }
  if (restructured) info.push({ kind: "text kept in different markup", count: restructured });

  const afterLinks = linkSet(after);
  for (const href of linkSet(before)) if (!afterLinks.has(href)) removed("internal link", href);

  const externalAfter = new Set(collect(after, (r) => r.externalLinks ?? []).map((l) => l.href));
  for (const href of new Set(collect(before, (r) => r.externalLinks ?? []).map((l) => l.href))) {
    if (!externalAfter.has(href)) removed("external link", href);
  }

  const contactAfter = new Map(collect(after, (r) => r.contactLinks ?? []).map((l) => [contactKey(l.href), l.href]));
  const renotated = new Map();
  for (const href of new Set(collect(before, (r) => r.contactLinks ?? []).map((l) => l.href))) {
    const key = contactKey(href);
    if (!contactAfter.has(key)) removed("contact link", href);
    else if (contactAfter.get(key) !== href && !collect(after, (r) => r.contactLinks ?? []).some((l) => l.href === href)) {
      renotated.set(href, contactAfter.get(key));
    }
  }
  for (const [was, now] of renotated) info.push({ kind: "contact link notation", before: was, after: now });

  const idsAfter = new Set(collect(after, (r) => r.ids ?? []));
  let generatedIds = 0;
  for (const id of new Set(collect(before, (r) => r.ids ?? []))) {
    if (idsAfter.has(id)) continue;
    if (GENERATED_ID.test(id)) generatedIds += 1;
    else removed("element id", id);
  }
  if (generatedIds) info.push({ kind: "generated ids changed", count: generatedIds });

  const sourcesOf = (r) => [...(r.images ?? []).map((i) => i.src), ...(r.media ?? []).map((m) => m.src), ...(r.imagePreloads ?? [])].filter(Boolean);
  const afterSources = new Set(collect(after, sourcesOf));
  const afterStatic = new Set([...afterSources].filter((s) => s.startsWith("/_next/static/media/")).map(fileKey));
  let movedToStatic = 0;
  for (const src of new Set(collect(before, (r) => [...(r.images ?? []).map((i) => i.src), ...(r.media ?? []).map((m) => m.src)].filter(Boolean)))) {
    if (afterSources.has(src)) continue;
    if (afterStatic.has(fileKey(src))) movedToStatic += 1;
    else removed("image or media source", src);
  }
  if (movedToStatic) info.push({ kind: "images now served from /_next/static/media", count: movedToStatic });

  // Site chrome text is the same on most routes; listed in its own section.
  const everything = strip(
    [after.mainText, ...["headerText", "footerText", "otherText"].flatMap((r) => (after[r] ?? []).map((b) => b.text))].join(" ")
  );
  for (const region of ["headerText", "footerText", "otherText"]) {
    for (const text of new Set((before[region] ?? []).map((b) => b.text))) {
      if (!everything.includes(strip(text))) removed(`${region.replace("Text", "")} text`, text);
    }
  }

  /* --- informational --- */
  const altsAfter = new Map();
  for (const img of collect(after, (r) => r.images ?? [])) altsAfter.set(img.src, [...(altsAfter.get(img.src) ?? []), img.alt]);
  const altChanges = new Map();
  for (const img of collect(before, (r) => r.images ?? [])) {
    const alts = altsAfter.get(img.src);
    if (alts && !alts.includes(img.alt)) altChanges.set(JSON.stringify([img.src, img.alt]), { src: img.src, before: img.alt, after: [...new Set(alts)].join(" | ") });
  }
  for (const change of altChanges.values()) info.push({ kind: "image alt changed", ...change });

  const outline = (r) => (r.outline ?? []).map((h) => `h${h.level} ${h.text}`);
  const outlineAfter = new Set(outline(after));
  const outlineBefore = new Set(outline(before));
  const headingsGone = [...outlineBefore].filter((h) => !outlineAfter.has(h));
  const headingsNew = [...outlineAfter].filter((h) => !outlineBefore.has(h));
  if (headingsGone.length || headingsNew.length) info.push({ kind: "H2/H3 outline", removed: headingsGone, added: headingsNew });

  const meta = diffTags(before.otherMeta, after.otherMeta).changes;
  for (const change of meta) info.push({ kind: "other meta tag", ...change });
  if ((before.lang ?? null) !== (after.lang ?? null)) info.push({ kind: "html lang", before: before.lang, after: after.lang });
  if (JSON.stringify(before.alternates ?? []) !== JSON.stringify(after.alternates ?? [])) info.push({ kind: "link rel=alternate", before: before.alternates, after: after.alternates });
  if (JSON.stringify([...(before.beacons ?? [])].sort()) !== JSON.stringify([...(after.beacons ?? [])].sort())) {
    info.push({ kind: "tracking beacon (<noscript>)", before: before.beacons ?? [], after: after.beacons ?? [] });
  }
  if ((before.clientOnlyBoundaries ?? 0) !== (after.clientOnlyBoundaries ?? 0)) {
    info.push({ kind: "client-only sections", before: before.clientOnlyBoundaries ?? 0, after: after.clientOnlyBoundaries ?? 0 });
  }
  for (const as of new Set([...Object.keys(before.preloads ?? {}), ...Object.keys(after.preloads ?? {})])) {
    const was = before.preloads?.[as] ?? 0;
    const now = after.preloads?.[as] ?? 0;
    if (was !== now) info.push({ kind: `preload as=${as}`, before: was, after: now });
  }

  const beforeBlocks = new Set(collect(before, (r) => r.text ?? []).map((b) => b.text));
  const beforeLinks = linkSet(before);
  const beforeSources = new Set(collect(before, sourcesOf));
  const beforeIds = new Set(collect(before, (r) => r.ids ?? []));
  const added = {
    text: [...afterBlocks].filter((t) => !beforeBlocks.has(t)).length,
    links: [...afterLinks].filter((h) => !beforeLinks.has(h)).length,
    images: [...afterSources].filter((s) => !beforeSources.has(s)).length,
    ids: [...idsAfter].filter((id) => !beforeIds.has(id) && !GENERATED_ID.test(id)).length,
  };
  return { violations, removals, info, added };
}

/* ------------------------------ whole snapshot ------------------------------ */

function lineDiff(a, b, limit = 12) {
  const left = a.split("\n");
  const right = b.split("\n");
  const out = [];
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  for (const line of left) if (!rightSet.has(line) && out.length < limit) out.push(`- ${truncate(line, 200)}`);
  for (const line of right) if (!leftSet.has(line) && out.length < limit * 2) out.push(`+ ${truncate(line, 200)}`);
  return out;
}

function compare(before, after) {
  const result = {
    routes: { before: Object.keys(before.routes).length, after: Object.keys(after.routes).length, removed: [], added: [] },
    perRoute: {},
    files: [],
    redirects: [],
    socialImages: [],
    notFound: null,
  };
  for (const route of Object.keys(before.routes)) {
    if (!after.routes[route]) result.routes.removed.push(route);
    else result.perRoute[route] = compareRoute(route, before.routes[route], after.routes[route]);
  }
  for (const route of Object.keys(after.routes)) if (!before.routes[route]) result.routes.added.push(route);
  if (before.notFound && after.notFound) result.notFound = compareRoute("(404 page)", before.notFound, after.notFound);

  for (const path of new Set([...Object.keys(before.files ?? {}), ...Object.keys(after.files ?? {})])) {
    const was = before.files?.[path];
    const now = after.files?.[path];
    const mustEqual = MUST_EQUAL_FILES.includes(path);
    if (!was) result.files.push({ path, mustEqual: false, change: "added" });
    else if (!now) result.files.push({ path, mustEqual: true, change: "removed" });
    else if (was.status !== now.status) result.files.push({ path, mustEqual: true, change: `HTTP ${was.status} → ${now.status}` });
    else if (was.sha256 !== now.sha256) {
      result.files.push({
        path,
        mustEqual,
        change: `bytes differ (${was.bytes} → ${now.bytes})`,
        lines: was.text !== undefined && now.text !== undefined ? lineDiff(was.text, now.text) : [],
      });
    }
  }
  for (const path of MUST_EQUAL_FILES) {
    if (!before.files?.[path] && !after.files?.[path]) result.files.push({ path, mustEqual: false, change: "in neither snapshot" });
  }

  const redirectKey = (r) => r.source;
  const afterRedirects = new Map((after.redirects ?? []).map((r) => [redirectKey(r), r]));
  const beforeRedirects = new Map((before.redirects ?? []).map((r) => [redirectKey(r), r]));
  for (const [source, was] of beforeRedirects) {
    const now = afterRedirects.get(source);
    if (!now) result.redirects.push({ source, mustEqual: true, change: "removed", before: `${was.status} → ${was.location}` });
    else if (was.status !== now.status || was.location !== now.location || was.targetStatus !== now.targetStatus) {
      result.redirects.push({
        source,
        mustEqual: true,
        change: "changed",
        before: `${was.status} → ${was.location} (target ${was.targetStatus})`,
        after: `${now.status} → ${now.location} (target ${now.targetStatus})`,
      });
    }
  }
  for (const [source, now] of afterRedirects) {
    if (!beforeRedirects.has(source)) result.redirects.push({ source, mustEqual: false, change: "added", after: `${now.status} → ${now.location}` });
    else if (!now.ok) result.redirects.push({ source, mustEqual: true, change: "does not match its declaration", after: `${now.status} → ${now.location}, declared ${now.statusCode} → ${now.expectedLocation}` });
  }

  if (before.socialImages && after.socialImages) {
    const byPath = (images) => new Map(Object.entries(images).map(([url, v]) => [url.split("?")[0], v]));
    const afterImages = byPath(after.socialImages);
    for (const [path, was] of byPath(before.socialImages)) {
      const now = afterImages.get(path);
      if (!now) continue; // the tag comparison already reports a route whose og:image path changed
      const okBefore = was.status === 200 && /^image\//.test(was.contentType ?? "");
      const okAfter = now.status === 200 && /^image\//.test(now.contentType ?? "");
      if (okBefore && !okAfter) result.socialImages.push({ path, mustEqual: true, change: `no longer an image (HTTP ${now.status} ${now.contentType})` });
      else if (was.sha256 !== now.sha256) result.socialImages.push({ path, mustEqual: false, change: `image bytes differ (${was.bytes} → ${now.bytes})` });
    }
  }
  return result;
}

/* ------------------------------ report ------------------------------ */

function summarize(result) {
  const routes = Object.entries(result.perRoute);
  const violations = routes.flatMap(([route, r]) => r.violations.map((v) => ({ route, ...v })));
  if (result.notFound) violations.push(...result.notFound.violations.map((v) => ({ route: "(404 page)", ...v })));
  const removals = routes.flatMap(([route, r]) => r.removals.map((v) => ({ route, ...v })));
  if (result.notFound) removals.push(...result.notFound.removals.map((v) => ({ route: "(404 page)", ...v })));
  const info = routes.flatMap(([route, r]) => r.info.map((v) => ({ route, ...v })));

  const fileViolations = result.files.filter((f) => f.mustEqual);
  const redirectViolations = result.redirects.filter((r) => r.mustEqual);
  const socialViolations = result.socialImages.filter((s) => s.mustEqual);
  const mustEqualCount =
    violations.length + result.routes.removed.length + fileViolations.length + redirectViolations.length + socialViolations.length;

  const byCategory = new Map();
  for (const removal of removals) {
    if (!byCategory.has(removal.category)) byCategory.set(removal.category, new Map());
    const items = byCategory.get(removal.category);
    items.set(removal.item, [...(items.get(removal.item) ?? []), removal.route]);
  }
  const added = { text: 0, links: 0, images: 0, ids: 0 };
  for (const [, r] of routes) for (const key of Object.keys(added)) added[key] += r.added[key] ?? 0;

  return { violations, removals, info, fileViolations, redirectViolations, socialViolations, mustEqualCount, byCategory, added };
}

function markdown(before, after, files, result, summary, listLimit) {
  const lines = [];
  const add = (line = "") => lines.push(line);
  const routesWith = (list) => new Set(list.map((item) => item.route)).size;
  const describe = (snap, file) =>
    `\`${file}\` — ${snap.generatedAt}, build \`${snap.build?.buildId ?? "?"}\`, commit \`${(snap.build?.git?.commit ?? "?").slice(0, 7)}\`${snap.build?.git?.dirty ? " (uncommitted changes)" : ""}, ${snap.base}`;
  const pass = summary.mustEqualCount === 0;

  add("# Content snapshot diff");
  add();
  add(`- Before: ${describe(before, files.before)}`);
  add(`- After: ${describe(after, files.after)}`);
  add();
  add(`## Result: ${pass ? "PASS" : "FAIL"} — ${summary.mustEqualCount} must-equal difference(s), ${summary.removals.length} removal(s)`);
  add();
  add("| Check | Rule | Differences | Routes |");
  add("|---|---|---:|---:|");
  const fieldCount = (test) => summary.violations.filter((v) => test(v.field));
  const row = (label, rule, list) => add(`| ${label} | ${rule} | ${list.length} | ${routesWith(list)} |`);
  add(`| Routes removed | must equal | ${result.routes.removed.length} | ${result.routes.removed.length} |`);
  row("HTTP status", "must equal", fieldCount((f) => f === "HTTP status"));
  row("Title", "must equal", fieldCount((f) => f === "title"));
  row("Meta description", "must equal", fieldCount((f) => f === "description"));
  row("Canonical", "must equal", fieldCount((f) => f === "canonical"));
  row("Robots / googlebot", "must equal", fieldCount((f) => f === "robots" || f === "googlebot"));
  row("og:* tags", "must equal", fieldCount((f) => f.startsWith("og:")));
  row("twitter:* tags", "must equal", fieldCount((f) => f.startsWith("twitter:")));
  row("H1 (whitespace removed)", "must equal", fieldCount((f) => f === "H1"));
  row("JSON-LD", "must equal", fieldCount((f) => f.startsWith("JSON-LD")));
  add(`| robots.txt, sitemap.xml, llms.txt, llms-full.txt, manifest | must equal | ${summary.fileViolations.length} | – |`);
  add(`| Redirects | must equal | ${summary.redirectViolations.length} | – |`);
  add(`| Social images that stopped loading | must equal | ${summary.socialViolations.length} | – |`);
  for (const category of ["text", "internal link", "external link", "contact link", "element id", "image or media source", "header text", "footer text", "other text"]) {
    const items = summary.byCategory.get(category);
    const occurrences = summary.removals.filter((r) => r.category === category);
    add(`| ${category[0].toUpperCase()}${category.slice(1)} removed | must stay | ${items ? items.size : 0} distinct (${occurrences.length} occurrences) | ${routesWith(occurrences)} |`);
  }
  add(`| Routes added | allowed | ${result.routes.added.length} | ${result.routes.added.length} |`);
  add(`| Added on existing routes | allowed | ${summary.added.text} text blocks, ${summary.added.links} links, ${summary.added.images} images, ${summary.added.ids} ids | – |`);
  add();
  add(`Routes compared: ${Object.keys(result.perRoute).length} (before ${result.routes.before}, after ${result.routes.after}).`);
  add();

  const cap = (list, render) => {
    list.slice(0, listLimit).forEach(render);
    if (list.length > listLimit) add(`- … ${list.length - listLimit} more (use --json for all, or raise --list)`);
  };
  // Informational sections repeat one kind of line; a handful shows the pattern.
  const infoLimit = Math.min(listLimit, 12);

  add("## Must-equal differences");
  add();
  if (pass) {
    add("None.");
    add();
  }
  if (result.routes.removed.length) {
    add("### Routes removed");
    cap(result.routes.removed, (route) => add(`- \`${route}\``));
    add();
  }
  if (summary.violations.length) {
    const byRoute = new Map();
    for (const v of summary.violations) byRoute.set(v.route, [...(byRoute.get(v.route) ?? []), v]);
    // The same change on many routes (a sitewide tag) is shown once.
    const what = (v) => (v.note ? truncate(v.note, 900) : `${show(v.before)} → ${show(v.after)}`);
    const signature = (v) => JSON.stringify([v.field, v.note ?? null, v.before ?? null, v.after ?? null]);
    const shared = new Map();
    for (const v of summary.violations) {
      if (!shared.has(signature(v))) shared.set(signature(v), { sample: v, routes: [] });
      shared.get(signature(v)).routes.push(v.route);
    }
    const sitewide = [...shared].filter(([, group]) => group.routes.length >= 5);
    if (sitewide.length) {
      add("### The same difference on 5 or more routes");
      for (const [, { sample, routes }] of sitewide) {
        add(`- **${sample.field}** on ${routes.length} routes (${routes.slice(0, 4).map((r) => `\`${r}\``).join(", ")}${routes.length > 4 ? ", …" : ""}): ${what(sample)}`);
      }
      add();
    }
    const sitewideSignatures = new Set(sitewide.map(([sig]) => sig));
    add("### By route");
    const entries = [...byRoute].map(([route, list]) => [route, list.filter((v) => !sitewideSignatures.has(signature(v)))]).filter(([, list]) => list.length);
    cap(entries, ([route, list]) => {
      add(`- \`${route}\``);
      for (const v of list) add(`  - **${v.field}**: ${what(v)}`);
    });
    if (!entries.length) add("- (every difference is in the list above)");
    add();
  }
  if (summary.fileViolations.length) {
    add("### Files");
    for (const f of summary.fileViolations) {
      add(`- \`${f.path}\`: ${f.change}`);
      for (const line of f.lines ?? []) add(`  - \`${line.replace(/`/g, "'")}\``);
    }
    add();
  }
  if (summary.redirectViolations.length) {
    add("### Redirects");
    for (const r of summary.redirectViolations) add(`- \`${r.source}\`: ${r.change}${r.before ? ` — before ${r.before}` : ""}${r.after ? ` — after ${r.after}` : ""}`);
    add();
  }
  if (summary.socialViolations.length) {
    add("### Social images");
    for (const s of summary.socialViolations) add(`- \`${s.path}\`: ${s.change}`);
    add();
  }

  add("## Removed (had to stay on the same route)");
  add();
  if (!summary.removals.length) {
    add("None.");
    add();
  }
  for (const [category, items] of summary.byCategory) {
    const sorted = [...items].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    add(`### ${category[0].toUpperCase()}${category.slice(1)} — ${sorted.length} distinct`);
    cap(sorted, ([item, routes]) => {
      const where = routes.length === 1 ? `\`${routes[0]}\`` : `${routes.length} routes: ${routes.slice(0, 4).map((r) => `\`${r}\``).join(", ")}${routes.length > 4 ? ", …" : ""}`;
      add(`- ${cell(truncate(item, 320))} — ${where}`);
    });
    add();
  }

  add("## For information (not failures)");
  add();
  const kinds = new Map();
  for (const item of summary.info) kinds.set(item.kind, [...(kinds.get(item.kind) ?? []), item]);
  const nothing =
    !kinds.size &&
    !result.routes.added.length &&
    !result.files.some((f) => !f.mustEqual) &&
    !result.redirects.some((r) => !r.mustEqual) &&
    !result.socialImages.some((s) => !s.mustEqual);
  if (nothing) add("Nothing to report.");
  if (result.routes.added.length) {
    add(`### Routes added — ${result.routes.added.length}`);
    cap(result.routes.added, (route) => add(`- \`${route}\``));
    add();
  }
  for (const [kind, items] of kinds) {
    add(`### ${kind[0].toUpperCase()}${kind.slice(1)} — ${items.length} on ${routesWith(items)} route(s)`);
    // Identical findings on several routes collapse into one line.
    const grouped = new Map();
    for (const item of items) {
      const rest = Object.fromEntries(Object.entries(item).filter(([key]) => key !== "route" && key !== "kind"));
      const key = JSON.stringify(rest);
      grouped.set(key, [...(grouped.get(key) ?? []), item.route]);
    }
    const rows = [...grouped].sort((a, b) => b[1].length - a[1].length);
    rows.slice(0, infoLimit).forEach(([key, routes]) => {
      const rest = JSON.parse(key);
      const parts = Object.entries(rest).map(([k, v]) => `${k}: ${truncate(typeof v === "string" ? v : JSON.stringify(v), 260)}`);
      const where = routes.length === 1 ? `\`${routes[0]}\`` : `${routes.length} routes (${routes.slice(0, 3).map((r) => `\`${r}\``).join(", ")}${routes.length > 3 ? ", …" : ""})`;
      add(`- ${where} — ${cell(parts.join("; "))}`);
    });
    if (rows.length > infoLimit) add(`- … ${rows.length - infoLimit} more of this kind (all of them are in --json)`);
    add();
  }
  const otherFiles = result.files.filter((f) => !f.mustEqual);
  if (otherFiles.length) {
    add("### Other files");
    for (const f of otherFiles) add(`- \`${f.path}\`: ${f.change}`);
    add();
  }
  const otherRedirects = result.redirects.filter((r) => !r.mustEqual);
  if (otherRedirects.length) {
    add("### Redirects added");
    for (const r of otherRedirects) add(`- \`${r.source}\`: ${r.after}`);
    add();
  }
  const otherSocial = result.socialImages.filter((s) => !s.mustEqual);
  if (otherSocial.length) {
    add(`### Social images re-rendered — ${otherSocial.length}`);
    cap(otherSocial, (s) => add(`- \`${s.path}\`: ${s.change}`));
    add();
  }
  return `${lines.join("\n")}\n`;
}

/* ------------------------------ main ------------------------------ */

function load(file) {
  let snap;
  try {
    snap = readJson(file);
  } catch (err) {
    process.stderr.write(`Cannot read ${file}: ${err.message}\n`);
    process.exit(2);
  }
  if (snap?.kind !== "cs-qa-snapshot" || !snap.routes) {
    process.stderr.write(`${file} is not a snapshot written by scripts/qa/snapshot.mjs\n`);
    process.exit(2);
  }
  return snap;
}

function main() {
  const { values, positionals } = cli(
    USAGE,
    { md: { type: "string" }, json: { type: "string" }, strict: { type: "boolean" }, list: { type: "string" } },
    { allowPositionals: true }
  );
  if (positionals.length !== 2) {
    process.stderr.write(`Expected BEFORE.json and AFTER.json.\n\n${USAGE.trim()}\n`);
    process.exit(2);
  }
  const [beforeFile, afterFile] = positionals;
  const before = load(beforeFile);
  const after = load(afterFile);
  const listLimit = intArg(values.list, "list", 150);

  const result = compare(before, after);
  const summary = summarize(result);
  const report = markdown(before, after, { before: beforeFile, after: afterFile }, result, summary, listLimit);
  if (values.md) writeFile(values.md, report);
  if (values.json) {
    writeJson(values.json, {
      before: { file: beforeFile, generatedAt: before.generatedAt, build: before.build },
      after: { file: afterFile, generatedAt: after.generatedAt, build: after.build },
      pass: summary.mustEqualCount === 0,
      mustEqualDifferences: summary.mustEqualCount,
      removals: summary.removals.length,
      ...result,
    });
  }

  const out = (line) => process.stdout.write(`${line}\n`);
  out(`${summary.mustEqualCount === 0 ? "PASS" : "FAIL"}: ${summary.mustEqualCount} must-equal difference(s) across ${Object.keys(result.perRoute).length} routes`);
  out(`  routes removed ${result.routes.removed.length}, added ${result.routes.added.length}`);
  out(`  per-route tag/H1/JSON-LD/status differences ${summary.violations.length}; files ${summary.fileViolations.length}; redirects ${summary.redirectViolations.length}; social images ${summary.socialViolations.length}`);
  out(`  removals (must stay): ${summary.removals.length}${summary.removals.length ? ` — ${[...summary.byCategory].map(([c, items]) => `${items.size} ${c}`).join(", ")}` : ""}`);
  out(`  additions: ${summary.added.text} text blocks, ${summary.added.links} links, ${summary.added.images} images, ${summary.added.ids} ids`);
  if (values.md) out(`  report: ${values.md}`);
  else out("  (pass --md FILE for the full report)");

  const failed = summary.mustEqualCount > 0 || (values.strict && summary.removals.length > 0);
  process.exit(failed ? 1 : 0);
}

main();
