"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Phone } from "@/components/ui/icons";
import type { MediaRef } from "@/lib/media-types";
import { cn } from "@/lib/utils";

export interface DirectoryPartner {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  /** Built on the server from the partner's own number (PartnersPage.tsx). */
  phoneHref: string;
  website?: string;
  logo: MediaRef | null;
}

interface PartnerDirectoryProps {
  partners: DirectoryPartner[];
  categories: string[];
  labels: { all: string; filter: string; website: string; empty: string };
}

/**
 * The recommended companies as cards (logo, category, name, what they do,
 * phone and website), two columns on desktop, with a category filter. Every row is in the
 * server HTML; the filter only hides rows, so without JavaScript all show.
 * The partner phone links are the partners' own numbers, not the company line.
 */
export default function PartnerDirectory({ partners, categories, labels }: PartnerDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState(labels.all);
  const options = [labels.all, ...categories];
  const visible = (p: DirectoryPartner) => activeCategory === labels.all || p.category === activeCategory;
  const count = partners.filter(visible).length;

  return (
    <>
      <div role="group" aria-label={labels.filter} className="mb-6 flex flex-wrap gap-2">
        {options.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "min-h-11 rounded-chip border px-4 text-[0.9375rem] font-medium transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.98]",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-steel-300 bg-white text-navy hover:border-steel-400"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {partners.map((partner) => (
          <li
            key={partner.id}
            hidden={!visible(partner)}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 gap-y-3 rounded-2xl border border-steel-200 bg-white p-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-5 sm:p-6"
          >
            <div className="flex h-16 items-center justify-center self-start rounded-xl border border-steel-200 bg-white p-2 sm:h-20">
              {partner.logo ? (
                <Image
                  src={partner.logo.src}
                  alt={`${partner.name} logo`}
                  width={partner.logo.width}
                  height={partner.logo.height}
                  sizes="144px"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              ) : (
                <span className="text-center text-[0.9375rem] font-medium text-body">{partner.category}</span>
              )}
            </div>

            <div className="min-w-0 self-center">
              <p className="meta text-accent">{partner.category}</p>
              <h3 className="mt-0.5 text-xl leading-snug font-semibold text-fg">{partner.name}</h3>
            </div>

            <div className="col-span-2">
              <p className="text-body">{partner.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6">
                <a
                  href={partner.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-fg underline-offset-4 hover:text-link hover:underline"
                >
                  <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  {partner.phone}
                </a>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-link underline decoration-1 underline-offset-4 hover:decoration-2"
                  >
                    <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                    {labels.website}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {count === 0 && <p className="mt-10 text-center text-body">{labels.empty}</p>}
    </>
  );
}
