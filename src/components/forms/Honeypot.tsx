import type { ComponentPropsWithRef } from "react";

export type HoneypotProps = Pick<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "onChange" | "ref">;

/**
 * The spam trap every C&S form carries, EXACTLY as rendered by
 * src/components/services/ServiceRequestForm.tsx today: a text field named
 * "website", out of sight but not display:none (bots skip hidden fields),
 * out of the tab order, no autofill, hidden from assistive technology.
 * The API routes drop a submission whose `website` is filled in.
 * Do not change the name, type or classes.
 */
export function Honeypot(props: HoneypotProps) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] w-px h-px opacity-0"
      {...props}
    />
  );
}

export default Honeypot;
