import type { ComponentPropsWithRef, ReactNode } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubmitRowProps extends Omit<ComponentPropsWithRef<"button">, "type" | "children"> {
  /** The submit label, sentence case ("Send request"). It stays while loading. */
  label: ReactNode;
  /** Spinner + aria-busy; the button stops accepting presses (and Enter submits). */
  loading?: boolean;
  /** Read to assistive technology while loading, e.g. "Sending". */
  loadingText?: string;
  /** A quiet secondary text link beside the button. */
  secondaryHref?: string;
  secondaryLabel?: ReactNode;
  /** Classes for the row. `className` styles the button. */
  rowClassName?: string;
  /** Anything else in the row (a consent line, a note). Rendered after the link. */
  children?: ReactNode;
}

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

/**
 * The primary submit (Button "primary" look, 48 px, full width on phones)
 * plus an optional secondary text link. Uses a real <button type="submit">, so
 * plain HTML submission works without JavaScript.
 */
export function SubmitRow({
  label,
  loading = false,
  loadingText = "Sending",
  secondaryHref,
  secondaryLabel,
  rowClassName,
  className,
  disabled,
  children,
  ...rest
}: SubmitRowProps) {
  return (
    <div className={cn("flex flex-col items-stretch gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center", rowClassName)}>
      <button
        type="submit"
        {...rest}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-primary px-6 py-3",
          "text-base leading-tight font-semibold text-white",
          "transition-[background-color,transform] duration-150 ease-enter",
          "hover:bg-primary-dark active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:active:scale-100",
          "[&:disabled:not([data-loading])]:border [&:disabled:not([data-loading])]:border-dashed [&:disabled:not([data-loading])]:border-steel-300 [&:disabled:not([data-loading])]:bg-steel-50 [&:disabled:not([data-loading])]:text-steel-500",
          "data-loading:cursor-progress data-loading:hover:bg-primary",
          className,
        )}
      >
        {loading ? <LoaderCircle aria-hidden="true" strokeWidth={2} className="size-5 shrink-0 animate-spin" /> : null}
        <span>{label}</span>
        {loading ? <span className="sr-only">: {loadingText}</span> : null}
      </button>
      {secondaryHref && secondaryLabel ? (
        isInternal(secondaryHref) ? (
          <Link
            href={secondaryHref}
            className="inline-flex min-h-11 items-center justify-center text-base font-semibold text-link underline-offset-[0.2em] hover:underline sm:justify-start"
          >
            {secondaryLabel}
          </Link>
        ) : (
          <a
            href={secondaryHref}
            className="inline-flex min-h-11 items-center justify-center text-base font-semibold text-link underline-offset-[0.2em] hover:underline sm:justify-start"
          >
            {secondaryLabel}
          </a>
        )
      ) : null}
      {children}
    </div>
  );
}

export default SubmitRow;
