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
import type { Tone } from "@/components/ui/Section";
import { PROJECT_PAGE } from "@/content/projects";

const T = PROJECT_PAGE.crossLinks;

/**
 * Foot of a project page: sends the authority a finished job earns back to
 * the pages that rank — the service hub, the city page and the service+city
 * landing — then links sibling projects so a GC can keep browsing proof.
 * The links are simple rows on phones (a 1 px line between them) and three
 * columns on desktop: a small blue label, the title, one line, an arrow.
 * `tone` is the surface of the links; the related projects take the other.
 */
export default function ProjectCrossLinks({ project, tone = "white" }: { project: CompletedProject; tone?: Tone }) {
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
        <LinkBlock overline={T.overline} heading={T.heading} headingId="project-links-heading" tone={tone}>
          <ul className="grid grid-cols-1 border-t border-rule lg:grid-cols-3 lg:gap-x-10">
            {links.map((link) => (
              <li key={link.href} className="border-b border-rule lg:border-b-0">
                <Link href={link.href} className="group flex items-start gap-4 py-5 lg:py-6">
                  <span className="min-w-0 flex-1">
                    <span className="meta block text-accent">{link.label}</span>
                    <span className="mt-1 block text-lg leading-snug font-semibold text-fg underline-offset-4 group-hover:underline group-hover:decoration-1 sm:text-xl">
                      {link.title}
                    </span>
                    <span className="mt-1.5 block max-w-[60ch] text-body">{link.blurb}</span>
                  </span>
                  <span className="mt-6 inline-flex shrink-0 items-center text-link">
                    <span className="sr-only">{T.open}</span>
                    <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
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
        tone={links.length > 0 ? (tone === "white" ? "shell" : "white") : tone}
      />
    </>
  );
}
