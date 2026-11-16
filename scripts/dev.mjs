#!/usr/bin/env node
/**
 * `npm run dev`: the Next dev server plus a watcher that keeps the image
 * manifest fresh.
 *
 * Drop a photo into public/images, replace one under the same name, or edit
 * an images.json or src/content/media.json: the manifest
 * (scripts/build-image-manifest.mjs) is rebuilt a moment later and the change
 * shows on the next page refresh. No restart, no page code.
 *
 *   npm run dev                 # http://localhost:3000
 *   npm run dev -- -p 3005      # every argument goes straight to `next dev`
 *
 * The wrapper is transparent: it passes arguments through, forwards
 * Ctrl+C / termination to the server, and exits with the server's own code.
 * The manifest runs in its own short-lived process, so a problem with one
 * photo can never take the dev server down with it.
 */

import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "scripts", "build-image-manifest.mjs");
const IMAGES = path.join(ROOT, "public", "images");
const CONTENT = path.join(ROOT, "src", "content");
const DEBOUNCE_MS = 250;

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

/* --------------------------------------------------------------- manifest */

let running = false;
let again = false;

/**
 * Rebuild the manifest. Changes that arrive while it runs trigger exactly one
 * more run afterwards. Problems are printed by the manifest itself (one line
 * each); this only adds a note when something on the site really changed.
 */
function rebuild(reason) {
  if (running) {
    again = true;
    return Promise.resolve();
  }
  running = true;
  return new Promise((resolve) => {
    let out = "";
    let settled = false;
    const done = (code) => {
      if (settled) return;
      settled = true;
      running = false;
      if (reason && code === 0) {
        try {
          const outcome = JSON.parse(out.trim().split("\n").pop() ?? "{}");
          if (outcome.changed?.length > 0) console.log(`image manifest: picked up ${reason}; refresh the page to see it.`);
        } catch {
          /* no note is better than a wrong one */
        }
      }
      if (again) {
        again = false;
        resolve(rebuild(reason));
      } else {
        resolve();
      }
    };
    const child = spawn(process.execPath, [MANIFEST, "--json"], { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] });
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.on("error", (err) => {
      console.error(`image manifest: could not start (${err.message}).`);
      done(1);
    });
    child.on("close", (code) => done(code ?? 1));
  });
}

let timer = null;
let pending = null;
function schedule(what) {
  pending = what;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const reason = pending;
    pending = null;
    void rebuild(reason);
  }, DEBOUNCE_MS);
}

/* ---------------------------------------------------------------- watchers */

const watchers = [];
function watchImages() {
  if (!existsSync(IMAGES)) return;
  try {
    watchers.push(
      watch(IMAGES, { recursive: true }, (_event, file) => {
        const name = file ? String(file).split(path.sep).join("/") : "";
        // Finder and editor droppings (.DS_Store, .photo.jpg.swp) are not photos.
        if (name.split("/").some((part) => part.startsWith("."))) return;
        schedule(name ? `the change to public/images/${name}` : "a change in public/images");
      }),
    );
  } catch (err) {
    console.error(`image manifest: cannot watch public/images (${err.message}); run \`npm run images:manifest\` after adding photos.`);
  }
}
function watchSettings() {
  if (!existsSync(CONTENT)) return;
  try {
    // The folder, not the file: editors save by replacing the file, which a watch on the file itself loses.
    watchers.push(
      watch(CONTENT, (_event, file) => {
        if (String(file ?? "") === "media.json") schedule("the change to src/content/media.json");
      }),
    );
  } catch {
    /* settings changes then need a restart; photos still work */
  }
}

/* ------------------------------------------------------------------ server */

await rebuild(null);
watchImages();
watchSettings();

const server = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], { cwd: ROOT, stdio: "inherit" });

const SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP"];
const forward = (signal) => {
  if (server.exitCode === null && server.signalCode === null) server.kill(signal);
};
for (const signal of SIGNALS) process.on(signal, () => forward(signal));

server.on("error", (err) => {
  console.error(`Could not start the Next dev server: ${err.message}`);
  process.exit(1);
});
server.on("exit", (code, signal) => {
  clearTimeout(timer);
  for (const w of watchers) w.close();
  if (signal) {
    // End the same way the server did, so the shell and npm see the real outcome.
    for (const s of SIGNALS) process.removeAllListeners(s);
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
