import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

export interface GridLink {
  href: string;
  label: string;
  /** Small second line under the label (city, category, price range). */
  meta?: string;
}

/**
 * Plain grid of internal links. Server component by design — no hooks, no
 * motion — so every anchor is in the HTML on first paint for crawlers and
 * nothing is added to the client bundle (same reasoning as RelatedProjects).
 */
export function LinkGrid({
  links,
  columns = 3,
}: {
  links: GridLink[];
  columns?: 2 | 3 | 4;
}) {
  if (links.length === 0) return null;
  const cols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`grid grid-cols-1 ${cols} gap-3 sm:gap-4`}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex h-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#F5F5F7] p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm group"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                {link.label}
              </span>
              {link.meta && (
                <span className="mt-0.5 block text-xs text-gray-500">
                  {link.meta}
                </span>
              )}
            </span>
            <ArrowRight className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Section shell for one or more LinkGrids: overline, heading, optional
 * description, then children. Keeps the cross-link blocks visually
 * consistent across landing, area, hub, blog and home pages.
 */
export function LinkSection({
  overline,
  heading,
  description,
  tone = "white",
  headingId,
  children,
}: {
  overline?: string;
  heading: string;
  description?: string;
  tone?: "white" | "surface";
  headingId?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`py-16 sm:py-20 ${
        tone === "surface"
          ? "bg-[#F5F5F7]"
          : "bg-white border-t border-gray-200"
      }`}
      aria-labelledby={headingId}
    >
      <Container>
        <div className="mb-8 max-w-2xl sm:mb-10">
          {overline && (
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary-dark sm:text-sm">
              {overline}
            </span>
          )}
          <h2
            id={headingId}
            className="text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            {heading}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
              {description}
            </p>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
