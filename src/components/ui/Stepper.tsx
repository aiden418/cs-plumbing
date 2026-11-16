import Link from "next/link";
import { type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "@/components/ui/icons";

/**
 * The connection line: steps as joints joined by a hairline (design-system.md
 * sections 1 and 4). Horizontal for processes and wizards (scrolls sideways
 * on phones), vertical for timelines.
 *
 * Server-safe. An item can be a link, a button (when a client component
 * passes onClick) or plain text.
 */

export type StepState = "done" | "current" | "todo";

/** The state of step `index` when step `current` is the one in progress. */
export function stepState(index: number, current: number | undefined): StepState {
  if (current === undefined || current < 0) return "todo";
  if (index < current) return "done";
  if (index === current) return "current";
  return "todo";
}

/** Every step's state; an item's own `state` wins over the position. */
export function stepStates(items: readonly { state?: StepState }[], current: number | undefined): StepState[] {
  return items.map((item, i) => item.state ?? stepState(i, current));
}

export interface StepItem {
  label: ReactNode;
  /** Small label above the step: a number, a year, a phase code (label-tech). */
  meta?: ReactNode;
  description?: ReactNode;
  /** Extra content under a vertical step (a photo, a list). */
  children?: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  state?: StepState;
  id?: string;
}

interface StepperProps {
  items: StepItem[];
  /** Index of the step in progress. Steps before it are done. */
  current?: number;
  orientation?: "horizontal" | "vertical";
  /** Names the navigation landmark. */
  label: string;
  /** Number the steps "01", "02"… when an item has no meta (default true). */
  numbered?: boolean;
  className?: string;
}

function Joint({ state }: { state: StepState }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-canvas transition-colors duration-250",
        state === "done" && "border-accent bg-accent text-canvas",
        state === "current" && "border-primary ring-4 ring-primary/15",
        state === "todo" && "border-rule",
      )}
    >
      {state === "done" && <Check className="size-3.5" strokeWidth={2.5} />}
      {state === "current" && <span className="size-2 rounded-full bg-primary" />}
    </span>
  );
}

function StepBody({ item, state, meta }: { item: StepItem; state: StepState; meta: ReactNode }) {
  return (
    <span className="block">
      {meta !== null && meta !== undefined && (
        <span className={cn("label-tech block", state === "todo" ? "text-muted" : "text-accent")}>{meta}</span>
      )}
      <span
        className={cn(
          "mt-1 block leading-snug font-semibold",
          state === "todo" ? "text-body" : "text-fg",
          (item.href || item.onClick) && "underline-offset-4 group-hover/step:underline",
        )}
      >
        {item.label}
      </span>
      {item.description && <span className="mt-1.5 block text-sm text-muted">{item.description}</span>}
    </span>
  );
}

function StepContent({ item, state, meta, className }: { item: StepItem; state: StepState; meta: ReactNode; className: string }) {
  const ariaCurrent = state === "current" ? ("step" as const) : undefined;
  const inner = (
    <>
      <Joint state={state} />
      <StepBody item={item} state={state} meta={meta} />
    </>
  );
  if (item.href) {
    return (
      <Link href={item.href} aria-current={ariaCurrent} className={cn("group/step", className)}>
        {inner}
      </Link>
    );
  }
  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} aria-current={ariaCurrent} className={cn("group/step text-left", className)}>
        {inner}
      </button>
    );
  }
  return (
    <span aria-current={ariaCurrent} className={className}>
      {inner}
    </span>
  );
}

export default function Stepper({
  items,
  current,
  orientation = "horizontal",
  label,
  numbered = true,
  className,
}: StepperProps) {
  const states = stepStates(items, current);
  const metaFor = (item: StepItem, i: number) => item.meta ?? (numbered ? String(i + 1).padStart(2, "0") : null);

  if (orientation === "vertical") {
    return (
      <nav aria-label={label} className={className}>
        <ol>
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.id ?? i} id={item.id} className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-10 last:pb-0">
                {!last && (
                  <span
                    aria-hidden="true"
                    className={cn("absolute top-7 bottom-1 left-3 w-px -translate-x-1/2", states[i] === "done" ? "bg-accent" : "bg-rule")}
                  />
                )}
                <StepContent
                  item={item}
                  state={states[i]}
                  meta={metaFor(item, i)}
                  className="col-span-2 grid grid-cols-[1.5rem_1fr] items-start gap-x-5 rounded-control"
                />
                {item.children && <div className="col-start-2 mt-4">{item.children}</div>}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex snap-x snap-proximity overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const state = states[i];
          return (
            <li
              key={item.id ?? i}
              id={item.id}
              className={cn(
                "relative min-w-[11rem] flex-1 shrink-0 snap-start pr-6",
                // On a phone the step in progress starts in view (where the
                // browser supports scroll-initial-target).
                state === "current" && "[scroll-initial-target:nearest]",
              )}
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn("absolute top-[calc(0.75rem+0.5rem)] right-0 left-6 h-px", state === "done" ? "bg-accent" : "bg-rule")}
                />
              )}
              <StepContent
                item={item}
                state={state}
                meta={metaFor(item, i)}
                className="flex flex-col items-start gap-3 rounded-control pt-2"
              />
              {item.children && <div className="mt-3">{item.children}</div>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
