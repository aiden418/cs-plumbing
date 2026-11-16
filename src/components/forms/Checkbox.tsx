import type { ComponentPropsWithRef, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { describedBy, fieldIds } from "./format";
import { hintClass } from "./styles";

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  id: string;
  /** The visible label, beside the box. */
  label: ReactNode;
  /** A line under the label. */
  hint?: ReactNode;
  /** Error message; sets aria-invalid. */
  error?: ReactNode;
  /** Classes for the outer wrapper. */
  wrapperClassName?: string;
}

/**
 * A native checkbox drawn as a 24 px box inside a 44 px tall tap target (the
 * whole label row is clickable). Checked shows a tick, not just a fill, so the
 * state reads without colour. `ref` reaches the <input>.
 */
export function Checkbox({ id, label, hint, error, className, wrapperClassName, ...rest }: CheckboxProps) {
  const { hintId, errorId } = fieldIds(id);
  const hasHint = hint !== undefined && hint !== null && hint !== false && hint !== "";
  const hasError = error !== undefined && error !== null && error !== false && error !== "";
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", wrapperClassName)}>
      <label
        htmlFor={id}
        className={cn(
          "group flex min-h-11 cursor-pointer items-start gap-3 py-2.5",
          "has-disabled:cursor-not-allowed",
        )}
      >
        <span className="relative grid size-6 shrink-0 place-items-center">
          <input
            type="checkbox"
            id={id}
            {...rest}
            aria-describedby={describedBy(hasError && errorId, hasHint && hintId, rest["aria-describedby"])}
            aria-invalid={rest["aria-invalid"] ?? (hasError ? true : undefined)}
            className={cn(
              "peer m-0 size-6 cursor-[inherit] appearance-none rounded-[0.375rem] border border-steel-400 bg-white",
              "transition-[border-color,background-color,outline-color] duration-150 ease-enter",
              "group-hover:border-steel-700",
              "checked:border-primary checked:bg-primary group-hover:checked:border-primary-dark group-hover:checked:bg-primary-dark",
              // Focus: the global 2 px ring (a 20% ring is too faint on a 24 px box).
              "focus-visible:border-primary",
              "aria-[invalid=true]:border-emergency",
              "disabled:border-dashed disabled:border-steel-300 disabled:bg-steel-50 disabled:checked:border-solid disabled:checked:border-steel-400 disabled:checked:bg-steel-400",
              className,
            )}
          />
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className="pointer-events-none absolute size-4 text-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span className="min-w-0 pt-px text-base leading-snug text-fg group-has-disabled:text-muted">
          {label}
          {hasHint ? (
            <span id={hintId} className={cn(hintClass, "mt-0.5 block")}>
              {hint}
            </span>
          ) : null}
        </span>
      </label>
      <FieldError id={errorId} className="pl-9">
        {hasError ? error : null}
      </FieldError>
    </div>
  );
}

export default Checkbox;
