"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The category filter of /projects: toggle buttons (aria-pressed, "All"
 * first) over a list of server-rendered project cards. Filtering only
 * toggles `hidden` on the list items; every card stays in the HTML. Under
 * "All" the featured project is shown as the spotlight above the grid and
 * left out of the grid, as before; choosing a category hides the spotlight
 * and lists every project of that category, the featured one included.
 * Without JavaScript "All" stays pressed and everything shows.
 */

export interface FilterCard {
  slug: string;
  category: string;
  featured?: boolean;
  card: ReactNode;
}

interface ProjectsFilterProps {
  categories: string[];
  cards: FilterCard[];
  spotlight?: ReactNode;
  labels: { all: string; group: string; empty: string };
}

const ALL = "__all__";

export default function ProjectsFilter({ categories, cards, spotlight, labels }: ProjectsFilterProps) {
  const [active, setActive] = useState(ALL);
  const shows = (card: FilterCard) => (active === ALL ? !card.featured : card.category === active);
  const visible = cards.filter(shows).length;
  const options = [{ id: ALL, label: labels.all }, ...categories.map((c) => ({ id: c, label: c }))];

  return (
    <>
      {spotlight && <div hidden={active !== ALL}>{spotlight}</div>}

      <div className="projects-filter-bar">
        <div role="group" aria-label={labels.group} className="flex flex-wrap gap-2">
          {options.map((option) => {
            const pressed = option.id === active;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                aria-controls="projects-grid"
                onClick={() => setActive(option.id)}
                className={cn("gallery-chip", pressed && "is-pressed")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul id="projects-grid" className="projects-grid">
        {cards.map((card) => (
          <li key={card.slug} hidden={!shows(card)} data-category={card.category}>
            {card.card}
          </li>
        ))}
      </ul>

      {visible === 0 && <p className="py-16 text-center text-muted">{labels.empty}</p>}
    </>
  );
}
