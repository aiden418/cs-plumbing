import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Check, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { isProjectComplete, projectPhotoCount, projectStatusLabel } from "@/lib/projects";
import type { CompletedProject } from "@/lib/types";

/**
 * Grid of project tiles used as local proof on service hubs, service+city
 * pages and at the foot of a project page. No hooks or motion on purpose:
 * it renders on the server, adds nothing to the client bundle, and every
 * link is in the HTML for crawlers on first paint.
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
  tone?: "white" | "surface";
}) {
  if (projects.length === 0) return null;

  return (
    <section
      className={`py-16 sm:py-24 ${tone === "surface" ? "bg-[#F5F5F7]" : "bg-white border-t border-gray-200"}`}
      aria-labelledby="related-projects-heading"
    >
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
              {overline}
            </span>
            <h2
              id="related-projects-heading"
              className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl"
            >
              {heading}
            </h2>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {description}
              </p>
            )}
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {projects.map((project) => {
            const done = isProjectComplete(project);
            return (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-500 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image
                      src={project.coverImage}
                      alt={`${project.name} — C&S Plumbing of Lee project`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-900 backdrop-blur-sm sm:text-xs">
                        {project.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${
                          done ? "bg-white/90 text-navy backdrop-blur-sm" : "bg-gold/95 text-navy"
                        }`}
                      >
                        {done && <Check className="h-3 w-3 text-[#34C759]" strokeWidth={3} />}
                        {projectStatusLabel(project)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="mb-1 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary sm:text-lg">
                      {project.name}
                    </h3>
                    <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      {project.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {project.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Camera className="h-3 w-3 text-primary" />
                        {projectPhotoCount(project)} photos
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary sm:text-sm">
                      See the project <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
