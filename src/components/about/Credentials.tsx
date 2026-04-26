"use client";

import { ShieldCheck, Award, FileCheck, Wrench, Users, Building2 } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";

const credentials = [
  {
    icon: <FileCheck className="w-5 h-5" />,
    title: "State-Licensed Plumbing Contractors",
    body: `Florida-licensed Certified Plumbing Contractors, ${BUSINESS.license} and ${BUSINESS.license2}. Verifiable on the DBPR (MyFloridaLicense.com). We pull every required permit and pass every Lee County inspection — no exceptions.`,
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Fully Insured & Bonded",
    body: "$2M general liability and full workers' comp on every crew. Certificates of insurance available on request — required by virtually every GC and HOA we work with.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Best of Cape Coral 2025",
    body: "Voted Best Plumbing Company in Cape Coral by the local community. We're also ranked in the top 4% of all licensed contractors in Florida by job volume and job-completion record.",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "8,500+ Homes Plumbed",
    body: "From subdivision rough-ins for major SWFL builders (Stellar, Alair, Red Key, McDowell) to one-off custom homes and remodels — we've completed more new-construction plumbing in Lee County than any other shop our size.",
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: "Trade Apprenticeship Program",
    body: "We train every apprentice through a structured 4-year program covering Florida Building Code, drainage and venting design, gas, and code-compliant install practices. The trade only stays strong if we keep teaching it.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Family-Owned, Locally Owned",
    body: "Founded in 1998, second-generation owner-operated, third-generation working in the field. We live in the same neighborhoods we work in — every job is an introduction to your neighbor.",
  },
];

export default function Credentials() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              Credentials
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Licensed, insured, and accountable to the community we live in.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
              The plumbing trade in Florida has high stakes — get it wrong and water damage
              ruins floors, walls, and equipment. We don&rsquo;t cut corners, and our paperwork
              is open to anyone who asks.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {credentials.map((c) => (
            <article
              key={c.title}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                {c.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
