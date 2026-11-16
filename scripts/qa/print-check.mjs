#!/usr/bin/env node
/**
 * Checks the printable documents: the two builder documents and the Terms.
 *
 *   node scripts/qa/print-check.mjs --base http://localhost:3111 --out print-before.json
 *   node scripts/qa/print-check.mjs --compare print-before.json print-after.json [--md report.md]
 *
 * For each route it prints the page to PDF with Chrome's own print pipeline
 * (CSS page size, backgrounds on, no browser header/footer) and records the
 * page count, the paper size and the text on every printed page, including
 * running footers such as "Page 2 of 9" that exist only on paper. Then, with
 * print media emulated in the page, it records the visible text lines and
 * whether any site chrome (the site header/nav and footer, anything fixed or
 * sticky, any open dialog) is still visible.
 *
 * --compare fails (exit 1) when a document's page count or paper size
 * changed, printed or print-media text was lost or changed, a blank page
 * appeared, or site chrome became visible in print.
 */

import path from "node:path";
import { launchChrome } from "./lib/chrome.mjs";
import { readPdf } from "./lib/pdf.mjs";
import {
  cell,
  cli,
  hostFacts,
  intArg,
  listArg,
  normalizeBase,
  progress,
  readJson,
  routeSlug,
  run,
  sha256,
  truncate,
  UsageError,
  writeFile,
  writeJson,
} from "./lib/util.mjs";

const DEFAULT_ROUTES = ["/builders/capability-statement", "/builders/prequal-packet", "/terms"];

const USAGE = `
Usage:
  node scripts/qa/print-check.mjs --base http://localhost:PORT --out FILE.json [--routes LIST] [--pdf-dir DIR]
  node scripts/qa/print-check.mjs --compare BEFORE.json AFTER.json [--md report.md]

  --base URL       origin of the running production build
  --out FILE.json  where to write the result
  --routes LIST    documents to print (default ${DEFAULT_ROUTES.join(", ")})
  --pdf-dir DIR    also keep the printed PDFs here
  --timeout MS     page load timeout, default 45000
  --compare A B    compare two results; --md writes the comparison as Markdown
`;

