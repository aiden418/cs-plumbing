/**
 * Parent service hub pages that service-city landing pages roll up to.
 * `slug` is referenced by `ServiceCityLanding.serviceSlug` and drives the
 * hub pages' city cross-link grids and the 3-level breadcrumbs on
 * service-city pages. Titles match SERVICE_LANDINGS where a data-driven
 * hub exists; commercial, new-construction, and emergency are
 * hand-written routes.
 */
export interface ServiceHub {
  slug: string;
  title: string;
  href: string;
}

export const SERVICE_HUBS: ServiceHub[] = [
  { slug: "repiping", title: "Whole-Home Repiping", href: "/services/repiping" },
  { slug: "water-heaters", title: "Water Heaters", href: "/services/water-heaters" },
  { slug: "drain-cleaning", title: "Drain Cleaning", href: "/services/drain-cleaning" },
  { slug: "leak-repair", title: "Leak Detection & Repair", href: "/services/leak-repair" },
  { slug: "water-softeners", title: "Water Softeners & Filtration", href: "/services/water-softeners" },
  { slug: "plumbing-remodel", title: "Plumbing Remodels", href: "/services/plumbing-remodel" },
  { slug: "uep-utilities", title: "UEP Utilities Hookup", href: "/services/uep-utilities" },
  { slug: "commercial", title: "Commercial Plumbing", href: "/services/commercial" },
  { slug: "new-construction", title: "New Construction Plumbing", href: "/services/new-construction" },
  { slug: "emergency", title: "Emergency Plumbing", href: "/emergency" },
];

export function getServiceHub(slug: string | undefined): ServiceHub | undefined {
  if (!slug) return undefined;
  return SERVICE_HUBS.find((hub) => hub.slug === slug);
}
