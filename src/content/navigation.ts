/**
 * The site menu as plain data: the desktop header, its four panels and the
 * mobile menu are all drawn from this one structure
 * (.redesign/spec/chrome-and-opening.md sections 1 and 2).
 *
 * Labels and hrefs that already exist in NAV_LINKS are looked up there, never
 * retyped: `fromNav("/services/repiping")` returns NAV_LINKS' own label for
 * that page and fails the build if the link has gone. Only the few entries
 * NAV_LINKS never had ("Our story", "Reviews", "FAQ", "Emergency", …) are
 * written here.
 *
 * Server-only data (it imports @/lib/constants): client components receive the
 * rendered links as children from SiteHeader and never import this file.
 */
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavColumn {
  /** Small label-tech heading over the column (optional). */
  title?: string;
  links: NavItem[];
}

export interface NavPhoto {
  /** A named picture position (picture() in @/lib/media). */
  id: string;
  /** Shown under the frame; none when absent. */
  caption?: string;
}

export type NavGroupId = "services" | "builders" | "about" | "areas";

export interface NavGroup {
  id: NavGroupId;
  /** The top-level label and the hub it links to. */
  label: string;
  href: string;
  /** The first line of the group in the mobile menu: the hub, by its own name. */
  hub: NavItem;
  columns: NavColumn[];
  /** The panel's footer row (Services only). */
  footer?: NavItem[];
  photos: NavPhoto[];
  /** Path prefixes that make this group the current section. */
  sections: string[];
}

function flatten(links: NavLink[]): NavLink[] {
  return links.flatMap((link) => [link, ...(link.children ? flatten(link.children) : [])]);
}

const ALL = flatten(NAV_LINKS);

/** The NAV_LINKS entry for an href, as a plain { label, href }. */
function fromNav(href: string): NavItem {
  const hit = ALL.find((link) => link.href === href && !(link.children && ALL.some((c) => c !== link && c.href === href)));
  if (!hit) throw new Error(`navigation: ${href} is not in NAV_LINKS`);
  return { label: hit.label, href: hit.href };
}

/** A top-level NAV_LINKS entry by its label. */
function topLevel(label: string): NavLink {
  const hit = NAV_LINKS.find((link) => link.label === label);
  if (!hit) throw new Error(`navigation: no top-level "${label}" in NAV_LINKS`);
  return hit;
}

const servicesTop = topLevel("Services");
const buildersTop = topLevel("Builders");
const areasTop = topLevel("Service Areas");
const aboutTop = topLevel("About");

/** Builder-side services; every other Services child is "for your home". */
const BUILDER_SERVICE_HREFS = ["/services/new-construction", "/services/commercial", "/services/uep-utilities"];
const HOME_SERVICE_ORDER = [
  "/services/residential",
  "/services/repiping",
  "/services/water-heaters",
  "/services/tankless-water-heaters",
  "/services/drain-cleaning",
  "/services/leak-repair",
  "/services/water-softeners",
  "/services/plumbing-remodel",
];

const homeServices = HOME_SERVICE_ORDER.map(fromNav);
const builderServices = BUILDER_SERVICE_HREFS.map(fromNav);

const allServices: NavItem = { label: "All services", href: servicesTop.href };
const serviceMap: NavItem = { label: "Service map", href: "/service-map" };
const ourStory: NavItem = { label: "Our story", href: aboutTop.href };

const areaLinks = (areasTop.children ?? []).map((c) => fromNav(c.href));
const areaColumns: NavColumn[] = [0, 1, 2].map((i) => ({
  links: areaLinks.slice(Math.ceil((areaLinks.length / 3) * i), Math.ceil((areaLinks.length / 3) * (i + 1))),
}));

const builderLinks = (buildersTop.children ?? []).map((c) => fromNav(c.href));

export const NAV_GROUPS: Record<NavGroupId, NavGroup> = {
  services: {
    id: "services",
    label: servicesTop.label,
    href: servicesTop.href,
    hub: allServices,
    columns: [
      { title: "For your home", links: homeServices },
      { title: "For builders & business", links: builderServices },
    ],
    footer: [
      fromNav("/coastal-comeback-plan"),
      { label: "Emergency", href: "/emergency" },
      { label: "Instant Quote", href: "/quote-builder" },
      allServices,
    ],
    photos: [
      { id: "home.door.home", caption: "For your home" },
      { id: "home.door.build", caption: "For builders & business" },
    ],
    sections: ["/services", "/emergency", "/coastal-comeback-plan", "/quote-builder"],
  },
  builders: {
    id: "builders",
    label: buildersTop.label,
    href: buildersTop.href,
    hub: builderLinks[0],
    columns: [
      { links: builderLinks.filter((l) => !l.href.startsWith("/new-construction-plumbing/")) },
      { links: builderLinks.filter((l) => l.href.startsWith("/new-construction-plumbing/")) },
    ],
    photos: [{ id: "builders.phase.underground" }],
    sections: ["/builders", "/builder-portal", "/new-construction-plumbing"],
  },
  about: {
    id: "about",
    label: aboutTop.label,
    href: aboutTop.href,
    hub: ourStory,
    columns: [
      {
        links: [
          ourStory,
          { label: "Reviews", href: "/reviews" },
          fromNav("/awards"),
          fromNav("/gallery"),
          fromNav("/blog"),
          fromNav("/partners"),
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
    photos: [],
    sections: ["/about", "/reviews", "/awards", "/gallery", "/blog", "/partners", "/faq"],
  },
  areas: {
    id: "areas",
    label: areasTop.label,
    href: serviceMap.href,
    hub: serviceMap,
    columns: areaColumns,
    footer: [serviceMap],
    photos: [],
    sections: ["/areas", "/service-map"],
  },
};

const projects = fromNav("/projects");
const contact = fromNav("/contact");

/** Desktop order: Services ▾ · Builders ▾ · Projects · About ▾ · Service Areas ▾ · Contact. */
export const NAV_ORDER: ({ kind: "group"; group: NavGroup } | { kind: "link"; link: NavItem; sections: string[] })[] = [
  { kind: "group", group: NAV_GROUPS.services },
  { kind: "group", group: NAV_GROUPS.builders },
  { kind: "link", link: projects, sections: ["/projects"] },
  { kind: "group", group: NAV_GROUPS.about },
  { kind: "group", group: NAV_GROUPS.areas },
  { kind: "link", link: contact, sections: ["/contact"] },
];

/** The mobile menu: four groups, then plain links. */
export const MOBILE_GROUPS: NavGroup[] = [NAV_GROUPS.services, NAV_GROUPS.builders, NAV_GROUPS.about, NAV_GROUPS.areas];
export const MOBILE_LINKS: NavItem[] = [projects, contact];

/** The header's fixed actions (the call link comes from BUSINESS). */
export const NAV_ACTIONS = {
  quote: { label: "Get a quote", short: "Quote", href: "/quote-builder" },
  book: { label: "Book a Service", href: "/booking" },
  text: { label: "Text us" },
  call: { label: "Call" },
} as const;

/** Every href the navigation data links to, for tests/nav-coverage.test.ts. */
export function navigationHrefs(): string[] {
  const out = new Set<string>();
  for (const group of Object.values(NAV_GROUPS)) {
    out.add(group.href);
    out.add(group.hub.href);
    for (const column of group.columns) for (const link of column.links) out.add(link.href);
    for (const link of group.footer ?? []) out.add(link.href);
  }
  for (const link of MOBILE_LINKS) out.add(link.href);
  out.add(NAV_ACTIONS.quote.href);
  out.add(NAV_ACTIONS.book.href);
  return [...out];
}
