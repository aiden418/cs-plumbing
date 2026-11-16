import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** Omit on the current page (the last crumb). */
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Where this page sits. The last crumb is the current page. The
 * BreadcrumbList JSON-LD stays in the page files.
 */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-muted select-none">
                  /
                </span>
              )}
              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-body underline-offset-4 hover:text-fg hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className={cn("inline-flex min-h-11 items-center", current && "text-fg")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
