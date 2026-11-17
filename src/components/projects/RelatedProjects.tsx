import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Section, { type Tone } from "@/components/ui/Section";
import { ArrowRight, Camera, Check, MapPin } from "@/components/ui/icons";
import { image } from "@/lib/media";
import { isProjectComplete, projectPhotoCount, projectStatusLabel } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";

/**
 * Project tiles used as local proof on service hubs, service+city pages and
 * at the foot of a project page. No hooks or motion on purpose: it renders on
 * the server, adds nothing to the client bundle, and every link is in the
 * HTML for crawlers on first paint.
 *
 * Each tile is one link: the cover in a frame, and below it (never on it) the
 * category and status as the plan label, the name, the place and the photo
 * count. On phones a tile is a row (small portrait frame beside the words);
 * from 640px the tiles stand in two or three columns.
 */
export default function RelatedProjects({
  projects,
  overline = "Local proof",
  heading,
  description,
  tone = "white",
}: {
  projects: CompletedProject[];
  overline?: string;
  heading: string;
  description?: string;
  /** The section's surface; "surface" is the legacy name of shell. */
  tone?: Tone | "surface";
}) {
  if (projects.length === 0) return null;

  return (
    <Section
      tone={tone === "surface" ? "shell" : tone}
      spacing="sm"
      divider={tone === "white"}
      labelledBy="related-projects-heading"
    >
      <Container>
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <Eyebrow className="mb-4">{overline}</Eyebrow>
            <h2 id="related-projects-heading" className="text-display-md text-fg">
              {heading}
            </h2>
            {description && <p className="mt-4 max-w-[56ch] text-lead text-body">{description}</p>}
          </div>
          <Link
            href="/projects"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
          >
            All projects
            <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {projects.map((project) => {
            const done = isProjectComplete(project);
            const cover = project.coverImage ? image(project.coverImage) : null;
            return (
              <li key={project.slug} className="max-sm:border-t max-sm:border-rule max-sm:pt-6">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-x-4 rounded-2xl sm:block"
                >
                  {cover ? (
                    <Frame
                      media={cover}
                      aspect="4/3"
                      alt={`${project.name} — C&S Plumbing of Lee project`}
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 46vw, 38vw"
                      className="max-sm:aspect-[4/5]"
                    />
                  ) : (
                    <span aria-hidden="true" className="block aspect-[4/5] rounded-2xl bg-shell sm:aspect-[4/3]" />
                  )}
                  <div className="min-w-0 sm:mt-5">
                    <span className="meta flex flex-wrap items-center gap-x-2 gap-y-1 text-accent">
                      <span>{project.category}</span>
                      <span aria-hidden="true" className="max-sm:hidden">·</span>
                      <span className="inline-flex items-center gap-1 max-sm:basis-full">
                        {done && <Check className="size-3.5 shrink-0" strokeWidth={2.25} />}
                        {projectStatusLabel(project)}
                      </span>
                    </span>
                    <h3 className="mt-1.5 text-lg leading-snug font-semibold text-fg sm:text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {project.name}
                    </h3>
                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted">
                      {project.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4 shrink-0" />
                          {project.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Camera className="size-4 shrink-0" />
                        {projectPhotoCount(project)} photos
                      </span>
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-link">
                      See the project
                      <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
