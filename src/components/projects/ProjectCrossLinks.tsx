import Link from "next/link";
import { ArrowRight, Building2, MapPin, Wrench } from "lucide-react";
import Container from "@/components/ui/Container";
import RelatedProjects from "@/components/projects/RelatedProjects";
import {
  projectArea,
  projectCity,
  projectCityPage,
  projectPrimaryHub,
  relatedProjects,
} from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";

/**
 * Foot of a project page: sends the authority a finished job earns back to
 * the pages that rank — the service hub, the city page and the service+city
 * landing — then links sibling projects so a GC can keep browsing proof.
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
      icon: <Wrench className="h-5 w-5" />,
      label: "Service",
      title: hub.title,
      blurb: `Everything we do for ${hub.title.toLowerCase()} across Southwest Florida.`,
    },
    area && {
      href: `/areas/${area.slug}`,
      icon: <MapPin className="h-5 w-5" />,
      label: "Service area",
      title: `Plumber in ${area.city}`,
      blurb: `Residential, commercial and emergency plumbing in ${area.city}.`,
    },
    cityPage && {
      href: `/${cityPage.slug}`,
      icon: <Building2 className="h-5 w-5" />,
      label: "Local pricing",
      title: cityPage.h1,
      blurb: cityPage.priceRange
        ? `Typical range ${cityPage.priceRange}. Free written estimates.`
        : "Local scope, pricing and FAQs for this service.",
    },
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <>
      {links.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-14 sm:py-20" aria-labelledby="project-links-heading">
          <Container>
            <div className="mb-8 max-w-2xl">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
                Where this work fits
              </span>
              <h2 id="project-links-heading" className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Need the same scope on your job?
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-[#F5F5F7] p-5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-md sm:p-6"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {link.icon}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      {link.label}
                    </span>
                    <span className="mt-1 text-base font-bold text-gray-900 transition-colors group-hover:text-primary sm:text-lg">
                      {link.title}
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-gray-500">{link.blurb}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <RelatedProjects
        projects={siblings}
        overline="Keep looking"
        heading={city ? `More of our work in and around ${city}` : `More ${project.category.toLowerCase()} projects`}
        description="Every project is documented phase by phase — underground, rough-in and trim — so you can judge the work, not the pitch."
        tone="surface"
      />
    </>
  );
}
