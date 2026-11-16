import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { ArrowRight } from "@/components/ui/icons";

export interface GridLink {
  href: string;
  label: string;
  /** Small second line under the label (city, category, price range). */
  meta?: string;
}

const columnClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Internal link lists (areas, services, city pages) as hairline rows in
 * columns. Server component: every anchor is in the HTML on first paint and
 * nothing is added to the client bundle.
 */
export function LinkGrid({
  links,
  columns = 3,
  className,
}: {
  links: GridLink[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <ul className={cn("grid grid-cols-1 gap-x-8", columnClasses[columns], className)}>
      {links.map((link) => (
        // Each row draws a rule above and below; the -1px margin lets
        // neighbouring rows share one hairline.
        <li key={link.href} className="-mt-px border-y border-rule">
          <Link
            href={link.href}
            className="group flex min-h-14 items-center justify-between gap-4 py-3 underline-offset-4"
          >
            <span className="min-w-0">
              <span className="block leading-snug font-medium text-fg group-hover:underline">{link.label}</span>
              {link.meta && <span className="mt-0.5 block text-sm text-muted">{link.meta}</span>}
            </span>
            <ArrowRight className="size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Section shell for one or more LinkGrids: eyebrow, heading, optional
 * description, then children.
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
  /** "surface" is the legacy name of the shell tone. */
  tone?: "white" | "surface" | "shell";
  headingId?: string;
  children: React.ReactNode;
}) {
  const shell = tone === "surface" || tone === "shell";
  return (
    <Section tone={shell ? "shell" : "white"} spacing="sm" divider={!shell} labelledBy={headingId}>
      <Container>
        <div className="mb-8 max-w-2xl sm:mb-10">
          {overline && <Eyebrow className="mb-4">{overline}</Eyebrow>}
          <h2 id={headingId} className="text-display-sm text-fg">
            {heading}
          </h2>
          {description && <p className="mt-3 max-w-[56ch] text-body">{description}</p>}
        </div>
        {children}
      </Container>
    </Section>
  );
}
