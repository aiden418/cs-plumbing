#!/usr/bin/env node
/**
 * Hero video build: makes the smaller, device-sized copies of the homepage clip.
 *
 *   public/videos/hero-loop.mp4            the original. Read, never written.
 *   public/videos/hero/<name>.<hash>.mp4   what this script writes
 *   public/videos/hero/variants.json       the list the site reads
 *
 *   npm run video:build                    build whatever is missing or out of date
 *   npm run video:build -- --force         re-encode everything
 *   npm run video:build -- --stills        only write the portrait review stills
 *   npm run video:build -- --check         verify the committed files (any computer, no encoding)
 *   npm run video:build -- --new-clip      hero-loop.mp4 was replaced on purpose: accept it and rebuild
 *   npm run video:build -- --portrait-center 0.58
 *                                          where the phone crop sits, 0 = left edge, 1 = right edge
 *
 * Building needs a Mac: it compiles scripts/video/herovideo.swift (Apple's own
 * video framework; no ffmpeg, nothing downloaded) into .next/cache/cs-tools and
 * runs it. The compiled tool is never committed.
 *
 * The original is checksummed before and after every run. A run that finds a
 * different clip stops unless --new-clip says the change is intended.
 *
 * Re-encoding gives the same picture but never the same bytes (each file
 * records when it was written), and every file name carries a hash of its
 * content, so a variant is only rebuilt when the clip or its recipe below
 * changes. Otherwise every run would rename all the files.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public", "videos", "hero-loop.mp4");
const SOURCE_URL = "/videos/hero-loop.mp4";
const OUT_DIR = path.join(ROOT, "public", "videos", "hero");
const OUT_URL = "/videos/hero";
const MANIFEST = path.join(OUT_DIR, "variants.json");
const TOOL_SOURCE = path.join(ROOT, "scripts", "video", "herovideo.swift");
const STILLS_DIR = path.join(os.tmpdir(), "cs-hero-video");
const CHECK_STILLS_DIR = path.join(STILLS_DIR, "encode-check");

// ───────────────────────────── settings ─────────────────────────────

/** The clip the first set of variants was made from. Once variants.json exists, the checksum recorded there is used. */
const SHIPPED_SOURCE_SHA256 = "4d0630826a9adb8a7ffca80fb0902d1eddf7a3a61df40b32ea11ecf6c1b61615";

/**
 * Where the 9:16 phone crop sits across the frame for the shipped clip.
 * Chosen from the review stills: 0.58 is the only one of the four candidates
 * that keeps the excavator (arm, cab and operator) in frame from the first
 * frame to the last, with two to four of the crew beside it. 0.46 and 0.50
 * lose the excavator; 0.54 cuts its cab off from about 3 s on.
 */
const SHIPPED_PORTRAIT_CENTER_X = 0.58;
const REVIEW_CENTERS = [0.46, 0.5, 0.54, 0.58];

const FPS = 30;

/**
 * How far apart keyframes (full pictures a player can start from) may be.
 *
 * "like-original" = no further apart than in the original, within 2 to 10
 * seconds. The shipped clip has keyframes at frames 0 and 250, so its copies get
 * exactly those two. Measured on that clip against a keyframe every 60 frames
 * (the tool's own default) at the same file size: the H.264 copies come out
 * 0.7-1.1 dB better and the 720p HEVC copy 1.7 dB better (34.6 against 32.9 dB),
 * because four extra keyframes take roughly a third of a file this small. With
 * the hardware encoders each of them also showed as a sharpen-then-soften
 * pulse, every 2 seconds. The clip plays from its first frame and replays from
 * its first frame, so nothing needs the extra starting points, and the
 * original has been served with this layout all along.
 *
 * Put a number here (for example 60) to force a fixed spacing instead.
 */
const KEYFRAME_SPACING = "like-original";
const KEYFRAME_SPACING_SECONDS = { min: 2, max: 10 };

/** Raise this when the encoder settings in herovideo.swift change in a way that should rebuild every variant. */
const RECIPE_VERSION = 1;

