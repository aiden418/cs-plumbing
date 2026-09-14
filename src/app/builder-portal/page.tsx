import type { Metadata } from "next";
import BuilderPortalPage from "./BuilderPortalPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/builder-portal" },
  title: "Builder Portal — Submit Plans for a Quote",
  description:
    "Builders and GCs: upload your blueprints to request a plumbing quote. New construction, commercial and remodel projects across Southwest Florida.",
  keywords: [
    "builder portal plumber",
    "submit plans plumbing quote",
    "new construction plumbing quote",
    "commercial plumbing bid",
    "plumbing contractor Cape Coral",
    "builder plumber Southwest Florida",
    "upload blueprints plumber",
    "plumbing subcontractor prequalification",
    "GC plumbing bid request",
    "plumbing bid Fort Myers",
    "builder plumber prequalification Lee County",
  ],
  openGraph: {
    title: "Builder Portal | C&S Plumbing of Lee",
    description:
      "Upload blueprints and project details to get a plumbing quote. New construction, commercial, and remodel projects.",
    url: "https://www.csplumbinglee.com/builder-portal",
  },
};

function HowToJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Request a Plumbing Quote as a General Contractor",
          description:
            "Submit your blueprints and project details through the C&S Plumbing Builder Portal to receive a detailed plumbing quote for new construction, commercial, or remodel projects.",
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Gather Your Blueprints",
              text: "Collect your project blueprints, specifications, and any relevant scope details for the plumbing portion of the build.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Upload Through the Builder Portal",
              text: "Use the C&S Plumbing Builder Portal to upload your blueprints and project files securely.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Provide Project Timeline & Scope",
              text: "Include your construction timeline, project address, scope of work, and any special requirements for the plumbing scope.",
            },
            {
              "@type": "HowToStep",
              position: 4,
              name: "Receive Your Detailed Quote",
              text: "C&S Plumbing reviews your plans and delivers a detailed plumbing quote within 24-48 hours, including scope breakdown and scheduling.",
            },
          ],
        }),
      }}
    />
  );
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Builder Portal", href: "/builder-portal" },
        ]}
      />
      <HowToJsonLd />
      <BuilderPortalPage />
    </>
  );
}
