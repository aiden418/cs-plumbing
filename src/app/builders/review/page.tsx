import type { Metadata } from "next";
import { ExternalLink, Mail, MessageSquareQuote } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
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
    <PageTransition>
      <PageHero
        size="sm"
        overline="For builders & GCs"
        title="How did we"
        accent="do on your job?"
        description="Other builders pick a plumbing sub on what builders say. There's no script. Write it in your own words, good or bad."
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <MessageSquareQuote className="h-6 w-6 text-primary" />
              Not sure where to start?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Pick any of these that apply, or skip them. They&apos;re prompts, not a template.
            </p>
            <ul className="mt-6 space-y-3">
              {BUILDER_REVIEW_PROMPTS.map((q) => (
                <li key={q} className="rounded-xl border border-gray-200 bg-[#F5F5F7] px-5 py-4 text-gray-800">
                  {q}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Write a Google review <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
              Something we should fix before the next job? Tell our project management desk
              directly at{" "}
              <a href={`mailto:${BUILDER_DESK.email}`} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" />
                {BUILDER_DESK.email}
              </a>
              . That goes to our team, and it doesn&apos;t replace a public review.
            </p>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
