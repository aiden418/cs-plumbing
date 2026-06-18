import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ProjectDetail from "@/components/projects/ProjectDetail";
import ProjectJsonLd from "@/components/seo/ProjectJsonLd";
import CTASection from "@/components/home/CTASection";
import { COMPLETED_PROJECTS } from "@/lib/constants";

export function generateStaticParams() {
  return COMPLETED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = COMPLETED_PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.metaTitle,
    description: project.metaDescription,
    keywords: [
      project.name,
      `${project.category} plumbing`,
      ...(project.location ? [`plumbing project ${project.location}`] : []),
      "C&S Plumbing projects",
    ],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.metaTitle,
      description: project.metaDescription,
      url: `https://www.csplumbinglee.com/projects/${project.slug}`,
      images: project.coverImage
        ? [{ url: project.coverImage, alt: project.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.metaTitle,
      description: project.metaDescription,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = COMPLETED_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
          { name: project.name, href: `/projects/${project.slug}` },
        ]}
      />
      <ProjectJsonLd project={project} />
      <ProjectDetail project={project} />
      <CTASection />
    </PageTransition>
  );
}
