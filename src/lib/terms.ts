// Terms & Conditions content — the single source for /terms, its print view,
// and llms.txt. Edit clause text here; bump the revision in ./terms-meta.ts.
//
// Rules for this file:
// - Numbers are derived from array order (1, 1.1 …). Anchor ids are stable
//   kebab-case strings so links survive reordering.
// - Only owner-confirmed figures appear as numbers. Anything that varies by
//   job is written as "quoted at booking" or "as stated on the document".
// - Never "lump sum". The price is a total; the Fixed Price clause carries
//   the fixed-price meaning (brand rule).
// - `attorneyReview` is internal and never rendered.
//
// Business decisions baked in (confirmed 2026-11-02): tiered warranty by job
// type (pending Chris/Sam sign-off before merge — broader than the Sep 2026
// WARRANTY constant), payment due in full on completion with no standing
// deposit, 3% credit-card surcharge, commercial supplement on the same page.

import { BUSINESS, EMERGENCY_CLAIMS } from "./constants";
import { QUALIFICATIONS } from "./builder-program";
import {
  TERMS_CITATION,
  TERMS_EFFECTIVE_DATE,
  TERMS_SHORT_URL,
  TERMS_URL,
  TERMS_VERSION,
  formatTermsDate,
} from "./terms-meta";

export * from "./terms-meta";

// ============================================
// TYPES
// ============================================

export type TermsAudience = "all" | "residential" | "commercial";

export interface TermsLink {
  label: string;
  href: string;
}

export interface TermsClause {
  /** Unique kebab-case anchor. Numbers are derived, never stored. */
  id: string;
  /** Bold run-in lead, e.g. "Late payment." */
  heading?: string;
  /** One paragraph of plain text. */
  text: string;
  /** Rendered as (a), (b), (c). */
  items?: readonly string[];
  /** Inline links rendered after the text. */
  links?: readonly TermsLink[];
  /** Statutory notice: rendered as a bordered block, text already in capitals. */
  notice?: boolean;
  /** Defaults to the section's audience, else "all". */
  appliesTo?: TermsAudience;
  /** Internal only. Why this clause needs attorney sign-off. Never rendered. */
  attorneyReview?: string;
}

export interface TermsSection {
  /** Anchor, e.g. "payment". */
  id: string;
  title: string;
  intro?: string;
  appliesTo?: TermsAudience;
  clauses: readonly TermsClause[];
}

export interface TermsRevision {
  version: string;
  effectiveDate: string;
  note: string;
}

export interface NumberedClause extends TermsClause {
  number: string;
  audience: TermsAudience;
}

export interface NumberedSection extends Omit<TermsSection, "clauses"> {
  number: string;
  audience: TermsAudience;
  clauses: NumberedClause[];
}

// ============================================
// PARAMETERS (owner-confirmed only)
// ============================================

export const TERMS_PARAMS = {
  quoteValidityDays: 30,
  cancellationNoticeHours: 24,
  lateInterestMonthlyPct: 1.5,
  lateInterestAnnualPct: 18,
  creditCardSurchargePct: 3,
  cureDays: 30,
  invoiceDisputeDays: 10,
  refundBusinessDays: 10,
  commercialNetDays: 30,
  retainageMaxPct: 10,
  retainageReleaseDays: 30,
  warranty: {
    installationLabor: "one year",
    installationMaterials: "one year",
    serviceLabor: "30 days",
    drainCleaning: "30 days",
  },
  venue: "Lee County, Florida",
} as const;

export const AUDIENCE_LABEL: Record<TermsAudience, string | null> = {
  all: null,
  residential: "Residential customers",
  commercial: "Commercial & builder work",
};

const GL_COVERAGE =
  QUALIFICATIONS.find((q) => q.id === "gl")?.label ?? "general liability coverage";
const WC_COVERAGE =
  QUALIFICATIONS.find((q) => q.id === "wc")?.label ?? "workers' compensation coverage";

const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

const OFFICE = `${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}`;

// ============================================
// PLAIN-ENGLISH SUMMARY (non-binding)
// ============================================

export const TERMS_PLAIN_ENGLISH: readonly string[] = [
  "Your written estimate or proposal plus these Terms is the agreement. You accept by signing, paying, scheduling, or telling us to go ahead.",
  "The price covers the scope written on the document. Anything hidden, added, or required by the inspector is priced and approved in writing before we do it.",
  `Payment is due when our work is done unless your document says otherwise. Credit cards carry a ${TERMS_PARAMS.creditCardSurchargePct}% surcharge; cash, check, ACH, debit, and prepaid cards do not.`,
  "Installations carry a one-year warranty on our labor and the materials we supply. Service repairs carry 30 days on labor and one year on parts we supply. Manufacturer warranties pass to you.",
  "We are not responsible for what was already failing before we arrived, for lines nobody marked, or for finishes we did not quote to restore.",
  "If something goes wrong, call the office first. We fix what we got wrong. If we still disagree, we mediate in Lee County before anyone goes to court.",
];