/**
 * bitrate  = the file's target in bits per second (the whole file, not just the picture data)
 * maxBytes = a hard ceiling; the build fails rather than ship a bigger file
 * control  = how the encoder is steered to that target:
 *   "bitrate" (default)  ask for a bit rate and correct it until the file lands just under the target
 *   "quality"            hold one quality level for the whole clip, and pick the highest level
 *                        whose file fits. Levels move in steps of roughly 15% of the file size,
 *                        so the file may end up to 5% over the target, or well under it.
 * encoder  = "auto" (default; the Mac's hardware encoder where there is one) or "software"
 *
 * Why the two formats are built differently (all measured on the shipped clip, same file size):
 *   H.264: the hardware encoder with a variable bit rate beats Apple's software H.264 encoder by
 *          1.7-2.4 dB, and its own average-bit-rate mode by 0.8-1.2 dB.
 *   HEVC:  the hardware encoder starts every clip soft (the first second is about 3 dB worse than
 *          the middle) and goes soft again in the push-in at the end. The software encoder held to
 *          a constant quality has neither problem: 0.3-0.4 dB better on average, 2.4 dB better on
 *          the worst frame and 3 dB better in the first half second, at about the same file size.
 *          Its bit-rate mode is no use here: it spends the bits early and starves the ending, and
 *          it labels the file with a tier/level pair ("H93") the HEVC standard does not define.
 *
 * Listed in the order the site should try them: smallest screen first, HEVC before H.264.
 */
const VARIANTS = [
  { name: "hero-portrait", codec: "hevc", audience: "portrait-phone", shape: "portrait", bitrate: 600_000, maxBytes: 800_000, control: "quality", encoder: "software" },
  { name: "hero-portrait", codec: "h264", audience: "portrait-phone", shape: "portrait", bitrate: 950_000, maxBytes: 1_250_000 },
  { name: "hero-mid", codec: "hevc", audience: "up-to-1023", shape: "full", width: 1280, bitrate: 700_000, control: "quality", encoder: "software" },
  { name: "hero-mid", codec: "h264", audience: "up-to-1023", shape: "full", width: 1280, bitrate: 1_100_000 },
  // No 1920-wide HEVC copy for desktop. Tried at about 1.3 Mbps (1.59 MB, 30%
  // smaller than the original): visibly softer than the original in the first
  // second and while the camera pushes in (PSNR 35.4 dB, SSIM 0.93 against it).
  // A re-encode at the original's own size still only reaches 37.3 dB, so there
  // is no size at which it is both as good and clearly smaller. Desktop keeps
  // the original file.
];

const AUDIENCES = ["portrait-phone", "up-to-1023", "desktop"];
/** A bit-rate encode is finished when it lands within this much under its target, never over. */
const UNDER_TARGET = 0.03;
/** A constant-quality encode may land this much over its target (never over maxBytes): its sizes come in steps. */
const QUALITY_OVER_TARGET = 0.05;
const MAX_ATTEMPTS = 7;
/** Quality levels closer together than this give the same file. */
const QUALITY_RESOLUTION = 0.004;
/** Below this the encode is not "a bit soft", it is broken (a wrong crop or wrong colours score around 20 dB). */
const MIN_SANE_PSNR = 26;

// ───────────────────────────── helpers ─────────────────────────────

class BuildError extends Error {}

function fail(message) {
  throw new BuildError(message);
}

function rel(file) {
  return path.relative(ROOT, file) || ".";
}

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function even(value) {
  return Math.round(value / 2) * 2;
}

function mb(bytes) {
  return `${(bytes / 1e6).toFixed(3)} MB`;
}

function mimeType(codec) {
  return `video/mp4; codecs="${codec}"`;
}

/** Names of the top-level boxes of an MP4 file, in file order. */
function topLevelBoxes(file) {
  const fd = fs.openSync(file, "r");
  try {
    const size = fs.fstatSync(fd).size;
    const header = Buffer.alloc(16);
    const boxes = [];
    let offset = 0;
    while (offset + 8 <= size) {
      const read = fs.readSync(fd, header, 0, 16, offset);
      if (read < 8) break;
      let length = header.readUInt32BE(0);
      const type = header.toString("latin1", 4, 8);
      if (length === 1) {
        if (read < 16) break;
        length = Number(header.readBigUInt64BE(8));
      } else if (length === 0) {
        length = size - offset;
      }
      if (length < 8 || offset + length > size) fail(`${rel(file)} is not a well-formed MP4 file (box "${type}" at byte ${offset}).`);
      boxes.push(type);
      offset += length;
    }
    return boxes;
  } finally {
    fs.closeSync(fd);
  }
}

