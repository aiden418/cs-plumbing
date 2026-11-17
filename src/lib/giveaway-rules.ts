/**
 * Official rules of the water heater giveaway, rendered on the page under
 * #rules. Kept apart from ./giveaway.ts so the entry form does not carry
 * the rules text in its bundle.
 */
import { BUSINESS } from "./business";
import { GIVEAWAY } from "./giveaway";

export function giveawayRules(): { title: string; body: string }[] {
  return [
    {
      title: "No purchase necessary",
      body: "No purchase or payment of any kind is necessary to enter or win. A purchase does not improve your chances of winning. Void where prohibited.",
    },
    {
      title: "Sponsor",
      body: `${BUSINESS.legalName}, d/b/a ${BUSINESS.fullName}, ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}.`,
    },
    {
      title: "Which water heaters can be entered",
      body: `A tank-type water heater that is installed and working (connected and making hot water) in a single-family home, condo or townhome in ${GIVEAWAY.citiesSentence}, Florida. The home must be owned by a Florida resident 18 or older. Homes owned by employees of the Sponsor or members of their households are not eligible. Limit one entry per home; duplicate entries are removed.`,
    },
    {
      title: "Who can enter",
      body: "The homeowner, or anyone 18 or older who has the homeowner's permission to enter the home and share its address and a photo of its water heater. The prize always goes to the homeowner, at the address on the entry. Whoever submits an entry for someone else receives no prize.",
    },
    {
      title: "Entry period",
      body: `Entries are accepted until ${GIVEAWAY.endsLabelLong}. Entries received after that time are not eligible.`,
    },
    {
      title: "How to enter",
      body: "Complete the entry form on this page with your name, phone number and email, the address of the home, the year the water heater was made and at least one photo of it. A photo of the label showing the manufacture date or serial number helps us confirm its age. Incomplete entries, and entries with a photo that is not of the water heater at the address entered, may be disqualified.",
    },
    {
      title: "Prize",
      body: `${GIVEAWAY.prize} Approximate retail value: ${GIVEAWAY.arv}, depending on size. Work beyond a standard replacement (relocating the heater, converting fuel type, or upgrades to gas, electrical, venting or structure required by code) is not included and would be quoted in writing before any work begins. The prize is installed at the address on the winning entry, is not transferable and has no cash alternative.`,
    },
    {
      title: "How the winner is chosen",
      body: `The winner is the eligible entry with the oldest working water heater, by manufacture date. After entries close, the Sponsor reviews the entries, visits the homes with the oldest water heaters and confirms each one's manufacture date from its label or serial number and that it is working. If the manufacture date cannot be confirmed, the entry is not eligible to win. If two or more water heaters share the oldest confirmed date, the winner is selected among them by random drawing. The Sponsor's decisions are final. The winner is announced on or about ${GIVEAWAY.announceOn}.`,
    },
    {
      title: "Verification and notification",
      body: `We contact the person who entered, and the homeowner, by phone and email using the details on the entry. ${GIVEAWAY.scamWarning} Before the prize is awarded, the Sponsor confirms who owns the home and that the homeowner accepts the prize. If the winner cannot be reached within 7 days, declines, or is found ineligible, the next-oldest verified entry wins. Installation is scheduled at a mutually agreed time within 60 days of the announcement.`,
    },
    {
      title: "Taxes and publicity",
      body: "Any taxes on the prize are the winner's responsibility, and the winner may be asked for a completed IRS Form W-9 before installation. With the winner's permission, the Sponsor may share the winner's first name, city, the age of the old water heater and photos of the old unit and the installation.",
    },
    {
      title: "Your information",
      body: "We use the information and photos you submit to run this giveaway and to contact you about your entry. By entering, you agree that we may also email you about water heater offers; every such email tells you how to opt out. We call or text you about offers only if you tick that box on the form. We do not sell your information. See our privacy policy for details.",
    },
    {
      title: "Social media",
      body: "This giveaway is not sponsored, endorsed or administered by, or associated with, Facebook, Instagram, Google or any other platform where it is shared.",
    },
  ];
}
