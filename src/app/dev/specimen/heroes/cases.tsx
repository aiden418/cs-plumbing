import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { heroFrame } from "@/lib/hero-frame";
import { serviceHeroImage } from "@/lib/hero-images";
import type { MediaRef } from "@/lib/media-types";

/**
 * Development specimen: every old PageHero layout name as version 2 draws it
 * (photo or plain), with the shortest and the
 * longest H1 of the site, with and without breadcrumb, actions and trust row,
 * with portrait and landscape frames. Not part of the site: 404 in a
 * production build unless it is a review build (analytics off).
 */

export const visible =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ANALYTICS === "off";

// Real H1s of the site: the shortest (/service-map) and the longest (a blog post).
const SHORT = { title: "Where We", accent: "Work" };
const LONG = {
  title:
    "After the Storm: A Plumbing Damage Checklist for Southwest Florida Homeowners",
};
// A typical long keyword headline (service-city template).
const KEYWORD = {
  title: "Water Heater Repair & Replacement in",
  accent: "Cape Coral, FL",
};

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  {
    name: "After the Storm",
    href: "/blog/plumbing-checklist-after-hurricane-swfl",
  },
];

const LEAD =
  "Licensed, insured and family owned since 1998. Repairs, repipes, water heaters and new construction across Southwest Florida.";

const actions = (
  <>
    <Button href="/booking" size="lg">
      Book a Service
    </Button>
    <Button href="/contact" variant="secondary" size="lg">
      Contact us
    </Button>
  </>
);

const urgentActions = (
  <>
    <Button href="/contact" variant="emergency" size="lg">
      Call now
    </Button>
    <Button href="/booking" variant="secondary" size="lg">
      Book a Service
    </Button>
  </>
);

const trust = (
  <p className="mt-6 text-sm text-muted">
    Licensed &amp; insured · Family owned · Southwest Florida
  </p>
);

export function Case({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div id={id}>
      <p
        data-tone="white"
        className="meta border-y border-rule px-6 py-3 text-muted"
      >
        {label}
      </p>
      {children}
    </div>
  );
}

export type HeroCase = { id: string; label: string; node: ReactNode };

/** Server only: the frames are resolved through the image manifest. */
export function heroCases(): HeroCase[] {
  const portrait = heroFrame(serviceHeroImage("repiping")) as MediaRef;
  const landscape = heroFrame(serviceHeroImage("plumbing-remodel")) as MediaRef;

  return [
    {
      id: "cinema-short",
      label: "cinema → photo · shortest H1 · landscape frame · actions + trust row",
      node: (
        <PageHero
          layout="cinema"
          frame={landscape}
          overline="For builders"
          {...SHORT}
          description={LEAD}
          actions={actions}
        >
          {trust}
        </PageHero>
      ),
    },
    {
      id: "cinema-long",
      label: "cinema · longest H1 · portrait frame · breadcrumb",
      node: (
        <PageHero
          layout="cinema"
          frame={portrait}
          overline="Storm guide"
          {...LONG}
          breadcrumb={CRUMBS}
          description={LEAD}
        />
      ),
    },
    {
      id: "split-short",
      label:
        "split → photo · shortest H1 · portrait frame · breadcrumb + actions + trust row",
      node: (
        <PageHero
          frame={portrait}
          overline="Service area"
          {...SHORT}
          breadcrumb={CRUMBS}
          description={LEAD}
          actions={actions}
        >
          {trust}
        </PageHero>
      ),
    },
    {
      id: "split-long",
      label: "split → photo · longest H1 · landscape frame · nothing else",
      node: <PageHero frame={landscape} {...LONG} />,
    },
    {
      id: "split-keyword-sm",
      label:
        "split → photo · keyword H1 · portrait frame · size sm (service-city defaults)",
      node: (
        <PageHero
          size="sm"
          frame={portrait}
          overline="Cape Coral, FL"
          overlineIcon={<MapPin className="h-3.5 w-3.5" />}
          {...KEYWORD}
          description={LEAD}
          actions={actions}
        />
      ),
    },
    {
      id: "type-led-short",
      label: "type-led → plain · shortest H1 · actions",
      node: (
        <PageHero
          overline="Service area"
          {...SHORT}
          description={LEAD}
          actions={actions}
        />
      ),
    },
    {
      id: "type-led-long",
      label: "type-led → plain · longest H1 · breadcrumb + actions + trust row",
      node: (
        <PageHero
          overline="Storm guide"
          {...LONG}
          breadcrumb={CRUMBS}
          description={LEAD}
          actions={actions}
        >
          {trust}
        </PageHero>
      ),
    },
    {
      id: "editorial-short",
      label: "editorial, no frame → plain · shortest H1 · centred",
      node: (
        <PageHero
          align="center"
          overline="Service area"
          {...SHORT}
          description={LEAD}
        />
      ),
    },
    {
      id: "editorial-long-landscape",
      label: "editorial → photo · longest H1 · breadcrumb · landscape frame below",
      node: (
        <PageHero
          layout="editorial"
          frame={landscape}
          overline="Storm guide"
          {...LONG}
          breadcrumb={CRUMBS}
          description={LEAD}
        />
      ),
    },
    {
      id: "editorial-portrait",
      label: "editorial → photo · keyword H1 · portrait frame below",
      node: (
        <PageHero
          layout="editorial"
          frame={portrait}
          overline="Cape Coral, FL"
          {...KEYWORD}
          description={LEAD}
        />
      ),
    },
    {
      id: "compact-short",
      label: "compact → plain · shortest H1",
      node: <PageHero size="sm" overline="Legal" {...SHORT} />,
    },
    {
      id: "compact-long",
      label: "compact → plain · longest H1 · centred · breadcrumb + trust row",
      node: (
        <PageHero
          size="sm"
          align="center"
          overline="Storm guide"
          {...LONG}
          breadcrumb={CRUMBS}
          description={LEAD}
        >
          {trust}
        </PageHero>
      ),
    },
    {
      id: "urgent-short",
      label: "urgent → plain · shortest H1 · red call button",
      node: (
        <PageHero
          layout="urgent"
          overline="Emergency"
          {...SHORT}
          description={LEAD}
          actions={urgentActions}
        />
      ),
    },
    {
      id: "urgent-long",
      label: "urgent → plain · longest H1 · breadcrumb + actions + trust row",
      node: (
        <PageHero
          accentTone="emergency"
          overline="Emergency"
          {...LONG}
          breadcrumb={CRUMBS}
          description={LEAD}
          actions={urgentActions}
        >
          {trust}
        </PageHero>
      ),
    },
    {
      id: "legacy-media",
      label: "legacy media node, no frame → plain with the node beside · keyword H1",
      node: (
        <PageHero
          overline="Water heaters"
          {...KEYWORD}
          description={LEAD}
          media={
            <div className="aspect-[4/3] rounded-2xl border border-rule bg-shell" />
          }
        />
      ),
    },
  ];
}
