"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap";

/**
 * "The Pipeline" — a scroll-scrubbed copper pipe that drops out of the Hero
 * CTA, snakes through the stats band, and runs the gutter past the service
 * cards. Pure decoration: pointer-events-none, aria-hidden, desktop-only,
 * skipped entirely under prefers-reduced-motion.
 *
 * The pipe is three concentric strokes on one path (dark edge, copper body,
 * specular highlight) so it reads as a lit cylinder in any direction. Ball
 * valves and solder couplings sit on the straight runs; each valve's lever
 * swings open as the flow reaches it. Everything animates on the
 * compositor: the draw is a stroke-dashoffset scrub, fittings are
 * scale/rotate pops at their arc-length positions.
 */

const ELBOW_RADIUS = 28;
const NAVY = "#1B2B4B";
// Copper pipe palette
const COPPER_DARK = "#7A3E1D";
const COPPER = "#B87333";
const COPPER_HI = "#EBAF7E";
const COPPER_JOINT = "#8A4A20";
const CASING_COLOR = "rgba(122, 62, 29, 0.12)";
// Brass fittings
const BRASS = "#C9A227";
const BRASS_DARK = "#8A6D1A";
const BRASS_HI = "#E3C258";
// Ball-valve lever
const LEVER_RED = "#C0392B";
const LEVER_RED_DARK = "#7B241C";

type Pt = { x: number; y: number };

/** Polyline → SVG path with rounded elbows, plus cumulative length fractions
 *  for each original point so fittings can pop when the flow reaches them. */
