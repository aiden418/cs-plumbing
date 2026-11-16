import { test } from "node:test";
import assert from "node:assert/strict";
import { BUSINESS } from "../src/lib/business";
import { LICENSE, LICENSE_RECORD, LICENSE_RECORD_DATES, LICENSE_STATUS_SENTENCE } from "../src/lib/claims";
import { licenseRecordFacts } from "../src/lib/license-schema";

// The site says what the Florida DBPR's own record showed on a named day
// (src/lib/claims.ts → LICENSE_RECORD). These tests keep that statement
// well-formed, and the last one asks for a fresh look once the renewal date
// the state listed has passed.

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const RECORD = /^https:\/\/www\.myfloridalicense\.com\/portalsearches\/VerifyLicensee\/LicenseDetail\?ID=[0-9A-F]{32}$/;

test("each license has its number, the state's record address and the day the state issued it", () => {
  assert.equal(LICENSE_RECORD.company.number, LICENSE.company);
  assert.equal(LICENSE_RECORD.founder.number, LICENSE.founder);
  for (const license of [LICENSE_RECORD.company, LICENSE_RECORD.founder]) {
    assert.match(license.recordUrl, RECORD);
    assert.match(license.licensedOn, ISO);
    assert.ok(license.licensedOn < LICENSE_RECORD.checkedOn);
  }
  assert.notEqual(LICENSE_RECORD.company.recordUrl, LICENSE_RECORD.founder.recordUrl);
});

test("the dates read as written and in order", () => {
  assert.match(LICENSE_RECORD.checkedOn, ISO);
  assert.match(LICENSE_RECORD.activeThrough, ISO);
  assert.ok(LICENSE_RECORD.checkedOn < LICENSE_RECORD.activeThrough, "the check came before the renewal date");
  assert.equal(LICENSE_RECORD_DATES.checkedOn, "November 16, 2026");
  assert.equal(LICENSE_RECORD_DATES.activeThrough, "August 31, 2028");
  assert.equal(
    LICENSE_STATUS_SENTENCE,
    "The state lists it as current and active through August 31, 2028 (record checked November 16, 2026).",
  );
});

test("links: the footer and schema open the record, 'search either number' opens the state's search page", () => {
  assert.equal(BUSINESS.licenseRecordUrl, LICENSE_RECORD.company.recordUrl);
  assert.equal(BUSINESS.licenseLookupUrl, "https://www.myfloridalicense.com/portalsearches/VerifyLicensee");
  // The address the state retired in 2026 must not come back.
  assert.doesNotMatch(BUSINESS.licenseLookupUrl + BUSINESS.licenseRecordUrl, /wl11\.asp/);
});

test("the schema facts for a license come from the same record", () => {
  assert.deepEqual(licenseRecordFacts("founder"), {
    identifier: LICENSE.founder,
    url: LICENSE_RECORD.founder.recordUrl,
    dateCreated: "1997-12-08",
    expires: "2028-08-31",
  });
  assert.equal(licenseRecordFacts("company").identifier, LICENSE.company);
});

test("the state's renewal date has not passed without a fresh check", () => {
  const today = new Date().toISOString().slice(0, 10);
  assert.ok(
    today <= LICENSE_RECORD.activeThrough,
    `The renewal date the state listed (${LICENSE_RECORD.activeThrough}) has passed. Open both records ` +
      `(LICENSE_RECORD.company.recordUrl and .founder.recordUrl), read Status and Expires, and update ` +
      `checkedOn, status and activeThrough in src/lib/claims.ts.`,
  );
});
