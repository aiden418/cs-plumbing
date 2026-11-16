import Link from "next/link";
import { cn } from "@/lib/utils";
import { image } from "@/lib/media";
import { isProjectComplete, projectCity } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";
import Frame from "@/components/ui/Frame";
import { ArrowRight } from "@/components/ui/icons";

/**
 * A project tile (explorer.md "Project cards"): the cover in a Frame (4:5
 * on phones, 4:3 in desktop grids, or one of the two everywhere), then below
 * it category and city (14 px, blue), the name, one line and "In progress"
 * when the job is not finished. The whole card is one link; hover lifts the
 * frame 2 px.
 */

interface ProjectCardProps {
  project: CompletedProject;
  /** "responsive": 4:5 on phones, 4:3 from 48rem. */
  aspect?: "responsive" | "4/5" | "4/3";
  /** Real layout widths of the cover. */
  sizes?: string;
  as?: "h2" | "h3" | "h4";
  /** Adds a quiet line with the client and the number of photos (the projects index). */
  details?: boolean;
  className?: string;
}

export default function ProjectCard({
  project,
  aspect = "responsive",
  sizes = "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw",
  as: Title = "h3",
  details = false,
  className,
}: ProjectCardProps) {
  const cover = project.coverImage ? image(project.coverImage) : null;
  const city = projectCity(project);
  const inProgress = !isProjectComplete(project);
  const photoCount = project.phases.reduce((total, phase) => total + phase.images.length, 0);
  const detailLine = [project.client, photoCount > 0 ? `${photoCount} photos` : null].filter(Boolean).join(" · ");

  return (
    <Link href={`/projects/${project.slug}`} className={cn("project-card group block rounded-2xl", className)}>
      {cover && (
        <Frame
          media={cover}
          alt=""
          aspect={aspect === "4/3" ? "4/3" : "4/5"}
          sizes={sizes}
          frameClassName={cn(aspect === "responsive" && "md:aspect-[4/3]")}
        />
      )}
      <span className="mt-4 block">
        <span className="meta block text-accent">{[project.category, city].filter(Boolean).join(" · ")}</span>
        <Title className="mt-1.5 flex items-start gap-2 text-[1.0625rem] leading-snug font-semibold text-fg sm:text-xl">
          <span className="underline-offset-4 group-hover:underline group-hover:decoration-1">{project.name}</span>
          <ArrowRight className="mt-[0.2em] size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5" />
        </Title>
        <span className="mt-1.5 line-clamp-2 text-[0.9375rem] text-body sm:text-base">{project.description}</span>
        {details && detailLine && <span className="mt-2 block text-[0.9375rem] text-muted">{detailLine}</span>}
        {inProgress && (
          <span className="meta mt-3 inline-flex items-center gap-2 text-fg">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            In progress
          </span>
        )}
      </span>
    </Link>
  );
}
