import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Case, heroCases, visible } from "../cases";

export const metadata: Metadata = {
  title: "PageHero specimen",
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return heroCases().map((c) => ({ case: c.id }));
}

/** One specimen case alone, for screenshots. */
export default async function HeroSpecimenCase({
  params,
}: {
  params: Promise<{ case: string }>;
}) {
  if (!visible) notFound();
  const { case: id } = await params;
  const found = heroCases().find((c) => c.id === id);
  if (!found) notFound();
  return (
    <Case id={found.id} label={found.label}>
      {found.node}
    </Case>
  );
}
