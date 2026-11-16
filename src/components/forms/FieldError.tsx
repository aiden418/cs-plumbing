import type { ComponentPropsWithRef, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FieldErrorProps extends Omit<ComponentPropsWithRef<"p">, "children"> {
  /** The id the control points at with aria-describedby. */
  id: string;
  /** The message. Nothing is rendered when it is empty. */
  children?: ReactNode;
}

/**
 * A field's error message: an icon AND text, never colour alone. Renders from
 * props, so a message returned by the server shows without JavaScript.
 */
export function FieldError({ id, children, className, ...rest }: FieldErrorProps) {
  if (children === null || children === undefined || children === false || children === "") return null;
  return (
    <p
      id={id}
      className={cn("flex items-start gap-1.5 text-sm font-medium leading-snug text-emergency-dark", className)}
      {...rest}
    >
      <CircleAlert aria-hidden="true" strokeWidth={1.75} className="mt-px size-[1.125rem] shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export default FieldError;
