import type { ComponentPropsWithRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlBase, controlHeight } from "./styles";

export interface SelectProps extends ComponentPropsWithRef<"select"> {
  /** Shorthand for aria-invalid; Field sets aria-invalid itself. */
  invalid?: boolean;
  /**
   * A first, empty option ("Choose one"). It is selectable only as the
   * initial value, so a `required` select still needs a real choice.
   */
  placeholder?: string;
  /** Classes for the wrapper (width, margins). `className` styles the select. */
  wrapperClassName?: string;
}

/**
 * The NATIVE select (the phone's own picker, full keyboard support) with the
 * browser arrow replaced by a chevron. `ref` reaches the <select>.
 */
export function Select({ invalid, placeholder, className, wrapperClassName, children, ...rest }: SelectProps) {
  const uncontrolledWithoutDefault = rest.value === undefined && rest.defaultValue === undefined && !rest.multiple;
  return (
    <div className={cn("relative min-w-0", wrapperClassName)}>
      <select
        {...rest}
        defaultValue={placeholder && uncontrolledWithoutDefault ? "" : rest.defaultValue}
        aria-invalid={rest["aria-invalid"] ?? (invalid ? true : undefined)}
        className={cn(controlBase, controlHeight, "cursor-pointer appearance-none py-0 pr-11", className)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn(
          "pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2",
          rest.disabled ? "text-steel-400" : "text-steel-700",
        )}
      />
    </div>
  );
}

export default Select;
