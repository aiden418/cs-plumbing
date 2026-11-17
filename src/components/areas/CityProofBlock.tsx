import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { ArrowRight } from "@/components/ui/icons";
import ProjectCard from "@/components/explorer/ProjectCard";
import { AREA_COPY } from "@/content/areas";
import { BUSINESS } from "@/lib/business";
import { COMPLETED_PROJECTS } from "@/lib/projects-data";
import type { ProjectCardData } from "@/lib/types";

const copy = AREA_COPY.proof;

interface CityProofBlockProps {
  cityName: string;
  /** From cityProofProjects() in @/lib/projects-data, resolved by the server page. */
  projects: ProjectCardData[];
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
    >
      {children}
      <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Major-project proof for area pages: the city's documented projects as
 * photo cards (a sideways row on phones, a grid from 640 px) with the client
 * and photo count, then the homes-plumbed figure in one short row. When no
 * project is recorded for the city yet, the same figure with the
 * across-Lee-County note and the license. Server component.
 */
export default function CityProofBlock({ cityName, projects }: CityProofBlockProps) {
  // The page picks the projects; the tiles need the full records for their covers.
  const records = projects
    .map((card) => COMPLETED_PROJECTS.find((p) => p.slug === card.slug))
    .filter((p): p is (typeof COMPLETED_PROJECTS)[number] => Boolean(p));
  const hasProjects = records.length > 0;

  return (
    <Section tone="white" spacing="sm" labelledBy="city-proof-heading">
      <Container>
        <div className="mb-8 max-w-3xl sm:mb-10">
          <Eyebrow className="mb-3">{copy.eyebrow}</Eyebrow>
          <h2 id="city-proof-heading" className="text-display-md text-fg">
            {copy.heading(cityName)}
          </h2>
          <p className="mt-4 max-w-[56ch] text-lead text-body">{copy.lead}</p>
        </div>

        {hasProjects ? (
          <>
            <ul className="area-tiles" aria-label={copy.heading(cityName)}>
              {records.map((project) => (
                <li key={project.slug}>
                  <ProjectCard
                    project={project}
                    aspect="4/3"
                    details
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 82vw"
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-1 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <p>
                <span className="text-display-sm font-display font-bold text-fg tabular-nums">{copy.statFigure}</span>{" "}
                <span className="ml-1 font-medium text-body">{copy.statCaption}</span>
              </p>
              <TextLink href="/projects">{copy.allProjects}</TextLink>
            </div>
          </>
        ) : (
          // Fallback: no completed-project record yet for this city
          <div className="grid grid-cols-1 gap-y-6 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-7">
              <h3 className="text-display-sm text-fg">{copy.fallbackHeading}</h3>
              <p className="mt-4 max-w-[60ch] text-body">{copy.fallbackBody}</p>
              <div className="mt-4">
                <TextLink href="/projects">{copy.fallbackLink}</TextLink>
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-display-md font-display font-bold text-fg tabular-nums">{copy.statFigure}</p>
              <p className="mt-2 font-medium text-body">{copy.fallbackStatCaption}</p>
              <p className="mt-4 border-t border-rule pt-4 text-[0.9375rem] text-body">{BUSINESS.license}</p>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
