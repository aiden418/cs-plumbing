import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Trophy, Vote, CalendarCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/ui/FaqAccordion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Credentials from "@/components/about/Credentials";
import { AWARDS, LATEST_AWARD } from "@/lib/constants";
import { AWARDS_FAQS } from "./awards-faqs";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-09-09" or "2025-09" → "September 2026". Read off the string so a
 *  UTC parse can't shift a first-of-month date into the previous month. */
function monthYear(iso: string) {
  const [y, m] = iso.split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : y;
}

const HOW_IT_WORKS = [
  {
    icon: <Vote className="w-5 h-5" />,
    title: "Readers vote",
    body: `Each summer the ${LATEST_AWARD.issuer} opens Best of Cape Coral voting. Residents nominate and vote for the local businesses they trust, category by category.`,
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Most votes wins",
    body: "The business with the most reader votes in each category wins. There's no judging panel — the result is the community's call.",
  },
  {
    icon: <CalendarCheck className="w-5 h-5" />,
    title: "Published each fall",
    body: "Winners are announced in September and published in the Breeze's Best of Cape Coral Winners Book, with a luncheon for the winners in October.",
  },
];

export default function AwardsPage() {
  return (
    <>
      <PageHero
        size="md"
        overline="Community Voted"
        title="Awards &"
        accent="Recognition"
        description={
          <>
            {LATEST_AWARD.issuer} readers voted C&amp;S Plumbing of Lee{" "}
            <strong className="text-white">{LATEST_AWARD.category}</strong> in the{" "}
            {LATEST_AWARD.year} Best of Cape Coral awards — our second year on the
            winners list. Here&rsquo;s every award, and how each one is decided.
          </>
        }
        media={
          <div className="relative mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <Image
              src={LATEST_AWARD.badge}
              alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
              width={LATEST_AWARD.badgeWidth}
              height={LATEST_AWARD.badgeHeight}
              sizes="(max-width: 1024px) 80vw, 384px"
              className="h-auto w-full"
              priority
            />
          </div>
        }
      />

      {/* Awards */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <SectionHeading
            overline="Best of Cape Coral"
            title="Voted by the people"
            accent="we work for"
            subtitle={`Two years on the ${LATEST_AWARD.issuer}'s winners list, in two categories.`}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {AWARDS.map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 card-lift card-lift-hover-subtle">
                  <div className="flex items-start gap-5">
                    <Image
                      src={a.badge}
                      alt={`${a.title} — ${a.category}`}
                      width={a.badgeWidth}
                      height={a.badgeHeight}
                      sizes="(max-width: 640px) 96px, 128px"
                      className="h-auto w-24 shrink-0 sm:w-32"
                    />
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {a.year}
                      </span>
                      <h3 className="mt-2 text-lg font-bold leading-tight text-gray-900 sm:text-xl">
                        {a.category}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{a.title}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {a.summary}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Awarded
                      </dt>
                      <dd className="mt-0.5 font-medium text-gray-900">
                        {monthYear(a.awardedOn)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Voted by
                      </dt>
                      <dd className="mt-0.5 font-medium text-gray-900">
                        <a
                          href={a.citationUrl ?? a.issuerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-primary hover:underline"
                        >
                          {a.issuer} readers
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works — the paragraph an answer engine quotes */}
      <section className="bg-[#F5F5F7] py-16 sm:py-24">
        <Container>
          <SectionHeading
            align="left"
            overline="How it's decided"
            title="What a Best of Cape Coral"
            accent="award actually means"
            subtitle="It isn't a paid list or a panel of judges. It's a readership vote run by the city's newspaper — and the votes come from people whose homes we've been in."
          />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <p className="mt-8 text-sm text-gray-500">
              A vote is a lagging indicator — it reflects work that was already done. Read it
              alongside the things you can check yourself: our{" "}
              <Link href="/reviews" className="font-semibold text-primary hover:underline">
                Google reviews
              </Link>
              , our{" "}
              <Link href="/projects" className="font-semibold text-primary hover:underline">
                completed projects
              </Link>
              , and both licenses on the DBPR.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* Licenses, insurance, builders — the verifiable half of "trust" */}
      <Credentials />

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            overline="Questions"
            title="About the"
            accent="awards"
          />
          <FaqAccordion faqs={AWARDS_FAQS} />
        </Container>
      </section>
    </>
  );
}
