import Link from "next/link";
import LinkBlock from "@/components/links/LinkBlock";
import { ArrowRight } from "@/components/ui/icons";
import RelatedProjects from "@/components/projects/RelatedProjects";
import {
  projectArea,
  projectCity,
  projectCityPage,
  projectPrimaryHub,
  relatedProjects,
} from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import { PROJECT_PAGE } from "@/content/projects";

const T = PROJECT_PAGE.crossLinks;

/**
 * Foot of a project page: sends the authority a finished job earns back to
 * the pages that rank — the service hub, the city page and the service+city
 * landing — then links sibling projects so a GC can keep browsing proof.
 * The links are editorial rows: the plan label on the left, the title and
 * one line, an arrow.
 */
export default function ProjectCrossLinks({ project }: { project: CompletedProject }) {
  const hub = projectPrimaryHub(project);
  const area = projectArea(project);
  const cityPage = projectCityPage(project);
  const city = projectCity(project);
  const siblings = relatedProjects(project, 3);

  const links = [
    hub && {
      href: hub.href,
      label: T.service.label,
      title: hub.title,
      blurb: T.service.blurb(hub.title),
    },
    area && {
      href: `/areas/${area.slug}`,
      label: T.area.label,
      title: T.area.title(area.city),
      blurb: T.area.blurb(area.city),
    },
    cityPage && {
      href: `/${cityPage.slug}`,
      label: T.cityPage.label,
      title: cityPage.h1,
      blurb: cityPage.priceRange ? T.cityPage.blurb(cityPage.priceRange) : T.cityPage.fallback,
    },
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <>
      {links.length > 0 && (
        <LinkBlock overline={T.overline} heading={T.heading} headingId="project-links-heading" tone="white">
          <ul className="border-t border-rule">
            {links.map((link) => (
              <li key={link.href} className="border-b border-rule">
                <Link
                  href={link.href}
                  className="group grid grid-cols-1 gap-y-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-x-8"
                >
                  <span className="label-tech text-accent sm:col-span-3">{link.label}</span>
                  <span className="sm:col-span-8">
                    <span className="block text-lg font-semibold text-fg underline-offset-4 group-hover:underline group-hover:decoration-1 sm:text-xl">
                      {link.title}
                    </span>
                    <span className="mt-1.5 block max-w-[60ch] text-muted">{link.blurb}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-link sm:col-span-1 sm:justify-self-end">
                    <span className="sm:sr-only">{T.open}</span>
                    <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </LinkBlock>
      )}

      <RelatedProjects
        projects={siblings}
        overline={PROJECT_PAGE.related.overline}
        heading={PROJECT_PAGE.related.heading(city, project.category)}
        description={PROJECT_PAGE.related.description}
        tone="surface"
      />
    </>
  );
}
