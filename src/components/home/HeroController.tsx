"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { Pause, Play } from "lucide-react";
import {
  LOAD_WATCHDOG_MS,
  MOTION_KEY,
  PHONE_MEDIA,
  audienceFor,
  controlFor,
  filmBlock,
  filmVisible,
  heroReducer,
  initialHeroModel,
  sourcesFor,
  type HeroEvent,
  type HeroSource,
} from "@/lib/hero-controller";

/** Created by the head script (src/lib/intro.ts); read by the preview ribbon. */
type HeroDebug = { intro: string; file: string; autoplay: "ok" | "blocked" | "n/a"; state: string };

declare global {
  interface Window {
    __csHero?: HeroDebug;
  }
}

type Connection = { saveData?: boolean; effectiveType?: string };

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
  // Mutated in place: the head script created this object.
  if (!window.__csHero) window.__csHero = { intro: "none", file: "none", autoplay: "n/a", state: "idle" };
  Object.assign(window.__csHero, patch);
  document.dispatchEvent(new Event("cs:hero-debug"));
}

/** Why the film stays off on this visit (filmBlock), read from the browser. */
function blockReason() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return filmBlock({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: Boolean(connection?.saveData),
    effectiveType: connection?.effectiveType ?? null,
    responseMs: nav && nav.responseStart > 0 ? nav.responseStart - nav.requestStart : null,
  });
}

/** Resolves once the still has loaded (or failed) and a frame with it has been painted. */
function stillPainted(media: HTMLElement): Promise<void> {
  const img = media.querySelector("img");
  const loaded =
    !img || img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
  return loaded.then(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

/** Candidate files for this viewport, HEVC first when the device decodes it efficiently. */
async function resolveCandidates(sources: readonly HeroSource[], video: HTMLVideoElement): Promise<HeroSource[]> {
  const audience = audienceFor({
    phone: window.matchMedia(PHONE_MEDIA).matches,
    width: window.innerWidth,
    coarse: window.matchMedia("(pointer: coarse)").matches,
  });
  const hevc = sourcesFor(sources, audience, true).find((s) => s.hevc);
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
  labels: { pause: string; play: string };
}

/**
 * The hero film. The still is already on screen (server-rendered, the LCP
 * element); after hydration this decides whether the film may play, picks the
 * file for the device, fades the film in over the still once its first frame
 * is decoded, loops it, pauses it off screen and in a hidden tab, and renders
 * the one Pause/Play button (the choice is remembered). Every decision is
 * made by the pure reducer in src/lib/hero-controller.ts.
 */
export default function HeroController({ sources, labels }: HeroControllerProps) {
  const [model, dispatch] = useReducer(heroReducer, undefined, () => initialHeroModel(false));
  const candidates = useRef<HeroSource[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRef = useRef<HTMLElement | null>(null);
  const send = useCallback((event: HeroEvent) => dispatch(event), []);

  // Wiring: the video's events, visibility, and the first decision.
  useEffect(() => {
    const video = document.getElementById("cs-hero-video") as HTMLVideoElement | null;
    const media = document.getElementById("cs-hero-frame");
    const hero = media?.closest("section") ?? media;
    if (!video || !media || !hero) return;
    videoRef.current = video;
    mediaRef.current = media;

    const block = blockReason();
    if (block) {
      debug({ intro: `still:${block}`, state: "still" });
      return;
    }

    let inView = false;
    let pageVisible = document.visibilityState === "visible";
    let started = false;
    let cancelled = false;
    const report = () => send({ type: inView && pageVisible ? "VISIBLE" : "HIDDEN" });

    const onError = () => {
      // An error from an emptied src (blocked/failed) is not a new failure.
      if (video.getAttribute("src")) send({ type: "ERROR" });
    };
    video.addEventListener("error", onError);

    const start = () => {
      if (started) return;
      started = true;
      // The still is painted first and stays the LCP element: nothing of the
      // film is requested before it has loaded and been on screen for a frame.
      void stillPainted(media)
        .then(() => resolveCandidates(sources, video))
        .then((list) => {
          if (cancelled) return;
          candidates.current = list;
          if (list.length === 0) {
            debug({ intro: "still:no-file", state: "still" });
            return;
          }
          debug({ intro: "film" });
          send({ type: readPref() === "off" ? "PREF_OFF" : "START", sources: list.length });
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        report();
        start();
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(hero);
    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      report();
    };
    const onPageHide = () => {
      pageVisible = false;
      report();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onVisibility);

    return () => {
      cancelled = true;
      io.disconnect();
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [send, sources]);

  // Acting on the state.
  const { status, source } = model;
  useEffect(() => {
    const video = videoRef.current;
    const media = mediaRef.current;
    if (!video || !media) return;
    const current = candidates.current[source];
    // The film layer fades in only over a decoded frame.
    const showFilm = () => {
      if (video.readyState >= 2) media.setAttribute("data-film", "on");
    };
    const film = (on: boolean) => {
      if (!on) media.removeAttribute("data-film");
      else if (video.readyState >= 2) showFilm();
      else video.addEventListener("loadeddata", showFilm, { once: true });
    };
    let watchdog = 0;
    let frameCallback = 0;
    const onPlaying = () => send({ type: "FIRST_FRAME" });

    switch (status) {
      case "loading": {
        if (!current) break;
        if (video.getAttribute("src") !== current.file) {
          video.preload = "auto";
          video.src = current.file;
        }
        video.muted = true;
        // The film is shown only once a frame is actually decoded.
        if (typeof video.requestVideoFrameCallback === "function") frameCallback = video.requestVideoFrameCallback(onPlaying);
        else video.addEventListener("playing", onPlaying, { once: true });
        video.play()?.catch((err: unknown) => {
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
      case "blocked":
      case "failed":
        film(false);
        video.pause();
        video.removeAttribute("src");
        video.load();
        break;
      default:
        break;
    }

    debug({
      state: status,
      file: status === "failed" || status === "blocked" || !current ? "none" : current.file,
      ...(status === "blocked" ? { autoplay: "blocked" as const } : {}),
      ...(status === "playing" ? { autoplay: "ok" as const } : {}),
    });

    return () => {
      window.clearTimeout(watchdog);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("loadeddata", showFilm);
      if (frameCallback && typeof video.cancelVideoFrameCallback === "function") video.cancelVideoFrameCallback(frameCallback);
    };
  }, [status, source, send]);

  const control = controlFor(status);
  if (!control) return null;
  const toggle = () => {
    writePref(control === "pause");
    send({ type: control === "pause" ? "USER_PAUSE" : "USER_PLAY" });
  };

  return (
    <button
      type="button"
      className="home-hero-toggle"
      onClick={toggle}
      aria-label={control === "pause" ? labels.pause : labels.play}
      data-state={status}
    >
      {control === "pause" ? (
        <Pause className="size-5" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Play className="size-5" strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
