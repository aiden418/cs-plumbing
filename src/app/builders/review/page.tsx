import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { ExternalLink, Mail } from "@/components/ui/icons";
import { BUILDER_REVIEW as COPY } from "@/content/builders";
import { BUILDER_DESK, BUILDER_REVIEW_PROMPTS } from "@/lib/builder-program";
import { getWriteReviewUrl } from "@/lib/google-reviews";

// A link we send to builders after a job, not a page for search.
export const metadata: Metadata = {
  title: "Review C&S Plumbing — For Builders",
  description: "Builders and GCs: tell other builders what working with C&S Plumbing of Lee was like.",
  alternates: { canonical: "/builders/review" },
  robots: { index: false, follow: true },
};

export default function BuilderReviewPage() {
  const reviewUrl = getWriteReviewUrl();
  // Every builder gets the same review link, whatever they'd rate us.
  // No screening for happy customers first (Google treats that as review gating).
  return (
    <>
      <PageHero
        layout="compact"
        overline={COPY.overline}
        title={COPY.title}
        accent={COPY.accent}
        description={COPY.description}
      />

      <Section tone="white" labelledBy="builder-review-prompts">
        <Container size="narrow">
          <h2 id="builder-review-prompts" className="text-display-sm text-fg">
            {COPY.promptsTitle}
          </h2>
          <p className="mt-3 text-body">{COPY.promptsNote}</p>
          <ul className="mt-8 border-b border-rule">
            {BUILDER_REVIEW_PROMPTS.map((q) => (
              <li key={q} className="border-t border-rule py-5 text-lg text-fg">
                {q}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href={reviewUrl} target="_blank" size="lg" iconRight={<ExternalLink className="size-5" />}>
              {COPY.writeReview}
            </Button>
          </div>

          <p className="mt-12 border-t border-rule pt-6 text-sm text-muted">
            {COPY.fixPrefix}{" "}
            <a
              href={`mailto:${BUILDER_DESK.email}`}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] hover:underline"
            >
              <Mail className="size-4" aria-hidden="true" />
              {BUILDER_DESK.email}
            </a>
            {COPY.fixSuffix}
          </p>
        </Container>
      </Section>
    </>
  );
}
