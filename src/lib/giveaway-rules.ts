/**
 * Official rules of the water heater giveaway, rendered on the page under
 * #rules. Kept apart from ./giveaway.ts because it reads the service-area
 * list from ./constants, which a client component must not load.
 */
import { BUSINESS } from "./business";
import { countiesSentence } from "./constants";
import { GIVEAWAY } from "./giveaway";

export function giveawayRules(): { title: string; body: string }[] {
  const counties = countiesSentence();
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
      title: "Who can enter",
      body: `Legal residents of Florida, 18 or older, who own a single-family home, condo or townhome in ${counties} and enter for that home. Employees of the Sponsor and members of their households are not eligible. Limit one entry per household; duplicate entries are removed.`,
    },
    {
      title: "Entry period",
      body: `Entries are accepted until ${GIVEAWAY.endsLabelLong}. Entries received after that time are not eligible.`,
    },
    {
      title: "How to enter",
      body: "Complete the entry form on this page with your name, phone number, email, the address of the home, the year your current water heater was made and at least one photo of it. Incomplete entries, and entries with a photo that is not of the water heater at the address entered, may be disqualified.",
    },
    {
      title: "Prize",
      body: `${GIVEAWAY.prize} Approximate retail value: ${GIVEAWAY.arv}, depending on size. Work beyond a standard replacement (relocating the heater, converting fuel type, or upgrades to gas, electrical, venting or structure required by code) is not included and would be quoted in writing before any work begins. The prize is installed at the address on the winning entry, is not transferable and has no cash alternative.`,
    },
    {
      title: "Winner selection",
      body: `One winner is selected in a random drawing from all eligible entries on or about ${GIVEAWAY.drawOn}. The odds of winning depend on the number of eligible entries received. The age or condition of your water heater does not affect your chances.`,
    },
    {
      title: "Verification and notification",
      body: `The winner is contacted by phone and email using the details on the entry. ${GIVEAWAY.scamWarning} Before the prize is awarded, the Sponsor confirms that the winner owns the home and that the water heater there matches the entry. If the winner cannot be reached within 7 days, or is found ineligible, an alternate winner is drawn. Installation is scheduled at a mutually agreed time within 60 days of the drawing.`,
    },
    {
      title: "Taxes and publicity",
      body: "Any taxes on the prize are the winner's responsibility, and the winner may be asked for a completed IRS Form W-9 before installation. With the winner's permission, the Sponsor may share the winner's first name, city and photos of the installation.",
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
