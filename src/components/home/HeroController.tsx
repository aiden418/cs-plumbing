"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  LOAD_WATCHDOG_MS,
  MOTION_KEY,
  PHONE_MEDIA,
  audienceFor,
  controlsFor,
  filmVisible,
  heroReducer,
  initialHeroModel,
  sourcesFor,
  type HeroEvent,
  type HeroSource,
  type HeroStatus,
} from "@/lib/hero-controller";

/** Written by the head script (src/lib/intro.ts); read by the preview ribbon. */
type HeroDebug = { intro: string; file: string; autoplay: "ok" | "blocked" | "n/a"; state: string };
/** The head script's handle. `r` is the eligibility result ("" when the Opening started). */
type IntroHandle = {
  s: "wait" | "play" | "skip" | "done" | null;
  r: string;
  path: string;
  files?: string[];
  idx?: number;
};

declare global {
  interface Window {
    __csHero?: HeroDebug;
    __csIntro?: IntroHandle;
  }
}

/** Eligibility results after which the film may start on its own (the "seen" rule does not apply to it). */
const AUTOPLAY_OK = new Set(["", "seen", "hidden"]);
/** Results that mean "no film at all": the still only. */
const STILL_ONLY = new Set(["reduced-motion", "save-data", "slow", "no-variant", "error"]);

/** The film starts by itself only once per page load (never on a client navigation back to the homepage). */
let autoplayUsed = false;

function readPref(): string | null {
  try {
    return window.localStorage.getItem(MOTION_KEY);
  } catch {
    return null;
  }
}

function writePref(off: boolean) {
  try {
    if (off) window.localStorage.setItem(MOTION_KEY, "off");
    else window.localStorage.removeItem(MOTION_KEY);
  } catch {
    // storage blocked: the choice lasts for this page only
  }
}

function debug(patch: Partial<HeroDebug>) {
  // Mutated in place: the head and frame scripts hold a reference to this object.
  if (!window.__csHero) window.__csHero = { intro: "ineligible:unknown", file: "none", autoplay: "n/a", state: "idle" };
  Object.assign(window.__csHero, patch);
  document.dispatchEvent(new Event("cs:hero-debug"));
}

/** Candidate files for this viewport, HEVC first when the device decodes it efficiently. */
async function resolveCandidates(sources: readonly HeroSource[], video: HTMLVideoElement): Promise<HeroSource[]> {
  const audience = audienceFor({
    phone: window.matchMedia(PHONE_MEDIA).matches,
    width: window.innerWidth,
    coarse: window.matchMedia("(pointer: coarse)").matches,
  });
  const all = sourcesFor(sources, audience, true);
  const hevc = all.find((s) => s.hevc);
  let hevcOk = false;
  if (hevc && navigator.mediaCapabilities?.decodingInfo) {
    try {
      const info = await navigator.mediaCapabilities.decodingInfo({
        type: "file",
        video: { contentType: hevc.type, width: hevc.width, height: hevc.height, bitrate: hevc.bitrate, framerate: 30 },
      });
      hevcOk = info.supported && info.powerEfficient;
    } catch {
      hevcOk = false;
    }
  }
  return sourcesFor(sources, audience, hevcOk).filter((s) => video.canPlayType(s.type) !== "");
}

interface HeroControllerProps {
  sources: HeroSource[];
  mode: "once" | "loop";
  labels: { pause: string; play: string; replay: string };
}

/**
 * The hero film after hydration: takes over the film the inline script
 * started (or starts it for a returning visitor), pauses it off screen,
 * dissolves back to the still at the end, and renders Pause/Play and Replay.
 * All decisions are made by the pure reducer in src/lib/hero-controller.ts.
 */
