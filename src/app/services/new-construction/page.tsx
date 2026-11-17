import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Stepper from "@/components/ui/Stepper";
import { Check } from "@/components/ui/icons";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import RelatedProjects from "@/components/projects/RelatedProjects";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import NewConstructionCityLinks from "@/components/builders/NewConstructionCityLinks";
import { Chapter, HeroActions } from "@/components/services/ServiceLandingTemplate";
import { BUSINESS } from "@/lib/constants";
import { projectsForHub } from "@/lib/projects";
import { picture } from "@/lib/media";
import { NEW_CONSTRUCTION_PAGE as COPY } from "@/content/services";

const newConstructionFaqs = [
  {
    question: "Who is the best plumber for new construction in Cape Coral and Fort Myers?",
    answer: "C&S Plumbing of Lee is Southwest Florida's most experienced new construction plumber, with 9,500+ homes plumbed since 1998. We're the go-to plumbing partner for residential and commercial builders across Lee and Collier County.",
  },
  {
    question: "Do you handle new construction plumbing for both residential and commercial builds?",
    answer: "Yes. We provide full new construction plumbing for single-family homes, multi-family developments, and light commercial buildings throughout Southwest Florida. Our services cover pre-construction planning, underground work, rough-in, trim-out, and final inspection.",
  },
  {
    question: "What is included in new construction plumbing rough-in?",
    answer: "Rough-in plumbing includes installing all supply and drain lines inside the walls and floors before drywall goes up. This covers water supply lines, DWV (drain, waste, and vent) piping, stub-outs for all fixtures, and any underground slab work. All rough-in work is permitted and inspected by Lee County.",
  },
  {
    question: "Do you pull permits for new construction plumbing in Lee County?",
    answer: `Yes. C&S Plumbing manages all permit applications, inspections, and final sign-offs for every new construction project. Our license number is ${BUSINESS.license}, issued by the Florida Department of Business and Professional Regulation.`,
  },
  {
    question: "How do I get C&S Plumbing on my new construction project as a builder?",
    answer: `Contact us directly at ${BUSINESS.phone} or through the Partner With Us form on our website. We work with builders of all sizes — from custom home builders to large-scale residential developers. We'll review your blueprints, provide a detailed scope and quote, and coordinate directly with your project schedule.`,
  },
  {
    question: "How far in advance should I schedule a plumber for new construction?",
    answer: "We recommend contacting us as early as possible in the planning phase — ideally before permits are submitted. Early coordination allows us to review blueprints, flag any plumbing layout issues, and ensure our schedule aligns with your construction timeline.",
  },
  {
    question: "Do you do new construction plumbing in Lehigh Acres, Bonita Springs, and Naples?",
    answer: "Yes. C&S Plumbing serves all of Southwest Florida for new construction, including Cape Coral, Fort Myers, Lehigh Acres, Bonita Springs, Estero, Naples, and surrounding areas in Lee and Collier County.",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/services/new-construction" },
  title: { absolute: "New Construction Plumber | Cape Coral & Fort Myers" },
  description:
    "9,500+ new construction homes plumbed in Cape Coral, Fort Myers & SWFL. The builder's partner for reliability, code compliance & precision.",
  keywords: [
    "new construction plumber Cape Coral",
    "new construction plumbing Fort Myers",
    "builder plumber Southwest Florida",
    "rough-in plumbing Lee County",
    "new home plumbing SWFL",
    "construction plumbing contractor",
    "underground plumbing Cape Coral",
    "trim-out plumbing Fort Myers",
    "plumbing subcontractor new construction",
    "builder plumbing sub SWFL",
    "new construction plumbing bid",
  ],
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "New Construction Plumbing | C&S Plumbing of Lee",
    description:
      "9,500+ homes plumbed. The builder's choice for new construction plumbing in Cape Coral, Fort Myers & all of Southwest Florida.",
    url: "https://www.csplumbinglee.com/services/new-construction",
  },
};

