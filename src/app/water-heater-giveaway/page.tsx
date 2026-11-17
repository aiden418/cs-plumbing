import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { Phone } from "@/components/ui/icons";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import GiveawayEntryForm from "@/components/giveaway/GiveawayEntryForm";
import { BUSINESS } from "@/lib/business";
import { licenseLine } from "@/lib/claims";
import { GIVEAWAY, isGiveawayOpen } from "@/lib/giveaway";
import { giveawayRules } from "@/lib/giveaway-rules";
import { heroFrame } from "@/lib/hero-frame";

// Open/closed is decided when the page renders; hourly revalidation flips it
// to the closed state after the end date without a deploy. The API enforces
// the exact cutoff either way.
export const revalidate = 3600;

const shareTitle = "Win a New Water Heater, Installed Free";
const description = `${GIVEAWAY.occasion}, C&S Plumbing of Lee is giving away ${GIVEAWAY.prizeShort}. Free to enter for Southwest Florida homeowners. Ends ${GIVEAWAY.endsLabel}.`;

export const metadata: Metadata = {
  alternates: { canonical: GIVEAWAY.path },
  title: "Water Heater Giveaway",
  description,
  openGraph: {
    type: "website",
    siteName: BUSINESS.fullName,
    title: `${shareTitle} | ${BUSINESS.fullName}`,
    description,
    url: `https://www.csplumbinglee.com${GIVEAWAY.path}`,
    // A committed JPEG with a photograph (scripts/build-giveaway-share-image.mjs);
    // rebuild it when the end date changes.
    images: [
      {
        url: "/og/water-heater-giveaway.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `Win a new water heater, installed free. ${BUSINESS.fullName} anniversary giveaway, enter by ${GIVEAWAY.endsLabelShort}.`,
      },
    ],
  },
};

const steps = [
  {
    title: "Fill out the form",
    description: "Your name, phone, email and the address of the home.",
  },
  {
    title: "Add a photo and the year",
    description: "Snap your current water heater and tell us the year on its label.",
  },
  {
    title: `Winner drawn ${GIVEAWAY.drawOnShort}`,
    description: "One entry is picked at random. We call and email the winner.",
  },
];

export default function Page() {
  const open = isGiveawayOpen();
  const rules = giveawayRules();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: GIVEAWAY.name, href: GIVEAWAY.path },
        ]}
      />

      <PageHero
        size="sm"
        frame={heroFrame({ src: "/images/gallery/rheem-water-heater.jpg", position: "center 30%" })}
        overline={open ? `Anniversary giveaway · Ends ${GIVEAWAY.endsLabelShort}` : "Giveaway closed"}
        title="Win a New Water Heater,"
        accent="Installed Free"
        description={
          open
            ? `${GIVEAWAY.occasion}, one Southwest Florida homeowner gets a brand-new tank water heater, installed by our licensed plumbers. Free to enter. Takes about a minute.`
            : `Entries closed on ${GIVEAWAY.endsLabel}. Thank you to everyone who entered. We contact the winner directly.`
        }
        actions={
          open ? (
            <Button href="#enter" variant="brass" size="lg">
              Enter now
            </Button>
          ) : (
            <Button href="/services/water-heaters" variant="brass" size="lg">
              Water heater services
            </Button>
          )
        }
      />

      <Section tone="shell" spacing="none" className="py-8 sm:py-12 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
            {/* Form first: the link is shared to people ready to enter. */}
            <div id="enter" className="min-w-0 scroll-mt-28 lg:col-span-7">
              {open ? (
                <GiveawayEntryForm />
              ) : (
                <div className="rounded-frame border border-steel-200 bg-white p-5 sm:p-8">
                  <h2 className="text-display-sm text-fg">This giveaway has ended</h2>
                  <p className="mt-2 text-body">
                    Entries closed at {GIVEAWAY.endsLabelLong}. Need a water heater looked at now?
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button href="/booking">Book a free estimate</Button>
                    <Button href={BUSINESS.phoneHref} variant="secondary" icon={<Phone className="size-5" />}>
                      {`Call ${BUSINESS.phone}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 lg:col-span-5">
              <h2 className="text-display-sm text-fg">The prize</h2>
              <p className="mt-3 text-body">{GIVEAWAY.prize}</p>
              <p className="mt-2 text-sm text-muted">Approximate retail value {GIVEAWAY.arv}.</p>

              <h2 className="mt-10 text-display-sm text-fg">How it works</h2>
              <ol className="mt-4 border-t border-rule">
                {steps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-3.5 border-b border-rule py-5">
                    <span aria-hidden="true" className="cv-num-disc">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="pt-0.5 text-lg leading-snug font-semibold text-fg">{step.title}</h3>
                      <p className="mt-1.5 text-body">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h2 className="mt-10 text-lg font-semibold text-fg">Watch for fake &quot;you won&quot; messages</h2>
              <p className="mt-2 text-body">{GIVEAWAY.scamWarning}</p>

              <p className="mt-8 text-sm text-muted">
                {BUSINESS.fullName} · Family owned since {BUSINESS.founded} · {licenseLine("marketing")}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" spacing="none" id="rules" className="scroll-mt-24 py-12 lg:py-16">
        <Container size="narrow">
          <h2 className="text-display-sm text-fg">Official rules</h2>
          <dl className="mt-6 space-y-5">
            {rules.map((rule, i) => (
              <div key={rule.title}>
                <dt className="font-semibold text-fg">
                  {i + 1}. {rule.title}
                </dt>
                <dd className="mt-1 text-body">{rule.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
