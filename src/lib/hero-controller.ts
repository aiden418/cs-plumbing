/**
 * The hero film: which file a device gets, whether it may play at all, and
 * the small state machine that runs it. No DOM, no React: HeroController
 * (client) feeds it what it reads from the browser and the <video>, and acts
 * on the state it returns.
 *
 * The still photograph is always painted first (it is the page's LCP
 * element). The film is only ever an addition on top of it:
 *
 *   idle ─START→ loading (on screen, tab visible) | waiting (otherwise)
 *   idle ─PREF_OFF→ paused-user              (the visitor paused it earlier)
 *   waiting ─VISIBLE→ loading
 *   loading ─FIRST_FRAME→ playing ─HIDDEN→ paused-auto ─VISIBLE→ playing
 *   loading|playing|paused-auto|waiting ─USER_PAUSE→ paused-user ─USER_PLAY→ loading
 *   loading ─BLOCKED→ blocked ─USER_PLAY→ loading
 *   loading|playing ─ERROR→ loading (next file) | failed;  loading ─TIMEOUT→ failed
 */

/** Which cut of the film a viewport gets (public/videos/hero/variants.json "audience"). */
export type HeroAudience = "portrait-phone" | "up-to-1023" | "desktop";

/** One playable file, in the order it should be tried. */
export type HeroSource = {
  file: string;
  audience: HeroAudience;
  /** Full MIME type with codecs, for canPlayType and mediaCapabilities. */
  type: string;
  hevc: boolean;
  width: number;
  height: number;
  /** Average bits per second (for mediaCapabilities). */
  bitrate: number;
};

/**
 * Phones held upright: the 4:5 still, the portrait film cut. Used in the
 * <source media>, the preload and the controller.
 */
export const PHONE_MEDIA = "(max-width: 47.9375rem) and (orientation: portrait)";

/** Widest viewport that gets the 720p cut instead of the original. */
export const MID_MAX_WIDTH = 1023;

/** How long the film may take to show its first frame before the page stays on the still. */
export const LOAD_WATCHDOG_MS = 8000;

/** Where navigator.connection is missing: the page's own response must have started within this. */
export const QUICK_RESPONSE_MS = 600;

/** localStorage key of the visitor's Pause (value "off"). */
export const MOTION_KEY = "cs-hero-motion";

/**
 * The audience for a viewport. A touch device never gets the desktop
 * original, whatever its width (a phone or tablet held sideways).
 */
export function audienceFor(view: { phone: boolean; width: number; coarse: boolean }): HeroAudience {
  if (view.phone) return "portrait-phone";
  if (view.width <= MID_MAX_WIDTH || view.coarse) return "up-to-1023";
  return "desktop";
}

/** The files for an audience in try order; HEVC files only when `hevcOk`. */
export function sourcesFor(table: readonly HeroSource[], audience: HeroAudience, hevcOk: boolean): HeroSource[] {
  return table.filter((s) => s.audience === audience && (hevcOk || !s.hevc));
}

/** The variants.json entries, reduced to what the page needs. */
export function toSources(
  variants: readonly {
    file: string;
    audience: string;
    type: string;
    codec: string;
    width: number;
    height: number;
    bytes: number;
    durationSeconds: number;
  }[],
): HeroSource[] {
  const out: HeroSource[] = [];
  for (const v of variants) {
    if (v.audience !== "portrait-phone" && v.audience !== "up-to-1023" && v.audience !== "desktop") continue;
    out.push({
      file: v.file,
      audience: v.audience,
      type: v.type,
      hevc: /^(hvc1|hev1)/.test(v.codec),
      width: v.width,
      height: v.height,
      bitrate: Math.round((v.bytes * 8) / Math.max(1, v.durationSeconds)),
    });
  }
  return out;
}

/** What the controller reads from the browser once, at the start. */
export type FilmEnvironment = {
  reducedMotion: boolean;
  /** navigator.connection.saveData (false where unknown). */
  saveData: boolean;
  /** navigator.connection.effectiveType, or null where the browser does not say. */
  effectiveType: string | null;
  /** responseStart − requestStart of the page's own navigation in ms, or null when unknown. */
  responseMs: number | null;
};

export type FilmBlock = "reduced-motion" | "save-data" | "slow";