// ============================================
// SECTIONS
// ============================================

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "scope",
    title: "Agreement and acceptance",
    clauses: [
      {
        id: "scope-agreement",
        heading: "The agreement.",
        text: `These Terms & Conditions ("Terms") apply to every estimate, quote, proposal, bid, work order, and invoice issued by ${BUSINESS.legalName}, doing business as ${BUSINESS.fullName} ("C&S", "we"), and to all plumbing work we perform for you ("Customer", "you"). The document that describes your scope and price, together with these Terms, is the agreement for that work.`,
      },
      {
        id: "scope-acceptance",
        heading: "Acceptance.",
        text: "Every estimate and proposal shows the link to these Terms and the revision date before you decide. You accept the document and these Terms when you sign it, approve it in writing by email or text message, pay any part of it, or ask us to start the work described on it. We keep a copy of the document you accepted and of your approval.",
      },
      {
        id: "scope-booking",
        heading: "Booking a visit is not approving a project.",
        text: "Booking a service call or diagnostic visit accepts these Terms for that visit and the fee quoted at booking (clause 3.4). Any further work is accepted separately when you approve the written estimate for it.",
      },
      {
        id: "scope-revision",
        heading: "Which revision applies.",
        text: "Each estimate and proposal cites the revision of these Terms in effect on its date. The revision in effect when you accept stays attached to that job, including its change orders and invoices, even if we publish a newer revision later. A later invoice does not substitute a newer revision.",
      },
      {
        id: "scope-precedence",
        heading: "Order of precedence.",
        text: "If documents conflict, a signed contract or subcontract controls first, then the estimate or proposal you accepted (by signature, written approval, or payment), then these Terms. A written change order controls over all of them for the change it describes.",
      },
      {
        id: "scope-consumer",
        heading: "Your rights.",
        text: "Nothing in these Terms limits rights that Florida or federal law gives you and does not allow you to waive.",
      },
    ],
  },
  {
    id: "licensing",
    title: "Who we are",
    clauses: [
      {
        id: "licensing-entity",
        heading: "Licensed contractor.",
        text: `C&S is a Florida Certified Plumbing Contractor holding state licenses ${BUSINESS.license} and ${BUSINESS.license2}. Either license can be verified with the Florida Department of Business and Professional Regulation. Our office is at ${OFFICE}.`,
        links: [{ label: "Verify our licenses on MyFloridaLicense.com", href: BUSINESS.licenseLookupUrl }],
      },
      {
        id: "licensing-insurance",
        heading: "Insurance.",
        text: `C&S carries ${GL_COVERAGE.replace(/ coverage$/, "")} and ${lowerFirst(WC_COVERAGE)}. A certificate of insurance is available on request. What we are responsible for is set out in Section 11.`,
      },
      {
        id: "licensing-people",
        heading: "Our people.",
        text: "Plumbing work is performed by C&S employees. Where a specialty task such as excavation, concrete cutting, or leak detection is subcontracted, the document says so, and C&S remains responsible to you for it.",
      },
    ],
  },
  {
    id: "estimates",
    title: "Estimates, quotes and pricing",
    clauses: [
      {
        id: "estimates-basis",
        heading: "Basis of price.",
        text: "Prices are based on the scope written on the document and on the conditions we could see at the time of assessment. Piping inside walls, under slabs, or underground is assumed to be in serviceable condition and reachable by normal means unless the document says otherwise.",
      },
      {
        id: "estimates-validity",
        heading: "Validity.",
        text: `A written estimate or proposal is open for acceptance for ${TERMS_PARAMS.quoteValidityDays} days from its date unless the document states a different period. If you accept within that period, the price is fixed for the scope described and is not repriced because time passes, except as clause 16.4 provides for commercial material escalation. If you accept after the period, we may update the price for current material and labor costs before starting.`,
      },
      {
        id: "estimates-fixed-price",
        heading: "Fixed price.",
        text: "The total stated is a firm fixed price for the scope of work described. It is not an estimate and is not subject to adjustment for actual labor or material cost, except as clause 16.4 provides for commercial material escalation. Changes to scope, quantity, or conditions are billed only by written change order approved before the work, with the exceptions stated in clauses 4.4 and 6.3.",
      },
      {
        id: "estimates-fees",
        heading: "Service call, diagnostic and trip fees.",
        text: "When a service call, diagnostic, or trip fee applies, we quote it when you book and before we dispatch. If the fee is credited toward approved work, the document says so.",
      },
      {
        id: "estimates-after-hours",
        heading: "After-hours pricing.",
        text: EMERGENCY_CLAIMS.afterHoursPricing,
      },
      {
        id: "estimates-online",
        heading: "Online figures.",
        text: "Price ranges from our online quote builder, website, or advertising are general information, not offers. Only a written estimate or proposal issued by our office states a price you can accept.",
      },
      {
        id: "estimates-taxes",
        heading: "Taxes and fees.",
        text: "Unless the document says otherwise, the price includes applicable sales tax on materials. Permit, impact, and utility fees are listed separately when they apply.",
      },
    ],
  },
  {
    id: "changes",
    title: "Change orders and concealed conditions",
    clauses: [
      {
        id: "changes-written",
        heading: "Written change orders.",
        text: "Any change to the scope, materials, schedule, or price is approved in writing before the work is done. A signed change order, an email, or a text message from you all count. Our crew can describe a change on site, but the approval comes from you in writing.",
      },
      {
        id: "changes-concealed",
        heading: "Concealed and unforeseen conditions.",
        text: "The price does not include correcting conditions that could not be seen or were not disclosed at assessment. We stop, show you the condition, and price the extra work before continuing. These conditions include:",
        items: [
          "leaks, breaks, or corrosion inside walls, under slabs, or underground;",
          "cast iron, galvanized steel, polybutylene, or other failing pipe found during the work;",
          "rot, mold, pests, or water damage behind finishes;",
          "private lines you did not mark, such as irrigation, pool, low-voltage, or septic lines;",
          "existing work that does not meet code, and upgrades an inspector requires as a condition of approval, such as expansion tanks, drain pans, relief-valve piping, or backflow devices;",
          "shut-off valves, supply lines, or fittings that fail when operated because of age or corrosion;",
          "rock, roots, groundwater, or obstructions encountered in excavation.",
        ],
      },
      {
        id: "changes-our-corrections",
        heading: "Correcting our own work.",
        text: "Correcting work that C&S performed defectively or not to code is never a change order. We correct it at no charge, including any re-inspection fee caused by our error.",
      },
      {
        id: "changes-active-leak",
        heading: "Stopping active water loss.",
        text: "If we find an active leak, a sewage release, or a gas or scald hazard that will cause damage or injury while we wait for approval, we may take the minimum action needed to make it safe. That emergency work is billed at the hourly service rate and material prices stated on your document or quoted at booking, limited to the time and materials actually used to stop the loss. We tell you what we did and what it cost as soon as practical and before we leave the site, and any further work waits for your written approval. This is the only exception to clause 4.1.",
      },
      {
        id: "changes-pricing",
        heading: "How changes are priced.",
        text: "Change orders are priced at our current rates for labor and materials, or at the unit prices on your document when it lists them. Work you ask us to delete is credited less the cost of materials already ordered and work already performed.",
      },
    ],
  },
  {
    id: "permits",
    title: "Permits, inspections and code",
    clauses: [
      {
        id: "permits-who",
        heading: "Permits.",
        text: "When a plumbing permit is required, C&S applies for it, schedules the inspections, and performs the work to the Florida Building Code and local amendments. Permit, impact, and utility connection fees are listed separately on the document when they apply. If a permit is required and the document did not list it, we still obtain it; you pay only the permit fee at cost, and our time to obtain it is not charged.",
      },
      {
        id: "permits-no-unpermitted",
        heading: "No unpermitted work.",
        text: "Where the jurisdiction requires a permit, we do not perform the work without one, and we do not close walls or cover work that requires inspection until it passes.",
      },
      {
        id: "permits-approvals",
        heading: "Your approvals.",
        text: "You are responsible for approvals from a homeowners' or condominium association, landlord, or lender, and for giving the inspector access on the scheduled day. A failed inspection caused by missing approvals or access may be charged as a return trip.",
      },
      {
        id: "permits-other-trades",
        heading: "Work by other trades.",
        text: "Electrical, HVAC, structural, concrete, and finish work by other trades is not included unless the document says so, even when an inspector requires it before a plumbing inspection can pass.",
      },
    ],
  },
  {
    id: "scheduling",
    title: "Scheduling, access and site conditions",
    clauses: [
      {
        id: "scheduling-windows",
        heading: "Arrival windows.",
        text: "We schedule arrival windows, not exact times. Emergency calls, weather, inspections, and jobs that run long can move your window. We call or text when the schedule changes.",
      },
      {
        id: "scheduling-cancellation",
        heading: "Cancellation and rescheduling.",
        text: `Please give at least ${TERMS_PARAMS.cancellationNoticeHours} hours' notice to cancel or move a scheduled visit. A late cancellation or a visit where we cannot get access may be charged the service call or trip fee quoted when you booked.`,
      },
      {
        id: "scheduling-access",
        heading: "What you provide.",
        text: "You provide safe access to the work area and to the water, sewer, gas, and electrical shut-offs; working water and power; a clear path and clear work area; secured pets; and the location of private lines such as irrigation, pool, low-voltage, or septic. Time our crew spends waiting for access or clearing the work area is billed at the hourly rate on your document or quoted at booking; we tell you before we bill it.",
      },
      {
        id: "scheduling-occupied",
        heading: "Occupied properties.",
        text: "We protect floors and work areas with reasonable care, but plumbing work is construction. Expect noise, dust, water shut-offs, and open walls or floors while the work is in progress. Move valuables, furniture, and fragile items away from the work area before we arrive.",
      },
      {
        id: "scheduling-weather",
        heading: "Weather.",
        text: "Work outdoors, on roofs, in attics, or in trenches may be paused for lightning, heavy rain, flooding, or heat conditions that are unsafe for our crew. Storm events are covered in Section 13.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    clauses: [
      {
        id: "payment-due",
        heading: "When payment is due.",
        text: "Payment is due in full when our work is complete, unless your estimate or proposal states a deposit, a pre-payment for special-order materials, or a progress billing schedule. Our work is complete when the scope on the document has been performed and, if we pulled a permit, we have requested the final plumbing inspection. If that inspection fails because of our work, we correct it at no charge and you may hold back the reasonable value of the correction until it passes; inspections or punch items that belong to other trades do not delay payment. If a proposal states a deposit of more than 10% of the price and a permit is required, we apply for the permit within 30 days after receiving the deposit and start the work within 90 days after the permit issues, as section 489.126, Florida Statutes, requires, unless you agree in writing to a longer period.",
        attorneyReview: "Confirm the section 489.126(2) deposit rule wording (10% threshold, 30 days to apply for permits, 90 days to start after permits issue, written agreement to longer periods).",
      },
      {
        id: "payment-methods",
        heading: "How to pay.",
        text: "We accept cash, check, ACH or bank transfer, debit cards, and major credit cards. Financing may be available for larger projects through third-party lenders, on terms set by the lender.",
      },
      {
        id: "payment-surcharge",
        heading: "Credit card surcharge.",
        text: `Credit card payments carry a ${TERMS_PARAMS.creditCardSurchargePct}% surcharge to cover processing costs. It is shown as a separate line on the invoice and disclosed before you pay, and it never exceeds our cost of accepting the card or the maximum the card networks allow. The surcharge does not apply to cash, check, ACH, debit card, or prepaid card payments.`,
        attorneyReview:
          "FS 501.0117 (no-surcharge statute) is still on the books but was held unconstitutional in Dana's R.R. Supply v. Attorney General, 807 F.3d 1235 (11th Cir. 2015). Confirm the office is comfortable relying on that, that the processor has been notified, and that invoices show the surcharge as a separate line. Alternative: cash/check discount wording.",
      },
      {
        id: "payment-late",
        heading: "Late payment.",
        text: `Balances not paid when due accrue interest at ${TERMS_PARAMS.lateInterestMonthlyPct}% per month (${TERMS_PARAMS.lateInterestAnnualPct}% per year), or the maximum rate Florida law allows if that is lower, from the due date until paid. You also agree to pay our reasonable costs of collection, including collection-agency fees, and attorney's fees and court costs where the law allows.`,
      },
      {
        id: "payment-returned",
        heading: "Returned payments.",
        text: "A check or electronic payment returned unpaid is subject to the service charge permitted by section 68.065, Florida Statutes.",
      },
      {
        id: "payment-suspension",
        heading: "Suspension for non-payment.",
        text: "If a payment is past due, we may stop work and decline to schedule further work until the account is current. Warranty service is suspended while a balance is past due and resumes when the account is paid; the warranty period is not extended, and a claim you made on time is honored once the account is current. Title to materials passes to you when they are paid for. Our remedies for non-payment are payment, interest, collection costs, and lien rights, not removal of installed work.",
      },
      {
        id: "payment-lien",
        heading: "Construction lien rights.",
        text: "Florida's Construction Lien Law (Chapter 713, Florida Statutes) gives those who improve your property and are not paid the right to record a lien against it. C&S reserves all rights under Chapter 713. On projects where we are not in direct contract with the property owner, we serve a Notice to Owner as standard practice.",
      },
      {
        id: "payment-disputed",
        heading: "Disputed invoices.",
        text: `If you dispute any part of an invoice, tell us in writing within ${TERMS_PARAMS.invoiceDisputeDays} days after you receive it and pay the undisputed part when due. We review and respond in writing within ${TERMS_PARAMS.invoiceDisputeDays} days. Interest does not accrue on a disputed amount while we are reviewing it.`,
      },
    ],
  },
  {
    id: "materials",
    title: "Materials and special orders",
    clauses: [
      {
        id: "materials-ours",
        heading: "Materials we supply.",
        text: "Materials we supply are new, approved for the use under the Florida Building Code, and installed to the manufacturer's instructions. Where a specified product is unavailable, we may substitute a like-for-like product of equal or better quality and function at no change in price. A substitute that changes the brand, model, finish, size, or performance of a product named on your document needs your approval before we install it.",
      },
      {
        id: "materials-yours",
        heading: "Materials you supply.",
        text: "If you supply fixtures, equipment, or materials, we install them for the labor price only. Our workmanship warranty in Section 9 covers how we installed them, but not the product itself or a failure the product causes. You are responsible for their suitability, defects, missing parts, returns, and the cost of return trips if they arrive late, wrong, or damaged. We may decline to install products that do not meet code or the manufacturer's installation requirements.",
      },
      {
        id: "materials-special-orders",
        heading: "Special orders.",
        text: "If you cancel or change your order after we have ordered fixtures, equipment, or materials for your job: items the supplier accepts back are returned, and you are charged only the supplier's restocking fee and freight, with any refund the supplier gives us credited to you in full; items the supplier will not accept back (custom, cut-to-length, or special-order products) are charged at our cost, and you may keep them. You are never charged both for an item and for an amount the supplier refunded. Your right to cancel under Section 14 is not affected.",
      },
      {
        id: "materials-removed",
        heading: "Removed items.",
        text: "Items we remove are hauled away and disposed of unless you ask us to leave them before the work starts.",
      },
      {
        id: "materials-delivered",
        heading: "Delivered materials.",
        text: "Materials stay in our care until installed unless you ask us to deliver them to your property early. If you do, you provide a secure, dry place, and they are in your care from delivery; loss or damage not caused by C&S is replaced by change order.",
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty",
    clauses: [
      {
        id: "warranty-periods",
        heading: "What we warrant.",
        text: "C&S warrants its workmanship and the materials it supplies against defects for the periods below, measured from the date the work is completed. An installation is new fixtures, equipment, or piping we install; a repair restores an existing component. The labor period covers our workmanship and the labor to correct a covered defect; the materials period covers the part itself. After the labor period ends, a defective part we supplied is still replaced at no charge for the rest of its materials period, but the labor to replace it is billed at our service rates.",
        items: [
          `installations, including water heaters, fixtures, whole-home repipes, remodel rough-in and trim, and new-construction plumbing: ${TERMS_PARAMS.warranty.installationLabor} on our labor and ${TERMS_PARAMS.warranty.installationMaterials} on materials supplied by C&S;`,
          `service and repair work, including leak repairs, valve and fixture repairs, and part replacements: ${TERMS_PARAMS.warranty.serviceLabor} on our labor and ${TERMS_PARAMS.warranty.installationMaterials} on materials supplied by C&S;`,
          `drain cleaning: ${TERMS_PARAMS.warranty.drainCleaning} against a recurring stoppage in the line we cleared, whatever the cause, except a stoppage caused by an object or material put into the line after our service, and except a line we told you at the time of service has root intrusion, a belly, a break, or deteriorated cast iron, which carries no warranty;`,
          "products you supplied: our workmanship in installing them is covered for the labor period above; the product itself is not.",
        ],
        attorneyReview:
          "Tiered labor warranty is broader than the owner-confirmed WARRANTY constant (Sep 2026: one year on C&S-supplied materials only). Chris/Sam must sign off before this revision is merged; then align the residential, repipe and commercial service pages. Owner decision also needed on the rule that labor after the labor period is billed at service rates.",
      },
      {
        id: "warranty-manufacturer",
        heading: "Manufacturer warranties.",
        text: "Water heaters, fixtures, and equipment carry their manufacturers' warranties, which pass to you. Extended manufacturer warranties sold with a product, such as 10- or 12-year tank warranties, are the manufacturer's, not ours. We help with registration and claims, but the manufacturer decides coverage. Labor to replace a product under a manufacturer's warranty is covered by C&S only within the labor periods above.",
      },
      {
        id: "warranty-claims",
        heading: "How to make a claim.",
        text: "Call or email the office within the warranty period and describe the problem. We inspect, and if the problem is a defect in our workmanship or in materials we supplied, we repair or replace it at our option: at no charge within the labor period, and after the labor period at no charge for the part with labor billed at our service rates, as clause 9.1 describes. Repair or replacement is your exclusive remedy under this warranty. A visit that finds no covered defect is billed at our service rates; we tell you that rate before we dispatch.",
        attorneyReview: "Exclusive-remedy language on a consumer written warranty: confirm it is permissible and conspicuous enough.",
      },
      {
        id: "warranty-exclusions",
        heading: "What is not covered.",
        text: "This warranty does not cover:",
        items: [
          "damage from misuse, neglect, accident, or alteration or repair by anyone other than C&S;",
          "conditions that existed before our work, including the parts of a plumbing system we did not replace;",
          "wear, sediment, scale, corrosion, or failures caused by water quality, water hardness, well water, or water pressure above code limits;",
          "freezing, storms, flooding, lightning, power surges, fire, or other events outside our control;",
          "stoppages caused by foreign objects, grease, wipes, or roots, except as the drain-cleaning warranty in clause 9.1 provides;",
          "materials you supplied, and work by other trades;",
          "cosmetic issues reported after the work was accepted;",
          "claims made while a balance is past due, which are honored once the account is current as clause 7.6 provides.",
        ],
      },
      {
        id: "warranty-transfer",
        heading: "Who is covered.",
        text: "The warranty runs to the original customer at the property where the work was done and is not transferable unless the document says otherwise. The new-construction customer benefits described on our website are separate from this warranty.",
        attorneyReview: "Non-transferability of a written warranty on consumer products: confirm permissible and whether it must be stated on the document itself.",
      },
      {
        id: "warranty-disclaimer",
        heading: "Implied warranties and your legal rights.",
        text: "To the extent the law allows, any implied warranty on our work or on products we supply, including an implied warranty of merchantability or fitness for a particular purpose, is limited in duration to the applicable period in clause 9.1. Some states do not allow limits on how long an implied warranty lasts, so this limit may not apply to you. This warranty gives you specific legal rights, and you may also have other rights that vary from state to state.",
        attorneyReview: "Magnuson-Moss: a written warranty on consumer products may limit implied warranties in duration but may not disclaim them. Confirm this wording and whether the warranty must be designated \"limited\" and provided pre-sale.",
      },
    ],
  },
  {
    id: "exclusions",
    title: "Exclusions and restoration",
    clauses: [
      {
        id: "exclusions-finishes",
        heading: "Finishes and restoration.",
        text: "Unless the document lists it, the price does not include restoring, patching, painting, or replacing drywall, stucco, tile, flooring, cabinets, countertops, trim, insulation, concrete, pavers, driveways, sod, landscaping, or irrigation that must be opened or removed to reach the plumbing. Where the document includes cutting and patching, the patch is a rough patch ready for finish by others unless it says otherwise.",
      },
      {
        id: "exclusions-other-work",
        heading: "Other work not included.",
        text: "Unless listed on the document, the price excludes electrical work and circuits; HVAC and condensate work beyond the plumbing connection; water treatment equipment; camera inspection and leak detection; water-damage drying and cleanup; mold or asbestos remediation; hauling of debris other than what we remove; and work on lines outside the property line or on the utility's side of the meter.",
      },
      {
        id: "exclusions-cleanup",
        heading: "Cleanup.",
        text: "We leave the work area broom-clean and remove our debris. Final cleaning of the home or business is not included.",
      },
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    clauses: [
      {
        id: "liability-our-damage",
        heading: "Damage we cause.",
        text: "If our crew damages your property through our negligence, we repair it or pay the reasonable cost to repair it, subject to clauses 11.5 and 11.6. Report it to the office as soon as you notice it so we can inspect.",
      },
      {
        id: "liability-preexisting",
        heading: "Conditions we did not cause.",
        text: "C&S is not responsible for damage or loss caused by conditions that existed before our work, including prior leaks, prior water damage, deteriorated pipe, failing fixtures, improper work by others, or conditions we identified and recommended correcting that you chose not to correct.",
      },
      {
        id: "liability-aging",
        heading: "Aging components.",
        text: "Operating old shut-off valves, supply lines, drains, and fittings is a normal part of plumbing work and can cause them to fail. C&S is not responsible for the failure of aging or corroded components we must operate to perform the work. Replacing them is a change order.",
      },
      {
        id: "liability-unmarked",
        heading: "Unmarked lines.",
        text: "C&S is not responsible for damage to private underground or in-wall lines that were not marked or disclosed before the work began. Public utilities are located through Sunshine 811 before we excavate.",
      },
      {
        id: "liability-consequential",
        heading: "No consequential damages.",
        text: "To the fullest extent the law allows, C&S is not liable for indirect, incidental, special, or consequential damages, including loss of use, lost rent or profits, business interruption, hotel or relocation costs, arising from our work or these Terms. Direct physical damage that we cause is covered by clause 11.1 and is not excluded by this clause.",
        attorneyReview: "Confirm consequential-damages waiver wording for residential consumers under FDUTPA.",
      },
      {
        id: "liability-cap",
        heading: "Limit of liability.",
        text: "To the fullest extent the law allows, C&S's total liability for any claim arising from the work is limited to the total price of the work on the document that gave rise to the claim. This limit does not apply to liability for bodily injury or death, or to any liability that Florida law does not allow to be limited.",
        attorneyReview: "Cap is set at the contract price of the work (not the amount paid), chosen so a partly paid job does not shrink the cap. Clause 11.1 affirms responsibility for negligent damage; the cap and the consequential-damages waiver still need consumer-law review.",
      },
      {
        id: "liability-insurance",
        heading: "Your insurance.",
        text: "For water damage from conditions that existed before our work or that we did not cause, your property insurer is the place to file a claim. Report water damage to your insurer promptly; we provide invoices and photographs to support your claim.",
      },
    ],
  },
  {
    id: "hazardous",
    title: "Hazardous materials and mold",
    clauses: [
      {
        id: "hazardous-discovery",
        heading: "Discovery.",
        text: "C&S does not test for, remove, or remediate asbestos, lead, mold, sewage contamination, or other hazardous materials. If we find or suspect them, we stop work in the affected area until it has been tested and cleared by a qualified remediation contractor hired by you.",
      },
      {
        id: "hazardous-cost",
        heading: "Cost and schedule.",
        text: "Testing and remediation are your responsibility. Time lost and remobilization caused by the stoppage are a change order. We are not responsible for the presence of hazardous materials or for not detecting them.",
      },
      {
        id: "hazardous-sewage",
        heading: "Sewage and contaminated water.",
        text: "Where work involves a sewage backup or contaminated water, we clear the plumbing problem. Cleaning, disinfecting, drying, and restoring the affected areas are performed by a remediation contractor and are not included unless the document says so.",
      },
    ],
  },
  {
    id: "force-majeure",
    title: "Delays beyond our control",
    clauses: [
      {
        id: "force-majeure-events",
        heading: "Events.",
        text: "C&S is not responsible for delay or failure to perform caused by events beyond our reasonable control, including tropical storms and hurricanes and the watches and warnings that precede them, evacuation orders, flooding, utility outages, permit or inspection delays, supplier and manufacturer shortages or delays, labor disputes, epidemics, and government orders.",
      },
      {
        id: "force-majeure-schedule",
        heading: "Effect on schedule.",
        text: "The schedule extends for the length of the delay plus a reasonable time to remobilize. Where a named storm requires us to secure the site, demobilize, and return, the return trip is a change order.",
      },
      {
        id: "force-majeure-storms",
        heading: "Named storms.",
        text: "When a hurricane watch or warning is issued for the project area, we may suspend work and secure the site. Work resumes when conditions and access allow.",
      },
    ],
  },
  {
    id: "cancellation",
    title: "Your right to cancel",
    appliesTo: "residential",
    clauses: [
      {
        id: "cancellation-three-day",
        heading: "Three-day right to cancel.",
        text: "If you signed an agreement at your home during a visit we solicited, Florida's Home Solicitation Sale Act (sections 501.021 through 501.055, Florida Statutes) gives you the right to cancel by written notice delivered or postmarked before midnight of the third business day after you signed. The notice printed on the agreement explains how. This right does not apply to a visit you requested for repair or maintenance, or to an emergency repair you asked us to perform right away and waived in a dated, signed statement in your own handwriting. Federal law (the Federal Trade Commission's Cooling-Off Rule) gives a similar right, and where both apply you get the broader one. The cancellation form and instructions are printed on the agreement.",
        attorneyReview:
          "Confirm the FS 501.021 exclusions as applied to customer-initiated service calls, and whether a home solicitation sale permit (FS 501.022) is required for anyone who sells at the customer's home.",
      },
      {
        id: "cancellation-after",
        heading: "Cancelling after that.",
        text: `If you cancel within the cancellation period, we refund everything you paid within ${TERMS_PARAMS.refundBusinessDays} business days of receiving your notice. If you cancel after the period, or where it does not apply, you pay for work performed and for ordered materials as clause 8.3 provides, and we refund any remaining balance of amounts you paid within ${TERMS_PARAMS.refundBusinessDays} business days.`,
      },
      {
        id: "cancellation-by-cs",
        heading: "Cancellation by C&S.",
        text: `We may cancel the agreement if the work cannot lawfully or safely be performed, if required permits or approvals are refused, or if you do not pay when due. We invoice for work performed and materials ordered to that point and refund any excess you have paid within ${TERMS_PARAMS.refundBusinessDays} business days.`,
      },
    ],
  },
  {
    id: "disputes",
    title: "Dispute resolution",
    clauses: [
      {
        id: "disputes-call-first",
        heading: "Call us first.",
        text: `Most issues are fixed with a phone call. If you have a concern about our work or an invoice, contact the office at ${BUSINESS.phone} or ${BUSINESS.email}. We respond promptly and return to inspect if needed.`,
      },
      {
        id: "disputes-cure",
        heading: "Notice and cure.",
        text: `Before starting any legal action, the party with a claim gives the other written notice describing the problem and ${TERMS_PARAMS.cureDays} days to inspect and fix it or otherwise resolve the claim. For a claim that a construction defect exists, Chapter 558, Florida Statutes, sets its own pre-suit notice and inspection process, described in Section 20, which applies in place of this clause. Neither this clause nor clause 15.3 delays a filing needed to meet a statutory deadline, including a lien deadline, or a request for urgent relief to stop ongoing damage; the parties still mediate afterward.`,
      },
      {
        id: "disputes-mediation",
        heading: "Mediation.",
        text: `If the claim is not resolved, the parties submit it to mediation in ${TERMS_PARAMS.venue}, with a Florida certified mediator, before filing suit, and share the mediator's fee equally. A small-claims action may be filed without waiting for mediation, and the deadline and urgent-relief exceptions in clause 15.2 also apply here.`,
      },
      {
        id: "disputes-law-venue",
        heading: "Law and venue.",
        text: `These Terms and the work are governed by Florida law. Any lawsuit is filed in the state courts in ${TERMS_PARAMS.venue}, and each party consents to that venue.`,
      },
      {
        id: "disputes-fees",
        heading: "Attorney's fees.",
        text: "In any lawsuit arising from the work or these Terms, the prevailing party recovers its reasonable attorney's fees and costs, including on appeal, from the other party.",
      },
      {
        id: "disputes-jury",
        heading: "Jury waiver.",
        text: "To the extent the law allows, each party waives trial by jury in any lawsuit arising from the work or these Terms.",
        attorneyReview:
          "Jury waivers must be knowing and voluntary; one incorporated by URL may not hold against a consumer. Keep, move to the signed document, or drop.",
      },
    ],
  },
  {
    id: "commercial",
    title: "Commercial and new-construction supplement",
    appliesTo: "commercial",
    intro:
      "This Section applies when the customer is a general contractor, builder, developer, property manager, or commercial property owner, or when the document says a project is commercial or new construction. Where it conflicts with the Sections above, this Section controls. A signed subcontract controls over this Section where they conflict.",
    clauses: [
      {
        id: "commercial-billing",
        heading: "Progress billing.",
        text: `Unless the document states a different schedule, C&S invoices by phase (underground, rough-in, top-out, trim) or monthly for work in place and stored materials, on AIA G702/G703 or our standard pay application, net ${TERMS_PARAMS.commercialNetDays} from the invoice date.`,
      },
      {
        id: "commercial-retainage",
        heading: "Retainage.",
        text: `Retainage, if any, does not exceed ${TERMS_PARAMS.retainageMaxPct}% and is released within ${TERMS_PARAMS.retainageReleaseDays} days of final plumbing inspection approval and completion of our punch list.`,
      },
      {
        id: "commercial-pay-contingency",
        heading: "Payment not contingent.",
        text: "Payment to C&S is not contingent on the customer receiving payment from the owner, lender, or any other party unless a signed subcontract expressly says so.",
      },
      {
        id: "commercial-escalation",
        heading: "Material escalation.",
        text: "As an exception to clause 3.3, pricing is based on material costs as of the bid date. Documented manufacturer or supplier increases for copper, brass, PVC, fixtures, or equipment occurring before installation are passed through by change order, in the amount of the documented increase, with supporting documentation.",
      },
      {
        id: "commercial-mobilization",
        heading: "Schedule and mobilization.",
        text: "Price assumes continuous access by phase and a single mobilization per phase. Delays caused by others, owner or contractor decisions, permit holds, or a site not ready for our work are not C&S's responsibility. Remobilization, standby, and out-of-sequence work are charged by change order at the rates in the subcontract or, if none, at our then-current rates, and we give written notice before the cost is incurred wherever practical.",
      },
      {
        id: "commercial-back-charges",
        heading: "Back-charges.",
        text: "No back-charge is valid unless C&S receives written notice describing the issue and a reasonable opportunity to correct it before the customer incurs the cost, except where immediate correction is needed to prevent injury, property damage, or a stop-work order, in which case the customer notifies C&S as soon as practical and documents the cost.",
      },
      {
        id: "commercial-lien-waivers",
        heading: "Lien waivers and Notice to Owner.",
        text: "C&S provides lien waivers in the statutory forms under section 713.20, Florida Statutes: a conditional waiver in exchange for a progress or final payment, and an unconditional waiver once that payment has cleared. C&S serves a Notice to Owner as standard practice on every project where it is not in direct contract with the owner.",
      },
      {
        id: "commercial-protection",
        heading: "Protection of installed work.",
        text: "After each phase is inspected, the customer is responsible for protecting installed piping, stub-outs, and fixtures from damage by other trades. Repairing our work after damage by others is a change order.",
      },
      {
        id: "commercial-documents",
        heading: "Insurance and documents.",
        text: "Certificates of insurance, W-9, and workers' compensation certificates are provided on request. Additional-insured endorsements, bonds, and limits above our standard coverage are provided where the subcontract requires them and may be priced as an add.",
      },
    ],
  },
  {
    id: "website",
    title: "Website, privacy and intellectual property",
    clauses: [
      {
        id: "website-content",
        heading: "Website content.",
        text: "Content on csplumbinglee.com, including articles, price ranges, and the online quote builder, is general information and is not a substitute for an on-site assessment. Do not attempt plumbing repairs beyond your skill level based on general information.",
      },
      {
        id: "website-privacy",
        heading: "Privacy.",
        text: "How we collect and use personal information is described in our Privacy Policy.",
        links: [{ label: "Privacy Policy", href: "/privacy-policy" }],
      },
      {
        id: "website-ip",
        heading: "Intellectual property.",
        text: "The text, images, logos, and design of our website and documents belong to C&S and may not be reproduced or distributed without written permission.",
      },
    ],
  },
  {
    id: "general",
    title: "General",
    clauses: [
      {
        id: "general-entire",
        heading: "Entire agreement.",
        text: "The document, any signed contract, written change orders, and these Terms are the entire agreement and replace prior discussions. Any change must be in writing.",
      },
      {
        id: "general-severability",
        heading: "Severability.",
        text: "If any part of these Terms is unenforceable, the rest remains in effect, and the unenforceable part is enforced to the fullest extent the law allows.",
      },
      {
        id: "general-waiver",
        heading: "No waiver.",
        text: "Our not enforcing a term on one occasion does not waive our right to enforce it later.",
      },
      {
        id: "general-assignment",
        heading: "Assignment and subcontracting.",
        text: "You may not assign the agreement without our written consent. C&S may use licensed subcontractors for specialty work and remains responsible for it.",
      },
      {
        id: "general-independent",
        heading: "Independent contractor.",
        text: "C&S is an independent contractor and controls the means and methods of its work.",
      },
      {
        id: "general-photos",
        heading: "Photographs.",
        text: "We photograph our work before, during, and after for records, inspections, and warranty purposes. We do not use photographs taken at your property in marketing unless you give us separate written permission, and even then we do not show your name, address, or identifiable personal items.",
      },
      {
        id: "general-electronic",
        heading: "Electronic documents.",
        text: "Estimates, proposals, change orders, and invoices may be delivered and accepted electronically. An electronic signature or a written approval by email or text message has the same effect as a signature on paper to the extent section 668.50, Florida Statutes (the Uniform Electronic Transaction Act), gives it that effect. We keep the electronic record of your approval with the job file.",
        attorneyReview: "Confirm section 668.50 scope for consumer approvals by text message and whether any writing is required to be signed in ink (none known for these documents).",
      },
      {
        id: "general-notices",
        heading: "Notices.",
        text: "Written notices to C&S go to the office address or email in Section 21. Notices to you go to the address or email on your document.",
      },
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to these Terms",
    clauses: [
      {
        id: "terms-revisions",
        heading: "Revisions.",
        text: `We revise these Terms from time to time. Each revision is identified by its date, shown at the top of this page and in the revision history at the end, and we archive a copy of every published revision. The current revision is ${TERMS_VERSION}, effective ${formatTermsDate(TERMS_EFFECTIVE_DATE)}, published at ${TERMS_SHORT_URL}.`,
      },
      {
        id: "terms-which-governs",
        heading: "Which revision governs your job.",
        text: "The revision in effect when you accepted your estimate or proposal stays attached to that job, as clause 1.4 provides, even if a newer revision is posted later. A copy of that revision and of the document you accepted is available from the office on request.",
      },
    ],
  },
  {
    id: "notices",
    title: "Florida statutory notices",
    intro:
      "Florida law requires certain notices in residential contracts. They are printed on the signed document and repeated here so you can read them in advance. They do not change the Sections above.",
    clauses: [
      {
        id: "notice-lien-law",
        heading: "Construction Lien Law notice (section 713.015, Florida Statutes).",
        text: "Required in a direct contract over $2,500 between an owner and a contractor to improve a residence of up to four units:",
        attorneyReview: "Verify verbatim against the current statute before merge; this session could not reach flsenate.gov.",
      },
      {
        id: "notice-lien-law-text",
        notice: true,
        text: "ACCORDING TO FLORIDA'S CONSTRUCTION LIEN LAW (SECTIONS 713.001-713.37, FLORIDA STATUTES), THOSE WHO WORK ON YOUR PROPERTY OR PROVIDE MATERIALS AND SERVICES AND ARE NOT PAID IN FULL HAVE A RIGHT TO ENFORCE THEIR CLAIM FOR PAYMENT AGAINST YOUR PROPERTY. THIS CLAIM IS KNOWN AS A CONSTRUCTION LIEN. IF YOUR CONTRACTOR OR A SUBCONTRACTOR FAILS TO PAY SUBCONTRACTORS, SUB-SUBCONTRACTORS, OR MATERIAL SUPPLIERS, THOSE PEOPLE WHO ARE OWED MONEY MAY LOOK TO YOUR PROPERTY FOR PAYMENT, EVEN IF YOU HAVE ALREADY PAID YOUR CONTRACTOR IN FULL. IF YOU FAIL TO PAY YOUR CONTRACTOR, YOUR CONTRACTOR MAY ALSO HAVE A LIEN ON YOUR PROPERTY. THIS MEANS IF A LIEN IS FILED YOUR PROPERTY COULD BE SOLD AGAINST YOUR WILL TO PAY FOR LABOR, MATERIALS, OR OTHER SERVICES THAT YOUR CONTRACTOR OR A SUBCONTRACTOR MAY HAVE FAILED TO PAY. TO PROTECT YOURSELF, YOU SHOULD STIPULATE IN THIS CONTRACT THAT BEFORE ANY PAYMENT IS MADE, YOUR CONTRACTOR IS REQUIRED TO PROVIDE YOU WITH A WRITTEN RELEASE OF LIEN FROM ANY PERSON OR COMPANY THAT HAS PROVIDED TO YOU A \"NOTICE TO OWNER.\" FLORIDA'S CONSTRUCTION LIEN LAW IS COMPLEX, AND IT IS RECOMMENDED THAT YOU CONSULT AN ATTORNEY.",
      },
      {
        id: "notice-recovery-fund",
        heading: "Florida Homeowners' Construction Recovery Fund notice (section 489.1425, Florida Statutes).",
        text: "Required in a contract for repair, restoration, improvement, or construction to residential real property where labor and materials exceed $2,500:",
        attorneyReview: "Verify verbatim and confirm the Construction Industry Licensing Board address and phone number against the current board rule before merge.",
      },
      {
        id: "notice-recovery-fund-text",
        notice: true,
        text: "FLORIDA HOMEOWNERS' CONSTRUCTION RECOVERY FUND. PAYMENT, UP TO A LIMITED AMOUNT, MAY BE AVAILABLE FROM THE FLORIDA HOMEOWNERS' CONSTRUCTION RECOVERY FUND IF YOU LOSE MONEY ON A PROJECT PERFORMED UNDER CONTRACT, WHERE THE LOSS RESULTS FROM SPECIFIED VIOLATIONS OF FLORIDA LAW BY A LICENSED CONTRACTOR. FOR INFORMATION ABOUT THE RECOVERY FUND AND FILING A CLAIM, PLEASE CONTACT THE FLORIDA CONSTRUCTION INDUSTRY LICENSING BOARD AT THE FOLLOWING TELEPHONE NUMBER AND ADDRESS: CONSTRUCTION INDUSTRY LICENSING BOARD, 2601 BLAIR STONE ROAD, TALLAHASSEE, FLORIDA 32399-1039, (850) 487-1395.",
      },
      {
        id: "notice-chapter-558",
        heading: "Construction defect claims (Chapter 558, Florida Statutes).",
        text: "Before you can sue over an alleged construction defect, Chapter 558 requires you to give us written notice of the claimed defect, allow us to inspect it, and consider any offer we make to repair or pay for it. There are strict deadlines in that process. The statutory Chapter 558 notice, in the form current when you sign, is printed on your contract; this page does not replace it.",
        attorneyReview: "Supply the current section 558.005 notice form for the contract template and confirm whether Chapter 558 applies to service and repair work. The verbatim block was removed from the public page pending that.",
      },
      {
        id: "notice-home-solicitation",
        heading: "Home solicitation cancellation notice (section 501.031, Florida Statutes).",
        text: "Where a sale is a home solicitation sale, the agreement carries this notice, under the heading BUYER'S RIGHT TO CANCEL, in bold type next to your signature:",
        appliesTo: "residential",
        attorneyReview: "Verify verbatim.",
      },
      {
        id: "notice-home-solicitation-text",
        notice: true,
        appliesTo: "residential",
        text: "BUYER'S RIGHT TO CANCEL. THIS IS A HOME SOLICITATION SALE, AND IF YOU DO NOT WANT THE GOODS OR SERVICES, YOU MAY CANCEL THIS AGREEMENT BY PROVIDING WRITTEN NOTICE TO THE SELLER IN PERSON, BY TELEGRAM, OR BY MAIL. THIS NOTICE MUST INDICATE THAT YOU DO NOT WANT THE GOODS OR SERVICES AND MUST BE DELIVERED OR POSTMARKED BEFORE MIDNIGHT OF THE THIRD BUSINESS DAY AFTER YOU SIGN THIS AGREEMENT. IF YOU CANCEL THIS AGREEMENT, THE SELLER MAY NOT KEEP ALL OR PART OF ANY CASH DOWN PAYMENT.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    clauses: [
      {
        id: "contact-office",
        heading: "Office.",
        text: `${BUSINESS.legalName}, doing business as ${BUSINESS.fullName}, Florida Certified Plumbing Contractor ${BUSINESS.license}. ${OFFICE}. ${BUSINESS.hours.weekday}; ${BUSINESS.hours.saturday}; ${BUSINESS.hours.emergency.toLowerCase()}.`,
        links: [
          { label: BUSINESS.phone, href: `tel:${BUSINESS.phoneRaw}` },
          { label: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
        ],
      },
    ],
  },
];

// ============================================
// REVISION HISTORY
// ============================================

export const TERMS_REVISIONS: readonly TermsRevision[] = [
  {
    version: TERMS_VERSION,
    effectiveDate: TERMS_EFFECTIVE_DATE,
    note: "First published revision. Replaces the Terms of Service page dated March 10, 2026. Same-day correction: the contracting entity is Draft Plumbing Corp, doing business as C&S Plumbing of Lee.",
  },
];

// ============================================
// DERIVED
// ============================================

/** Sections with "7" / "7.3" numbering and resolved audiences. */
export function numberedTerms(): NumberedSection[] {
  return TERMS_SECTIONS.map((section, i) => {
    const sectionNumber = String(i + 1);
    const sectionAudience: TermsAudience = section.appliesTo ?? "all";
    return {
      ...section,
      number: sectionNumber,
      audience: sectionAudience,
      clauses: section.clauses.map((clause, j) => ({
        ...clause,
        number: `${sectionNumber}.${j + 1}`,
        audience: clause.appliesTo ?? sectionAudience,
      })),
    };
  });
}

/** (a), (b), (c) … */
export function itemLetter(index: number): string {
  return `(${String.fromCharCode(97 + index)})`;
}

/** Plain-text rendering for llms-full.txt and PDF snapshots. */
export function termsToMarkdown(): string {
  const lines: string[] = [
    `# ${BUSINESS.fullName} — Terms & Conditions`,
    "",
    `${TERMS_CITATION} · Effective ${formatTermsDate(TERMS_EFFECTIVE_DATE)} · ${TERMS_URL}`,
    `${BUSINESS.legalName} · Florida Certified Plumbing Contractor ${BUSINESS.license} / ${BUSINESS.license2}`,
    "",
    "## In plain English (summary, not binding)",
    "",
    ...TERMS_PLAIN_ENGLISH.map((s) => `- ${s}`),
    "",
  ];
  for (const section of numberedTerms()) {
    const audience = AUDIENCE_LABEL[section.audience];
    lines.push(`## ${section.number}. ${section.title}${audience ? ` (${audience})` : ""}`, "");
    if (section.intro) lines.push(section.intro, "");
    for (const clause of section.clauses) {
      const head = clause.heading ? `**${clause.heading}** ` : "";
      lines.push(`${clause.number} ${head}${clause.text}`);
      clause.items?.forEach((item, k) => lines.push(`  ${itemLetter(k)} ${item}`));
      clause.links?.forEach((l) => {
        if (l.href.startsWith("tel:")) lines.push(`  Phone: ${l.label}`);
        else if (l.href.startsWith("mailto:")) lines.push(`  Email: ${l.label}`);
        else lines.push(`  ${l.label}: ${l.href.startsWith("/") ? `https://www.csplumbinglee.com${l.href}` : l.href}`);
      });
      lines.push("");
    }
  }
  lines.push("## Revision history", "");
  for (const r of TERMS_REVISIONS) {
    lines.push(`- Rev. ${r.version} (effective ${formatTermsDate(r.effectiveDate)}): ${r.note}`);
  }
  return lines.join("\n");
}