function isFastStart(boxes) {
  const moov = boxes.indexOf("moov");
  const mdat = boxes.indexOf("mdat");
  return moov !== -1 && mdat !== -1 && moov < mdat;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return null;
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch (error) {
    fail(`${rel(MANIFEST)} is not valid JSON (${error.message}). Fix or delete it and run the build again.`);
  }
  if (!Array.isArray(entries)) fail(`${rel(MANIFEST)} should be a list of video files.`);
  return entries;
}

/** A manifest entry's file on disk ("/videos/hero/x.mp4" → public/videos/hero/x.mp4). */
function diskPath(entry) {
  const videos = path.join(ROOT, "public", "videos");
  const file = typeof entry.file === "string" ? path.join(ROOT, "public", ...entry.file.split("/")) : "";
  if (!file.startsWith(videos + path.sep)) fail(`${rel(MANIFEST)}: "${entry.file}" is not a /videos/ path.`);
  return file;
}

function parseArgs(argv) {
  const options = { force: false, stills: false, check: false, newClip: false, portraitCenter: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") options.force = true;
    else if (arg === "--stills") options.stills = true;
    else if (arg === "--check") options.check = true;
    else if (arg === "--new-clip") options.newClip = true;
    else if (arg === "--portrait-center") {
      const value = Number(argv[(i += 1)]);
      if (!Number.isFinite(value) || value < 0 || value > 1) fail("--portrait-center needs a number between 0 and 1, for example 0.58.");
      options.portraitCenter = value;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      fail(`Unknown option ${arg}. Options: --force, --stills, --check, --new-clip, --portrait-center <0-1>.`);
    }
  }
  return options;
}

// ───────────────────────────── the encoder tool ─────────────────────────────

