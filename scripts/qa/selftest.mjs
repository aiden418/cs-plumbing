#!/usr/bin/env node
/**
 * Proves that the harness notices what it is supposed to notice.
 *
 *   node scripts/qa/selftest.mjs --port 3111
 *
 * Starts a throwaway server on 127.0.0.1:PORT (stop the site first if it is
 * using that port) that serves small pages, each broken in one known way,
 * then runs the real scripts against them and compares what they report with
 * what was planted:
 *
 *   sweep.mjs        a clean page passes; a broken image (visible, and lazy
 *                    inside a hidden block), two H1s, an invisible H1,
 *                    sideways overflow, a console error with an uncaught
 *                    exception, a failed request and an HTTP 500 each fail
 *                    exactly their own checks; tag requests are blocked and
 *                    counted, and fail the page under --expect-tags none
 *   capture.mjs      a 20,000 px page becomes one image of exactly that
 *                    height, stitched from tiles; overflow is recorded
 *   print-check.mjs  a three-sheet document is read back sheet by sheet from
 *                    the PDF, with its "Page X of Y" footers; a fixed element
 *                    left visible in print and a blank last page are caught
 *   vitals.mjs       a planted layout shift, long task and intro:/video:
 *                    marks are measured; cold runs use fresh origins
 *
 * Nothing leaves the machine: the only third-party URLs are tag URLs, which
 * the harness blocks. Exit 0 when every expectation holds.
 */

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cli, imageSize, intArg, readJson, run, UsageError } from "./lib/util.mjs";

const USAGE = `
Usage: node scripts/qa/selftest.mjs --port PORT [--keep]

  --port PORT   free port for the throwaway server (never the port of a running site)
  --keep        keep the temporary output folder and print where it is
`;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

const page = (title, body, head = "") =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
  `<title>${title}</title><style>body{margin:0;font:16px/1.4 sans-serif}main{padding:16px}</style>${head}</head><body>${body}</body></html>`;
const ok = (extra = "") => `<main><h1>Self-test page</h1><p>Plain content.</p><img src="/pixel.png" alt="" width="40" height="40">${extra}</main>`;

/** Letter pages with a "Page X of Y" footer in the page margin, like the Terms document. */
const PRINT_STYLE = `<style>@page { size: Letter; margin: 0.6in 0.6in 0.8in; @bottom-right { content: "Page " counter(page) " of " counter(pages); font: 8pt sans-serif; } }</style>`;
const sheets = (names) =>
  names
    .map((name, i) => {
      const tag = i === 0 ? "h1" : "h2";
      const style = i < names.length - 1 ? ` style="break-after:page"` : "";
      return `<section${style}><${tag}>${name} sheet of the test document</${tag}><p>${name} body text.</p></section>`;
    })
    .join("");

