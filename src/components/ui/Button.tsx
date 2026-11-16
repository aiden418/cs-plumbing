import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/icons";
import { type AriaAttributes, type MouseEventHandler, type ReactNode } from "react";

/**
 * The site's button and button-styled link (design-system.md section 4).
 *
 * Server-safe: no hooks and no handler of its own, so a server page can
 * render it; a client component may pass `onClick`. Colours come from the
 * section tone where the variant depends on it (secondary, ghost).
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "emergency"
  | "brass"
  | "inverse"
  /** Legacy name of `brass`. */
  | "gold"
  /** Legacy: the secondary outline on a dark band that has no data-tone. */
  | "outline-light";

export type ButtonSize = "sm" | "md" | "lg";

/** How an href is rendered: next/link for pages of this site, a plain <a> for the rest. */
export type HrefKind = "internal" | "tel" | "sms" | "mailto" | "external" | "other";

export function classifyHref(href: string): HrefKind {
  const h = href.trim();
  if (h.startsWith("//")) return "external";
  if (h.startsWith("/") || h.startsWith("#") || h.startsWith("?")) return "internal";
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(h)?.[1]?.toLowerCase();
  if (scheme === "tel") return "tel";
  if (scheme === "sms") return "sms";
  if (scheme === "mailto") return "mailto";
  if (scheme === "http" || scheme === "https") return "external";
  if (scheme) return "other";
  // A relative path ("services/drain-cleaning") stays inside the site.
  return "internal";
}

/** rel for a plain <a>: only an external link opened in a new tab gets noopener noreferrer. */
export function relFor(kind: HrefKind, target: string | undefined, rel: string | undefined): string | undefined {
  if (rel) return rel;
  if (kind === "external" && target === "_blank") return "noopener noreferrer";
  return undefined;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-fg bg-transparent text-fg hover:bg-fg/[0.06]",
  ghost: "min-h-11 bg-transparent px-0 text-link underline-offset-[0.2em] hover:underline",
  emergency: "bg-emergency text-white hover:bg-emergency-dark",
  brass: "bg-brass text-ink hover:bg-brass-300",
  gold: "bg-brass text-ink hover:bg-brass-300",
  inverse: "bg-white text-ink hover:bg-shell",
  "outline-light": "border border-white bg-transparent text-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-[0.9375rem]",
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-[1.0625rem]",
};

/** The class list for a button look, for the rare control that cannot use <Button>. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "group/button relative inline-flex select-none items-center justify-center gap-2 rounded-control font-sans font-semibold leading-tight normal-case",
    "transition-[background-color,border-color,color,transform] duration-150 ease-enter active:scale-[0.98]",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
    "aria-busy:cursor-progress aria-busy:active:scale-100",
    sizes[size],
    variants[variant],
    variant === "ghost" && "px-0",
    "leading-tight",
    fullWidth && "w-full",
    className,
  );
}

type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };

interface ButtonBaseProps extends AriaAttributes, DataAttributes {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  /** Leading icon (an element from @/components/ui/icons). */
  icon?: ReactNode;
  /** Trailing icon. A ghost button gets an arrow when none is given. */
  iconRight?: ReactNode;
  /** Shows a spinner, sets aria-busy and ignores clicks. The label stays. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
  title?: string;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  form?: string;
  name?: string;
  value?: string;
  target?: never;
  rel?: never;
  download?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  /** e.g. analytics on a booking link. Never put a handler on a tel: link. */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: never;
  target?: "_blank" | "_self";
  rel?: string;
  download?: boolean | string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-[1.1em] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    children,
    className,
    icon,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    ...rest
  } = props;

  const classes = buttonClasses({ variant, size, fullWidth, className });
  const trailing =
    iconRight ??
    (variant === "ghost" ? (
      <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover/button:translate-x-0.5" />
    ) : null);
  const content = (
    <>
      {loading ? <Spinner /> : icon}
      <span>{children}</span>
      {trailing}
    </>
  );

  if (rest.href !== undefined) {
    const { href, onClick, target, rel, download, ...attrs } = rest;
    const blocked = loading || disabled;
    if (blocked) {
      // An inert link: no href, so it cannot be followed or focused.
      return (
        <a
          {...attrs}
          aria-disabled={loading ? undefined : "true"}
          aria-busy={loading || undefined}
          role="link"
          className={classes}
        >
          {content}
        </a>
      );
    }
    const kind = classifyHref(href);
    if (kind === "internal") {
      return (
        <Link {...attrs} href={href} onClick={onClick} target={target} rel={rel} className={classes}>
          {content}
        </Link>
      );
    }
    return (
      <a
        {...attrs}
        href={href}
        onClick={onClick}
        target={target}
        rel={relFor(kind, target, rel)}
        download={download}
        className={classes}
      >
        {content}
      </a>
    );
  }

  const { onClick, type = "button", ...attrs } = rest as ButtonAsButton;
  return (
    <button
      {...attrs}
      // While loading the button keeps focus and its label but does nothing:
      // no handler, and a submit button stops submitting.
      type={loading && type === "submit" ? "button" : type}
      onClick={loading ? undefined : onClick}
      disabled={disabled || undefined}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