const process = [
  {
    step: "01",
    title: "Pre-Construction Planning",
    description:
      "We review blueprints, assess site conditions, and create a detailed plumbing plan that aligns with your construction timeline.",
  },
  {
    step: "02",
    title: "Underground & Rough-In",
    description:
      "Our team installs underground piping and completes rough-in work, coordinating with other trades for seamless progress.",
  },
  {
    step: "03",
    title: "Trim-Out & Fixtures",
    description:
      "Final fixture installation, connections, and system testing. Every faucet, toilet, and water line is carefully installed and tested.",
  },
  {
    step: "04",
    title: "Inspection & Turnover",
    description:
      "We handle all permit inspections and provide a final walkthrough. Your client gets a perfectly plumbed home, every time.",
  },
];

const advantages = [
  { text: "9,500+ homes plumbed" },
  { text: "On-time, every time" },
  { text: "Full code compliance" },
  { text: "5.0-Star Rated" },
];

export default function NewConstructionPage() {
  const frame = picture("service.header.new-construction");
  return (
    <>
      {/* Hero */}
      <PageHero
        layout="photo"
        frame={frame}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "New Construction", href: "/services/new-construction" },
        ]}
        overline="New Construction"
        title="The Builder's Choice for"
        accent="New Construction Plumbing"
        description="With over 9,500 new construction homes plumbed across Southwest Florida, C&S Plumbing is the go-to partner for builders who demand reliability, code-compliance, and timeline precision."
        actions={<HeroActions second={{ label: COPY.partner, href: COPY.partnerHref }} />}
      />

      {/* Big number and the four proof points */}
      <Section tone="white" spacing="sm">
        <Container>
          <div className="grid grid-cols-1 items-end gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-6">
              <p className="font-display text-display-xl font-bold text-fg tabular-nums [font-stretch:108%]">
                {COPY.bigNumber}
              </p>
              <p className="mt-3 max-w-[32ch] text-lead text-body">{COPY.bigNumberCaption}</p>
            </div>
            <ul className="grid grid-cols-2 border-b border-rule lg:col-span-6">
              {advantages.map((adv, i) => (
                <li
                  key={adv.text}
                  className={`flex min-h-16 items-center gap-2.5 border-t border-rule py-4 font-semibold text-fg ${i % 2 === 1 ? "pl-4 border-l sm:pl-5" : "pr-4 sm:pr-5"}`}
                >
                  <Check className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  {adv.text}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="shell" spacing="sm" labelledBy="process-heading">
        <Container>
          <SectionHeading
            align="left"
            id="process-heading"
            overline={COPY.processOverline}
            title={COPY.processTitle}
          />
          <div>
            <Stepper
              label={COPY.processTitle}
              items={process.map((step) => ({
                meta: step.step,
                label: step.title,
                description: step.description,
              }))}
              className="[&_li]:min-w-[15rem] lg:[&_li]:min-w-0"
            />
          </div>
        </Container>
      </Section>

      <NewConstructionBenefits />

      {/* Documented builds — proof for the builder reading this page */}
      <RelatedProjects
        projects={projectsForHub("new-construction", 6)}
        overline="Documented builds"
        heading="New construction plumbing, photographed phase by phase"
        description="Underground, second rough and trim on real Southwest Florida builds, with the builder named on each one. Judge the work, not the pitch."
        tone="shell"
      />

      {/* FAQ */}
      <Section tone="white" spacing="sm" labelledBy="new-construction-faq-heading">
        <Container>
          <Chapter id="new-construction-faq-heading" overline={COPY.faqOverline} title={COPY.faqTitle}>
            <FaqAccordion faqs={newConstructionFaqs} />
          </Chapter>
        </Container>
      </Section>

      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: "New Construction", href: "/services/new-construction" }]} />
      <FaqJsonLd faqs={newConstructionFaqs} />
      <NewConstructionCityLinks />
      <CTASection />
    </>
  );
}
