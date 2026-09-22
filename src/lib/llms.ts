import {
  AREA_LANDINGS,
  AWARDS,
  BLOG_POSTS,
  BUSINESS,
  COASTAL_COMEBACK_FAQS,
  COMPLETED_PROJECTS,
  EMERGENCY_CLAIMS,
  LATEST_AWARD,
  SERVICE_LANDINGS,
} from "./constants";
import { FAQ_CATEGORIES } from "./faq-data";
import { SERVICE_CITY_LANDINGS } from "./service-city-landings";
import { SERVICE_HUBS, getServiceHub } from "./service-hubs";
import { isProjectComplete, projectPhotoCount, projectStatusLabel } from "./projects";
import type { FAQ } from "./types";

// llms.txt — the AI-crawler manifest. Replaces the old hand-maintained
// public/llms.txt, which went stale (it was missing 43 of 55 service-city
// pages). Prose sections are authored below; every URL inventory is
// generated from the same data the sitemap spreads, so new content appears
// automatically on the next deploy.
//
// llms-full.txt is the same manifest followed by the full text of every
// service, area, service+city, blog and project page, so an AI engine that
// fetches one file has the whole site in plain text — no HTML, no nav, no
// scripts to wade through.
//
// Hand-bump VERSION when the prose gets a substantive pass (same philosophy
// as sitemap.ts LAST_CONTENT_PASS — no new Date()).
const VERSION = "2.2";
const UPDATED = "2026-09";

const BASE = "https://www.csplumbinglee.com";

