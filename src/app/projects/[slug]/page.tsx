import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ProjectDetail from "@/components/projects/ProjectDetail";
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
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.metaTitle,
      description: project.metaDescription,
      url: `https://www.csplumbinglee.com/projects/${project.slug}`,
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
      <ProjectDetail project={project} />
      <CTASection />
    </PageTransition>
  );
}
