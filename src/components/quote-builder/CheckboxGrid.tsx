"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function CheckboxGrid({
  options,
  selected,
  onToggle,
}: CheckboxGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={cn(
              "flex items-center gap-3 p-3 sm:p-4 rounded-xl border text-left transition-all duration-300",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300"
              )}
            >
              {isSelected && <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium block",
                  isSelected ? "text-primary" : "text-gray-600"
                )}
              >
                {opt.label}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 flex-shrink-0">
              +${opt.price}
            </span>
          </button>
        );
      })}
    </div>
  );
}
