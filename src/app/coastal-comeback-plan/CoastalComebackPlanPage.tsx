"use client";

import { useState } from "react";
import {
  Check,
  Phone,
  Calendar,
  ChevronDown,
  Droplets,
  Flame,
  AlertTriangle,
  Star,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS, COASTAL_COMEBACK_FAQS } from "@/lib/constants";

const problems = [
  {
    icon: Droplets,
    title: "Silent leaks behind the wall",
    body: "A pinhole leak in a copper line can run for months in an empty house — by the time you fly back, drywall is soaked, baseboards are warped, and mold is already in the framing.",
  },
  {
    icon: Flame,
    title: "Water heater failure",
    body: "Florida's hard water eats anode rods. Tanks rust, leak, or burst while no one is home — flooding garages, closets, and laundry rooms with 40+ gallons of hot water.",
  },
  {
    icon: AlertTriangle,
    title: "Drain & valve seizure",
    body: "Dry P-traps let sewer gas push back into the home. Shut-off valves freeze in place. Toilet seals dry and crack. None of it is visible until you turn the water back on.",
  },
];

const tiers = [
  {
    name: "Coastal Comfort",
    price: "$349",
    period: "/yr",
    tagline: "Pre-departure shutdown + return-ready inspection.",
    cta: "Get Started",
    href: "/booking?plan=comfort",
    variant: "secondary" as const,
    highlight: false,
    inclusions: [
      "Pre-departure home shutdown visit",
      "Main shut-off & valve test",
      "Water heater inspection",
      "Return-ready start-up inspection",
      "Written before/after report",
    ],
  },
  {
    name: "Coastal Shield",
    price: "$549",
    period: "/yr",
    tagline: "Everything in Comfort + a mid-summer check & priority dispatch.",
    cta: "Get Started",
    href: "/booking?plan=shield",
    variant: "primary" as const,
    highlight: true,
    inclusions: [
      "Everything in Coastal Comfort",
      "Mid-summer mid-season check (photo report emailed)",
      "Priority emergency dispatch",
      "10% off any in-season repairs",
      "Direct text line to your technician",
    ],
  },
  {
    name: "Coastal Smart",
    price: "Call",
    period: "for Quote",
    tagline: "Custom plans for multi-property owners, estates & STR managers.",
    cta: `Call ${BUSINESS.phone}`,
    href: `tel:${BUSINESS.phoneRaw}`,
    variant: "secondary" as const,
    highlight: false,
    inclusions: [
      "Everything in Coastal Shield",
      "Smart leak detector install (Wi-Fi, app alerts)",
      "Monthly remote monitoring",
      "Multi-property pricing",
      "Dedicated account manager",
    ],
  },
];

const steps = [
  {
    n: "1",
    title: "Sign up online or by phone",
    body: "Pick a tier that fits, give us your travel dates, and we'll lock in your visit window.",
  },
  {
    n: "2",
    title: "Pre-departure visit",
    body: "Before you fly out, we shut down, drain, and document the entire plumbing system.",
  },
  {
    n: "3",
    title: "Mid-summer check (Shield+)",
    body: "Mid-season we walk the home, test for leaks, and email you a photo report.",
  },
  {
    n: "4",
    title: "Return-ready inspection",
    body: "A week before you land, we restart the system so you walk into a working home.",
  },
];

const trustItems = [
  `Lic. #${BUSINESS.license}`,
  `Lic. #${BUSINESS.license2}`,
  `Family-owned since ${BUSINESS.founded}`,
  "5★ on Google",
  "Insured & bonded",
  "A Division of Draft Construction",
];

export default function CoastalComebackPlanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-[#F5F5F7]">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              For SWFL Snowbirds
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              Leaving for the Summer? Your Pipes Aren&apos;t.
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
              The Coastal Comeback Plan keeps your vacant Florida home dry,
              protected, and ready to live in the day you fly back. Licensed
              plumbers — not a home watch service — checking your pipes,
              valves, and water heater while you&apos;re gone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                href="#plans"
                size="lg"
                icon={<ShieldCheck className="w-5 h-5" />}
              >
                See the Plans
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Licensed CFC1432485
              </span>
              <span>·</span>
              <span>Family-owned since 1998</span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary fill-primary" />
                5★ on Google
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* PROBLEM / AGITATION */}
      <section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            overline="The Risk"
            title="What Happens to a Vacant Florida Home"
            subtitle="Six months of heat, humidity, and pressure on a system no one is checking. Here's what we see most often when snowbirds come back."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <ScrollReveal key={p.title}>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* PRICING TIERS */}
      <section id="plans" className="py-16 sm:py-24 lg:py-28 bg-[#F5F5F7]">
        <Container>
          <SectionHeading
            overline="Annual Plans"
            title="Pick Your Coastal Comeback Plan"
            subtitle="One yearly fee covers your visits, reports, and priority access. No hidden trip charges, no per-visit upcharges."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col ${
                  tier.highlight
                    ? "border-2 border-primary shadow-lg md:scale-[1.03]"
                    : "border border-gray-200"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full whitespace-nowrap">
                    Best for Snowbirds
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-black text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {tier.period}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {tier.tagline}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-gray-600 leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.variant}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            overline="How It Works"
            title="Four Steps. One Worry-Free Summer."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {steps.map((s) => (
              <ScrollReveal key={s.n}>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 mx-auto sm:mx-0">
                    {s.n}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* TRUST BAR */}
      <section className="py-10 sm:py-12 bg-[#F5F5F7] border-y border-gray-200">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-10 text-xs sm:text-sm text-gray-600">
            {trustItems.map((item, i) => (
              <span key={item} className="flex items-center gap-x-6 sm:gap-x-10">
                <span className="font-medium">{item}</span>
                {i < trustItems.length - 1 && (
                  <span className="text-gray-300 hidden sm:inline">·</span>
                )}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            overline="FAQ"
            title="Common Questions from Snowbirds"
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {COASTAL_COMEBACK_FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F5F5F7] rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-500 text-xs sm:text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-24 lg:py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
              Fly home to a dry house.
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-8 sm:mb-10 leading-relaxed">
              Enroll once. Travel for the summer. Come back to the same home you
              left — not a flood and a phone call to insurance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                href="/booking?plan=coastal-comeback"
                variant="secondary"
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
                className="bg-white border-white text-primary hover:bg-white/95 hover:text-primary-dark"
              >
                Enroll Now
              </Button>
              <Button
                href={`tel:${BUSINESS.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
                className="border-white/40 text-white hover:bg-white/10 hover:text-white hover:border-white"
              >
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