const PAGES = {
  "/ok": page("ok", ok(`<div style="height:2400px"></div><img loading="lazy" src="/pixel.png?lazy" alt="" width="40" height="40">`)),
  "/broken-image": page("broken image", ok(`<img src="/missing.png" alt="missing" width="40" height="40">`)),
  "/hidden-broken-image": page("hidden broken image", ok(`<div hidden><img loading="lazy" src="/missing-lazy.png" alt="" width="40" height="40"></div>`)),
  "/two-h1": page("two h1", ok(`<h1>A second headline</h1>`)),
  "/no-visible-h1": page("no visible h1", `<main><h1 style="opacity:0">Invisible headline</h1><p>Plain content.</p></main>`),
  "/overflow": page("overflow", ok(`<div id="too-wide" style="width:1600px;height:40px;background:#ccc"></div>`)),
  "/console-error": page("console error", ok(`<script>console.error("planted console error"); setTimeout(() => { throw new Error("planted exception"); }, 0);</script>`)),
  "/failed-request": page("failed request", ok(`<script>fetch("/api/missing").catch(() => {});</script>`)),
  "/server-error": page("server error", ok()),
  "/tag": page(
    "tag",
    ok(
      `<script src="https://www.googletagmanager.com/gtag/js?id=G-SELFTEST"></script>` +
        `<script>fetch("https://www.facebook.com/tr?id=0&ev=PageView", { mode: "no-cors" }).catch(() => {}); new Image().src = "https://www.google-analytics.com/collect?v=1&selftest=1";</script>`
    )
  ),
  "/tall": page("tall", `<main style="padding:0"><h1 style="margin:0;height:1000px">Tall page</h1>${Array.from({ length: 19 }, (_, i) => `<div style="height:1000px;background:${i % 2 ? "#eef" : "#fee"}">${(i + 2) * 1000}</div>`).join("")}</main>`),
  // Three sheets with a running footer; the site nav stays fixed in print (a defect to catch).
  "/print-doc": page(
    "print doc",
    `<nav style="position:fixed;top:0;left:0;right:0;background:#eee">Site navigation</nav><main>${sheets(["Alpha", "Bravo", "Charlie"])}</main>`,
    PRINT_STYLE
  ),
  // The same, with the nav hidden in print.
  "/print-clean": page(
    "print clean",
    `<nav style="position:fixed;top:0;left:0;right:0;background:#eee">Site navigation</nav><main>${sheets(["Alpha", "Bravo", "Charlie"])}</main>`,
    `${PRINT_STYLE}<style>@media print { nav { display: none !important; } }</style>`
  ),
  // Two sheets of text, then a forced break that leaves a third page with only the footer.
  "/print-blank-last": page(
    "print blank last",
    `<main>${sheets(["Alpha", "Bravo"])}<div style="break-before:page;height:1px"></div></main>`,
    PRINT_STYLE
  ),
  "/shift": page(
    "shift",
    `<main style="padding:0"><div id="slot"></div><h1 id="headline">A headline that will be pushed down</h1><p>Paragraph text. Paragraph text. Paragraph text.</p></main>` +
      `<script>performance.mark("intro:start");` +
      `setTimeout(() => { document.getElementById("slot").style.height = "150px"; performance.mark("video:first-frame"); }, 300);` +
      `setTimeout(() => { const end = performance.now() + 160; while (performance.now() < end) {} performance.mark("other:ignored"); }, 600);</script>`
  ),
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");
    if (pathname === "/pixel.png" || pathname === "/favicon.ico") {
      res.writeHead(200, { "content-type": "image/png", "cache-control": "max-age=3600" });
      res.end(PIXEL);
    } else if (PAGES[pathname]) {
      res.writeHead(pathname === "/server-error" ? 500 : 200, { "content-type": "text/html; charset=utf-8" });
      res.end(PAGES[pathname]);
    } else {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err.code === "EADDRINUSE" ? new UsageError(`Port ${port} is in use. Stop what is running there or pass another --port.`) : err));
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

/** Run one of the scripts; resolves with its exit code and output. */
function script(name, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(HERE, name), ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.once("error", reject);
    child.once("exit", (code) => resolve({ code, output }));
  });
}

