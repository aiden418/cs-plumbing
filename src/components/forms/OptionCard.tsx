import type { ComponentPropsWithRef, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { describedBy } from "./format";

export interface OptionCardProps extends Omit<ComponentPropsWithRef<"input">, "type" | "title"> {
  /** Unique id; the title and description get `${id}-title` / `${id}-desc`. */
  id: string;
  /** "radio" (default) for one choice in a group, "checkbox" for several. */
  type?: "radio" | "checkbox";
  title: ReactNode;
  description?: ReactNode;
  /** A small picture or icon on the left (a framed thumbnail, not decoration). */
  media?: ReactNode;
  /** A price or figure on the right, from PRICES/CLAIMS data. Never typed. */
  price?: ReactNode;
  /** Extra content under the description. */
  children?: ReactNode;
  /** Classes for the card (the <label>). */
  className?: string;
}

/**
 * A radio or checkbox presented as a card. The native input is visually
 * hidden but stays in the tab order, so keyboard behaviour is the browser's
 * own: Tab into the group, arrow keys move between radios with one `name`,
 * Space toggles a checkbox.
 *
 * Selected = 2 px primary border (1 px border + 1 px inset, so nothing moves)
 * + a 5% primary fill + a filled joint. The joint carries the state without
 * colour. Holds no state; `ref` reaches the <input>.
 */
export function OptionCard({
  id,
  type = "radio",
  title,
  description,
  media,
  price,
  children,
  className,
  ...rest
}: OptionCardProps) {
  const titleId = `${id}-title`;
  const descId = description ? `${id}-desc` : undefined;
  const priceId = price ? `${id}-price` : undefined;
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex min-h-11 min-w-0 cursor-pointer items-start gap-3 rounded-control border border-steel-300 bg-white p-4 text-ink",
        "transition-[border-color,background-color,box-shadow] duration-150 ease-enter",
        "hover:border-steel-500",
        "has-checked:border-primary has-checked:bg-[color-mix(in_srgb,var(--color-primary)_5%,white)] has-checked:shadow-[inset_0_0_0_1px_var(--color-primary)]",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
        "has-[[aria-invalid=true]]:border-emergency",
        "has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:bg-steel-50 has-disabled:text-steel-500",
        className,
      )}
    >
      <input
        type={type}
        id={id}
        {...rest}
        aria-labelledby={rest["aria-labelledby"] ?? titleId}
        aria-describedby={describedBy(descId, priceId, rest["aria-describedby"])}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] border-steel-400 bg-white",
          "group-has-checked:border-primary",
          type === "checkbox" && "group-has-checked:bg-primary",
          "group-has-disabled:border-steel-300",
        )}
      >
        {type === "checkbox" ? (
          <Check strokeWidth={3} className="size-3.5 text-white opacity-0 group-has-checked:opacity-100" />
        ) : (
          <span className="size-2.5 scale-0 rounded-full bg-primary transition-transform duration-150 ease-settle group-has-checked:scale-100 group-has-disabled:bg-steel-400" />
        )}
      </span>
      {media ? <span className="shrink-0">{media}</span> : null}
      <span className="min-w-0 flex-1">
        <span id={titleId} className="block text-base leading-snug font-semibold text-ink group-has-disabled:text-steel-500">
          {title}
        </span>
        {description ? (
          <span id={descId} className="mt-1 block text-sm leading-snug text-steel-600 group-has-disabled:text-steel-500">
            {description}
          </span>
        ) : null}
        {children}
      </span>
      {price ? (
        <span id={priceId} className="shrink-0 text-base font-semibold tabular-nums text-ink group-has-disabled:text-steel-500">
          {price}
        </span>
      ) : null}
    </label>
  );
}

export default OptionCard;