function compileTool() {
  if (process.platform !== "darwin") {
    fail("Building the hero videos needs a Mac (it uses the video encoder built into macOS).\nOn any computer, `npm run video:build -- --check` verifies the committed files.");
  }
  const arch = process.arch === "arm64" ? "arm64" : "x86_64";
  const flags = ["-O", "-swift-version", "5", "-target", `${arch}-apple-macos14`];
  const fingerprint = createHash("sha256").update(fs.readFileSync(TOOL_SOURCE)).update(flags.join(" ")).digest("hex").slice(0, 12);

  let cacheDir = path.join(ROOT, ".next", "cache", "cs-tools");
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
  } catch {
    cacheDir = path.join(os.tmpdir(), "cs-tools");
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  const binary = path.join(cacheDir, `herovideo-${fingerprint}`);
  if (fs.existsSync(binary)) return binary;

  console.log("Compiling the video tool (first run, or herovideo.swift changed)…");
  let sdk;
  try {
    sdk = execFileSync("xcrun", ["--show-sdk-path"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    fail("Apple's Command Line Tools are missing. Install them with `xcode-select --install`, then run this again.");
  }
  const scratch = `${binary}.building-${process.pid}`;
  try {
    execFileSync("xcrun", ["swiftc", ...flags, "-sdk", sdk, TOOL_SOURCE, "-o", scratch], { stdio: ["ignore", "inherit", "inherit"] });
  } catch {
    fs.rmSync(scratch, { force: true });
    fail(`Could not compile ${rel(TOOL_SOURCE)} (the compiler's message is above).`);
  }
  fs.renameSync(scratch, binary);
  for (const name of fs.readdirSync(cacheDir)) {
    if (/^herovideo-[0-9a-f]{12}$/.test(name) && name !== path.basename(binary)) fs.rmSync(path.join(cacheDir, name), { force: true });
  }
  return binary;
}

function makeRunner(binary) {
  return function run(args) {
    try {
      return JSON.parse(execFileSync(binary, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 }));
    } catch (error) {
      const detail = String(error.stderr || error.message).trim();
      fail(`The video tool failed on "${args[0]}": ${detail}`);
    }
  };
}

// ───────────────────────────── geometry ─────────────────────────────

/** Output size and crop for one variant, from the source's own dimensions. */
function geometryFor(variant, source, portraitCenter) {
  if (variant.shape === "portrait") {
    // A 9:16 cut from the full height, at the source's own resolution (1080 tall at most).
    const height = even(Math.min(source.height, 1080));
    const width = even((height * 9) / 16);
    const cropHeight = source.height;
    const cropWidth = even((cropHeight * width) / height);
    if (cropWidth > source.width) fail(`The clip (${source.width}x${source.height}) is too narrow for a 9:16 phone crop.`);
    const x = Math.min(source.width - cropWidth, Math.max(0, even(portraitCenter * source.width - cropWidth / 2)));
    return { width, height, crop: [x, 0, cropWidth, cropHeight], cropCenterX: portraitCenter };
  }
  const width = even(Math.min(variant.width, source.width));
  const height = even((width * source.height) / source.width);
  return { width, height, crop: null, cropCenterX: null };
}

/** The most output frames allowed between two keyframes (see KEYFRAME_SPACING). */
function keyframeIntervalFor(sourceProbe) {
  if (typeof KEYFRAME_SPACING === "number") return KEYFRAME_SPACING;
  const { keyframes, frameCount, frameRate } = sourceProbe.video;
  let gap = keyframes.length > 1 ? 0 : frameCount;
  for (let index = 1; index < keyframes.length; index += 1) gap = Math.max(gap, keyframes[index] - keyframes[index - 1]);
  const seconds = Math.min(KEYFRAME_SPACING_SECONDS.max, Math.max(KEYFRAME_SPACING_SECONDS.min, gap / Number(frameRate)));
  return Math.round(seconds * FPS);
}

/** A short fingerprint of everything that decides what one variant looks like. Same fingerprint = nothing to rebuild. */
function recipeFor(variant, geometry, source) {
  const inputs = {
    version: RECIPE_VERSION,
    source: source.sha256,
    codec: variant.codec,
    width: geometry.width,
    height: geometry.height,
    crop: geometry.crop,
    bitrate: variant.bitrate,
    maxBytes: variant.maxBytes ?? null,
    fps: FPS,
    keyint: source.keyframeInterval,
  };
  // Only named when they differ from the defaults, so adding these options did not rename the H.264 files.
  if (variant.control === "quality") inputs.control = "quality";
  if (variant.encoder && variant.encoder !== "auto") inputs.encoder = variant.encoder;
  return createHash("sha256").update(JSON.stringify(inputs)).digest("hex").slice(0, 12);
}

// ───────────────────────────── review stills ─────────────────────────────

function reviewTimes(duration) {
  const times = [0, duration * 0.33, duration * 0.66, duration - 0.1];
  return [...new Set(times.map((t) => Math.max(0, Math.round(t * 10) / 10)))];
}

/** Stills of each candidate phone crop at four moments, for a person to look at. */
function writeReviewStills(run, source, chosenCenter) {
  const dir = path.join(STILLS_DIR, "portrait-review");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const centers = [...new Set([...REVIEW_CENTERS, chosenCenter])].sort((a, b) => a - b);
  const portrait = VARIANTS.find((variant) => variant.shape === "portrait");
  for (const time of reviewTimes(source.durationSeconds)) {
    run(["frame", SOURCE, "--time", String(time), "--out", path.join(dir, `full-frame-t${time.toFixed(1)}.png`)]);
    for (const center of centers) {
      const { crop } = geometryFor(portrait, source, center);
      const name = `center-${center.toFixed(2)}-t${time.toFixed(1)}.png`;
      run(["frame", SOURCE, "--time", String(time), "--crop", crop.join(","), "--out", path.join(dir, name)]);
    }
  }
  console.log(`Portrait review stills (centres ${centers.map((c) => c.toFixed(2)).join(", ")}; in use: ${chosenCenter.toFixed(2)}):\n  ${dir}`);
  return dir;
}

/** The encode and the matching piece of the original, as stills, at 1 s and 6 s. */
function writeCheckStills(run, file, label, geometry, source) {
  const dir = CHECK_STILLS_DIR;
  fs.mkdirSync(dir, { recursive: true });
  const size = `${geometry.width}x${geometry.height}`;
  for (const time of [1, 6].filter((t) => t < source.durationSeconds)) {
    run(["frame", file, "--time", String(time), "--out", path.join(dir, `${label}-t${time}-encode.png`)]);
    const original = ["frame", SOURCE, "--time", String(time), "--size", size, "--out", path.join(dir, `${label}-t${time}-original.png`)];
    if (geometry.crop) original.push("--crop", geometry.crop.join(","));
    run(original);
  }
  return dir;
}

// ───────────────────────────── encoding ─────────────────────────────

/**
 * Encodes one variant to its size target, trying again with a corrected request
 * until the file lands in the accepted range, and returns the biggest attempt
 * that fits.
 */
function encodeToBudget(run, variant, geometry, source, workDir) {
  const label = `${variant.name}.${variant.codec}`;
  const target = (variant.bitrate * source.durationSeconds) / 8;
  const ceiling = variant.maxBytes ?? Infinity;
  const byQuality = variant.control === "quality";
  const limit = Math.floor(Math.min(byQuality ? target * (1 + QUALITY_OVER_TARGET) : target, ceiling));
  const floor = Math.min(target, limit) * (1 - UNDER_TARGET);
  const aim = (limit + floor) / 2;

  // What to ask the encoder for: a bit rate that gets corrected in proportion, or a quality level found by halving.
  let request = byQuality ? 0.5 : (aim * 8) / source.durationSeconds;
  let low = 0.05;
  let high = 0.95;
  const describe = () => (byQuality ? `q${request.toFixed(3)}` : `${Math.round(request / 1000)}k`);

  let best = null;
  const trail = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS + (byQuality ? 2 : 0); attempt += 1) {
    const out = path.join(workDir, `${label}.try${attempt}.mp4`);
    const args = ["encode", SOURCE, out, "--codec", variant.codec];
    // "auto" = the encoder's variable-bit-rate mode where it has one (macOS 26+ hardware encoders), else an average.
    args.push(...(byQuality ? ["--quality", request.toFixed(3)] : ["--bitrate", String(Math.round(request)), "--rate-control", "auto"]));
    args.push("--size", `${geometry.width}x${geometry.height}`, "--fps", String(FPS), "--keyint", String(source.keyframeInterval));
    if (variant.encoder && variant.encoder !== "auto") args.push("--encoder", variant.encoder);
    if (geometry.crop) args.push("--crop", geometry.crop.join(","));
    const result = run(args);
    trail.push(`${describe()}→${mb(result.bytes)}`);
    const fits = result.bytes <= limit;
    if (fits && (!best || result.bytes > best.result.bytes)) {
      if (best) fs.rmSync(best.out, { force: true });
      best = { out, result };
    } else {
      fs.rmSync(out, { force: true });
    }
    if (fits && result.bytes >= floor) break;
    if (byQuality) {
      if (fits) low = request;
      else high = request;
      if (high - low < QUALITY_RESOLUTION) break;
      request = (low + high) / 2;
    } else {
      request *= aim / result.bytes;
    }
  }
  if (!best) fail(`${label}: could not get under ${mb(limit)} (${trail.join(", ")}).`);
  if (best.result.bytes < floor) {
    const why = byQuality ? "the next quality step up does not fit" : `the encoder would not come closer in ${trail.length} attempts`;
    console.log(`  note: ${label} is ${((1 - best.result.bytes / target) * 100).toFixed(1)}% under its target; ${why} (${trail.join(", ")}).`);
  }
  return { ...best, trail };
}

