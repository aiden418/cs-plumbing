/**
 * The hero film's state machine and the pure helpers around it. No DOM, no
 * React: HeroController (client) feeds it events from the <video>, the
 * IntersectionObserver and the buttons, and acts on the state it returns.
 * The inline frame script in src/lib/intro.ts picks the file with the same
 * rules (tests/intro-script.test.ts checks that they agree).
 *
 *   idle ─ARM→ armed ─VISIBLE→ loading ─FIRST_FRAME→ playing ─ENDED→ resting
 *   playing ─HIDDEN→ paused-auto ─VISIBLE→ playing
 *   loading|playing|paused-auto ─USER_PAUSE→ paused-user ─USER_PLAY→ loading
 *   loading ─BLOCKED→ blocked ─USER_PLAY→ loading
 *   loading ─ERROR→ loading (next file, once) | failed;  loading ─TIMEOUT→ failed
 *   resting|playing|paused-* ─REPLAY→ loading
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
 * Phones held upright: the 4:5 still, the portrait film cut and the 4:5
 * frame. Used in the <source media>, the preload, the CSS and both scripts.
 */
export const PHONE_MEDIA = "(max-width: 47.9375rem) and (orientation: portrait)";

/** Widest viewport that gets the 720p cut instead of the original. */
export const MID_MAX_WIDTH = 1023;

/** Seconds of playback the watchdog waits for a first frame before giving up. */
export const LOAD_WATCHDOG_MS = 8000;

/** localStorage key of the user's Pause (value "off"). */
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

export type HeroStatus =
  | "idle"
  | "armed"
  | "loading"
  | "playing"
  | "resting"
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
  /** The frame is at least a quarter on screen and the tab is visible. */
  visible: boolean;
};

export type HeroEvent =
  /** Autoplay allowed: play when the frame is on screen. `sources` = candidate files. */
  | { type: "ARM"; sources: number }
  /** Autoplay not allowed (client navigation, forced off): the still, with Replay. */
  | { type: "REST"; sources: number }
  /** The user paused on an earlier visit: the still, with Play. */
  | { type: "PREF_OFF"; sources: number }
  /** The inline script already started the film; take it over. */
  | { type: "ADOPT"; sources: number; source: number; playing: boolean; ended: boolean; error: boolean }
  | { type: "VISIBLE" }
  | { type: "HIDDEN" }
  /** The film presented a frame and is playing. */
  | { type: "FIRST_FRAME" }
  | { type: "ENDED" }
  /** play() was refused. */
  | { type: "BLOCKED" }
  | { type: "ERROR" }
  | { type: "TIMEOUT" }
  | { type: "USER_PAUSE" }
  | { type: "USER_PLAY" }
  | { type: "REPLAY" };

export function initialHeroModel(visible = true): HeroModel {
  return { status: "idle", source: 0, sources: 0, visible };
}

const ACTIVE: readonly HeroStatus[] = ["loading", "playing", "paused-auto"];

/** The pure transition function. Unknown or meaningless events return the same object. */
export function heroReducer(model: HeroModel, event: HeroEvent): HeroModel {
  const s = model.status;
  const to = (status: HeroStatus, extra: Partial<HeroModel> = {}): HeroModel => ({ ...model, ...extra, status });

  switch (event.type) {
    case "ARM":
      if (s !== "idle" || event.sources < 1) return model;
      return to(model.visible ? "loading" : "armed", { sources: event.sources, source: 0 });
    case "REST":
      return s === "idle" && event.sources > 0 ? to("resting", { sources: event.sources, source: 0 }) : model;
    case "PREF_OFF":
      return s === "idle" && event.sources > 0 ? to("paused-user", { sources: event.sources, source: 0 }) : model;
    case "ADOPT": {
      if (s !== "idle" || event.sources < 1) return model;
      const source = Math.min(Math.max(0, event.source), event.sources - 1);
      const base = { sources: event.sources, source };
      if (event.error) {
        return source + 1 < event.sources ? to("loading", { ...base, source: source + 1 }) : to("failed", base);
      }
      if (event.ended) return to("resting", base);
      if (event.playing) return to(model.visible ? "playing" : "paused-auto", base);
      return to("loading", base);
    }
    case "VISIBLE":
      if (model.visible && s !== "armed" && s !== "paused-auto") return model;
      if (s === "armed") return to("loading", { visible: true });
      if (s === "paused-auto") return to("playing", { visible: true });
      return { ...model, visible: true };
    case "HIDDEN":
      if (s === "playing") return to("paused-auto", { visible: false });
      return model.visible ? { ...model, visible: false } : model;
    case "FIRST_FRAME":
      if (s !== "loading") return model;
      return to(model.visible ? "playing" : "paused-auto");
    case "ENDED":
      return s === "playing" || s === "paused-auto" ? to("resting") : model;
    case "BLOCKED":
      return s === "loading" ? to("blocked") : model;
    case "ERROR":
      if (s === "failed" || s === "idle") return model;
      if (model.source + 1 < model.sources) return to("loading", { source: model.source + 1 });
      return to("failed");
    case "TIMEOUT":
      return s === "loading" ? to("failed") : model;
    case "USER_PAUSE":
      return ACTIVE.includes(s) || s === "armed" ? to("paused-user") : model;
    case "USER_PLAY":
      return s === "paused-user" || s === "blocked" || s === "resting" ? to("loading", { visible: true }) : model;
    case "REPLAY":
      return s === "resting" || s === "playing" || s === "paused-user" || s === "paused-auto" || s === "blocked"
        ? to("loading", { visible: true })
        : model;
    default:
      return model;
  }
}

/** Which controls the frame shows in a state. */
export function controlsFor(status: HeroStatus): { toggle: "pause" | "play" | null; replay: boolean } {
  switch (status) {
    case "loading":
    case "playing":
      return { toggle: "pause", replay: status === "playing" };
    case "paused-auto":
    case "paused-user":
      return { toggle: "play", replay: true };
    case "blocked":
      return { toggle: "play", replay: false };
    case "resting":
      return { toggle: null, replay: true };
    default:
      return { toggle: null, replay: false };
  }
}

/** Whether the film layer is shown over the still. */
export function filmVisible(status: HeroStatus): boolean {
  return status === "playing" || status === "paused-auto" || status === "paused-user";
}
