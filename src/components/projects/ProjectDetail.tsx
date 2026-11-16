import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import ProjectExplorer, { resolvePhases } from "@/components/explorer/ProjectExplorer";
import { phaseAnchor } from "@/components/explorer/explorer-utils";
import CaseStudyFacts from "@/components/projects/CaseStudyFacts";
import { image } from "@/lib/media";
import { cn } from "@/lib/utils";
import { formatCompletedOn, projectPhotoCount } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import { PROJECT_PAGE as T } from "@/content/projects";

/**
 * A project page above its cross-links (pages.md "Project page"): the split
 * hero with the cover and the job's facts, the builder facts and the case
 * study where the project has them, then the ProjectExplorer with every
 * phase and every photo in the server HTML under today's #phase-<slug>
 * anchors. Server component; the explorer brings its own client islands.
 */
export default function ProjectDetail({ project }: { project: CompletedProject }) {
  const cover = project.coverImage ? image(project.coverImage, { alt: project.name }) : null;
  const phases = resolvePhases(project);
  const firstPhase = phases[0];

  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: T.facts.client,
      value: project.clientUrl ? (
        <a
          href={project.clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-4 hover:text-link"
        >
          {project.client}
          <ArrowUpRight className="ml-1 inline size-4 align-[-0.125em]" />
        </a>
      ) : (
        project.client
      ),
    },
    { label: T.facts.timeline, value: project.timeline },
    ...(project.completedOn ? [{ label: T.facts.completed, value: formatCompletedOn(project.completedOn) }] : []),
    { label: T.facts.cost, value: project.cost },
    ...(project.location ? [{ label: T.facts.location, value: project.location }] : []),
    { label: T.facts.photos, value: projectPhotoCount(project) },
  ];

  const hasCaseStudy = Boolean(
    project.challenge ||
      project.solution ||
      project.scopeDetails?.length ||
      project.permits?.length ||
      project.materials?.length,
  );
  const lists = ([
    { title: T.caseStudy.scope, items: project.scopeDetails },
    { title: T.caseStudy.permits, items: project.permits },
    { title: T.caseStudy.materials, items: project.materials },
  ] as { title: string; items?: string[] }[]).filter((l): l is { title: string; items: string[] } => Boolean(l.items && l.items.length > 0));

  return (
    <>
      <PageHero
        layout="split"
        frame={cover}
        className="project-hero"
        breadcrumb={[
          { name: T.breadcrumb.home, href: "/" },
          { name: T.breadcrumb.projects, href: "/projects" },
          { name: project.name, href: `/projects/${project.slug}` },
        ]}
        overline={project.category}
        title={project.name}
        description={project.description}
      >
        <dl className="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col border-t border-rule py-3">
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="mt-1 font-semibold text-fg tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {firstPhase && (
          <Link
            href={`#${phaseAnchor(firstPhase.slug)}`}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
          >
            <ArrowRight className="size-4 rotate-90 transition-transform duration-250 ease-settle group-hover:translate-y-0.5" />
            {T.walk}
          </Link>
        )}
      </PageHero>

      <CaseStudyFacts project={project} />

      {hasCaseStudy && (
        <Section tone="shell" labelledBy="case-study-heading">
          <Container>
            <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-4">
                <Eyebrow className="mb-4">{T.caseStudy.overline}</Eyebrow>
                <h2 id="case-study-heading" className="text-display-md text-fg">
                  {T.caseStudy.heading}
                </h2>
              </div>

              <div className="lg:col-span-8">
                {(project.challenge || project.solution) && (
                  <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
                    {[
                      { title: T.caseStudy.challenge, text: project.challenge },
                      { title: T.caseStudy.solution, text: project.solution },
                    ]
                      .filter((block) => block.text)
                      .map((block, i) => (
                        <Reveal key={block.title} index={i} className="border-t border-rule pt-5">
                          <h3 className="text-xl font-semibold text-fg">{block.title}</h3>
                          <p className="mt-3 max-w-[60ch] text-body">{block.text}</p>
                        </Reveal>
                      ))}
                  </div>
                )}

                {lists.length > 0 && (
                  <div
                    className={cn(
                      "grid grid-cols-1 gap-y-10 md:gap-x-8",
                      lists.length > 1 && "md:grid-cols-2",
                      (project.challenge || project.solution) && "mt-14",
                    )}
                  >
                    {lists.map((list, i) => (
                      <Reveal key={list.title} index={i}>
                        <h3 className="mb-4 text-lg font-semibold text-fg">{list.title}</h3>
                        <ul className="project-list text-body">
                          {list.items.map((item) => (
                            <li key={item}>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {phases.length > 0 && (
        <Section
          as="div"
          tone="ink"
          spacing={phases.length > 1 ? "none" : "sm"}
          divider={!hasCaseStudy && !project.caseStudy}
          className={phases.length > 1 ? "pb-section-sm" : undefined}
        >
          <ProjectExplorer project={project} as="h2" eager={0} />
        </Section>
      )}
    </>
  );
}
