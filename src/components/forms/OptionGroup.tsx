import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { describedBy, fieldIds } from "./format";
import { hintClass, labelClass, optionalTagClass } from "./styles";

export interface OptionGroupProps extends Omit<ComponentPropsWithRef<"fieldset">, "children"> {
  /** Used for the hint and error ids. */
  id: string;
  legend: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Adds "(required)" to the legend for assistive technology. */
  required?: boolean;
  optional?: boolean;
  /** Columns from 640 px up (one column on phones). */
  columns?: 1 | 2 | 3;
  /** "label" (15 px, like a Field) or "step" (a wizard step question). */
  legendStyle?: "label" | "step";
  legendClassName?: string;
  children: ReactNode;
}

const COLUMNS = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * fieldset + legend around OptionCards, Checkboxes or plain radios. Arrow
 * keys between radios come from the browser (same `name`), nothing scripted.
 * Neighbours sit 8 px apart.
 */
export function OptionGroup({
  id,
  legend,
  hint,
  error,
  required = false,
  optional = false,
  columns = 1,
  legendStyle = "label",
  legendClassName,
  className,
  children,
  ...rest
}: OptionGroupProps) {
  const { hintId, errorId } = fieldIds(id);
  const hasHint = hint !== undefined && hint !== null && hint !== false && hint !== "";
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  return (
    <fieldset
      id={id}
      {...rest}
      aria-describedby={describedBy(hasError && errorId, hasHint && hintId, rest["aria-describedby"])}
      className={cn("m-0 min-w-0 border-0 p-0", className)}
    >
      <legend
        className={cn(
          "mb-1.5 p-0",
          legendStyle === "step" ? "text-display-sm font-display font-bold text-fg" : labelClass,
          legendClassName,
        )}
      >
        {legend}
        {required ? <span className="sr-only"> (required)</span> : null}
        {optional && !required ? <span className={optionalTagClass}>Optional</span> : null}
      </legend>
      {hasHint ? (
        <p id={hintId} className={cn(hintClass, legendStyle === "step" && "text-base")}>
          {hint}
        </p>
      ) : null}
      <div className={cn("mt-3 grid grid-cols-1 gap-2", COLUMNS[columns])}>{children}</div>
      <FieldError id={errorId} className="mt-2">
        {hasError ? error : null}
      </FieldError>
    </fieldset>
  );
}

export default OptionGroup;