/** Everything a finished file must be. Throws with the reason if it is not. */
function verifyEncode(run, file, variant, geometry, source) {
  const label = `${variant.name}.${variant.codec}`;
  const probe = run(["probe", file]);
  const video = probe.video;
  const expectedFrames = Math.round(source.durationSeconds * FPS);
  const expectedTag = variant.codec === "hevc" ? "hvc1" : "avc1";
  const problems = [];
  if (!probe.fastStart) problems.push(`not fast-start (boxes: ${probe.topLevelBoxes.join(", ")})`);
  if (probe.audioTracks !== 0) problems.push("has an audio track");
  if (video.width !== geometry.width || video.height !== geometry.height) problems.push(`is ${video.width}x${video.height}`);
  if (video.fourcc !== expectedTag) problems.push(`is tagged ${video.fourcc}, expected ${expectedTag}`);
  if (!video.codec) problems.push("has no readable codec string");
  if (video.frameCount !== expectedFrames) problems.push(`has ${video.frameCount} frames, expected ${expectedFrames}`);
  if (Math.abs(Number(probe.durationSeconds) - source.durationSeconds) > 1 / FPS) problems.push(`runs ${probe.durationSeconds} s`);
  if (Math.abs(Number(video.frameRate) - FPS) > 0.01) problems.push(`is ${video.frameRate} fps`);
  const keyframes = video.keyframes;
  const gaps = keyframes.map((frame, index) => (index === 0 ? frame : frame - keyframes[index - 1]));
  if (keyframes[0] !== 0 || Math.max(...gaps, expectedFrames - keyframes[keyframes.length - 1]) > source.keyframeInterval) {
    problems.push(`keyframes at ${keyframes.join("/")} (more than ${source.keyframeInterval} frames apart)`);
  }
  if (problems.length > 0) fail(`${label}: the encode ${problems.join("; ")}.`);

  const compareArgs = ["compare", SOURCE, file, "--fps", String(FPS)];
  if (geometry.crop) compareArgs.push("--crop", geometry.crop.join(","));
  const quality = run(compareArgs);
  if (Number(quality.psnrY.mean) < MIN_SANE_PSNR) {
    fail(`${label}: the encode does not match the original (PSNR ${quality.psnrY.mean} dB). Wrong crop or colours?`);
  }
  return { probe, quality };
}

