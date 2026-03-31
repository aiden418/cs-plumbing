import type { Metadata } from "next";
import BuilderPortalPage from "./BuilderPortalPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/builder-portal" },
  title: "Builder Portal — Submit Plans for a Quote",
  description:
    "Builders and general contractors: upload your blueprints and project details to request a plumbing quote from C&S Plumbing of Lee County. New construction, commercial, and remodel projects across Southwest Florida.",
  keywords: [
    "builder portal plumber",
    "submit plans plumbing quote",
    "new construction plumbing quote",
    "commercial plumbing bid",
    "plumbing contractor Cape Coral",
    "builder plumber Southwest Florida",
    "upload blueprints plumber",
  ],
  openGraph: {
    title: "Builder Portal | C&S Plumbing of Lee County",
    description:
      "Upload blueprints and project details to get a plumbing quote. New construction, commercial, and remodel projects.",
    url: "https://www.csplumbinglee.com/builder-portal",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Builder Portal", href: "/builder-portal" },
        ]}
      />
      <BuilderPortalPage />
    </>
  );
}