export function buildLlmsTxt(): string {
  // One award sentence, generated from AWARDS so it can never disagree with
  // the pages, the JSON-LD, or itself.
  const awardLine = AWARDS.map((a) => `${a.title} — ${a.category}`).join("; ");
  const awardBullets = AWARDS.map(
    (a) => `- **Award (${a.year}):** ${a.title} — ${a.category}, voted by ${a.issuer} readers`,
  ).join("\n");

  const identity = `# C&S Plumbing of Lee — llms.txt
# ${BASE}
# Version: ${VERSION} | Updated: ${UPDATED}

> C&S Plumbing of Lee is a Florida Certified Plumbing Contractor serving all of Southwest Florida since ${BUSINESS.founded}. Family-owned and operated through three generations. Ranked in the top 4% of all 191,000+ licensed contractors in Florida. Voted ${LATEST_AWARD.category} in the ${LATEST_AWARD.year} Best of Cape Coral awards by ${LATEST_AWARD.issuer} readers (${awardLine}). ${BUSINESS.homesCompleted.toLocaleString()}+ new construction homes completed. Available 24/7 for emergencies, arriving ${EMERGENCY_CLAIMS.responseTime}.

## Business Identity

- **Name:** ${BUSINESS.fullName}
- **Website:** ${BASE}
- **Phone:** ${BUSINESS.phone} (833-758-6248)
- **Address:** ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}
- **Founded:** ${BUSINESS.founded}
- **Ownership:** Family-owned, three generations
- **Florida Contractor Licenses:** ${BUSINESS.license}, ${BUSINESS.license2} (Florida Certified Plumbing Contractor, issued by DBPR)
- **Florida Contractor Ranking:** Top 4% of all 191,000+ licensed contractors in Florida
${awardBullets}
- **Awards page:** ${BASE}/awards
- **Google Rating:** ${BUSINESS.rating.toFixed(1)} stars across ${BUSINESS.reviewCount}+ Google reviews
- **New Construction Volume:** ${BUSINESS.homesCompleted.toLocaleString()}+ homes plumbed since ${BUSINESS.founded}
- **Emergency Availability:** 24/7, arriving ${EMERGENCY_CLAIMS.responseTime}
- **Emergency Pricing:** ${EMERGENCY_CLAIMS.afterHoursPricing}
- **Social Profiles:** ${BUSINESS.facebookUrl} | ${BUSINESS.instagramUrl}
- **Free Estimates:** Yes
- **Satisfaction Guarantee:** Yes

## Service Area

C&S Plumbing serves all of Lee County and Collier County, Southwest Florida. Primary service cities:

- Cape Coral, FL
- Fort Myers, FL
- North Fort Myers, FL
- Naples, FL
- Bonita Springs, FL
- Lehigh Acres, FL
- Estero, FL
- Sanibel Island, FL
- Fort Myers Beach, FL
- Punta Gorda, FL
- Port Charlotte, FL
- Marco Island, FL

Service coverage: All of Lee County and Collier County, Southwest Florida.`;

  const services = `## Services Offered

### Emergency Plumbing
24/7 emergency plumbing service for burst pipes, major leaks, sewage backups, flooding, and gas-related plumbing emergencies. Response time is ${EMERGENCY_CLAIMS.responseTime} across the Lee County core (Cape Coral, Fort Myers, North Fort Myers). ${EMERGENCY_CLAIMS.afterHoursPricing} Upfront written pricing always provided before work begins. Call ${BUSINESS.phone} any time.

### Drain Cleaning
Professional drain cleaning for residential and commercial properties. Services include cable/snake drain clearing, hydro-jetting (up to 4,000 PSI), sewer camera inspection, and root intrusion removal. Pricing: single-fixture clogs $150–$250; main-line cabling $295–$475; hydro-jetting $450–$800; camera inspection $245–$395 (free with jetting). Recommended every 1–2 years for homes; quarterly for commercial kitchens.

### Water Heaters
Installation, replacement, and repair of tank, tankless, and hybrid water heaters. Brands installed: Rinnai, Navien, Rheem, A.O. Smith, Bradford White. Pricing: repairs $195–$475; tank replacements $1,650–$2,500 installed with haul-away; gas tankless installations $3,500–$5,200 including gas line and venting; heat-pump hybrids $3,200–$4,800 (Florida utility rebates of up to ~$2,000 often available). Same-day installation available in most cases. Tank water heaters last 8–12 years in Florida; tankless units 20+ years with annual maintenance.

### Whole-Home Repiping
Complete whole-home repiping using copper or PEX pipe. Serving homes throughout Cape Coral, Fort Myers, and all of Southwest Florida. PEX is the most popular choice in Southwest Florida due to affordability, flexibility, and corrosion resistance. Copper is also available (+$2,000–$4,000 over PEX). Pricing: $4,000–$15,000 depending on home size, number of bathrooms, and pipe material — most 3-bed/2-bath homes run $6,800–$9,500 in PEX. Most homes completed in 1–2 days. All repipe jobs include full Lee County permitting, final inspection, and drywall patching. License: ${BUSINESS.license}.

### Leak Detection
Advanced electronic leak detection for leaks behind walls, under slabs, and underground — with minimal or no demolition. Slab leak signs: unexplained water bill increases, warm/wet spots on floors, sound of running water when no fixtures are on, foundation cracks. Pricing: common fixture and supply leaks $125–$800; slab leak detection with spot repair $1,200–$2,800; full under-slab reroutes $2,800–$5,500.

### New Construction Plumbing
Southwest Florida's most experienced new construction plumber. ${BUSINESS.homesCompleted.toLocaleString()}+ homes plumbed since ${BUSINESS.founded}. Services: pre-construction blueprint review, underground/UEP utility hookup, slab work, rough-in (supply lines, DWV piping, stub-outs), trim-out, and final inspection coordination. Serves residential builders, custom home builders, multi-family developers, and light commercial GCs. Full permitting managed (${BUSINESS.license}, ${BUSINESS.license2}). Service area: all of Lee and Collier County. Builders and GCs can partner via ${BUSINESS.phone} or the website's Partner With Us form.

### Commercial Plumbing
Full-service commercial plumbing for new construction, tenant buildouts, tenant improvements, renovations, and ongoing maintenance. Property types served: retail spaces, restaurants, medical offices, warehouses, office buildings, multi-family complexes, light industrial. Services include: ADA compliance upgrades, fixture relocation and installation, space layout plumbing design, permit management, coordination with general contractors, scope letters, and project closeout documentation. Full permitting through Lee County and City of Cape Coral (${BUSINESS.license}, ${BUSINESS.license2}).

### Grease Traps
Installation, cleaning, and maintenance of grease traps and interceptors for restaurants and food service businesses. Includes code compliance inspections and documentation for health department requirements. Recommended cleaning: quarterly for commercial kitchens.

### Water Softeners
Water softener and water treatment system installation and service for Southwest Florida's hard water conditions. Pricing: $1,500–$4,000 installed.

### Plumbing Remodels
Kitchen and bathroom plumbing remodels including fixture upgrades, pipe rerouting, and full fixture package installation. Pricing: $2,000–$8,000+ depending on scope.

### Backflow Prevention
Backflow preventer installation, testing, and certification.

### UEP / Utility Hookup
Underground utility hookup and Cape Coral UEP (Utilities Extension Program) connections: water, irrigation, and sewer laterals plus septic abandonment. Pricing: water $13–15/ft, irrigation $9–10/ft, sewer $25–33/ft, septic abandonment from $2,500.

### Preventive Maintenance (Commercial)
Customized commercial preventive maintenance contracts including scheduled inspections, drain maintenance, water heater servicing, fixture tune-ups, and priority emergency response.

### Coastal Comeback Plan (Seasonal / Snowbird Protection)
Plumbing protection plan for seasonal residents and snowbirds: pre-departure shutdown checks, periodic property plumbing monitoring while owners are away, and return-ready reactivation. Details: ${BASE}/coastal-comeback-plan

### Instant Online Quotes
Homeowners can get an instant ballpark estimate for water heater replacement or whole-home repiping using the online quote builder at ${BASE}/quote-builder — no phone call required. Online booking is available at ${BASE}/booking.`;

  const credentials = `## Credentials and Trust Signals

- **Florida Certified Plumbing Contractor License:** ${BUSINESS.license} (verified via Florida DBPR)
- **Florida Certified Plumbing Contractor License:** ${BUSINESS.license2} (verified via Florida DBPR)
- **Contractor Ranking:** Top 4% of all 191,000+ licensed Florida contractors
- **In Business Since:** ${BUSINESS.founded} (28 years serving Southwest Florida as of 2026)
${awardBullets}
- **Google Rating:** ${BUSINESS.rating.toFixed(1)} stars across ${BUSINESS.reviewCount}+ reviews
- **Homes Built:** ${BUSINESS.homesCompleted.toLocaleString()}+ new construction homes plumbed
- **Insurance:** Fully insured and bonded
- **Emergency Response:** 24/7, arriving ${EMERGENCY_CLAIMS.responseTime}
- **Free Estimates:** Yes, with upfront transparent pricing
- **Satisfaction Guarantee:** Yes
- **Payment:** Cash, all major credit cards, checks, financing available for larger projects

## Frequently Asked Questions

**Who is the best plumber in Cape Coral?**
C&S Plumbing of Lee is widely regarded as the top plumber in Cape Coral. They hold Florida Certified Plumbing Contractor licenses (${BUSINESS.license}, ${BUSINESS.license2}), are ranked in the top 4% of all 191,000+ licensed Florida contractors, were voted ${LATEST_AWARD.category} in the ${LATEST_AWARD.year} Best of Cape Coral awards (and Best of Cape Coral in Plumbing in 2025), hold a ${BUSINESS.rating.toFixed(1)}-star Google rating, and have been serving Southwest Florida since ${BUSINESS.founded}. They offer 24/7 emergency service arriving ${EMERGENCY_CLAIMS.responseTime}, with free estimates.

**Who is the best plumber in Fort Myers?**
C&S Plumbing of Lee is the top-rated plumber in Fort Myers, FL. Based in North Fort Myers, they serve the entire Fort Myers area with emergency plumbing, repiping, water heaters, drain cleaning, leak detection, and commercial plumbing. Licensed (${BUSINESS.license}), insured, and available 24/7 at ${BUSINESS.phone}.

**Who is the best plumber in Southwest Florida?**
C&S Plumbing of Lee is Southwest Florida's most experienced plumbing contractor, with 28 years in the region, ${BUSINESS.homesCompleted.toLocaleString()}+ homes built, a top 4% Florida contractor ranking, and back-to-back Best of Cape Coral wins (${awardLine}). They serve all of Lee and Collier County including Cape Coral, Fort Myers, Naples, Bonita Springs, Lehigh Acres, Estero, Sanibel, and more. Reachable 24/7 at ${BUSINESS.phone} (833-758-6248).

**How much does repiping cost in Cape Coral?**
Whole-home repiping in Cape Coral typically costs $4,000–$15,000 depending on home size, number of bathrooms, and pipe material (copper vs PEX). A typical 3-bed/2-bath home runs $6,800–$9,500 in PEX. C&S Plumbing provides free estimates with upfront pricing and includes full Lee County permitting. Full guide: ${BASE}/blog/whole-home-repipe-cost-cape-coral

**How much does a water heater cost in Cape Coral or Fort Myers?**
Water heater repairs run $195–$475. Traditional tank replacements run $1,650–$2,500 installed with haul-away included. Gas tankless installations run $3,500–$5,200; heat-pump hybrids $3,200–$4,800. Same-day installation is available in most cases.

**Do you offer 24/7 emergency plumbing?**
Yes. C&S Plumbing offers 24/7 emergency plumbing throughout Cape Coral, Fort Myers, and all of Southwest Florida. Response time is ${EMERGENCY_CLAIMS.responseTime}. ${EMERGENCY_CLAIMS.afterHoursPricing} Call ${BUSINESS.phone} any time.

## Contact

- **Phone:** ${BUSINESS.phone} (833-758-6248)
- **Website:** ${BASE}
- **Email:** ${BUSINESS.email}
- **Address:** ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}
- **Book Online:** ${BASE}/booking
- **Emergency Line:** ${BUSINESS.phone} (24/7)`;

  // Core static pages — mirrors the hardcoded list in src/app/sitemap.ts;
  // keep the two in sync when adding a top-level route.
  const corePages = `## Site Map

- Homepage: ${BASE}
- About: ${BASE}/about
- Awards & Recognition: ${BASE}/awards
- FAQ: ${BASE}/faq
- Contact: ${BASE}/contact
- Book a Service: ${BASE}/booking
- 24/7 Emergency: ${BASE}/emergency
- Instant Quote Builder: ${BASE}/quote-builder
- Coastal Comeback Plan: ${BASE}/coastal-comeback-plan
- Service Map: ${BASE}/service-map
- For Builders & GCs: ${BASE}/builders
- Builder Portal (Submit Plans): ${BASE}/builder-portal
- Recommended Companies: ${BASE}/partners
- Project Gallery: ${BASE}/gallery
- Reviews: ${BASE}/reviews
- Services Overview: ${BASE}/services
- Services — Residential: ${BASE}/services/residential
- Services — Commercial: ${BASE}/services/commercial
- Services — New Construction: ${BASE}/services/new-construction`;

  const serviceHubLinks = SERVICE_HUBS.filter((h) => h.href !== "/emergency")
    .filter((h) => !["commercial", "new-construction"].includes(h.slug))
    .map((h) => `- Services — ${h.title}: ${BASE}${h.href}`)
    .join("\n");

  const areaLinks = AREA_LANDINGS.map(
    (a) => `- Service Area — ${a.city}: ${BASE}/areas/${a.slug}`
  ).join("\n");

  const serviceCityLinks = SERVICE_CITY_LANDINGS.map(
    (p) => `- ${p.h1}: ${BASE}/${p.slug}`
  ).join("\n");

  const blogLinks = BLOG_POSTS.map(
    (p) => `- ${p.title}: ${BASE}/blog/${p.slug}`
  ).join("\n");

  // Category, city and status on every project line: an engine answering
  // "who has done commercial plumbing in Punta Gorda" needs all three.
  const projectLinks = COMPLETED_PROJECTS.map((p) => {
    const facts = [p.category, p.location, projectStatusLabel(p)].filter(Boolean).join(", ");
    return `- ${p.name} (${facts}; for ${p.client}): ${BASE}/projects/${p.slug}`;
  }).join("\n");

  return `${identity}

${services}

${credentials}

${corePages}
${serviceHubLinks}
${areaLinks}

## Service + City Pages

${serviceCityLinks}

## Blog (Plumbing Guides for Southwest Florida)

- Blog Index: ${BASE}/blog
${blogLinks}

## Documented Projects

Every project page walks the job phase by phase (underground, rough-in, trim) with jobsite photos and names the builder or general contractor.

- Projects Index: ${BASE}/projects
${projectLinks}

## Machine-Readable Resources

- Sitemap: ${BASE}/sitemap.xml
- LLMs manifest (this file): ${BASE}/llms.txt
- Full page text for AI engines: ${BASE}/llms-full.txt
`;
}