export default function HeroController({ sources, mode, labels }: HeroControllerProps) {
  const [model, dispatch] = useReducer(heroReducer, undefined, () => initialHeroModel(false));
  const candidates = useRef<HeroSource[]>([]);
  const lastEvent = useRef<HeroEvent["type"] | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLElement | null>(null);

  const send = useCallback((event: HeroEvent) => {
    lastEvent.current = event.type;
    dispatch(event);
  }, []);

  // Wiring: the video's events, visibility, and the first decision.
  useEffect(() => {
    const video = document.getElementById("cs-hero-video") as HTMLVideoElement | null;
    const frame = document.getElementById("cs-hero-frame");
    if (!video || !frame) return;
    videoRef.current = video;
    frameRef.current = frame;
    video.loop = mode === "loop";

    let inView = true;
    let pageVisible = document.visibilityState === "visible";
    let decided = false;
    // Decide only once the observer has said whether the frame is on screen.
    let ioReported = false;
    let cancelled = false;
    const report = () => send({ type: inView && pageVisible ? "VISIBLE" : "HIDDEN" });

    const onPlaying = () => send({ type: "FIRST_FRAME" });
    const onEnded = () => send({ type: "ENDED" });
    const onError = () => {
      // An error from an emptied src (blocked/failed) is not a new failure.
      if (video.getAttribute("src")) send({ type: "ERROR" });
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        report();
        if (!ioReported) {
          ioReported = true;
          decide();
        }
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(frame);
    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      report();
    };
    const onPageHide = () => {
      pageVisible = false;
      report();
    };
    const onPageShow = () => {
      pageVisible = document.visibilityState === "visible";
      report();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);

    const decide = () => {
      if (decided || cancelled || !ioReported) return;
      const intro = window.__csIntro;
      // The inline script is still choosing a file: wait for its next debug event.
      if (intro && (intro.s === "wait" || intro.s === "play") && !intro.files && !autoplayUsed) return;
      decided = true;
      document.removeEventListener("cs:hero-debug", decide);

      if (intro?.files && intro.files.length > 0 && !autoplayUsed) {
        autoplayUsed = true;
        candidates.current = intro.files
          .map((file) => sources.find((s) => s.file === file))
          .filter((s): s is HeroSource => Boolean(s));
        send({
          type: "ADOPT",
          sources: candidates.current.length,
          source: intro.idx ?? 0,
          playing: !video.paused && video.readyState >= 2,
          ended: video.ended,
          error: Boolean(video.error),
        });
        return;
      }

      const reason = intro && intro.path === "/" && !autoplayUsed ? intro.r : "navigation";
      if (STILL_ONLY.has(reason)) return;
      void resolveCandidates(sources, video).then((list) => {
        if (cancelled) return;
        candidates.current = list;
        const n = list.length;
        if (readPref() === "off") send({ type: "PREF_OFF", sources: n });
        else if (AUTOPLAY_OK.has(reason)) {
          autoplayUsed = true;
          if (document.visibilityState !== "visible") send({ type: "HIDDEN" });
          send({ type: "ARM", sources: n });
        } else send({ type: "REST", sources: n });
      });
    };
    document.addEventListener("cs:hero-debug", decide);

    return () => {
      cancelled = true;
      io.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("cs:hero-debug", decide);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [mode, send, sources]);

  // Acting on the state.
  const { status, source } = model;
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame) return;
    const current = candidates.current[source];
    const film = (on: boolean) => {
      if (on && video.readyState >= 2) frame.setAttribute("data-film", "on");
      else if (!on) frame.removeAttribute("data-film");
    };
    const clearSource = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
    let watchdog = 0;

    switch (status) {
      case "loading": {
        if (!current) break;
        const wanted = new URL(current.file, window.location.href).href;
        if (video.currentSrc !== wanted && video.getAttribute("src") !== current.file) {
          video.src = current.file;
        } else if (lastEvent.current === "REPLAY" || video.ended) {
          video.currentTime = 0;
        }
        video.muted = true;
        const attempt = video.play();
        attempt?.catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "NotAllowedError") send({ type: "BLOCKED" });
        });
        watchdog = window.setTimeout(() => send({ type: "TIMEOUT" }), LOAD_WATCHDOG_MS);
        break;
      }
      case "playing":
        if (video.paused) void video.play().catch(() => {});
        film(true);
        if (performance.getEntriesByName("video:first-frame").length === 0) performance.mark("video:first-frame");
        break;
      case "paused-auto":
      case "paused-user":
        video.pause();
        film(filmVisible(status));
        break;
      case "resting":
        film(false);
        break;
      case "blocked":
      case "failed":
        film(false);
        clearSource();
        break;
      default:
        break;
    }

    debug({
      state: status,
      file: status === "failed" || status === "blocked" || !current ? "none" : current.file,
      ...(status === "blocked" ? { autoplay: "blocked" as const } : {}),
      ...(status === "playing" && lastEvent.current !== "USER_PLAY" && lastEvent.current !== "REPLAY"
        ? { autoplay: "ok" as const }
        : {}),
    });

    return () => window.clearTimeout(watchdog);
  }, [status, source, send]);

  const controls = controlsFor(status);
  const toggle = () => {
    if (controls.toggle === "pause") {
      writePref(true);
      send({ type: "USER_PAUSE" });
    } else {
      writePref(false);
      send({ type: "USER_PLAY" });
    }
  };
  const replay = () => {
    writePref(false);
    send({ type: "REPLAY" });
  };

  const button =
    "pointer-events-auto grid size-11 place-items-center rounded-control bg-ink text-white transition-transform duration-150 ease-enter active:scale-[0.98]";

  return (
    <div className="cs-hero-controls pointer-events-none absolute right-3 bottom-3 flex gap-2" data-state={status satisfies HeroStatus}>
      {controls.replay && (
        <button type="button" className={button} onClick={replay} aria-label={labels.replay}>
          <RotateCcw className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
      {controls.toggle && (
        <button
          type="button"
          className={button}
          onClick={toggle}
          aria-label={controls.toggle === "pause" ? labels.pause : labels.play}
        >
          {controls.toggle === "pause" ? (
            <Pause className="size-5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Play className="size-5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
