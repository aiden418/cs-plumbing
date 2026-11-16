#!/usr/bin/env node
/**
 * Superseded by scripts/check-images.mjs.
 *
 * That script checks the same thing this one did (every "/images/..." path
 * written in src/ must exist in public/) and adds the fixed slots, the EXIF
 * privacy gate and unsupported file types. This file is kept so an older
 * `npm run photos:check` line keeps working: it forwards every argument.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = path.join(path.dirname(fileURLToPath(import.meta.url)), "check-images.mjs");
const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);