// ───────────────────────────── --check ─────────────────────────────

/** Verifies the committed files against variants.json. Plain Node: runs on any OS. */
function check() {
  const entries = readManifest();
  if (!entries) fail(`${rel(MANIFEST)} is missing. Run \`npm run video:build\` on a Mac.`);
  const problems = [];
  const listed = new Set();
  const originals = entries.filter((entry) => entry.original === true);
  if (originals.length !== 1) problems.push(`expected exactly one entry marked "original", found ${originals.length}`);
  for (const entry of entries) {
    const label = entry.file;
    const file = diskPath(entry);
    listed.add(path.resolve(file));
    if (!AUDIENCES.includes(entry.audience)) problems.push(`${label}: unknown audience "${entry.audience}"`);
    if (entry.type !== mimeType(entry.codec)) problems.push(`${label}: "type" does not match "codec"`);
    if (!fs.existsSync(file)) {
      problems.push(`${label}: file is missing`);
      continue;
    }
    const bytes = fs.statSync(file).size;
    if (bytes !== entry.bytes) problems.push(`${label}: is ${bytes} bytes, variants.json says ${entry.bytes}`);
    const hash = sha256(file);
    if (hash !== entry.sha256) problems.push(`${label}: content does not match its recorded checksum`);
    if (!isFastStart(topLevelBoxes(file))) problems.push(`${label}: is not fast-start (moov must come before mdat)`);
    if (entry.original === true) {
      if (path.resolve(file) !== path.resolve(SOURCE)) problems.push(`${label}: the original should be ${SOURCE_URL}`);
      continue;
    }
    const match = /^(hero-[a-z]+)\.(h264|hevc)\.([0-9a-f]{8})\.mp4$/.exec(path.basename(file));
    if (!match) {
      problems.push(`${label}: unexpected file name`);
      continue;
    }
    if (match[3] !== hash.slice(0, 8)) problems.push(`${label}: the hash in the name is not the file's own`);
    const planned = VARIANTS.find((variant) => variant.name === match[1] && variant.codec === match[2]);
    if (!planned) problems.push(`${label}: not one of the variants this script builds`);
    else if (planned.maxBytes && bytes > planned.maxBytes) problems.push(`${label}: ${mb(bytes)} is over the ${mb(planned.maxBytes)} limit`);
  }
  for (const variant of VARIANTS) {
    const found = entries.some((entry) => path.basename(entry.file).startsWith(`${variant.name}.${variant.codec}.`));
    if (!found) problems.push(`${variant.name}.${variant.codec}: missing from variants.json`);
  }
  for (const name of fs.readdirSync(OUT_DIR)) {
    const file = path.resolve(OUT_DIR, name);
    if (name === path.basename(MANIFEST) || name.startsWith(".") || listed.has(file)) continue;
    problems.push(`${rel(file)}: not listed in variants.json`);
  }
  if (problems.length > 0) {
    fail(`Hero video check failed:\n${problems.map((problem) => `  ✗ ${problem}`).join("\n")}`);
  }
  console.log(`✓ ${entries.length} hero video files match ${rel(MANIFEST)} (sizes, checksums, fast-start, limits).`);
}

