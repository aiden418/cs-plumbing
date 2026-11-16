import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Frame from "@/components/ui/Frame";
import { ArrowRight } from "@/components/ui/icons";
import ProjectCard from "@/components/explorer/ProjectCard";
import CTASection from "@/components/home/CTASection";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";
import { image } from "@/lib/media";
import { projectPhotoCount } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import { PROJECTS_INDEX as T } from "@/content/projects";
import ProjectsFilter, { type FilterCard } from "./ProjectsFilter";

/**
 * /projects (pages.md "Projects index"): a type-led hero with the three
 * figures, the project with the most photographs as the spotlight, then
 * every project as a large card under the category filter. Server
 * component; the filter is a small client island that only toggles which
 * server-rendered cards show.
 */
export default function ProjectsIndexPage({ projects }: { projects: CompletedProject[] }) {
  const totalPhotos = projects.reduce((n, p) => n + projectPhotoCount(p), 0);
  const cityCount = new Set(projects.map((p) => p.location).filter(Boolean)).size;
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const featured = [...projects].sort((a, b) => projectPhotoCount(b) - projectPhotoCount(a))[0];

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
        sizes="(min-width: 1280px) 25rem, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
      />
    ),
  }));

  return (
    <>
      <PageHero layout="type-led" overline={T.overline} title={T.title} description={T.description}>
        <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-rule">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("flex flex-col", i > 0 ? "border-l border-rule pl-4 sm:pl-6" : "pr-4 sm:pr-6")}>
              <dt className="label-tech mt-4 text-muted">{s.label}</dt>
              <dd className="order-first mt-4 text-display-sm font-semibold text-fg tabular-nums">
                {s.value.toLocaleString("en-US")}
                <span className="text-accent">{T.stats.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section tone="white" spacing="sm" className="projects-index">
        <Container>
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

/** The featured project: one link, the cover framed beside the words. */
function Spotlight({ project }: { project: CompletedProject }) {
  const cover = project.coverImage ? image(project.coverImage, { alt: project.name }) : null;
  const photos = projectPhotoCount(project);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-1 gap-y-6 rounded-frame pb-section-sm lg:grid-cols-12 lg:items-center lg:gap-x-8"
    >
      {cover && (
        <Frame
          media={cover}
          aspect="4/3"
          sizes="(min-width: 1280px) 46rem, (min-width: 1024px) 58vw, 92vw"
          className="lg:col-span-7"
        />
      )}
      <div className="lg:col-span-5">
        <p className="label-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-accent">
          <span className="joint" aria-hidden="true" />
          <span>{T.featured.label}</span>
          <span aria-hidden="true">·</span>
          <span>{project.category}</span>
        </p>
        <h2 className="mt-4 text-display-sm text-fg underline-offset-[0.15em] group-hover:underline group-hover:decoration-1">
          {project.name}
        </h2>
        <p className="mt-4 max-w-[60ch] text-body">{project.description}</p>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted tabular-nums">
          {project.location && <span>{project.location}</span>}
          <span>{T.photos(photos)}</span>
          {project.phases.length > 1 && <span>{T.phases(project.phases.length)}</span>}
        </p>
        <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-link">
          {T.featured.cta}
          <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
