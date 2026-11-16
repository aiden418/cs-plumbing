"use client";

import type { FocusEvent } from "react";
import { Input, type InputProps } from "./Input";
import { applyBlurFormat, PRESET_BLUR_FORMAT, type BlurFormat } from "./format";

export interface FormattedInputProps extends InputProps {
  /**
   * What happens to the value when the visitor leaves the field. Defaults to
   * the preset's format (tel → phone, postal-code → zip, others → trim).
   * Nothing is ever formatted or refused while typing.
   */
  format?: BlurFormat;
}

/**
 * Write a value the way typing does, so React's onChange fires for a
 * controlled input and an uncontrolled one simply holds the new value.
 */
function setValueLikeTyping(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(input, value);
  else input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Input that tidies its value on blur: phone numbers to "(239) 555-0134",
 * ZIP codes to "33903" / "33903-1234", surrounding spaces trimmed. Works
 * controlled or uncontrolled; without JavaScript it is a plain Input.
 */
export function FormattedInput({ format, preset, onBlur, ...rest }: FormattedInputProps) {
  const mode: BlurFormat = format ?? (preset ? PRESET_BLUR_FORMAT[preset] : "trim");
  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const next = applyBlurFormat(mode, input.value);
    if (next !== input.value) setValueLikeTyping(input, next);
    onBlur?.(event);
  };
  return <Input preset={preset} {...rest} onBlur={handleBlur} />;
}

export default FormattedInput;
