"use client";

import { useId } from "react";
import { OptionCard } from "@/components/forms";

export interface CheckboxItem {
  id: string;
  label: string;
  price: number;
}

interface CheckboxGridProps {
  options: CheckboxItem[];
  selected: string[];
  onToggle: (id: string) => void;
}

/** Optional add-ons: checkbox cards (Space toggles), any number may be chosen. */
export default function CheckboxGrid({ options, selected, onToggle }: CheckboxGridProps) {
  const name = useId();
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <OptionCard
          key={opt.id}
          type="checkbox"
          id={`${name}-${opt.id}`}
          name={name}
          value={opt.id}
          checked={selected.includes(opt.id)}
          onChange={() => onToggle(opt.id)}
          title={opt.label}
          price={<>+${opt.price}</>}
        />
      ))}
    </div>
  );
}
