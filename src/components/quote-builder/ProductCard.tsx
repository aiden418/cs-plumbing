"use client";

import { useId } from "react";
import Image from "next/image";
import { OptionCard } from "@/components/forms";
import { cn } from "@/lib/utils";

export interface ProductOption {
  id: string;
  label: string;
  description?: string;
  priceHint?: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface ProductCardProps {
  options: ProductOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  layout?: "row" | "grid";
}

/**
 * One choice per card (native radios, arrow keys move between them). A
 * product picture, when the option has one, sits in a small white frame on
 * the left; the price hint comes from the pricing data in the quiz files.
 */
export default function ProductCard({ options, selected, onSelect, layout = "grid" }: ProductCardProps) {
  const name = useId();
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2",
        layout === "grid" && (options.length === 2 || options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")
      )}
    >
      {options.map((opt) => (
        <OptionCard
          key={opt.id}
          id={`${name}-${opt.id}`}
          name={name}
          value={opt.id}
          checked={selected === opt.id}
          onChange={() => onSelect(opt.id)}
          className="h-full"
          media={
            opt.image ? (
              <span className="relative block size-16 overflow-hidden rounded-[0.5rem] border border-steel-200 bg-white sm:size-20">
                <Image src={opt.image} alt={opt.label} fill className="object-contain p-1.5" sizes="80px" />
              </span>
            ) : undefined
          }
          title={
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{opt.label}</span>
              {opt.badge && (
                <span className="rounded-chip bg-shell px-2.5 py-0.5 text-[0.8125rem] font-semibold text-primary-dark">
                  {opt.badge}
                </span>
              )}
            </span>
          }
          description={opt.description}
        >
          {opt.priceHint && (
            <span className="mt-2 block text-sm font-semibold text-ink tabular-nums">{opt.priceHint}</span>
          )}
        </OptionCard>
      ))}
    </div>
  );
}
