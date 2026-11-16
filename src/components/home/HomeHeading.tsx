import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * A homepage section heading (v2-bright.md): an optional small blue eyebrow
 * (14 px, semibold, normal letter-spacing), a big bold heading and an
 * optional one-paragraph subtitle. `subtitleHidden` keeps the subtitle in the
 * HTML for search engines without showing it ("always", or "phone": shown
 * from 768 px), which keeps the phone page short.
 */
export function HomeHeading({
  id,
  eyebrow,
  title,
  subtitle,
  subtitleHidden,
  size = "lg",
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  subtitleHidden?: "always" | "phone";
  size?: "lg" | "sm";
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="home-eyebrow">{eyebrow}</p>}
      <h2 id={id} className={size === "lg" ? "home-h2" : "home-h2-sm"}>
        {title}
      </h2>
      {subtitle && (
        <p className={subtitleHidden === "always" ? "sr-only" : cn("home-sub", subtitleHidden === "phone" && "max-md:sr-only")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** A plain text link with an arrow ("All services", "Our story"). */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("home-arrow-link group", className)}>
      {children}
      <ArrowRight className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  );
}
