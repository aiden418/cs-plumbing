#!/usr/bin/env node
/**
 * Builds the builder-door PDFs from their web pages with headless Chrome:
 *
 *   /builders/capability-statement → public/downloads/cs-plumbing-capability-statement.pdf
 *   /builders/prequal-packet        → public/downloads/cs-plumbing-prequal-packet.pdf
 *
 * The pages read src/lib/builder-program.ts, so the PDFs can't drift from
 * the site. Start the app first (npm run dev, or npm run build && npm start),
 * then:
 *
 *   npm run builders:pdf                       # against http://localhost:3000
 *   npm run builders:pdf -- http://localhost:3001
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:3000";

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));

if (!CHROME) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}

const DOCS = [
  ["/builders/capability-statement", "cs-plumbing-capability-statement.pdf"],
  ["/builders/prequal-packet", "cs-plumbing-prequal-packet.pdf"],
];

for (const [route, file] of DOCS) {
  const out = path.join(ROOT, "public", "downloads", file);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${out}`,
      `${BASE}${route}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  console.log(`✓ ${route} → public/downloads/${file}`);
}
