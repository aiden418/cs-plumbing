import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import { ArrowRight, ArrowUpRight, Phone } from "@/components/ui/icons";
import Filmstrip from "@/components/explorer/Filmstrip";
import FilmstripRail from "@/components/explorer/FilmstripRail";
import PhaseNav from "@/components/explorer/PhaseNav";
import { resolvePhases, type ResolvedPhase } from "@/components/explorer/ProjectExplorer";
import { phaseAnchor } from "@/components/explorer/explorer-utils";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import CaseStudyFacts from "@/components/projects/CaseStudyFacts";
import ProjectCrossLinks from "@/components/projects/ProjectCrossLinks";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";
import { formatCompletedOn, projectPhotoCount } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import { PROJECT_PAGE as T, PROJECTS_ACTIONS } from "@/content/projects";

/**
 * A project page (v2-bright.md "Inner pages"): the cover fills the hero
 * behind the name and the first sentence of the description; the rest of
 * the description, the case study (where the project has one) and the job's
 * facts open the page on white; then every phase and every photo (today's
 * #phase-<slug> anchors, each phase headed "Phase N of M"), the builder facts
 * where the project has them, the cross-links and related projects. Sections alternate white
 * and shell. Server component; the rails are client islands.
 */
export default function ProjectDetail({ project }: { project: CompletedProject }) {
  const cover = project.coverImage ? image(project.coverImage, { alt: project.name }) : null;
  const phases = resolvePhases(project);
  const firstPhase = phases[0];
  const [lead, rest] = splitLead(project.description);

  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: T.facts.client,
      value: project.clientUrl ? (
        <a
          href={project.clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline decoration-1 underline-offset-4"
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
    project.notes?.length ||
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

  // White and shell alternate down the page, whichever sections it has.
  const tones: Tone[] = ["white", "shell"];
  let next = 0;
  const tone = () => tones[next++ % 2];
  const introTone = tone();
  const photosTone = phases.length > 0 ? tone() : null;
  const glanceTone = project.caseStudy ? tone() : null;
  const linksTone = tone();
  const hasLeft = Boolean(rest) || hasCaseStudy;

  return (
    <>
      <PageHero
        layout="photo"
        frame={cover}
        breadcrumb={[
          { name: T.breadcrumb.home, href: "/" },
          { name: T.breadcrumb.projects, href: "/projects" },
          { name: project.name, href: `/projects/${project.slug}` },
        ]}
        overline={project.category}
        title={project.name}
        description={lead}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {`${PROJECTS_ACTIONS.call} ${BUSINESS.phone}`}
            </Button>
            {firstPhase ? (
              <Button
                href={`#${phaseAnchor(firstPhase.slug)}`}
                variant="onPhoto"
                size="lg"
                iconRight={<ArrowRight className="size-5 rotate-90" />}
              >
                {T.walk}
              </Button>
            ) : (
              <Button href={PROJECTS_ACTIONS.book.href} variant="onPhoto" size="lg">
                {PROJECTS_ACTIONS.book.label}
              </Button>
            )}
          </>
        }
      />

      <Section tone={introTone} spacing="sm" className="project-intro">
        <Container>
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            {hasLeft && (
              <div className="space-y-10 lg:col-span-7">
                {rest && <p className="max-w-[60ch] text-lead text-body">{rest}</p>}
                {hasCaseStudy && (
                  <section aria-labelledby="case-study-heading">
                    <p className="eyebrow mb-2 text-accent">{T.caseStudy.overline}</p>
                    <h2 id="case-study-heading" className="text-display-sm text-fg">
                      {T.caseStudy.heading}
                    </h2>
                    {(project.challenge || project.solution) && (
                      <div className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
                        {[
                          { title: T.caseStudy.challenge, text: project.challenge },
                          { title: T.caseStudy.solution, text: project.solution },
                        ]
                          .filter((block) => block.text)
                          .map((block) => (
                            <div key={block.title}>
                              <h3 className="text-xl font-semibold text-fg">{block.title}</h3>
                              <p className="mt-2 max-w-[60ch] text-body">{block.text}</p>
                            </div>
                          ))}
                      </div>
                    )}
                    {project.notes && project.notes.length > 0 && (
                      <div className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
                        {project.notes.map((note) => (
                          <div key={note.title}>
                            <h3 className="text-xl font-semibold text-fg">{note.title}</h3>
                            <p className="mt-2 max-w-[60ch] text-body">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {lists.length > 0 && (
                      <div className={lists.length > 1 ? "mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8" : "mt-6"}>
                        {lists.map((list) => (
                          <div key={list.title}>
                            <h3 className="mb-2 text-lg font-semibold text-fg">{list.title}</h3>
                            <ul className="project-list text-body">
                              {list.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {project.request && (
                      <div className="mt-8">
                        <Button href={project.request.href} size="lg" iconRight={<ArrowRight className="size-5" />}>
                          {project.request.label}
                        </Button>
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
            <dl className={hasLeft ? "project-facts lg:col-span-5" : "project-facts project-facts--wide lg:col-span-12"}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd className="tabular-nums">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {photosTone && (
        <Section
          as="div"
          tone={photosTone}
          spacing="none"
          divider={photosTone === introTone}
          className={phases.length > 1 ? "project-photos" : "project-photos py-10 lg:py-14"}
        >
          <PhaseExplorer project={project} phases={phases} />
        </Section>
      )}

      {glanceTone && <CaseStudyFacts project={project} tone={glanceTone} />}

      <ProjectCrossLinks project={project} tone={linksTone} />
    </>
  );
}

/**
 * Splits a paragraph after its first sentence, word for word: the hero keeps
 * the first sentence and the rest opens the first section below. A full stop
 * after a capital ("U.S. Postal") does not end a sentence.
 */
export function splitLead(text: string): [lead: string, rest: string] {
  const match = /[a-z0-9)\]][.!?](?=\s+[A-Z"(])/.exec(text);
  if (!match) return [text, ""];
  const end = match.index + match[0].length;
  return [text.slice(0, end), text.slice(end).trim()];
}

/**
 * Every phase with its photos, as ProjectExplorer draws them (the same
 * components, ids and anchors), with a small "Phase N of M" line over each
 * phase heading. A single phase is a plain labelled filmstrip.
 */
function PhaseExplorer({ project, phases }: { project: CompletedProject; phases: ResolvedPhase[] }) {
  if (phases.length === 1) {
    const [phase] = phases;
    return (
      <LightboxProvider>
        <section id={phaseAnchor(phase.slug)} aria-label={`${project.name}: ${phase.name}`}>
          <Filmstrip
            id={`${project.slug}:${phase.slug}`}
            items={phase.items}
            name={phase.name}
            title={`${project.name}: ${phase.name}`}
            description={phase.description}
            plain
            eager={0}
          />
        </section>
      </LightboxProvider>
    );
  }

  return (
    <LightboxProvider>
      <div data-explorer={project.slug}>
        <PhaseNav phases={phases.map((p) => ({ slug: p.slug, name: p.name, count: p.items.length }))} />
        <div className="explorer-phases">
          {phases.map((phase, i) => {
            const following = phases[i + 1];
            const headingId = `${phaseAnchor(phase.slug)}-title`;
            return (
              <section key={phase.slug} id={phaseAnchor(phase.slug)} aria-labelledby={headingId} className="explorer-phase">
                <FilmstripRail
                  id={`${project.slug}:${phase.slug}`}
                  title={`${project.name}: ${phase.name}`}
                  items={phase.items}
                  eager={0}
                  next={following ? { id: `${project.slug}:${following.slug}`, label: following.name } : undefined}
                  header={
                    <>
                      <p className="eyebrow mb-2 text-accent">{T.phaseOf(i + 1, phases.length)}</p>
                      <h2 id={headingId} className="filmstrip-title text-fg">
                        {phase.name}
                      </h2>
                      {phase.description && <p className="mt-2 max-w-[60ch] text-body">{phase.description}</p>}
                    </>
                  }
                />
              </section>
            );
          })}
        </div>
      </div>
    </LightboxProvider>
  );
}