/**
 * Why the film must not load on this visit, or null when it may. A browser
 * that does not report its connection (Safari) must show that the page itself
 * arrived quickly; without that evidence the visitor keeps the still.
 */
export function filmBlock(env: FilmEnvironment): FilmBlock | null {
  if (env.reducedMotion) return "reduced-motion";
  if (env.saveData) return "save-data";
  if (env.effectiveType !== null) return /(^|-)(2g|3g)$/.test(env.effectiveType) ? "slow" : null;
  return env.responseMs !== null && env.responseMs >= 0 && env.responseMs < QUICK_RESPONSE_MS ? null : "slow";
}

export type HeroStatus =
  | "idle"
  | "waiting"
  | "loading"
  | "playing"
  | "paused-auto"
  | "paused-user"
  | "blocked"
  | "failed";

export type HeroModel = {
  status: HeroStatus;
  /** Index into the candidate files of the file being played. */
  source: number;
  /** How many candidate files there are (HEVC then H.264, or one). */
  sources: number;
  /** The hero is at least a quarter on screen and the tab is visible. */
  visible: boolean;
};

export type HeroEvent =
  /** The film may play: start when the hero is on screen. `sources` = candidate files. */
  | { type: "START"; sources: number }
  /** The visitor paused on an earlier visit: the still, with Play. */
  | { type: "PREF_OFF"; sources: number }
  | { type: "VISIBLE" }
  | { type: "HIDDEN" }
  /** The film presented a frame and is playing. */
  | { type: "FIRST_FRAME" }
  /** play() was refused (autoplay blocked, Low Power Mode). */
  | { type: "BLOCKED" }
  | { type: "ERROR" }
  | { type: "TIMEOUT" }
  | { type: "USER_PAUSE" }
  | { type: "USER_PLAY" };

export function initialHeroModel(visible = true): HeroModel {
  return { status: "idle", source: 0, sources: 0, visible };
}

/** The pure transition function. Unknown or meaningless events return the same object. */
export function heroReducer(model: HeroModel, event: HeroEvent): HeroModel {
  const s = model.status;
  const to = (status: HeroStatus, extra: Partial<HeroModel> = {}): HeroModel => ({ ...model, ...extra, status });

  switch (event.type) {
    case "START":
      if (s !== "idle" || event.sources < 1) return model;
      return to(model.visible ? "loading" : "waiting", { sources: event.sources, source: 0 });
    case "PREF_OFF":
      return s === "idle" && event.sources > 0 ? to("paused-user", { sources: event.sources, source: 0 }) : model;
    case "VISIBLE":
      if (s === "waiting") return to("loading", { visible: true });
      if (s === "paused-auto") return to("playing", { visible: true });
      return model.visible ? model : { ...model, visible: true };
    case "HIDDEN":
      if (s === "playing") return to("paused-auto", { visible: false });
      return model.visible ? { ...model, visible: false } : model;
    case "FIRST_FRAME":
      if (s !== "loading") return model;
      return to(model.visible ? "playing" : "paused-auto");
    case "BLOCKED":
      return s === "loading" ? to("blocked") : model;
    case "ERROR":
      if (s !== "loading" && s !== "playing" && s !== "paused-auto") return model;
      if (model.source + 1 < model.sources) return to("loading", { source: model.source + 1 });
      return to("failed");
    case "TIMEOUT":
      return s === "loading" ? to("failed") : model;
    case "USER_PAUSE":
      return s === "loading" || s === "playing" || s === "paused-auto" || s === "waiting" ? to("paused-user") : model;
    case "USER_PLAY":
      return s === "paused-user" || s === "blocked" ? to("loading", { visible: true }) : model;
    default:
      return model;
  }
}

/** The one control the hero shows in a state: Pause, Play, or nothing. */
export function controlFor(status: HeroStatus): "pause" | "play" | null {
  switch (status) {
    case "loading":
    case "playing":
    case "paused-auto":
      return "pause";
    case "paused-user":
    case "blocked":
      return "play";
    default:
      return null;
  }
}

/** Whether the film layer may be shown over the still (it also needs a decoded frame). */
export function filmVisible(status: HeroStatus): boolean {
  return status === "playing" || status === "paused-auto" || status === "paused-user";
}
