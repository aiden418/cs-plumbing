import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { INPUT_PRESETS, type InputPresetName } from "./format";
import { controlBase, controlHeight } from "./styles";

export interface InputProps extends ComponentPropsWithRef<"input"> {
  /**
   * Sets type, autoComplete, inputMode, enterKeyHint, autoCapitalize and
   * spellCheck for a common field. Any of those passed explicitly wins.
   */
  preset?: InputPresetName;
  /** Shorthand for aria-invalid; Field sets aria-invalid itself. */
  invalid?: boolean;
}

/** Resolve a preset into native attributes; explicit props win. */
export function presetProps<P extends Partial<Record<string, unknown>>>(preset: InputPresetName | undefined, props: P) {
  if (!preset) return props;
  const attrs = INPUT_PRESETS[preset];
  const out: Record<string, unknown> = { ...attrs };
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) out[key] = value;
  }
  return out as P;
}

/**
 * A single-line text control: 48 px tall, 16 px text (no iOS zoom), white
 * surface with ink text on every tone. Native props and `ref` are forwarded,
 * so it works controlled or uncontrolled. Holds no state.
 */
export function Input({ preset, invalid, className, type, ...rest }: InputProps) {
  const props = presetProps(preset, { type, ...rest });
  return (
    <input
      {...props}
      type={props.type ?? "text"}
      aria-invalid={rest["aria-invalid"] ?? (invalid ? true : undefined)}
      className={cn(controlBase, controlHeight, "py-0", className)}
    />
  );
}

export default Input;
