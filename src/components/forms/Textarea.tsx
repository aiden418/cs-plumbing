import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./styles";

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  /** Shorthand for aria-invalid; Field sets aria-invalid itself. */
  invalid?: boolean;
}

/** Multi-line control: at least 7rem tall, resizes vertically only. */
export function Textarea({ invalid, className, rows = 4, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      {...rest}
      aria-invalid={rest["aria-invalid"] ?? (invalid ? true : undefined)}
      className={cn(controlBase, "min-h-28 resize-y py-3", className)}
    />
  );
}

export default Textarea;
