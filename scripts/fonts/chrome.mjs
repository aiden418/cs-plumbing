/**
 * Minimal headless-Chrome driver for the font scripts in this folder.
 * No dependencies: Chrome's DevTools protocol over Node's built-in WebSocket
 * (Node 22+), with a throwaway profile that is deleted afterwards.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));

/** Ad and analytics hosts that must never be contacted from a test browser. */
export const BLOCKED_URLS = [
  "*facebook.net*",
  "*facebook.com*",
  "*openai.com*",
  "*googletagmanager.com*",
  "*google-analytics.com*",
  "*doubleclick.net*",
  "*googleadservices.com*",
];

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts Chrome, hands `run` a browser object, and always shuts Chrome down
 * and removes its profile.
 *
 *   await withChrome(async (browser) => {
 *     const page = await browser.newPage();
 *     await page.send("Page.navigate", { url });
 *     const value = await page.evaluate("document.title");
 *   });
 */
export async function withChrome(run) {
  if (!CHROME) throw new Error("Chrome not found. Set CHROME_PATH.");
  const profile = mkdtempSync(path.join(os.tmpdir(), "cs-fonts-chrome-"));
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-sync",
      "--mute-audio",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let socket;
  try {
    const portFile = path.join(profile, "DevToolsActivePort");
    const started = Date.now();
    while (!existsSync(portFile) || readFileSync(portFile, "utf8").split("\n").length < 2) {
      if (Date.now() - started > 20000) throw new Error("Chrome did not open its DevTools port.");
      await sleep(50);
    }
    const [port, wsPath] = readFileSync(portFile, "utf8").trim().split("\n");
    socket = new WebSocket(`ws://127.0.0.1:${port}${wsPath}`);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("Could not connect to Chrome.")), { once: true });
    });

    let nextId = 1;
    const pending = new Map();
    const sessions = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const waiter = pending.get(message.id);
        if (!waiter) return;
        pending.delete(message.id);
        if (message.error) waiter.reject(new Error(`${waiter.method}: ${message.error.message}`));
        else waiter.resolve(message.result);
        return;
      }
      const listeners = sessions.get(message.sessionId)?.get(message.method);
      if (listeners) for (const listener of [...listeners]) listener(message.params);
    });
    const sendRaw = (method, params = {}, sessionId) =>
      new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject, method });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });

    const browser = {
      version: (await sendRaw("Browser.getVersion")).product,
      async newPage() {
        const { targetId } = await sendRaw("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await sendRaw("Target.attachToTarget", { targetId, flatten: true });
        const listeners = new Map();
        sessions.set(sessionId, listeners);
        const page = {
          send: (method, params) => sendRaw(method, params, sessionId),
          /** Subscribe to a protocol event; returns the unsubscribe function. */
          on(method, listener) {
            if (!listeners.has(method)) listeners.set(method, new Set());
            listeners.get(method).add(listener);
            return () => listeners.get(method).delete(listener);
          },
          /** Evaluate an expression in the page (promises are awaited) and return its JSON value. */
          async evaluate(expression) {
            const result = await page.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
            if (result.exceptionDetails) {
              const details = result.exceptionDetails;
              throw new Error(`In page: ${details.exception?.description ?? details.text}`);
            }
            return result.result.value;
          },
          async close() {
            sessions.delete(sessionId);
            await sendRaw("Target.closeTarget", { targetId }).catch(() => {});
          },
        };
        await page.send("Page.enable");
        await page.send("Runtime.enable");
        await page.send("Network.enable");
        await page.send("DOM.enable");
        await page.send("CSS.enable");
        await page.send("Network.setBlockedURLs", { urls: BLOCKED_URLS });
        return page;
      },
    };
    return await run(browser);
  } finally {
    try {
      socket?.close();
    } catch {
      // already closed
    }
    chrome.kill("SIGKILL");
    await sleep(250);
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

/** The fonts Chrome really drew an element's text with: [{ family, postScriptName, webFont, glyphs }]. */
export async function renderedFonts(page, selector) {
  const { root } = await page.send("DOM.getDocument", { depth: 0 });
  const { nodeId } = await page.send("DOM.querySelector", { nodeId: root.nodeId, selector });
  if (!nodeId) return [];
  const { nodeIds } = await page.send("DOM.querySelectorAll", { nodeId, selector: "*" });
  const totals = new Map();
  for (const id of [nodeId, ...nodeIds]) {
    const { fonts } = await page.send("CSS.getPlatformFontsForNode", { nodeId: id }).catch(() => ({ fonts: [] }));
    for (const font of fonts) {
      const key = `${font.familyName}|${font.postScriptName}|${font.isCustomFont}`;
      totals.set(key, (totals.get(key) ?? 0) + font.glyphCount);
    }
  }
  return [...totals].map(([key, glyphs]) => {
    const [family, postScriptName, webFont] = key.split("|");
    return { family, postScriptName, webFont: webFont === "true", glyphs };
  });
}
