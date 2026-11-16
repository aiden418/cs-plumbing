import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GALLERY_ITEMS } from "@/lib/gallery-data";
import { image } from "@/lib/media";
import { COMPLETED_PROJECTS } from "@/lib/projects-data";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeaturedProjects from "@/components/explorer/FeaturedProjects";
import ProjectCard from "@/components/explorer/ProjectCard";
import ProjectExplorer from "@/components/explorer/ProjectExplorer";
import { featuredProjects } from "@/components/explorer/featured-data";
import GalleryGrid, { type GalleryGridItem } from "@/components/gallery/GalleryGrid";
import LightboxProvider from "@/components/lightbox/LightboxProvider";

/**
 * Development-only specimen of "Walk the job": the project explorer on a
 * multi-phase and a single-phase project, the homepage's featured projects
 * on ink, the gallery grid with its filters over the real gallery, and the
 * project cards in both shapes. 404 in a production build unless it was
 * built with NEXT_PUBLIC_ANALYTICS=off (review builds). Never indexed.
 */

export const metadata: Metadata = {
  title: "Explorer specimen",
  robots: { index: false, follow: false },
};

const VISIBLE = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS === "off";

const MULTI_PHASE = "ifha-community-center";
const SINGLE_PHASE = "306-seminal-way-fort-myers-beach";
const FEATURED = ["ifha-community-center", "usps-cape-coral-remodel"];

export default function ExplorerSpecimenPage() {
  if (!VISIBLE) notFound();

  const multi = COMPLETED_PROJECTS.find((p) => p.slug === MULTI_PHASE);
  const single = COMPLETED_PROJECTS.find((p) => p.slug === SINGLE_PHASE);
  const featured = featuredProjects(FEATURED);

  const galleryItems: GalleryGridItem[] = [];
  for (const item of GALLERY_ITEMS) {
    const media = image(item.src, { caption: item.title });
    if (media) galleryItems.push({ media, category: item.category });
  }
  const categories = GALLERY_CATEGORIES.map(({ id, label }) => ({ id, label }));

  return (
    <LightboxProvider>
      <Section tone="ink" spacing="sm" className="pt-[calc(var(--nav-h)+6rem)]">
        <Container>
          <Eyebrow>Development only</Eyebrow>
          <h1 className="mt-4 text-display-lg">Walk the job</h1>
          <p className="mt-4 max-w-[56ch] text-lead">
            Filmstrip, phase line, lightbox, featured projects, gallery grid and project cards.
          </p>
        </Container>
      </Section>

      {multi && (
        <Section tone="white" spacing="none" className="pt-section-sm" labelledBy="specimen-multi">
          <Container>
            <SectionHeading
              id="specimen-multi"
              overline="ProjectExplorer: several phases"
              title={multi.name}
              subtitle={multi.description}
            />
          </Container>
          <ProjectExplorer project={multi} as="h3" className="mt-10" />
        </Section>
      )}

      {single && (
        <Section tone="shell" spacing="sm" labelledBy="specimen-single">
          <Container>
            <SectionHeading id="specimen-single" overline="ProjectExplorer: one phase" title={single.name} />
          </Container>
          <ProjectExplorer project={single} as="h3" eager={0} className="mt-10" />
        </Section>
      )}

      <Section tone="ink" labelledBy="specimen-featured">
        <Container>
          <SectionHeading id="specimen-featured" overline="FeaturedProjects" title="Two jobs, phase by phase" />
        </Container>
        <div className="mt-12">
          <FeaturedProjects projects={featured} />
        </div>
      </Section>

      <Section tone="white" labelledBy="specimen-gallery">
        <Container>
          <SectionHeading
            id="specimen-gallery"
            overline="GalleryGrid + GalleryFilters"
            title={`The gallery, ${galleryItems.length} photos`}
          />
          <div className="mt-10">
            <GalleryGrid items={galleryItems} categories={categories} title="Our work" />
          </div>
        </Container>
      </Section>

      <Section tone="shell" labelledBy="specimen-cards">
        <Container>
          <SectionHeading id="specimen-cards" overline="ProjectCard" title="Every project, 4:5 then 4:3" />
          <h3 className="label-tech mt-12 text-accent">Responsive: 4:5 on phones, 4:3 from 48rem</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {COMPLETED_PROJECTS.map((project) => (
              <li key={project.slug}>
                <ProjectCard
                  project={project}
                  sizes="(min-width: 1024px) 18rem, (min-width: 768px) 30vw, 45vw"
                  as="h4"
                />
              </li>
            ))}
          </ul>
          <h3 className="label-tech mt-16 text-accent">Fixed 4:5</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
            {COMPLETED_PROJECTS.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} aspect="4/5" sizes="(min-width: 768px) 18rem, 45vw" as="h4" />
              </li>
            ))}
          </ul>
          <h3 className="label-tech mt-16 text-accent">Fixed 4:3</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {COMPLETED_PROJECTS.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} aspect="4/3" sizes="(min-width: 768px) 24rem, 90vw" as="h4" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </LightboxProvider>
  );
}
