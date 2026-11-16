"use client";

import { useId } from "react";
import { OptionCard } from "@/components/forms";
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

const COLUMNS = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  5: "grid-cols-3 sm:grid-cols-5",
} as const;

/** Short choices (ages, counts, materials) as radio cards. */
export default function OptionGrid({ options, selected, onSelect, columns = 3 }: OptionGridProps) {
  const name = useId();
  // Counts ("1", "2.5", "5+") sit several to a row.
  const short = options.every((o) => !o.description && o.label.length <= 3);
  return (
    <div className={cn("grid gap-2", short ? "grid-cols-3 sm:grid-cols-4" : COLUMNS[columns])}>
      {options.map((opt) => (
        <OptionCard
          key={opt.id}
          id={`${name}-${opt.id}`}
          name={name}
          value={opt.id}
          checked={selected === opt.id}
          onChange={() => onSelect(opt.id)}
          title={<span className={cn(short && "tabular-nums")}>{opt.label}</span>}
          description={opt.description}
          className={cn("h-full", short && "items-center px-3.5")}
        />
      ))}
    </div>
  );
}
