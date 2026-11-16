import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Frame from "@/components/ui/Frame";
import { ArrowRight, Phone } from "@/components/ui/icons";
import ProjectCard from "@/components/explorer/ProjectCard";
import { splitLead } from "@/components/projects/ProjectDetail";
import CTASection from "@/components/home/CTASection";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";
import { projectPhotoCount } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import { PROJECTS_ACTIONS, PROJECTS_INDEX as T } from "@/content/projects";
import ProjectsFilter, { type FilterCard } from "./ProjectsFilter";

/**
 * /projects (v2-bright.md "Inner pages"): a job photo fills the hero behind
 * the headline (the cover of the first project, or of the second when the
 * first is the featured one, so the spotlight below never repeats it); the
 * hero keeps the lead's first sentence and the rest opens the list, beside
 * the three figures. Then the project with the most photographs as the
 * spotlight, the category filter and every project as a card (a compact
 * row on phones, a grid from 48rem). Server component; the filter is a small
 * client island that only toggles which server-rendered cards show.
 */
export default function ProjectsIndexPage({ projects }: { projects: CompletedProject[] }) {
  const totalPhotos = projects.reduce((n, p) => n + projectPhotoCount(p), 0);
  const cityCount = new Set(projects.map((p) => p.location).filter(Boolean)).size;
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const featured = [...projects].sort((a, b) => projectPhotoCount(b) - projectPhotoCount(a))[0];
  const heroProject = projects.find((p) => p.coverImage && p.slug !== featured?.slug);
  const heroPhoto = heroProject?.coverImage ? image(heroProject.coverImage, { alt: heroProject.name }) : null;
  const [lead, rest] = splitLead(T.description);

  const stats = [
    { value: BUSINESS.homesCompleted, label: T.stats.homes },
    { value: totalPhotos, label: T.stats.photos },
    { value: cityCount, label: T.stats.cities },
  ];

  const cards: FilterCard[] = projects.map((project) => ({
    slug: project.slug,
    category: project.category,
    featured: project.slug === featured?.slug,
    card: (
      <ProjectCard
        project={project}
        as="h2"
        details
        sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 40vw"
      />
    ),
  }));

  return (
    <>
      <PageHero
        layout="photo"
        frame={heroPhoto}
        overline={T.overline}
        title={T.title}
        description={lead}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {`${PROJECTS_ACTIONS.call} ${BUSINESS.phone}`}
            </Button>
            <Button href={PROJECTS_ACTIONS.book.href} variant="onPhoto" size="lg">
              {PROJECTS_ACTIONS.book.label}
            </Button>
          </>
        }
      />

      <Section tone="white" spacing="sm" className="projects-index">
        <Container>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            {rest && <p className="max-w-[40ch] text-lead text-body">{rest}</p>}
            <dl className="projects-stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd className="tabular-nums">
                    {s.value.toLocaleString("en-US")}
                    <span className="text-accent">{T.stats.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ProjectsFilter
            categories={categories}
            cards={cards}
            spotlight={featured ? <Spotlight project={featured} /> : null}
            labels={{ all: T.filter.all, group: T.filter.label, empty: T.filter.empty }}
          />
        </Container>
      </Section>

      <CTASection />
    </>
  );
}

/** The featured project: one card, the cover beside the words from 64rem. */
function Spotlight({ project }: { project: CompletedProject }) {
  const cover = project.coverImage ? image(project.coverImage, { alt: project.name }) : null;
  const photos = projectPhotoCount(project);
  return (
    <Link href={`/projects/${project.slug}`} className="projects-spotlight group">
      {cover && (
        <Frame
          media={cover}
          aspect="4/3"
          sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 48vw, 92vw"
          frameClassName="lg:aspect-[3/2]"
          className="lg:col-span-6"
        />
      )}
      <div className="lg:col-span-6">
        <p className="meta text-accent">
          {T.featured.label} · {project.category}
        </p>
        <h2 className="mt-2 text-display-sm text-fg underline-offset-[0.15em] group-hover:underline group-hover:decoration-1">
          {project.name}
        </h2>
        <p className="mt-3 line-clamp-4 max-w-[60ch] text-body xl:line-clamp-5">{project.description}</p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] font-medium text-body tabular-nums">
          {project.location && <span>{project.location}</span>}
          <span>{T.photos(photos)}</span>
          {project.phases.length > 1 && <span>{T.phases(project.phases.length)}</span>}
        </p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-[1.0625rem] font-semibold text-link">
          {T.featured.cta}
          <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
