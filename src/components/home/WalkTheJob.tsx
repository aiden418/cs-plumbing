import Link from "next/link";
import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import FeaturedProjects from "@/components/explorer/FeaturedProjects";
import { featuredProjects } from "@/components/explorer/featured-data";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { BUILDERS } from "@/lib/builders-data";
import { collection, imageMeta } from "@/lib/media";
import { phaseFolder } from "@/lib/projects-data";
import { builders, walk } from "@/content/home";

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline";

/**
 * A see-through logo drawn in white (its dominant colour is pure white)
 * would vanish on a white cell: that cell is set on ink instead.
 */
function whiteLogo(path: string) {
  const meta = imageMeta(path);
  return Boolean(meta?.alpha && meta.color?.toLowerCase() === "#ffffff");
}

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

/**
 * Chapter 3: "Walk the job" on ink (FeaturedProjects, placed full width),
 * then the builders who trust C&S as a hairline logo wall on white.
 */
export default function WalkTheJob() {
  const projects = featured();
  return (
    <>
      <Section tone="ink" spacing="none" className="py-section-sm lg:py-section" labelledBy="home-walk-title">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 lg:mb-14">
            <SectionHeading id="home-walk-title" align="left" title={walk.title} className="mb-0" />
            <Link href={walk.allLink.href} className={linkClass}>
              {walk.allLink.label}
              <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Container>
        <LightboxProvider>
          <FeaturedProjects projects={projects} label={walk.title} />
        </LightboxProvider>
      </Section>

      <Section tone="white" spacing="sm" labelledBy="home-builders-title">
        <Container>
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
            <SectionHeading
              id="home-builders-title"
              align="left"
              overline={builders.overline}
              title={builders.title}
              subtitle={builders.subtitle}
              className="mb-0 lg:col-span-8"
            />
            <p className="lg:col-span-4 lg:text-right">
              <Link href={builders.link.href} className={linkClass}>
                {builders.link.label}
                <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>
          <ul className="home-logo-wall mt-10">
            {BUILDERS.map((builder) => (
              <li key={builder.name} data-tone={whiteLogo(builder.logo) ? "ink" : undefined}>
                <BuilderLogoImage
                  builder={builder}
                  sizes="140px"
                  className="h-8 w-auto max-w-full object-contain sm:h-10 lg:max-w-[8.5rem]"
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
