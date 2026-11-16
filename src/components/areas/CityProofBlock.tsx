import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
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
      <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Major-project proof for area pages: the city's documented projects as
 * project tiles, then the homes-plumbed figure as a ruled data row. When no
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
    <Section tone="white" labelledBy="city-proof-heading">
      <Container>
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          <Eyebrow className="mb-4">{copy.eyebrow}</Eyebrow>
          <h2 id="city-proof-heading" className="text-display-md text-fg">
            {copy.heading(cityName)}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-body">{copy.lead}</p>
        </Reveal>

        {hasProjects ? (
          <>
            <ul className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
              {records.map((project, i) => (
                <Reveal as="li" key={project.slug} index={i}>
                  <ProjectCard
                    project={project}
                    aspect="4/3"
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 90vw"
                  />
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-14 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <p className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="text-display-md font-display font-bold text-fg tabular-nums">{copy.statFigure}</span>
                <span className="label-tech text-accent">{copy.statCaption}</span>
              </p>
              <TextLink href="/projects">{copy.allProjects}</TextLink>
            </Reveal>
          </>
        ) : (
          // Fallback: no completed-project record yet for this city
          <Reveal className="grid grid-cols-1 gap-y-10 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-7">
              <h3 className="text-display-sm text-fg">{copy.fallbackHeading}</h3>
              <p className="mt-4 max-w-[60ch] text-body">{copy.fallbackBody}</p>
              <div className="mt-5">
                <TextLink href="/projects">{copy.fallbackLink}</TextLink>
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-display-lg font-display font-bold text-fg tabular-nums">{copy.statFigure}</p>
              <p className="label-tech mt-3 text-accent">{copy.fallbackStatCaption}</p>
              <p className="mt-6 border-t border-rule pt-4 text-sm text-muted">{BUSINESS.license}</p>
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
