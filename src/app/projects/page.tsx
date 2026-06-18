import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ProjectsIndexPage from "./ProjectsIndexPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ProjectsListJsonLd from "@/components/seo/ProjectsListJsonLd";
import { COMPLETED_PROJECTS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/projects" },
  title: "Completed Projects",
  description:
    "Browse completed plumbing projects by C&S Plumbing of Lee — new construction, remodels, and commercial work across Southwest Florida.",
  keywords: [
    "plumbing projects Cape Coral",
    "completed plumbing projects",
    "new construction plumbing SWFL",
    "plumbing contractor portfolio",
    "C&S Plumbing projects",
  ],
  openGraph: {
    title: "Completed Projects | C&S Plumbing",
    description:
      "Browse completed plumbing projects across Southwest Florida.",
    url: "https://www.csplumbinglee.com/projects",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ]}
      />
      <ProjectsListJsonLd projects={COMPLETED_PROJECTS} />
      <ProjectsIndexPage />
    </PageTransition>
  );
}