// ───────────────────────────── build ─────────────────────────────

function build(options) {
  if (!fs.existsSync(SOURCE)) fail(`${rel(SOURCE)} is missing. Put the clip there and run this again.`);
  const sourceSha = sha256(SOURCE);
  const manifest = readManifest() ?? [];
  const recorded = manifest.find((entry) => entry.original === true);
  const expectedSha = recorded?.sha256 ?? SHIPPED_SOURCE_SHA256;
  const sameClip = sourceSha === expectedSha;
  if (!sameClip && !options.newClip) {
    fail(
      [
        `${rel(SOURCE)} is not the clip the current videos were made from.`,
        `  expected ${expectedSha}`,
        `  found    ${sourceSha}`,
        "This build never changes that file, so something else did.",
        "  • Replaced it on purpose? Run: npm run video:build -- --new-clip",
        `  • Otherwise restore it: git checkout -- ${rel(SOURCE)}`,
      ].join("\n"),
    );
  }
  console.log(`Original: ${rel(SOURCE)}  sha256 ${sourceSha}${sameClip ? "  (matches the record)" : "  (new clip accepted)"}`);

  const run = makeRunner(compileTool());
  const sourceProbe = run(["probe", SOURCE]);
  const source = {
    sha256: sourceSha,
    width: sourceProbe.video.width,
    height: sourceProbe.video.height,
    durationSeconds: Number(sourceProbe.durationSeconds),
    codec: sourceProbe.video.codec,
    bytes: sourceProbe.bytes,
    keyframeInterval: keyframeIntervalFor(sourceProbe),
  };
  if (!source.codec || !source.codec.startsWith("avc1.")) fail(`${rel(SOURCE)} should be an H.264 MP4 (found ${sourceProbe.video.fourcc}).`);
  if (!sourceProbe.fastStart) console.log("  note: the original is not fast-start; browsers must download all of it before it plays.");
  console.log(`  ${source.width}x${source.height}, ${sourceProbe.video.frameRate} fps, ${source.durationSeconds} s, ${source.codec}, ${mb(source.bytes)}`);
  console.log(`  keyframes at frames ${sourceProbe.video.keyframes.join(", ")}; the copies get one at least every ${source.keyframeInterval} frames`);

  // Phone crop: a flag wins, then what was used last time for this clip, then the shipped choice.
  const recordedCenter = sameClip ? manifest.find((entry) => typeof entry.cropCenterX === "number")?.cropCenterX : undefined;
  const shippedCenter = sourceSha === SHIPPED_SOURCE_SHA256 ? SHIPPED_PORTRAIT_CENTER_X : 0.5;
  const portraitCenter = options.portraitCenter ?? recordedCenter ?? shippedCenter;
  if (!sameClip && options.portraitCenter === null && sourceSha !== SHIPPED_SOURCE_SHA256) {
    console.log("  note: new clip, so the phone crop starts in the middle (0.50). Look at the review stills and rerun with --portrait-center if the subject is cut off.");
  }

  const assertOriginalUntouched = () => {
    const after = sha256(SOURCE);
    if (after !== sourceSha) fail(`${rel(SOURCE)} changed while the build ran (now ${after}). Restore it: git checkout -- ${rel(SOURCE)}`);
  };

  const stillsDir = writeReviewStills(run, source, portraitCenter);
  if (options.stills) {
    assertOriginalUntouched();
    return;
  }

  // Stills from an earlier run (perhaps of another clip) would only mislead.
  fs.rmSync(CHECK_STILLS_DIR, { recursive: true, force: true });
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "cs-hero-encode-"));
  const rows = [];
  const entries = [];
  const finished = [];
  let checkDir = null;
  try {
    for (const variant of VARIANTS) {
      const label = `${variant.name}.${variant.codec}`;
      const geometry = geometryFor(variant, source, portraitCenter);
      const recipe = recipeFor(variant, geometry, source);
      const previous = manifest.find((entry) => entry.recipe === recipe);
      if (previous && !options.force && fs.existsSync(diskPath(previous)) && sha256(diskPath(previous)) === previous.sha256) {
        entries.push({ ...previous, audience: variant.audience });
        rows.push([label, `${previous.width}x${previous.height}`, mb(previous.bytes), previous.codec, "up to date"]);
        continue;
      }

      console.log(`Encoding ${label} (${geometry.width}x${geometry.height}, about ${(variant.bitrate / 1e6).toFixed(2)} Mbps)…`);
      const kept = encodeToBudget(run, variant, geometry, source, workDir);
      const { probe, quality } = verifyEncode(run, kept.out, variant, geometry, source);
      checkDir = writeCheckStills(run, kept.out, label, geometry, source);

      const hash = sha256(kept.out);
      const fileName = `${label}.${hash.slice(0, 8)}.mp4`;
      finished.push({ from: kept.out, to: path.join(OUT_DIR, fileName), hash });

      const entry = {
        file: `${OUT_URL}/${fileName}`,
        audience: variant.audience,
        width: geometry.width,
        height: geometry.height,
        codec: probe.video.codec,
        type: mimeType(probe.video.codec),
        bytes: probe.bytes,
        sha256: hash,
        durationSeconds: Number(probe.durationSeconds),
        ...(geometry.cropCenterX === null ? {} : { cropCenterX: geometry.cropCenterX }),
        recipe,
      };
      entries.push(entry);
      const steering = kept.result.rateControl === "quality" ? `constant quality ${kept.result.requestedQuality}` : `${kept.result.rateControl} bit rate`;
      const encoder = `${kept.result.encoder.name}, ${steering}`;
      const scores = `PSNR ${Number(quality.psnrY.mean).toFixed(1)} dB (lowest frame ${Number(quality.psnrY.min).toFixed(1)}), SSIM ${Number(quality.ssimY.mean).toFixed(3)}`;
      rows.push([label, `${entry.width}x${entry.height}`, mb(entry.bytes), entry.codec, `${encoder}; ${scores}; ${kept.trail.length} attempt(s)`]);
    }

    entries.push({
      file: SOURCE_URL,
      audience: "desktop",
      width: source.width,
      height: source.height,
      codec: source.codec,
      type: mimeType(source.codec),
      bytes: source.bytes,
      sha256: sourceSha,
      durationSeconds: source.durationSeconds,
      original: true,
    });
    rows.push(["original (desktop)", `${source.width}x${source.height}`, mb(source.bytes), source.codec, "not re-encoded"]);

    // Nothing in public/ is touched until every variant has been encoded and verified.
    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const { from, to, hash } of finished) {
      fs.copyFileSync(from, to);
      if (sha256(to) !== hash) fail(`${rel(to)} was not copied intact.`);
    }
    // Out with the files that are no longer listed, then the list itself.
    const keep = new Set(entries.map((entry) => path.basename(entry.file)));
    for (const name of fs.readdirSync(OUT_DIR)) {
      if (/^hero-[a-z]+\.(h264|hevc)\.[0-9a-f]{8}\.mp4$/.test(name) && !keep.has(name)) {
        fs.rmSync(path.join(OUT_DIR, name));
        console.log(`  removed ${rel(path.join(OUT_DIR, name))} (replaced)`);
      }
    }
    const json = `${JSON.stringify(entries, null, 2)}\n`;
    if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== json) fs.writeFileSync(MANIFEST, json);
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  assertOriginalUntouched();

  const widths = rows[0].map((_, column) => Math.max(...rows.map((row) => row[column].length)));
  console.log("");
  for (const row of rows) console.log(`  ${row.map((cell, column) => (column === row.length - 1 ? cell : cell.padEnd(widths[column]))).join("  ")}`);
  console.log(`\n✓ ${rel(MANIFEST)} lists ${entries.length} files. The original is unchanged (sha256 ${sourceSha.slice(0, 12)}…).`);
  if (checkDir) console.log(`Stills of each new encode beside the original, at 1 s and 6 s:\n  ${checkDir}`);
  console.log(`Portrait review stills:\n  ${stillsDir}`);
  check();
}

// ───────────────────────────── main ─────────────────────────────

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log("Usage: node scripts/build-hero-video.mjs [--force] [--stills] [--check] [--new-clip] [--portrait-center <0-1>]");
  } else if (options.check) {
    check();
  } else {
    build(options);
  }
} catch (error) {
  if (!(error instanceof BuildError)) throw error;
  console.error(`\n✗ ${error.message}`);
  process.exit(1);
}
