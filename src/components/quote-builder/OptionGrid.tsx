"use client";

import { cn } from "@/lib/utils";

export interface OptionItem {
  id: string;
  label: string;
  description?: string;
}

interface OptionGridProps {
  options: OptionItem[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: 2 | 3 | 4 | 5;
}

export default function OptionGrid({
  options,
  selected,
  onSelect,
  columns = 3,
}: OptionGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : columns === 5
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={cn("grid gap-2 sm:gap-3", colClass)}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "p-3 sm:p-4 rounded-xl border text-center transition-all duration-300",
            selected === opt.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
          )}
        >
          <span className="text-xs sm:text-sm font-medium block">{opt.label}</span>
          {opt.description && (
            <span className="text-[10px] sm:text-xs text-gray-400 block mt-1">
              {opt.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