async function main() {
  const { values } = cli(USAGE, { port: { type: "string" }, keep: { type: "boolean" } });
  if (!values.port) throw new UsageError("--port is required (a free port; the throwaway server binds to 127.0.0.1)");
  const port = intArg(values.port, "port");
  if (port === 3000) throw new UsageError("Port 3000 is reserved for the site's own dev server; pick another.");
  const base = `http://localhost:${port}`;
  const out = mkdtempSync(path.join(os.tmpdir(), "cs-qa-selftest-"));
  const server = await startServer(port);
  const results = [];
  const expect = (label, pass, detail = "") => {
    results.push({ label, pass, detail });
    process.stdout.write(`${pass ? "  ok  " : "  FAIL"}  ${label}${!pass && detail ? ` — ${detail}` : ""}\n`);
  };
  const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

  try {
    /* ---- sweep ---- */
    process.stdout.write("sweep.mjs\n");
    const planted = {
      "/ok": [],
      "/broken-image": ["console", "image", "request"],
      "/hidden-broken-image": ["console", "image", "request"],
      "/two-h1": ["h1"],
      "/no-visible-h1": ["h1"],
      "/overflow": ["overflow"],
      "/console-error": ["console"],
      "/failed-request": ["console", "request"],
      "/server-error": ["console", "request", "status"],
      "/tag": [],
    };
    const sweepRun = await script("sweep.mjs", ["--base", base, "--out", path.join(out, "sweep"), "--routes", Object.keys(planted).join(",")]);
    const sweep = readJson(path.join(out, "sweep.json"));
    for (const [route, checks] of Object.entries(planted)) {
      for (const width of [375, 1440]) {
        const found = sweep.results.find((r) => r.route === route && r.width === width);
        const failing = [...new Set((found?.failures ?? [{ check: "missing result" }]).map((f) => f.check))];
        expect(`${route} at ${width} px ${checks.length ? `fails ${checks.join(", ")}` : "passes"}`, same(failing, checks), `reported: ${failing.join(", ") || "nothing"}`);
      }
    }
    const consoleRun = sweep.results.find((r) => r.route === "/console-error" && r.width === 1440);
    expect("the console error and the uncaught exception are both reported", consoleRun?.consoleErrors.length === 2, JSON.stringify(consoleRun?.consoleErrors));
    const wide = sweep.results.find((r) => r.route === "/overflow" && r.width === 375);
    expect("the element that overflows is named", /#too-wide/.test(wide?.failures[0]?.detail ?? ""), wide?.failures[0]?.detail);
    const tag = sweep.results.find((r) => r.route === "/tag" && r.width === 1440);
    expect("3 tag requests are attempted, all blocked, none leaked", tag?.tags.attempts === 3 && tag.tags.blocked === 3 && tag.tags.leaks.length === 0, JSON.stringify(tag?.tags));
    expect("sweep exits 1 when pages fail", sweepRun.code === 1, `exit ${sweepRun.code}`);

    const offRun = await script("sweep.mjs", ["--base", base, "--out", path.join(out, "sweep-off"), "--routes", "/ok,/tag", "--expect-tags", "none", "--widths", "1440"]);
    const off = readJson(path.join(out, "sweep-off.json"));
    expect("--expect-tags none: the clean page passes", off.results.find((r) => r.route === "/ok")?.ok === true);
    expect("--expect-tags none: the page that calls tag hosts fails", same(new Set(off.results.find((r) => r.route === "/tag")?.failures.map((f) => f.check)), ["tag request"]), offRun.output.trim().split("\n").pop());

    const cleanRun = await script("sweep.mjs", ["--base", base, "--out", path.join(out, "sweep-clean"), "--routes", "/ok"]);
    expect("sweep exits 0 when every page passes", cleanRun.code === 0, `exit ${cleanRun.code}`);

    /* ---- capture ---- */
    process.stdout.write("capture.mjs\n");
    const shots = path.join(out, "shots");
    const captureRun = await script("capture.mjs", ["--base", base, "--out", shots, "--routes", "/tall,/overflow", "--viewports", "mobile"]);
    const captures = readJson(path.join(shots, "capture.json")).captures;
    const tall = captures["tall--mobile.jpg"];
    const size = imageSize(readFileSync(path.join(shots, "tall--mobile.jpg")));
    expect("a 20,000 px page reports scrollHeight 20000", tall?.scrollHeight === 20000, `scrollHeight ${tall?.scrollHeight}`);
    expect("its screenshot is one 780 x 40000 JPEG stitched from 5 tiles", size?.width === 780 && size?.height === 40000 && tall?.tiles === 5 && tall?.scale === 1, `${size?.width}x${size?.height}, ${tall?.tiles} tiles, scale ${tall?.scale}`);
    expect("overflow is recorded with the capture", captures["overflow--mobile.jpg"]?.overflowsViewport === true);
    expect("capture exits 0", captureRun.code === 0, captureRun.output.trim().split("\n").pop());

    /* ---- print-check ---- */
    process.stdout.write("print-check.mjs\n");
    const printFile = path.join(out, "print.json");
    const printRun = await script("print-check.mjs", ["--base", base, "--out", printFile, "--routes", "/print-doc,/print-clean,/print-blank-last"]);
    const docs = readJson(printFile).documents;
    const doc = docs.find((d) => d.route === "/print-doc");
    const clean = docs.find((d) => d.route === "/print-clean");
    const blankLast = docs.find((d) => d.route === "/print-blank-last");
    expect("a three-sheet document prints 3 Letter pages", doc?.pdf.pages === 3 && same(doc.pdf.mediaBox, [0, 0, 612, 792]), `${doc?.pdf.pages} pages, ${JSON.stringify(doc?.pdf.mediaBox)}`);
    expect(
      "each sheet's text is read back from its own PDF page",
      ["Alpha", "Bravo", "Charlie"].every((name, i) => (doc?.pdf.pageText[i] ?? []).some((line) => line.replace(/\s+/g, "").includes(`${name}sheetofthetestdocument`))),
      JSON.stringify(doc?.pdf.pageText)
    );
    expect("the running \"Page X of Y\" footer is read from every page", same(doc?.pdf.pageNumbers ?? [], ["Page 1 of 3", "Page 2 of 3", "Page 3 of 3"]), JSON.stringify(doc?.pdf.pageNumbers));
    expect("a fixed element left visible in print is reported", doc?.print.chromeVisible === true && doc.print.visibleChrome.some((c) => c.element.startsWith("nav")), JSON.stringify(doc?.print.visibleChrome));
    expect("a document that hides its chrome in print is clean", clean?.print.chromeVisible === false && clean.pdf.pages === 3 && clean.pdf.blankPages.length === 0, JSON.stringify({ chrome: clean?.print.visibleChrome, pages: clean?.pdf.pages, blank: clean?.pdf.blankPages }));
    expect("a last page holding only the running footer is reported blank", blankLast?.pdf.pages === 3 && same(blankLast.pdf.blankPages, [3]), JSON.stringify({ pages: blankLast?.pdf.pages, blank: blankLast?.pdf.blankPages, text: blankLast?.pdf.pageText }));
    expect("print-check exits 1 when a document has a problem", printRun.code === 1, `exit ${printRun.code}`);
    const cleanFile = path.join(out, "print-clean.json");
    const cleanRun2 = await script("print-check.mjs", ["--base", base, "--out", cleanFile, "--routes", "/print-clean"]);
    expect("print-check exits 0 on a clean document", cleanRun2.code === 0, cleanRun2.output.trim().split("\n").pop());
    const compareSame = await script("print-check.mjs", ["--compare", cleanFile, cleanFile]);
    expect("comparing a clean result with itself passes", compareSame.code === 0, compareSame.output.trim());
    const compareBad = await script("print-check.mjs", ["--compare", printFile, printFile]);
    expect("comparing fails while site chrome is visible in print", compareBad.code === 1 && /site chrome visible in print/.test(compareBad.output), compareBad.output.trim());

    /* ---- vitals ---- */
    process.stdout.write("vitals.mjs\n");
    const vitalsFile = path.join(out, "vitals.json");
    const vitalsRun = await script("vitals.mjs", ["--base", base, "--out", vitalsFile, "--routes", "/shift", "--viewports", "desktop", "--cold", "2", "--warm", "1", "--settle", "1500"]);
    const vitals = readJson(vitalsFile);
    const cold = vitals.runs.filter((r) => r.kind === "cold");
    expect("3 runs are measured (2 cold, 1 warm)", vitals.runs.length === 3 && vitals.runs.every((r) => !r.error), vitalsRun.output.trim().split("\n").slice(-3).join(" | "));
    expect("cold runs use fresh origins", same(cold.map((r) => new URL(r.url).hostname), ["c1.localhost", "c2.localhost"]), cold.map((r) => r.url).join(", "));
    expect("the warm run reuses the last cold origin", new URL(vitals.runs.find((r) => r.kind === "warm")?.url ?? "http://x").hostname === "c2.localhost");
    expect("the planted layout shift is measured, with its source", cold.every((r) => r.cls > 0.01 && r.shiftCount === 1 && r.shifts[0]?.sources.length > 0), JSON.stringify(cold.map((r) => [r.cls, r.shiftCount])));
    expect("the planted long task is measured", cold.every((r) => r.longTasks.count >= 1 && r.longTasks.maxMs >= 150), JSON.stringify(cold.map((r) => r.longTasks)));
    expect("intro:/video: marks are recorded and others ignored", cold.every((r) => same(r.marks.map((m) => m.name), ["intro:start", "video:first-frame"])), JSON.stringify(cold[0]?.marks));
    expect("the LCP element is identified", cold.every((r) => r.lcp?.element?.id === "headline"), JSON.stringify(cold[0]?.lcp?.element));
    expect("navigator.webdriver, user agent and effectiveType are recorded", cold.every((r) => typeof r.env.webdriver === "boolean" && r.env.userAgent && "effectiveType" in r.env));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    if (values.keep) process.stdout.write(`Output kept in ${out}\n`);
    else rmSync(out, { recursive: true, force: true });
  }

  const failed = results.filter((r) => !r.pass);
  process.stdout.write(`\n${failed.length ? "FAIL" : "PASS"}: ${results.length - failed.length}/${results.length} expectations hold\n`);
  return failed.length ? 1 : 0;
}

run(main);
