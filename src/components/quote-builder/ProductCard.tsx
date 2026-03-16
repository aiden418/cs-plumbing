"use client";

import Image from "next/image";
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

export default function ProductCard({
  options,
  selected,
  onSelect,
  layout = "grid",
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "gap-3 sm:gap-4",
        layout === "row"
          ? "flex flex-col"
          : options.length === 2
            ? "grid grid-cols-1 sm:grid-cols-2"
            : "grid grid-cols-1 sm:grid-cols-3"
      )}
    >
      {options.map((opt) => {
        const isActive = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "relative group rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden",
              layout === "row" ? "flex items-center gap-4 p-4 sm:p-5" : "p-4 sm:p-5",
              isActive
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            )}
          >
            {/* Badge */}
            {opt.badge && (
              <span
                className={cn(
                  "absolute top-2 right-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {opt.badge}
              </span>
            )}

            {/* Image or Icon */}
            {opt.image ? (
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl bg-gray-50",
                  layout === "row"
                    ? "w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
                    : "w-full h-32 sm:h-40 mb-3"
                )}
              >
                <Image
                  src={opt.image}
                  alt={opt.label}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
              </div>
            ) : opt.icon ? (
              <div
                className={cn(
                  "rounded-xl flex items-center justify-center transition-colors",
                  layout === "row"
                    ? "w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0"
                    : "w-full h-24 sm:h-32 mb-3",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-50 text-gray-400 group-hover:text-gray-600"
                )}
              >
                {opt.icon}
              </div>
            ) : null}

            {/* Text */}
            <div className={layout === "row" ? "flex-1 min-w-0" : ""}>
              <span
                className={cn(
                  "font-semibold block text-sm sm:text-base",
                  isActive ? "text-primary" : "text-gray-900"
                )}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs sm:text-sm text-gray-500 block mt-0.5">
                  {opt.description}
                </span>
              )}
              {opt.priceHint && (
                <span
                  className={cn(
                    "text-xs font-medium block mt-1.5",
                    isActive ? "text-primary/70" : "text-gray-400"
                  )}
                >
                  {opt.priceHint}
                </span>
              )}
            </div>

            {/* Selection indicator */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                layout === "row" ? "flex-shrink-0" : "absolute top-3 left-3",
                isActive
                  ? "border-primary bg-primary"
                  : "border-gray-300"
              )}
            >
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
