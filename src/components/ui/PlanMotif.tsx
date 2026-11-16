import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";
import { formatCoordinates, planVariant } from "@/lib/hero-images";

/**
 * A fragment of a plumbing plan seen from above: a few thin brass runs that
 * meet at joint rings, compass ticks in one corner and the shop's coordinates
 * as a small label. Decorative only (aria-hidden). Three drawings, chosen from
 * `seed`, so neighbouring pages do not all show the same one. Static: nothing
 * moves, so it is complete without JavaScript and under reduced motion.
 */

type Point = readonly [number, number];

interface Drawing {
  /** Pipe runs as polylines in the 400 × 480 drawing space. */
  runs: readonly (readonly Point[])[];
  /** A cleanout or future stub, drawn dashed. */
  dashed: readonly (readonly Point[])[];
  /** Where runs meet: a ring. */
  joints: readonly Point[];
  /** Ends of runs: a short cap across the line. */
  caps: readonly { at: Point; vertical: boolean }[];
  /** Compass centre. */
  compass: Point;
}

const DRAWINGS: Record<"a" | "b" | "c", Drawing> = {
  // A main run across the lower third, an elbow rising to the top, one
  // branch dropping out of the bottom.
  a: {
    runs: [
      [
        [0, 312],
        [252, 312],
        [292, 272],
        [292, 72],
      ],
      [
        [132, 312],
        [132, 480],
      ],
      [
        [212, 312],
        [212, 404],
        [400, 404],
      ],
    ],
    dashed: [
      [
        [292, 172],
        [372, 172],
      ],
    ],
    joints: [
      [132, 312],
      [212, 312],
      [292, 272],
      [212, 404],
      [292, 172],
    ],
    caps: [{ at: [292, 72], vertical: false }],
    compass: [356, 52],
  },
  // A riser in the middle with two branches stepping off at 45 degrees.
  b: {
    runs: [
      [
        [180, 480],
        [180, 140],
        [220, 100],
        [400, 100],
      ],
      [
        [180, 260],
        [60, 260],
        [60, 160],
      ],
      [
        [180, 360],
        [300, 360],
        [340, 400],
        [340, 480],
      ],
    ],
    dashed: [
      [
        [60, 260],
        [0, 260],
      ],
    ],
    joints: [
      [180, 260],
      [180, 360],
      [220, 100],
      [300, 360],
      [60, 260],
    ],
    caps: [{ at: [60, 160], vertical: false }],
    compass: [52, 52],
  },
  // A long diagonal header with three short stubs, like a manifold.
  c: {
    runs: [
      [
        [0, 400],
        [96, 400],
        [256, 240],
        [400, 240],
      ],
      [
        [136, 360],
        [136, 300],
      ],
      [
        [196, 300],
        [196, 220],
      ],
      [
        [316, 240],
        [316, 480],
      ],
    ],
    dashed: [
      [
        [316, 240],
        [316, 136],
      ],
    ],
    joints: [
      [96, 400],
      [136, 360],
      [196, 300],
      [256, 240],
      [316, 240],
    ],
    caps: [
      { at: [136, 300], vertical: false },
      { at: [196, 220], vertical: false },
    ],
    compass: [356, 64],
  },
};

const pointsAttr = (run: readonly Point[]) => run.map(([x, y]) => `${x},${y}`).join(" ");

function Compass({ at: [cx, cy] }: { at: Point }) {
  const r = 11;
  return (
    <g opacity={0.5}>
      <circle cx={cx} cy={cy} r={r} />
      {/* north tick is longer than the other three */}
      <line x1={cx} y1={cy - r - 3} x2={cx} y2={cy - r - 13} />
      <line x1={cx + r + 3} y1={cy} x2={cx + r + 8} y2={cy} />
      <line x1={cx} y1={cy + r + 3} x2={cx} y2={cy + r + 8} />
      <line x1={cx - r - 3} y1={cy} x2={cx - r - 8} y2={cy} />
      <circle cx={cx} cy={cy} r={1.5} fill="currentColor" stroke="none" />
    </g>
  );
}

export default function PlanMotif({ seed, className }: { seed: string; className?: string }) {
  const drawing = DRAWINGS[planVariant(seed)];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none select-none text-brass", className)}>
      <svg
        viewBox="0 0 400 480"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="block h-auto w-full"
        focusable="false"
      >
        <g opacity={0.55} vectorEffect="non-scaling-stroke">
          {drawing.runs.map((run, i) => (
            <polyline key={i} points={pointsAttr(run)} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g opacity={0.35} strokeDasharray="4 6">
          {drawing.dashed.map((run, i) => (
            <polyline key={i} points={pointsAttr(run)} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g opacity={0.6}>
          {drawing.caps.map(({ at: [x, y], vertical }, i) =>
            vertical ? (
              <line key={i} x1={x} y1={y - 7} x2={x} y2={y + 7} vectorEffect="non-scaling-stroke" />
            ) : (
              <line key={i} x1={x - 7} y1={y} x2={x + 7} y2={y} vectorEffect="non-scaling-stroke" />
            )
          )}
          {drawing.joints.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={5.5}
              fill="var(--color-ink)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <Compass at={drawing.compass} />
      </svg>
      <p className="label-tech mt-3 text-right tabular-nums opacity-70">{formatCoordinates(BUSINESS.geo)}</p>
    </div>
  );
}
