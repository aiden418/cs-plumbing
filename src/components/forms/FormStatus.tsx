import type { ComponentPropsWithRef, ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormStatusProps extends Omit<ComponentPropsWithRef<"div">, "title" | "role"> {
  /** "success" is announced politely (role="status"); "error" at once (role="alert"). */
  status: "success" | "error";
  title: ReactNode;
  /** The message under the title. */
  children?: ReactNode;
  /** Buttons or links under the message (e.g. "Call 833-PLUMB-IT", "Send another"). */
  actions?: ReactNode;
}

/**
 * The result of a submission. White surface and ink text on every tone; the
 * icon shape and the title tell success from error without colour.
 * Pass `tabIndex={-1}` and a ref to move focus to it after a submit.
 * Renders from props, so a server response can show it without JavaScript.
 */
export function FormStatus({ status, title, children, actions, className, ...rest }: FormStatusProps) {
  const success = status === "success";
  const Icon = success ? CircleCheck : TriangleAlert;
  return (
    <div
      role={success ? "status" : "alert"}
      {...rest}
      data-status={status}
      className={cn(
        "flex gap-3 rounded-control border bg-white p-4 text-steel-700 sm:p-5",
        success ? "border-success-ink" : "border-emergency",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn("mt-0.5 size-6 shrink-0", success ? "text-success-ink" : "text-emergency-dark")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-base leading-snug font-semibold text-ink">{title}</p>
        {children ? <div className="mt-1 text-base leading-normal">{children}</div> : null}
        {actions ? <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export default FormStatus;