function roundedPath(points: Pt[], r: number) {
  if (points.length < 2) return { d: "", fractions: [] as number[] };

  const segLengths: number[] = [];
  for (let i = 1; i < points.length; i++) {
    segLengths.push(Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  const total = segLengths.reduce((a, b) => a + b, 0);
  let cum = 0;
  const fractions = [0];
  for (const len of segLengths) {
    cum += len;
    fractions.push(cum / total);
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const outLen = Math.hypot(next.x - cur.x, next.y - cur.y);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    const inX = cur.x - ((cur.x - prev.x) / inLen) * rr;
    const inY = cur.y - ((cur.y - prev.y) / inLen) * rr;
    const outX = cur.x + ((next.x - cur.x) / outLen) * rr;
    const outY = cur.y + ((next.y - cur.y) / outLen) * rr;
    d += ` L ${inX} ${inY} Q ${cur.x} ${cur.y} ${outX} ${outY}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return { d, fractions };
}

/** Brass ball valve drawn along +x, centered on the pipe axis. The lever
 *  line's left end sits at the pivot so a bbox-origin rotation swings it
 *  from closed (across the pipe) to open (along it). */
function BallValve({ className }: { className?: string }) {
  return (
    <g className={className}>
      {/* union nuts */}
      <rect x="-22" y="-10" width="8" height="20" rx="1.5" fill={BRASS} stroke={BRASS_DARK} strokeWidth="1" />
      <rect x="14" y="-10" width="8" height="20" rx="1.5" fill={BRASS} stroke={BRASS_DARK} strokeWidth="1" />
      {/* body */}
      <rect x="-15" y="-9" width="30" height="18" rx="4" fill={BRASS} stroke={BRASS_DARK} strokeWidth="1.2" />
      <rect x="-13" y="-7.5" width="26" height="6" rx="3" fill={BRASS_HI} opacity="0.55" />
      {/* stem */}
      <rect x="-2.5" y="-14" width="5" height="6" rx="1" fill={BRASS_DARK} />
      {/* lever — pivot at the stem top */}
      <g transform="translate(0, -14)">
        <line
          className="valve-lever"
          x1="0"
          y1="0"
          x2="21"
          y2="0"
          stroke={LEVER_RED}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <circle r="2.6" fill={LEVER_RED_DARK} />
      </g>
    </g>
  );
}

/** Solder coupling — a short dark band across the pipe, drawn for a
 *  horizontal run and rotated into place with the segment. */
function Coupling({ className }: { className?: string }) {
  return (
    <g className={className}>
      <rect x="-5.5" y="-8" width="11" height="16" rx="2" fill={COPPER_JOINT} stroke={COPPER_DARK} strokeWidth="1" />
      <rect x="-4.5" y="-6.5" width="9" height="4" rx="2" fill={COPPER_HI} opacity="0.5" />
    </g>
  );
}

export default function PipelineFlow() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setActive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!active || !hostRef.current) return;
    registerGSAP();

    const host = hostRef.current;
    const wrapper = host.parentElement as HTMLElement; // PipelineSection div
    const svg = host.querySelector("svg") as SVGSVGElement;
    const casing = svg.querySelector(".pipe-casing") as SVGPathElement;
    const drawPaths = Array.from(svg.querySelectorAll(".pipe-draw")) as SVGPathElement[];
    const body = svg.querySelector(".pipe-draw-body") as SVGPathElement;
    const valves = Array.from(svg.querySelectorAll(".pipe-ball-valve")) as SVGGElement[];
    const couplings = Array.from(svg.querySelectorAll(".pipe-coupling")) as SVGGElement[];
    const levers = Array.from(svg.querySelectorAll(".valve-lever")) as SVGLineElement[];
    const terminal = svg.querySelector(".pipe-terminal") as SVGGElement;
    const wheel = svg.querySelector(".terminal-wheel") as SVGGElement;

    let valveFractions: number[] = [];
    let couplingFractions: number[] = [];

    const measure = () => {
      const wrapRect = wrapper.getBoundingClientRect();
      const W = wrapper.clientWidth;
      const H = wrapper.scrollHeight;

      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left - wrapRect.left,
          right: r.right - wrapRect.left,
          top: r.top - wrapRect.top,
          bottom: r.bottom - wrapRect.top,
          midX: r.left - wrapRect.left + r.width / 2,
          midY: r.top - wrapRect.top + r.height / 2,
        };
      };

      const cta = wrapper.querySelector('[data-pipe-node="hero-cta"]');
      const stats = wrapper.querySelector('[data-pipe-node="stats"]');
      const services = wrapper.querySelector('[data-pipe-node="services"]');
      if (!cta || !stats || !services) return null;

      const c = rel(cta);
      const st = rel(stats);
      const sv = rel(services);

      const centerX = W / 2;
      // Left gutter — outside the max-w-7xl content column when there's room
      const gutterX = Math.max(18, (W - 1280) / 2 - 8);

      const startX = c.left + 36;
      const startY = c.bottom + 28;

      // Adaptive first drop: deep enough to read as a drop, but never so
      // deep that the cross-elbow collides with the stats band below.
      const dropY = startY + Math.min(110, Math.max(36, (st.top - startY) * 0.45));

      const points: Pt[] = [
        { x: startX, y: startY },
        { x: startX, y: dropY },                  // drop out of the CTA
        { x: centerX, y: dropY },                 // elbow toward center
        { x: centerX, y: st.top },                // down to the stats band
        { x: centerX, y: sv.top + 56 },           // straight through stats into services
        { x: gutterX, y: sv.top + 56 },           // elbow into the gutter
        { x: gutterX, y: H - 64 },                // run the gutter past the cards
        { x: centerX, y: H - 64 },                // elbow back to center
        { x: centerX, y: H - 8 },                 // terminal drop
      ];

      const { d, fractions } = roundedPath(points, ELBOW_RADIUS);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));
      casing.setAttribute("d", d);
      drawPaths.forEach((p) => p.setAttribute("d", d));

      // Fittings sit mid-segment on the straight runs — never on an elbow.
      // Each spec: segment index i (points[i] → points[i+1]) and 0–1 lerp t.
      const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      });
      const segAngle = (a: Pt, b: Pt) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const frac = (i: number, t: number) => fractions[i] + (fractions[i + 1] - fractions[i]) * t;

      const valveSpecs = [
        { i: 1, t: 0.5 },  // horizontal run toward center
        { i: 3, t: 0.25 }, // vertical run entering the stats band
        { i: 5, t: 0.5 },  // gutter run past the cards
      ];
      valves.forEach((g, k) => {
        const s = valveSpecs[k];
        if (!s) return;
        const p = lerpPt(points[s.i], points[s.i + 1], s.t);
        gsap.set(g, { x: p.x, y: p.y, rotation: segAngle(points[s.i], points[s.i + 1]) });
      });
      valveFractions = valveSpecs.map((s) => frac(s.i, s.t));

      const couplingSpecs = [
        { i: 2, t: 0.5 },  // center run between hero and stats
        { i: 6, t: 0.5 },  // bottom return toward center
      ];
      couplings.forEach((g, k) => {
        const s = couplingSpecs[k];
        if (!s) return;
        const p = lerpPt(points[s.i], points[s.i + 1], s.t);
        gsap.set(g, { x: p.x, y: p.y, rotation: segAngle(points[s.i], points[s.i + 1]) });
      });
      couplingFractions = couplingSpecs.map((s) => frac(s.i, s.t));

      const end = points[points.length - 1];
      gsap.set(terminal, { x: end.x, y: end.y - 18 });

      return body.getTotalLength();
    };

    let tl: gsap.core.Timeline | null = null;

    const build = () => {
      tl?.kill();
      const len = measure();
      if (!len) return;

      gsap.set(drawPaths, { strokeDasharray: len });
      gsap.set([...valves, ...couplings], { scale: 0, transformOrigin: "center center" });
      gsap.set(levers, { rotation: -90, transformOrigin: "0px 0px" });
      gsap.set(terminal, { opacity: 0 });

      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom 75%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        drawPaths,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1 },
        0
      );
      valves.forEach((g, i) => {
        const at = Math.max(0, Math.min(0.96, valveFractions[i] ?? 0));
        tl!.to(g, { scale: 1, duration: 0.04, ease: "back.out(2)" }, at);
        // Lever swings from closed (across the pipe) to open (along it)
        // just as the flow arrives.
        const lever = g.querySelector(".valve-lever");
        if (lever) {
          tl!.to(lever, { rotation: 0, duration: 0.12, ease: "power2.out" }, Math.min(0.96, at + 0.02));
        }
      });
      couplings.forEach((g, i) => {
        const at = Math.max(0, Math.min(0.96, couplingFractions[i] ?? 0));
        tl!.to(g, { scale: 1, duration: 0.04, ease: "back.out(2)" }, at);
      });
      tl.to(terminal, { opacity: 1, duration: 0.04 }, 0.96);
      if (wheel) {
        tl.to(wheel, { rotation: 120, duration: 0.04, transformOrigin: "center center" }, 0.96);
      }
    };

    build();

    // Re-measure when the wrapper resizes (fonts, images, viewport).
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        build();
        ScrollTrigger.refresh();
      });
    });
    ro.observe(wrapper);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      tl?.kill();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none z-[5] hidden lg:block"
    >
      <svg className="absolute inset-0" fill="none">
        <path className="pipe-casing" stroke={CASING_COLOR} strokeWidth="12" strokeLinecap="round" />
        {/* Copper cylinder: dark edge, body, specular highlight on one path */}
        <path className="pipe-draw pipe-draw-dark" stroke={COPPER_DARK} strokeWidth="11" strokeLinecap="round" />
        <path
          className="pipe-draw pipe-draw-body"
          stroke={COPPER}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 5px rgba(184,115,51,0.35))" }}
        />
        <path className="pipe-draw pipe-draw-hi" stroke={COPPER_HI} strokeWidth="2.5" strokeLinecap="round" />
        <Coupling className="pipe-coupling" />
        <Coupling className="pipe-coupling" />
        <BallValve className="pipe-ball-valve" />
        <BallValve className="pipe-ball-valve" />
        <BallValve className="pipe-ball-valve" />
        {/* Terminal fixture — brass gate-valve handwheel on the pipe mouth */}
        <g className="pipe-terminal">
          <g className="terminal-wheel">
            <circle r="11" fill="white" stroke={BRASS_DARK} strokeWidth="5" />
            <circle r="11" fill="none" stroke={BRASS} strokeWidth="3" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke={BRASS} strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="-15" x2="0" y2="15" stroke={BRASS} strokeWidth="3" strokeLinecap="round" />
            <circle r="3.5" fill={NAVY} />
          </g>
        </g>
      </svg>
    </div>
  );
}
