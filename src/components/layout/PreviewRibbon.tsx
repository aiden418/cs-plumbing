"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ANALYTICS_MODE } from "@/lib/pixel";

/**
 * "Preview: not live" (chrome-and-opening.md section 7). Only in review builds
 * (NEXT_PUBLIC_ANALYTICS=off), so a reviewer on an iPhone can tell a preview
 * from the live site and read what the homepage Opening decided. A slim tab on
 * the left edge, half way down, where no page content sits; it never shifts
 * the layout and is hidden in print (chrome.css).
 *
 * The hero facts come from window.__csHero ({ intro, file, autoplay, state }),
 * kept by the home hero's code, which dispatches `cs:hero-debug` on document
 * when it changes.
 */

type HeroDebug = { intro?: unknown; file?: unknown; autoplay?: unknown; state?: unknown };
type NetworkInfo = { effectiveType?: string; saveData?: boolean; addEventListener?: (type: string, cb: () => void) => void; removeEventListener?: (type: string, cb: () => void) => void };

const NA = "n/a";

function show(value: unknown): string {
  if (value === undefined || value === null || value === "") return NA;
  return String(value);
}

function connection(): NetworkInfo | undefined {
  return (navigator as Navigator & { connection?: NetworkInfo }).connection;
}

function readSnapshot(): string {
  const hero = (window as Window & { __csHero?: HeroDebug }).__csHero;
  const net = connection();
  const rows: [string, string][] = [
    ["Intro", show(hero?.intro)],
    ["Video file", show(hero?.file)],
    ["Autoplay", show(hero?.autoplay)],
    ["Player", show(hero?.state)],
    ["Viewport", `${window.innerWidth} x ${window.innerHeight}`],
    ["Pixel ratio", String(Math.round(window.devicePixelRatio * 100) / 100)],
    ["Reduced motion", window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : "no-preference"],
    ["Connection", show(net?.effectiveType)],
    ["Save-Data", net ? (net.saveData ? "on" : "off") : NA],
  ];
  return JSON.stringify(rows);
}

function subscribe(onChange: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const net = connection();
  window.addEventListener("resize", onChange);
  document.addEventListener("cs:hero-debug", onChange);
  motion.addEventListener("change", onChange);
  net?.addEventListener?.("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    document.removeEventListener("cs:hero-debug", onChange);
    motion.removeEventListener("change", onChange);
    net?.removeEventListener?.("change", onChange);
  };
}

function Details({ id }: { id: string }) {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => "[]");
  const rows = JSON.parse(snapshot) as [string, string][];
  return (
    <dl
      id={id}
      className="absolute top-1/2 left-full ml-2 grid w-[min(18rem,calc(100vw-3.5rem))] -translate-y-1/2 grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-control border border-steel-200 bg-white p-4 text-[0.875rem] leading-snug text-steel-800 shadow-lift"
    >
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-steel-600">{label}</dt>
          <dd className="break-all text-navy tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Ribbon() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div data-tone="white" className="preview-ribbon">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label="Preview: not live. Show details"
        onClick={() => setOpen((v) => !v)}
        className="preview-tab"
      >
        <span aria-hidden="true">Preview: not live</span>
      </button>
      {open && <Details id={id} />}
    </div>
  );
}

export default function PreviewRibbon() {
  if (ANALYTICS_MODE !== "off") return null;
  return <Ribbon />;
}
