/**
 * Lets a node:test file import server modules that reach src/lib/media.ts.
 *
 * Under Next, a picture import (`import x from "./photo.jpg"`) becomes
 * { src, width, height, blurDataURL } and `import "server-only"` is a
 * build-time guard. Plain Node knows neither, so a test that imports
 * src/lib/media.ts (or anything built on it) would crash on the first .jpg.
 * Call installMediaStubs() before such an import:
 *
 *   import { installMediaStubs } from "./fixtures/media-stubs";
 *   installMediaStubs();
 *   const { collection } = await import("../src/lib/media");
 *
 * A stubbed picture has the shape Next gives it, with a recognisable URL
 * (/_next/static/media/<file name>) and no pixels.
 */
import * as nodeModule from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PICTURE = /\.(?:jpe?g|png|webp|avif|gif)$/i;

type Hooks = {
  resolve?: (specifier: string, context: unknown, next: (specifier: string, context?: unknown) => { url: string }) => unknown;
  load?: (url: string, context: unknown, next: (url: string, context?: unknown) => unknown) => unknown;
};

let installed = false;

export function installMediaStubs(): void {
  if (installed) return;
  installed = true;
  // registerHooks covers both `require` and `import`; it is newer than the Node typings in this project.
  const { registerHooks } = nodeModule as unknown as { registerHooks?: (hooks: Hooks) => void };
  if (typeof registerHooks !== "function") throw new Error("installMediaStubs() needs Node 22.15 or newer (module.registerHooks).");
  registerHooks({
    resolve(specifier, context, next) {
      if (specifier === "server-only") return { url: "cs-stub:server-only", shortCircuit: true };
      return next(specifier, context);
    },
    load(url, context, next) {
      if (url === "cs-stub:server-only") return { format: "commonjs", source: "", shortCircuit: true };
      if (url.startsWith("file:") && PICTURE.test(url)) {
        const name = path.basename(fileURLToPath(url));
        const data = { src: `/_next/static/media/${name}`, width: 1, height: 1, blurDataURL: "data:image/gif;base64,stub" };
        return { format: "commonjs", source: `module.exports = ${JSON.stringify(data)};`, shortCircuit: true };
      }
      return next(url, context);
    },
  });
}
