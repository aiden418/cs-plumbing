"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap";

/**
 * "The Pipeline" — a scroll-scrubbed gold pipe that drops out of the Hero
 * CTA, snakes through the stats band, and runs the gutter past the service
 * cards. Pure decoration: pointer-events-none, aria-hidden, desktop-only,
 * skipped entirely under prefers-reduced-motion.
 *
 * Everything animates on the compositor: the flow is a stroke-dashoffset
 * scrub, gauges are scale/rotate pops at their arc-length positions.
 */

const ELBOW_RADIUS = 28;
const CASING_COLOR = "rgba(27, 43, 75, 0.14)"; // navy 14%
const GOLD = "#E8A427";
const NAVY = "#1B2B4B";

type Pt = { x: number; y: number };

/** Polyline → SVG path with rounded elbows, plus cumulative length fractions
 *  for each original point so gauges can pop when the flow reaches them. */
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

function Gauge({ className }: { className?: string }) {
  return (
    <g className={className}>
      <circle r="14" fill="white" stroke={GOLD} strokeWidth="3" />
      <circle r="3" fill={NAVY} />
      <line className="gauge-needle" x1="0" y1="0" x2="0" y2="-9" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
      <circle r="14" fill="none" stroke={NAVY} strokeOpacity="0.15" strokeWidth="1" transform="scale(1.25)" />
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
    const flow = svg.querySelector(".pipe-flow") as SVGPathElement;
    const gauges = Array.from(svg.querySelectorAll(".pipe-gauge")) as SVGGElement[];
    const valve = svg.querySelector(".pipe-valve") as SVGGElement;

    let gaugeFractions: number[] = [];

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
        { x: centerX, y: dropY },                 // elbow toward center  [gauge 0]
        { x: centerX, y: st.top },                // down to the stats band [gauge 1 = gold tick]
        { x: centerX, y: sv.top + 56 },           // straight through stats into services
        { x: gutterX, y: sv.top + 56 },           // elbow into the gutter [gauge 2]
        { x: gutterX, y: H - 64 },                // run the gutter past the cards
        { x: centerX, y: H - 64 },                // elbow back to center
        { x: centerX, y: H - 8 },                 // terminal drop [valve]
      ];

      const { d, fractions } = roundedPath(points, ELBOW_RADIUS);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));
      casing.setAttribute("d", d);
      flow.setAttribute("d", d);

      // Gauges sit at the corner points 2, 3 and 5; valve at the end.
      // Position via GSAP x/y so scale tweens compose with the translation.
      const gaugePts = [points[2], points[3], points[5]];
      gauges.forEach((g, i) => {
        const p = gaugePts[i];
        if (p) gsap.set(g, { x: p.x, y: p.y });
      });
      gaugeFractions = [fractions[2], fractions[3], fractions[5]];
      const end = points[points.length - 1];
      gsap.set(valve, { x: end.x, y: end.y - 18 });

      return flow.getTotalLength();
    };

    let tl: gsap.core.Timeline | null = null;

    const build = () => {
      tl?.kill();
      const len = measure();
      if (!len) return;

      gsap.set(flow, { strokeDasharray: len });
      gsap.set(gauges, { scale: 0, transformOrigin: "center center" });
      gsap.set(valve, { opacity: 0 });

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
        flow,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1 },
        0
      );
      gauges.forEach((g, i) => {
        const at = Math.max(0, Math.min(0.96, gaugeFractions[i] ?? 0));
        tl!.to(g, { scale: 1, duration: 0.04, ease: "back.out(2)" }, at);
        const needle = g.querySelector(".gauge-needle");
        if (needle) {
          // pivot at the gauge center: the needle's bbox is 9px tall ending
          // at local (0,0), so the origin sits at bbox bottom
          tl!.fromTo(
            needle,
            { rotation: 0, transformOrigin: "0px 9px" },
            { rotation: 250, duration: Math.max(0.1, 1 - at) },
            at
          );
        }
      });
      tl.to(valve, { opacity: 1, duration: 0.04 }, 0.96);
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
        <path className="pipe-casing" stroke={CASING_COLOR} strokeWidth="10" strokeLinecap="round" />
        <path
          className="pipe-flow"
          stroke={GOLD}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(232,164,39,0.45))" }}
        />
        <Gauge className="pipe-gauge" />
        <Gauge className="pipe-gauge" />
        <Gauge className="pipe-gauge" />
        {/* Terminal valve — a wheel on the pipe mouth feeding the next section */}
        <g className="pipe-valve">
          <circle r="11" fill="white" stroke={GOLD} strokeWidth="3.5" />
          <line x1="-16" y1="0" x2="16" y2="0" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-16" x2="0" y2="16" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
          <circle r="3.5" fill={NAVY} />
        </g>
      </svg>
    </div>
  );
}
