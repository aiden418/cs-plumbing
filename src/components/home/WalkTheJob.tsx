import Container from "@/components/ui/Container";
import FeaturedProjects from "@/components/explorer/FeaturedProjects";
import { featuredProjects } from "@/components/explorer/featured-data";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { collection, imageMeta } from "@/lib/media";
import { phaseFolder } from "@/lib/projects-data";
import { walk } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/**
 * The two featured jobs. Each phase's rail is that phase's photographs
 * marked `featured` in its images.json, in folder order; a phase with none
 * is left out.
 */
function featured() {
  return featuredProjects(walk.projects)
    .map((project) => ({
      ...project,
      phases: project.phases.filter((phase) =>
        collection(phaseFolder(project.slug, phase.slug)).some((m) => imageMeta(m.path)?.featured),
      ),
    }))
    .filter((project) => project.phases.length > 0);
}

/** Our work, on white: the project explorer (FeaturedProjects) and the link to every project. */
export default function WalkTheJob() {
  const projects = featured();
  return (
    <section data-tone="white" aria-labelledby="home-walk-title" className="relative bg-canvas py-14 text-body lg:py-20">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 lg:mb-10">
          <HomeHeading id="home-walk-title" title={walk.title} />
          <ArrowLink href={walk.allLink.href}>{walk.allLink.label}</ArrowLink>
        </div>
      </Container>
      <LightboxProvider>
        <FeaturedProjects projects={projects} label={walk.title} />
      </LightboxProvider>
    </section>
  );
}
