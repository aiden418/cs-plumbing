import {
  Hammer,
  ClipboardCheck,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";

// Builder roster mirrors src/components/home/BuilderShowcase.tsx
const BUILDERS = [
  { name: "Draft Construction LLC", logo: "/images/builders/draft-construction.png" },
  { name: "Poseidon Homes", logo: "/images/builders/poseidon-homes.webp" },
  { name: "Alair Homes", logo: "/images/builders/alair-homes.svg" },
  { name: "Red Key Builders", logo: "/images/builders/red-key-builders.png" },
  { name: "Heather Wood Construction", logo: "/images/builders/heather-wood.webp" },
  { name: "Stellar Development", logo: "/images/builders/stellar-development.jpg" },
  { name: "Engelke Construction Solutions", logo: "/images/builders/engelke.png" },
  { name: "Itasca Construction Associates", logo: "/images/builders/itasca.png" },
  { name: "McDowell Construction", logo: "/images/builders/mcdowell.png" },
];

const WHY_CS = [
  {
    icon: <Hammer className="w-6 h-6" />,
    title: "Rough-in to trim",
    description:
      "Full underground, in-wall rough, water heater set, fixture trim, and final inspection on every project.",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Permit + inspection support",
    description:
      "We pull permits, coordinate inspections, and own the paperwork so your project clears Lee County without delay.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "On-schedule delivery",
    description:
      "Lee County crews staged across the service area. We hit your rough-in date and stay coordinated with your other trades.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Code-compliant from day one",
    description:
      "Two active state licenses (CFC1432485 / CFC057076). Every fixture, slope, and vent meets current FL Building Code.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Plans uploaded",
    description:
      "Submit prints, scope notes, and target dates via the form below.",
  },
  {
    title: "Takeoff & proposal",
    description:
      "Detailed plumbing takeoff and written proposal back to you within 3–5 business days.",
  },
  {
    title: "Kickoff scheduled",
    description:
      "Once approved, we schedule rough-in around your slab / framing dates and confirm material delivery.",
  },
  {
    title: "Rough-in",
    description:
      "Underground first, then in-wall. Pressure-tested before pour and before drywall.",
  },
  {
    title: "Trim & final inspection",
    description:
      "Fixture trim, water heater set, and final county inspection. We don't leave until it's signed off.",
  },
];

const WHAT_WE_NEED = [
  "Site plans and architectural drawings (PDF or DWG)",
  "Plumbing fixture schedule (or rough fixture count if not finalized)",
  "Permit set if you have one — otherwise we'll work from the architecturals",
  "Target rough-in date and any GC scheduling constraints",
];

export default function BuilderPortalIntro() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 bg-[#F5F5F7] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,119,204,0.08)_0%,transparent_60%)]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Builder Portal
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-5 sm:mb-6">
              Plans in. Quote out.{" "}
              <span className="text-gradient">Crews ready.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-3">
              C&amp;S Plumbing has been the underground-to-trim partner for Lee
              County builders since 1998. <strong className="text-gray-900">8,500+ homes built</strong>,
              two active state licenses, and a 5.0 rating from the GCs and custom
              home builders we work with every week.
            </p>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 sm:mb-10">
              Upload your plans below. We&apos;ll come back with a detailed takeoff
              and proposal within 3–5 business days — no upfront cost, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button href="#upload-plans" size="lg">
                Submit Plans
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href={`tel:${BUSINESS.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
              >
                Call {BUSINESS.phone}
              </Button>
            </div>
            <p className="mt-5 text-xs text-gray-400">
              License #CFC1432485 · #CFC057076 · Family-owned since 1998
            </p>
          </div>
        </Container>
      </section>

      {/* Why C&S */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white">
        <Container>
          <SectionHeading
            overline="Why C&S"
            title="Why builders choose us for the plumbing scope"
            subtitle="The plumber on a project either keeps the schedule or breaks it. We keep it."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {WHY_CS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div className="h-full bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-primary/30 transition-all duration-500">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 lg:py-28 bg-[#F5F5F7]">
        <Container>
          <SectionHeading
            overline="Our process"
            title="Plan to inspection — no surprises"
            subtitle="The same playbook we've run on 8,500+ homes."
          />
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.06}>
                <li className="relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 h-full">
                  <span
                    aria-hidden="true"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-sm shadow-[0_0_30px_rgba(0,119,204,0.25)] mb-4"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Builders we work with */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white">
        <Container>
          <SectionHeading
            overline="Who we build with"
            title="Lee County's busiest builders pick C&S"
            subtitle="From custom homes to commercial developments, these builders trust us to keep their projects moving."
          />
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {BUILDERS.map((b) => (
              <div
                key={b.name}
                className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#F5F5F7] border border-gray-200 rounded-full flex items-center justify-center hover:border-primary/30 transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.logo}
                  alt={`${b.name} — C&S Plumbing builder partner`}
                  className="h-6 sm:h-8 w-auto max-w-[100px] sm:max-w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What we need from you */}
      <section className="py-16 sm:py-20 bg-[#F5F5F7]">
        <Container size="narrow">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
                What we need from you
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                What to send with your plans
              </h2>
            </div>
          </ScrollReveal>

          <ul className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
            {WHAT_WE_NEED.map((item, i) => (
              <ScrollReveal key={item} delay={i * 0.05}>
                <li className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white border border-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              </ScrollReveal>
            ))}
          </ul>

          <ScrollReveal>
            <div className="mt-10 text-center">
              <Button href="#upload-plans" size="lg">
                Submit Plans
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
