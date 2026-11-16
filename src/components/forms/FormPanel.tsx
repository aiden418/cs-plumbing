import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The white panel a form sits in on an ink or navy section. It resets the
 * tone to white, so labels, hints and links inside take their light-surface
 * colours. On white or shell sections a form needs no panel.
 */
export function FormPanel({ className, ...rest }: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-tone="white"
      {...rest}
      className={cn("rounded-frame bg-white p-5 text-body sm:p-8", className)}
    />
  );
}

export default FormPanel;
