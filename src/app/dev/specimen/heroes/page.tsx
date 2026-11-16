import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Case, heroCases, visible } from "./cases";

export const metadata: Metadata = {
  title: "PageHero specimen",
  robots: { index: false, follow: false },
};

/** Every case on one page; /dev/specimen/heroes/<id> shows one alone. */
export default function HeroSpecimenPage() {
  if (!visible) notFound();
  return (
    <div>
      {heroCases().map((c) => (
        <Case key={c.id} id={c.id} label={c.label}>
          {c.node}
        </Case>
      ))}
    </div>
  );
}
