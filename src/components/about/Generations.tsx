"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";

type Generation = {
  gen: string;
  name: string;
  label: string;
  image?: string;
  body: string;
};

const GENERATIONS: Generation[] = [
  {
    gen: "First Generation",
    name: "Samuel Pellechio Sr.",
    label: "The Foundation",
    // No photo on file yet — graceful placeholder until one is found.
    body: "A mason and general contractor in Philadelphia who built thousands of homes before moving the family to Cape Coral in 1984. He taught his sons that craftsmanship isn't a shortcut business — you do it right, and you stand behind it. Every standard C&S holds today traces back to him.",
  },
  {
    gen: "Second Generation",
    name: "Chris & Sam — Founders",
    label: "Owner & President: Samuel Pellechio Jr.",
    image: "/images/team/samuel.jpeg",
    body: "Both Cape Coral High grads. Sam earned his plumbing license in December 1997 and, with his brother Chris and their father's backing, founded C&S Plumbing of Lee — C&S, for Chris and Sam. Sam has led it ever since: honest work, fair pricing, and treating every customer like family, growing C&S into one of Southwest Florida's most trusted plumbing companies.",
  },
  {
    gen: "Third Generation",
    name: "Aiden Pellechio",
    label: "Project Manager & Estimator",
    image: "/images/team/aiden.jpg",
    body: "Born in 2005 and a 2023 North Fort Myers High grad, Aiden runs projects and estimating at C&S — plus permitting, marketing, and more — while earning a construction-management degree at FGCU (Class of 2028). His goal from there: a GC license, then his own plumbing license. The future of C&S, same name on the truck.",
  },
];

export default function Generations() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-surface">
      <Container>
        <SectionHeading
          overline="Three Generations"
          title="One Name on Every Job"
          subtitle="The trade, handed down father to son — and the people who carry it now."
        />

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {GENERATIONS.map((g, i) => (
            <motion.div
              key={g.name}
              variants={staggerItem}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 card-lift card-lift-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                {g.image ? (
                  <Image
                    src={g.image}
                    alt={g.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy to-[#0f1a2f]">
                    <div className="text-center">
                      <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-2xl font-black text-gold">
                        {g.name.charAt(0)}
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        Photo coming soon
                      </p>
                    </div>
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
                  {`Gen ${i + 1}`}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  {g.gen}
                </span>
                <h3 className="mt-1 text-lg sm:text-xl font-black text-gray-900">
                  {g.name}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{g.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{g.body}</p>
              </div>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </motion.div>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
