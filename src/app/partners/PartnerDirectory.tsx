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
 * The recommended companies as hairline rows (logo, category, name, what
 * they do, phone and website), with a category filter. Every row is in the
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
      <div role="group" aria-label={labels.filter} className="mb-10 flex flex-wrap gap-2 sm:mb-12">
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
                  : "border-rule bg-canvas text-body hover:border-steel-300 hover:text-fg"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <ul className="border-b border-rule">
        {partners.map((partner) => (
          <li
            key={partner.id}
            hidden={!visible(partner)}
            className="grid grid-cols-1 gap-y-5 border-t border-rule py-8 sm:grid-cols-[11rem_1fr] sm:gap-x-8 lg:grid-cols-12"
          >
            <div className="flex h-24 w-44 items-center justify-center rounded-control border border-rule bg-white p-3 lg:col-span-3 lg:w-full lg:max-w-[13rem]">
              {partner.logo ? (
                <Image
                  src={partner.logo.src}
                  alt={`${partner.name} logo`}
                  width={partner.logo.width}
                  height={partner.logo.height}
                  sizes="200px"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              ) : (
                <span className="label-tech text-muted">{partner.category}</span>
              )}
            </div>

            <div className="min-w-0 lg:col-span-6">
              <p className="label-tech text-accent">{partner.category}</p>
              <h3 className="mt-2 text-xl leading-snug font-semibold text-fg">{partner.name}</h3>
              <p className="mt-2 max-w-[60ch] text-body">{partner.description}</p>
            </div>

            <div className="flex flex-wrap items-start gap-x-6 gap-y-1 sm:col-start-2 lg:col-span-3 lg:col-start-10 lg:flex-col lg:items-end">
              <a
                href={partner.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 font-medium text-fg tabular-nums underline-offset-4 hover:text-link hover:underline"
              >
                <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                {partner.phone}
              </a>
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-link underline-offset-4 hover:underline"
                >
                  <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                  {labels.website}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {count === 0 && <p className="mt-12 text-center text-muted">{labels.empty}</p>}
    </>
  );
}
