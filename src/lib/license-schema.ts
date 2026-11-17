import { LICENSE_RECORD } from "./claims";

/**
 * The checkable half of a license credential in JSON-LD: the number, the
 * state's own record for it, the day the state issued it and the renewal date
 * the state lists. Spread into an EducationalOccupationalCredential so a
 * reader (or an answer engine) can go from the claim to the source in one hop.
 */
export function licenseRecordFacts(which: "company" | "founder") {
  const license = LICENSE_RECORD[which];
  return {
    identifier: license.number,
    url: license.recordUrl,
    dateCreated: license.licensedOn,
    expires: LICENSE_RECORD.activeThrough,
  };
}
