import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { describedBy, fieldIds } from "./format";
import { hintClass, labelClass, optionalTagClass } from "./styles";

/** What a Field hands its control. */
export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
}

export interface FieldProps {
  /** The control's id; the label, hint and error are wired to it. */
  id: string;
  label: ReactNode;
  /** One short line under the label (14 px, muted). */
  hint?: ReactNode;
  /** Error message (from the client or the server response). Sets aria-invalid. */
  error?: ReactNode;
  /** Adds "(required)" for assistive technology and `required` to the control. */
  required?: boolean;
  /** Shows a quiet "Optional" tag after the label. */
  optional?: boolean;
  className?: string;
  labelClassName?: string;
  /**
   * The control. Either one element (Input, Select, Textarea, FormattedInput…),
   * which receives the wiring props, or a function that receives them.
   */
  children: ReactElement | ((control: FieldControlProps) => ReactNode);
}

/**
 * Label above the control (6 px gap), optional hint, then the error. Wires
 * htmlFor/id, aria-describedby (error first, then hint) and aria-invalid.
 * Holds no state, so it renders on the server.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  optional = false,
  className,
  labelClassName,
  children,
}: FieldProps) {
  const { hintId, errorId } = fieldIds(id);
  const hasHint = hint !== undefined && hint !== null && hint !== false && hint !== "";
  const hasError = error !== undefined && error !== null && error !== false && error !== "";

  const wiring: FieldControlProps = {
    id,
    "aria-describedby": describedBy(hasError && errorId, hasHint && hintId),
    ...(hasError ? { "aria-invalid": true as const } : {}),
    ...(required ? { required: true } : {}),
  };

  let control: ReactNode;
  if (typeof children === "function") {
    control = children(wiring);
  } else if (isValidElement<Record<string, unknown>>(children)) {
    const own = children.props;
    control = cloneElement(children, {
      ...wiring,
      "aria-describedby": describedBy(
        wiring["aria-describedby"],
        typeof own["aria-describedby"] === "string" ? own["aria-describedby"] : undefined,
      ),
      // An explicit `required` on the control wins over the Field's.
      ...(own.required !== undefined ? { required: own.required } : {}),
    });
  } else {
    control = children;
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn(labelClass, labelClassName)}>
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
        {optional && !required ? <span className={optionalTagClass}>Optional</span> : null}
      </label>
      {hasHint ? (
        <p id={hintId} className={cn(hintClass, "-mt-0.5")}>
          {hint}
        </p>
      ) : null}
      {control}
      <FieldError id={errorId}>{hasError ? error : null}</FieldError>
    </div>
  );
}

export default Field;
