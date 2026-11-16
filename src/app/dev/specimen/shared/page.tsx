import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import BlogRelatedLandings from "@/components/blog/BlogRelatedLandings";
import RelatedPosts from "@/components/blog/RelatedPosts";
import BuilderBidForm from "@/components/builders/BuilderBidForm";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import NewConstructionCityLinks from "@/components/builders/NewConstructionCityLinks";
import GoogleReviews from "@/components/home/GoogleReviews";
import RelatedProjects from "@/components/projects/RelatedProjects";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import { BLOG_POSTS } from "@/lib/constants";
import { latestPosts } from "@/lib/internal-links";
import { projectsForHub } from "@/lib/projects";
import { UploadAlone } from "./UploadAlone";

/**
 * Shared blocks specimen: every block the page families share, with real
 * data, on white, shell and ink. A development and review page only: it 404s
 * in a production build unless the review switch (NEXT_PUBLIC_ANALYTICS=off)
 * is on, and it is never indexed. Several blocks carry fixed ids, so ids
 * repeat across the three tones here; on a real page each block appears once.
 */

const VISIBLE = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS === "off";

export const metadata: Metadata = {
  title: "Shared blocks specimen",
  robots: { index: false, follow: false },
};

const TONES: Exclude<Tone, "navy">[] = ["white", "shell", "ink"];

function ToneBar({ tone }: { tone: Tone }) {
  return (
    <div data-tone="shell" className="border-y border-rule bg-canvas py-3">
      <Container>
        <p className="meta text-accent">Tone: {tone}</p>
      </Container>
    </div>
  );
}

export default function SharedBlocksSpecimen() {
  if (!VISIBLE) notFound();
  const projects = projectsForHub("new-construction", 3);
  const posts = latestPosts(3);
  const post = BLOG_POSTS.find((p) => (p.relatedLandings?.length ?? 0) > 0) ?? BLOG_POSTS[0];

  return (
    <div className="pt-[var(--nav-h)]">
      <Section tone="white" spacing="sm">
        <Container>
          <h1 className="text-display-lg text-fg">Shared blocks</h1>
          <p className="mt-4 max-w-[56ch] text-lead text-body">
            Related projects, related posts, blog landings, builder city links, customer benefits, Google reviews and
            the two lead forms, on white and shell (their defaults) and on ink (still supported).
          </p>
        </Container>
      </Section>

      {TONES.map((tone) => (
        <div key={tone}>
          <ToneBar tone={tone} />
          <RelatedProjects
            projects={projects}
            overline="Documented builds"
            heading="Our work in Cape Coral"
            description="Jobs we've photographed phase by phase in Cape Coral."
            tone={tone}
          />
          <RelatedPosts
            posts={posts}
            heading="Plumbing guides for Southwest Florida homeowners"
            description="Costs, warning signs and storm prep, written for Cape Coral, Fort Myers and the rest of SWFL."
            tone={tone}
          />
          <BlogRelatedLandings post={post} tone={tone} />
          <NewConstructionCityLinks tone={tone} />
          <NewConstructionBenefits overline="What your buyers get" tone={tone} />
          <GoogleReviews tone={tone} />
          <Section tone={tone} divider={tone === "white"}>
            <Container>
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                <div id={tone === "white" ? "request-service" : undefined}>
                  <ServiceRequestForm defaultService="water-heater" source="service-page" />
                </div>
                <BuilderBidForm source={`specimen-${tone}`} />
              </div>
            </Container>
          </Section>
        </div>
      ))}

      <ToneBar tone="white" />
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="mb-6 text-display-sm text-fg">Chat (compact)</h2>
              <div className="max-w-sm rounded-2xl border border-rule p-4">
                <ServiceRequestForm compact source="chat" />
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-display-sm text-fg">Upload without a label (booking, portal)</h2>
              <UploadAlone />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