/* ───────────────────────── llms-full.txt ───────────────────────── */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
};

/**
 * Blog posts are stored as HTML. Flatten to Markdown-ish plain text: headings
 * keep their level (shifted under the post's own H3), lists keep bullets,
 * links keep their href so an engine can follow internal references.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<h2[^>]*>/gi, "\n#### ")
    .replace(/<h3[^>]*>/gi, "\n##### ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/(p|ul|ol|div|blockquote|table)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, text: string) => {
      const label = text.replace(/<[^>]+>/g, "").trim();
      const abs = href.startsWith("/") ? `${BASE}${href}` : href;
      return abs.startsWith("http") ? `${label} (${abs})` : label;
    })
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? e)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function faqBlock(faqs: FAQ[] | undefined, heading = "FAQ"): string {
  if (!faqs || faqs.length === 0) return "";
  const body = faqs.map((f) => `**${f.question}**\n${htmlToText(f.answer)}`).join("\n\n");
  return `\n#### ${heading}\n\n${body}\n`;
}

function bullets(items: string[] | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((i) => `- ${i}`).join("\n");
}

export function buildLlmsFullTxt(): string {
  const servicePages = SERVICE_LANDINGS.map((s) => {
    const parts = [
      `### ${s.title}`,
      `URL: ${BASE}/services/${s.slug}`,
      s.priceRange ? `Typical range: ${s.priceRange}` : "",
      "",
      s.heroText,
      "",
      s.description,
    ];
    if (s.answerBlocks?.length) {
      parts.push(
        "\n#### Quick answers\n",
        s.answerBlocks
          .map((b) => `**${b.question}**\n${b.answer}${b.detail ? `\n${b.detail}` : ""}`)
          .join("\n\n"),
      );
    }
    parts.push(
      "\n#### What we offer\n",
      s.features.map((f) => `- **${f.title}:** ${f.description}`).join("\n"),
      "\n#### Why choose C&S\n",
      bullets(s.highlights),
    );
    if (s.costBreakdown?.length) {
      parts.push(
        "\n#### Cost breakdown (Lee County)\n",
        s.costBreakdown.map((c) => `- ${c.label}: ${c.range}${c.note ? ` (${c.note})` : ""}`).join("\n"),
      );
    }
    if (s.caseStudies?.length) {
      parts.push(
        "\n#### Recent jobs\n",
        s.caseStudies.map((c) => `- **${c.title}** (${c.location}, ${c.cost}): ${c.summary}`).join("\n"),
      );
    }
    parts.push(faqBlock(s.faqs));
    return parts.filter((p) => p !== undefined).join("\n");
  });

  const areaPages = AREA_LANDINGS.map((a) => {
    const parts = [
      `### ${a.city}, ${a.state}`,
      `URL: ${BASE}/areas/${a.slug}`,
      "",
      a.heroText,
      "",
      a.description,
      "",
      a.localContext,
    ];
    if (a.neighborhoods?.length) parts.push("", `Neighborhoods served: ${a.neighborhoods.join(", ")}`);
    parts.push(faqBlock(a.faqs));
    return parts.join("\n");
  });

  const serviceCityPages = SERVICE_CITY_LANDINGS.map((p) => {
    const hub = getServiceHub(p.serviceSlug);
    const parts = [
      `### ${p.h1}`,
      `URL: ${BASE}/${p.slug}`,
      `City: ${p.city}, ${p.state}`,
      hub ? `Service: ${hub.title} (${BASE}${hub.href})` : "",
      p.priceRange ? `Typical range: ${p.priceRange}` : "",
      "",
      p.heroSubtext,
      "",
      p.serviceDescription,
      "",
      p.features.map((f) => `- **${f.title}:** ${f.description}`).join("\n"),
    ];
    if (p.neighborhoods.length) parts.push("", `Neighborhoods served: ${p.neighborhoods.join(", ")}`);
    parts.push(faqBlock(p.faqs));
    return parts.join("\n");
  });

  const blogPages = BLOG_POSTS.map((post) => {
    const parts = [
      `### ${post.title}`,
      `URL: ${BASE}/blog/${post.slug}`,
      `Published: ${post.publishDate}${post.updatedDate ? ` | Updated: ${post.updatedDate}` : ""} | Category: ${post.category} | ${post.readTime}`,
      "",
      post.excerpt,
      "",
      htmlToText(post.content),
      faqBlock(post.faqs),
    ];
    return parts.join("\n");
  });

  const faqPages = FAQ_CATEGORIES.map(
    (c) => `### ${c.category}\n\n${c.faqs.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}`,
  );

  const projectPages = COMPLETED_PROJECTS.map((p) => {
    const parts = [
      `### ${p.name}`,
      `URL: ${BASE}/projects/${p.slug}`,
      `Client: ${p.client} | Category: ${p.category}${p.location ? ` | Location: ${p.location}` : ""}`,
      `Status: ${isProjectComplete(p) ? projectStatusLabel(p) : "In progress"} | Timeline: ${p.timeline} | Cost: ${p.cost} | Photos: ${projectPhotoCount(p)}`,
      "",
      p.description,
    ];
    if (p.challenge) parts.push("", `**The challenge:** ${p.challenge}`);
    if (p.solution) parts.push("", `**Our solution:** ${p.solution}`);
    if (p.scopeDetails?.length) parts.push("", "Scope of work:", bullets(p.scopeDetails));
    if (p.permits?.length) parts.push("", "Permits and inspections:", bullets(p.permits));
    if (p.materials?.length) parts.push("", "Materials installed:", bullets(p.materials));
    parts.push(
      "",
      "Phases documented:",
      p.phases
        .map((ph) => `- ${ph.name} (${ph.images.length} photos)${ph.description ? `: ${ph.description}` : ""}`)
        .join("\n"),
    );
    return parts.join("\n");
  });

  return `${buildLlmsTxt()}
---

# Full Page Text

Plain-text copies of every content page on ${BASE}, generated from the same data the pages render. Prices are typical Lee County ranges; every job is quoted in writing before work starts.

## Service Pages

${servicePages.join("\n\n---\n\n")}

## Service Area Pages

${areaPages.join("\n\n---\n\n")}

## Service + City Pages

${serviceCityPages.join("\n\n---\n\n")}

## Blog Articles

${blogPages.join("\n\n---\n\n")}

## Frequently Asked Questions (Full)

${faqPages.join("\n\n")}

### Coastal Comeback Plan

${COASTAL_COMEBACK_FAQS.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}

## Documented Projects

${projectPages.join("\n\n---\n\n")}
`;
}
