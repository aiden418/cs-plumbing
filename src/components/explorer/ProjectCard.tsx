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
 * it category and city in label-tech, the name, one line and "In progress"
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
  className?: string;
}

export default function ProjectCard({
  project,
  aspect = "responsive",
  sizes = "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw",
  as: Title = "h3",
  className,
}: ProjectCardProps) {
  const cover = project.coverImage ? image(project.coverImage) : null;
  const city = projectCity(project);
  const inProgress = !isProjectComplete(project);

  return (
    <Link href={`/projects/${project.slug}`} className={cn("project-card group block rounded-frame", className)}>
      {cover && (
        <Frame
          media={cover}
          alt=""
          aspect={aspect === "4/3" ? "4/3" : "4/5"}
          sizes={sizes}
          frameClassName={cn(
            aspect === "responsive" && "md:aspect-[4/3]",
            "transition-transform duration-250 ease-settle group-hover:-translate-y-0.5",
          )}
        />
      )}
      <span className="mt-4 block">
        <span className="label-tech block text-accent">{[project.category, city].filter(Boolean).join(" · ")}</span>
        <Title className="mt-2 flex items-start gap-2 text-base leading-snug sm:text-lg font-semibold text-fg">
          <span className="underline-offset-4 group-hover:underline group-hover:decoration-1">{project.name}</span>
          <ArrowRight className="mt-[0.2em] size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </Title>
        <span className="mt-1.5 line-clamp-2 text-sm text-muted">{project.description}</span>
        {inProgress && (
          <span className="label-tech mt-3 inline-flex items-center gap-2 text-fg">
            <span className="joint text-primary" aria-hidden="true" />
            In progress
          </span>
        )}
      </span>
    </Link>
  );
}
