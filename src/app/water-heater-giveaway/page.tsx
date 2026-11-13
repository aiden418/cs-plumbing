import type { Metadata } from "next";
import { Camera, CalendarCheck, ClipboardList, Gift, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import GiveawayEntryForm from "@/components/giveaway/GiveawayEntryForm";
import { BUSINESS } from "@/lib/constants";
import { licenseLine } from "@/lib/claims";
import { GIVEAWAY, giveawayRules, isGiveawayOpen } from "@/lib/giveaway";

// Open/closed is decided when the page renders; hourly revalidation flips it
// to the closed state after the end date without a deploy. The API enforces
// the exact cutoff either way.
export const revalidate = 3600;

const description = `Enter to win ${GIVEAWAY.prizeShort} by C&S Plumbing of Lee. Free to enter for Southwest Florida homeowners. Ends ${GIVEAWAY.endsLabel}.`;

export const metadata: Metadata = {
  alternates: { canonical: GIVEAWAY.path },
  title: "Water Heater Giveaway",
  description,
  openGraph: {
    title: "Win a New Water Heater, Installed | C&S Plumbing of Lee",
    description,
    url: `https://www.csplumbinglee.com${GIVEAWAY.path}`,
  },
};

const steps = [
  {
    icon: ClipboardList,
    title: "Fill out the form",
    body: "Your name, phone, email and the address of the home.",
  },
  {
    icon: Camera,
    title: "Add a photo and the year",
    body: "Snap your current water heater and tell us the year on its label.",
  },
  {
    icon: CalendarCheck,
    title: `Winner drawn ${GIVEAWAY.drawOn}`,
    body: "One entry is picked at random. We call and email the winner.",
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
        overline={open ? `Giveaway · Ends ${GIVEAWAY.endsLabel}` : "Giveaway closed"}
        overlineIcon={<Gift className="h-4 w-4" />}
        title="Win a New Water Heater,"
        accent="Installed Free."
        description={
          open
            ? "One Southwest Florida homeowner gets a brand-new tank water heater, installed by our licensed plumbers. Free to enter, takes about a minute."
            : `Entries closed on ${GIVEAWAY.endsLabel}. Thank you to everyone who entered. We contact the winner directly.`
        }
        image={{ src: "/images/gallery/tank-water-heater-replacement.jpg", position: "center 35%" }}
        actions={
          open ? (
            <Button href="#enter" variant="gold" size="lg">
              Enter Now
            </Button>
          ) : (
            <Button href="/services/water-heaters" variant="gold" size="lg">
              Water Heater Services
            </Button>
          )
        }
      />

      <section className="py-10 sm:py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
            {/* Form first on phones: the link is shared to people ready to enter. */}
            <div id="enter" className="scroll-mt-28 lg:order-2 lg:col-span-3">
              {open ? (
                <GiveawayEntryForm />
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-6 sm:p-8 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">This giveaway has ended</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Entries closed at {GIVEAWAY.endsLabelLong}. Need a water heater looked at now?
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button href="/booking">Book a Free Estimate</Button>
                    <Button href={`tel:${BUSINESS.phoneRaw}`} variant="secondary" icon={<Phone className="h-4 w-4" />}>
                      {BUSINESS.phone}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:order-1 lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How it works</h2>
              <ol className="mt-6 space-y-5">
                {steps.map((step) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{step.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-2xl bg-navy p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">The prize</p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{GIVEAWAY.prize}</p>
                <p className="mt-3 text-xs text-white/60">Approximate retail value {GIVEAWAY.arv}.</p>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-gray-500">
                {BUSINESS.fullName} · Family owned since {BUSINESS.founded} · {licenseLine("marketing")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="rules" className="scroll-mt-24 bg-[#F5F5F7] py-12 sm:py-16">
        <Container size="narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Official rules</h2>
          <dl className="mt-6 space-y-5">
            {rules.map((rule, i) => (
              <div key={rule.title}>
                <dt className="text-sm font-semibold text-gray-900">
                  {i + 1}. {rule.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-gray-600">{rule.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