/** Runs in the page with print media emulated. */
function inspectPrint() {
  const clean = (s) => (s ?? "").replace(/\s+/g, " ").trim();
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  const visible = (el) => {
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const main = document.querySelector("main");
  const chrome = [];
  const seen = new Set();
  const note = (el, kind) => {
    if (seen.has(el)) return;
    seen.add(el);
    chrome.push({ kind, element: describe(el), visible: visible(el), text: clean(el.innerText).slice(0, 120) });
  };
  // Site header, navigation and footer: the ones that are not part of the document in <main>.
  for (const el of document.querySelectorAll("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")) {
    if (main && main.contains(el)) continue;
    if (el.parentElement && el.parentElement.closest("header, nav, footer")) continue;
    note(el, el.matches("footer, [role='contentinfo']") ? "site footer" : "site header/nav");
  }
  for (const el of document.querySelectorAll("dialog[open], [role='dialog'], [aria-modal='true']")) note(el, "dialog");
  for (const el of document.body.querySelectorAll("*")) {
    const position = getComputedStyle(el).position;
    if (position === "fixed") note(el, "fixed");
    else if (position === "sticky") note(el, "sticky");
  }
  const lines = document.body.innerText.split(/\n+/).map(clean).filter(Boolean);
  const mainLines = main ? main.innerText.split(/\n+/).map(clean).filter(Boolean) : [];
  return {
    lines,
    linesOutsideMain: Math.max(0, lines.length - mainLines.length),
    h1: [...document.querySelectorAll("h1")].filter(visible).map((h) => clean(h.textContent)),
    chrome,
    printMedia: matchMedia("print").matches,
  };
}

/**
 * Pages with nothing on them. A line that is on every page of a document
 * (numbers aside) is a running header or footer, and a page that holds
 * nothing else counts as blank.
 */
function findBlankPages(pageText) {
  const key = (line) => line.replace(/\d+/g, "#").replace(/\s+/g, "");
  const running = new Set();
  if (pageText.length >= 2) {
    const pagesWith = new Map();
    for (const lines of pageText) for (const k of new Set(lines.map(key))) pagesWith.set(k, (pagesWith.get(k) ?? 0) + 1);
    for (const [k, n] of pagesWith) if (n === pageText.length) running.add(k);
  }
  return {
    blankPages: pageText.map((lines, i) => (lines.some((line) => !running.has(key(line))) ? null : i + 1)).filter(Boolean),
    runningLines: [...new Set(pageText.flatMap((lines) => lines.filter((line) => running.has(key(line))).map((line) => line.replace(/\d+/g, "#"))))],
  };
}

async function checkRoute(browser, base, route, options) {
  const page = await browser.newPage({ width: 1280, height: 900 });
  try {
    const nav = await page.goto(base + route, { waitUntil: "networkidle", timeout: options.timeout });
    await page.evaluate(() => document.fonts.ready.then(() => true));
    const screenTitle = await page.evaluate(() => document.title);

    const pdfBytes = await page.pdf();
    const pdf = readPdf(pdfBytes);
    if (options.pdfDir) writeFile(path.join(options.pdfDir, `${routeSlug(route)}.pdf`), pdfBytes);

    await page.emulateMedia({ media: "print" });
    const print = await page.evaluate(inspectPrint);
    await page.emulateMedia({ media: null });
    const env = await page.env();

    const visibleChrome = print.chrome.filter((c) => c.visible && c.kind !== "sticky");
    const pageText = pdf.pageText ?? [];
    const { blankPages, runningLines } = findBlankPages(pageText);
    return {
      route,
      status: nav.status,
      title: screenTitle,
      pdf: {
        pages: pdf.pages,
        mediaBox: pdf.mediaBox,
        bytes: pdfBytes.length,
        // Pages with no text of their own (a running header or footer does not count).
        blankPages,
        runningLines,
        textError: pdf.textError,
        unmappedGlyphs: pdf.unmappedGlyphs,
        pageText,
        // "Page 3 of 9" style footers found on each page, in page order.
        pageNumbers: pageText.map((lines) => lines.map((line) => /Page\s*\d+\s*of\s*\d+/i.exec(line)?.[0] ?? null).find(Boolean) ?? null),
        textSha256: sha256(pageText.map((lines) => lines.join("\n")).join("\f")),
      },
      print: {
        mediaEmulated: print.printMedia,
        lines: print.lines,
        linesOutsideMain: print.linesOutsideMain,
        visibleH1: print.h1,
        chromeVisible: visibleChrome.length > 0,
        visibleChrome,
        hiddenChrome: print.chrome.filter((c) => !c.visible).map((c) => `${c.kind}: ${c.element}`),
        stickyVisible: print.chrome.filter((c) => c.visible && c.kind === "sticky").map((c) => c.element),
      },
      env: { webdriver: env.webdriver, userAgent: env.userAgent, effectiveType: env.effectiveType },
      tags: { attempts: page.tagAttempts().length, leaks: page.tagLeaks().length },
    };
  } finally {
    await page.close();
  }
}

/* ------------------------------ compare ------------------------------ */

const squash = (s) => String(s).replace(/\s+/g, "");

/** "Page 1 of 13 … Page 13 of 13 (every page)" or the plain list when the footers are irregular. */
function footerSummary(pageNumbers) {
  const found = pageNumbers.filter(Boolean);
  if (!found.length) return "none";
  const regular = pageNumbers.every((text, i) => text && new RegExp(`^Page\\s*${i + 1}\\s*of\\s*${pageNumbers.length}$`, "i").test(text));
  if (regular) return pageNumbers.length === 1 ? `${found[0]}` : `${found[0]} … ${found[found.length - 1]} (every page)`;
  return pageNumbers.map((text, i) => `p${i + 1}: ${text ?? "none"}`).join(", ");
}

function compareResults(before, after) {
  const problems = [];
  const notes = [];
  const routes = new Set([...before.documents.map((d) => d.route), ...after.documents.map((d) => d.route)]);
  for (const route of routes) {
    const a = before.documents.find((d) => d.route === route);
    const b = after.documents.find((d) => d.route === route);
    const problem = (text) => problems.push({ route, text });
    const note = (text) => notes.push({ route, text });
    if (!a) {
      note("only in the second result");
      continue;
    }
    if (!b) {
      problem("missing from the second result");
      continue;
    }
    if (a.error || b.error) {
      problem(`could not be printed: ${a.error ?? b.error}`);
      continue;
    }
    if (a.status !== b.status) problem(`HTTP status ${a.status} → ${b.status}`);
    if (a.pdf.pages !== b.pdf.pages) problem(`page count ${a.pdf.pages} → ${b.pdf.pages}`);
    if (JSON.stringify(a.pdf.mediaBox) !== JSON.stringify(b.pdf.mediaBox)) problem(`paper size ${JSON.stringify(a.pdf.mediaBox)} → ${JSON.stringify(b.pdf.mediaBox)}`);
    const newBlank = b.pdf.blankPages.filter((n) => !a.pdf.blankPages.includes(n));
    if (newBlank.length) problem(`blank page(s) in the second result: ${newBlank.join(", ")}`);
    if (JSON.stringify(a.pdf.pageNumbers) !== JSON.stringify(b.pdf.pageNumbers)) {
      problem(`page-number footers: ${footerSummary(a.pdf.pageNumbers)} → ${footerSummary(b.pdf.pageNumbers)}`);
    }
    if (a.pdf.textError || b.pdf.textError) note(`printed text could not be read (${a.pdf.textError ?? b.pdf.textError}); compared page count and print-media text only`);

    // Printed text, page by page, ignoring whitespace.
    const pages = Math.max(a.pdf.pageText.length, b.pdf.pageText.length);
    for (let i = 0; i < pages; i++) {
      const left = a.pdf.pageText[i] ?? [];
      const right = b.pdf.pageText[i] ?? [];
      if (squash(left.join("")) === squash(right.join(""))) continue;
      const rightSet = new Set(right.map(squash));
      const leftSet = new Set(left.map(squash));
      const gone = left.filter((line) => !rightSet.has(squash(line)));
      const added = right.filter((line) => !leftSet.has(squash(line)));
      problem(
        `printed page ${i + 1} differs: ${gone.length} line(s) gone, ${added.length} new` +
          `${gone.length ? ` — gone: ${gone.slice(0, 4).map((l) => `"${truncate(l, 110)}"`).join(", ")}` : ""}` +
          `${added.length ? ` — new: ${added.slice(0, 4).map((l) => `"${truncate(l, 110)}"`).join(", ")}` : ""}`
      );
    }

    // Text visible with print media emulated.
    const afterLines = new Set(b.print.lines.map(squash));
    const beforeLines = new Set(a.print.lines.map(squash));
    const lost = a.print.lines.filter((line) => !afterLines.has(squash(line)));
    const gained = b.print.lines.filter((line) => !beforeLines.has(squash(line)));
    if (lost.length) problem(`${lost.length} print-media line(s) gone: ${lost.slice(0, 5).map((l) => `"${truncate(l, 110)}"`).join(", ")}`);
    if (gained.length) problem(`${gained.length} new print-media line(s): ${gained.slice(0, 5).map((l) => `"${truncate(l, 110)}"`).join(", ")}`);
    if (!lost.length && !gained.length && JSON.stringify(a.print.lines.map(squash)) !== JSON.stringify(b.print.lines.map(squash))) {
      note("print-media lines are the same but in a different order");
    }

    if (b.print.chromeVisible) {
      problem(`site chrome visible in print: ${b.print.visibleChrome.map((c) => `${c.kind} ${c.element}`).join("; ")}${a.print.chromeVisible ? " (also in the first result)" : ""}`);
    }
    if (a.pdf.bytes !== b.pdf.bytes) note(`PDF size ${a.pdf.bytes} → ${b.pdf.bytes} bytes`);
  }
  return { problems, notes };
}

function compareMarkdown(files, before, after, outcome) {
  const lines = [];
  const add = (line = "") => lines.push(line);
  add("# Print check comparison");
  add();
  add(`- Before: \`${files[0]}\` — ${before.generatedAt}, ${before.base}`);
  add(`- After: \`${files[1]}\` — ${after.generatedAt}, ${after.base}`);
  add();
  add(`## Result: ${outcome.problems.length ? `FAIL — ${outcome.problems.length} difference(s)` : "PASS — printed documents match"}`);
  add();
  add("| Document | Pages | Paper | Page-number footers | Blank pages | Site chrome in print | Print-media lines |");
  add("|---|---|---|---|---|---|---|");
  for (const a of before.documents) {
    const b = after.documents.find((d) => d.route === a.route);
    const pair = (pick) => {
      const left = a.error ? "error" : pick(a);
      const right = !b ? "missing" : b.error ? "error" : pick(b);
      return left === right ? `${left}` : `${left} → ${right}`;
    };
    add(
      `| \`${a.route}\` | ${pair((d) => d.pdf.pages)} | ${pair((d) => (d.pdf.mediaBox ? `${d.pdf.mediaBox[2]}x${d.pdf.mediaBox[3]} pt` : "?"))} | ${cell(pair((d) => footerSummary(d.pdf.pageNumbers)))} | ${pair((d) => d.pdf.blankPages.join(", ") || "none")} | ${pair((d) => (d.print.chromeVisible ? "VISIBLE" : "hidden"))} | ${pair((d) => d.print.lines.length)} |`
    );
  }
  add();
  add("## Differences");
  add();
  if (!outcome.problems.length) add("None.");
  for (const p of outcome.problems) add(`- \`${p.route}\`: ${cell(p.text)}`);
  add();
  if (outcome.notes.length) {
    add("## Notes");
    add();
    for (const n of outcome.notes) add(`- \`${n.route}\`: ${cell(n.text)}`);
    add();
  }
  return `${lines.join("\n")}\n`;
}

/* ------------------------------ main ------------------------------ */

async function main() {
  const { values, positionals } = cli(
    USAGE,
    {
      base: { type: "string" },
      out: { type: "string" },
      routes: { type: "string", multiple: true },
      "pdf-dir": { type: "string" },
      timeout: { type: "string" },
      compare: { type: "boolean" },
      md: { type: "string" },
    },
    { allowPositionals: true }
  );

  if (values.compare) {
    if (positionals.length !== 2) throw new UsageError("--compare needs two result files: BEFORE.json AFTER.json");
    const load = (file) => {
      let data;
      try {
        data = readJson(file);
      } catch (err) {
        throw new UsageError(`Cannot read ${file}: ${err.message}`);
      }
      if (data?.kind !== "cs-qa-print-check") throw new UsageError(`${file} was not written by scripts/qa/print-check.mjs`);
      return data;
    };
    const before = load(positionals[0]);
    const after = load(positionals[1]);
    const outcome = compareResults(before, after);
    if (values.md) writeFile(values.md, compareMarkdown(positionals, before, after, outcome));
    process.stdout.write(`${outcome.problems.length ? "FAIL" : "PASS"}: ${outcome.problems.length} difference(s) across ${before.documents.length} document(s)\n`);
    for (const p of outcome.problems) process.stdout.write(`  ${p.route}: ${p.text}\n`);
    for (const n of outcome.notes) process.stdout.write(`  note — ${n.route}: ${n.text}\n`);
    if (values.md) process.stdout.write(`  report: ${values.md}\n`);
    return outcome.problems.length ? 1 : 0;
  }

  if (positionals.length) throw new UsageError(`Unexpected argument: ${positionals[0]}`);
  if (!values.out) throw new UsageError("--out is required");
  const base = normalizeBase(values.base);
  const routes = listArg(values.routes).length ? listArg(values.routes) : DEFAULT_ROUTES;
  const options = { timeout: intArg(values.timeout, "timeout", 45000), pdfDir: values["pdf-dir"] ?? null };

  const browser = await launchChrome();
  const browserInfo = browser.info();
  const documents = [];
  try {
    for (const route of routes) {
      progress(`Printing ${route} …`);
      try {
        documents.push(await checkRoute(browser, base, route, options));
      } catch (err) {
        documents.push({ route, error: err.message });
      }
    }
  } finally {
    await browser.close();
  }

  writeJson(values.out, { kind: "cs-qa-print-check", version: 1, generatedAt: new Date().toISOString(), base, host: hostFacts(), browser: browserInfo, documents });
  let failed = 0;
  for (const d of documents) {
    if (d.error) {
      failed += 1;
      process.stdout.write(`${d.route}: FAILED — ${d.error}\n`);
      continue;
    }
    const issues = [
      d.status !== 200 ? `HTTP ${d.status}` : null,
      d.print.chromeVisible ? `site chrome visible in print (${d.print.visibleChrome.map((c) => c.element).join(", ")})` : null,
      d.pdf.blankPages.length ? `blank page(s): ${d.pdf.blankPages.join(", ")} (nothing but a running header or footer)` : null,
      d.pdf.textError ? `printed text unreadable (${d.pdf.textError})` : null,
      d.tags.leaks ? "a tag request was not blocked" : null,
    ].filter(Boolean);
    if (issues.length) failed += 1;
    process.stdout.write(
      `${d.route}: ${d.pdf.pages} page(s), ${d.pdf.mediaBox ? `${d.pdf.mediaBox[2]}x${d.pdf.mediaBox[3]} pt` : "size unknown"}, ` +
        `${d.pdf.pageText.reduce((n, lines) => n + lines.length, 0)} printed lines (last page ${d.pdf.pageText.at(-1)?.length ?? 0}), ` +
        `${d.print.lines.length} print-media lines, page-number footers: ${footerSummary(d.pdf.pageNumbers)}` +
        `${issues.length ? ` — ${issues.join("; ")}` : " — ok"}\n`
    );
  }
  process.stdout.write(`Written to ${values.out}\n`);
  return failed ? 1 : 0;
}

run(main);
