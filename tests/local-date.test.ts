import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { localIsoDate } from "../src/lib/local-date";

/** Run `fn` as if the visitor's device were in `timeZone` (Node re-reads TZ when it is assigned). */
function inTimeZone<T>(timeZone: string, fn: () => T): T {
  const before = process.env.TZ;
  process.env.TZ = timeZone;
  try {
    return fn();
  } finally {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  }
}

/** The same calendar date worked out by Intl for a named zone, independent of process.env.TZ. */
function calendarDate(timeZone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** What BookingPage used to send. */
const utcDate = (date: Date) => date.toISOString().split("T")[0];

test("an evening booking in Florida keeps the day the customer picked", () => {
  inTimeZone("America/New_York", () => {
    const evening = new Date(2026, 10, 17, 21, 30); // Tue Nov 17, 9:30 pm Eastern
    assert.equal(utcDate(evening), "2026-11-18"); // the bug: UTC is already Wednesday
    assert.equal(localIsoDate(evening), "2026-11-17");
  });
});

test("the value is the local date at every hour, in summer and in winter", () => {
  inTimeZone("America/New_York", () => {
    for (let hour = 0; hour < 24; hour++) {
      assert.equal(localIsoDate(new Date(2026, 6, 4, hour, 59, 59)), "2026-07-04"); // EDT, UTC-4
      assert.equal(localIsoDate(new Date(2026, 0, 9, hour, 59, 59)), "2026-01-09"); // EST, UTC-5
    }
  });
});

test("month and day are zero-padded and New Year's Eve stays in its own year", () => {
  inTimeZone("America/New_York", () => {
    assert.equal(localIsoDate(new Date(2027, 0, 5, 9, 0)), "2027-01-05");
    const newYearsEve = new Date(2026, 11, 31, 22, 0);
    assert.equal(utcDate(newYearsEve), "2027-01-01");
    assert.equal(localIsoDate(newYearsEve), "2026-12-31");
  });
});

test("the 14 dates the booking form offers from an evening visit start tomorrow and stay consecutive across the clock change", () => {
  inTimeZone("America/New_York", () => {
    const now = new Date(2026, 9, 28, 20, 15); // Wed Oct 28, 8:15 pm; clocks go back on Nov 1
    // The same loop BookingPage runs.
    const offered = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() + i + 1);
      return { value: localIsoDate(d), was: utcDate(d), label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
    });

    assert.equal(offered[0].label, "Thu, Oct 29");
    assert.equal(offered[0].value, "2026-10-29");
    assert.equal(offered[0].was, "2026-10-30"); // a day late before the fix
    assert.equal(offered[13].label, "Wed, Nov 11");
    assert.equal(offered[13].value, "2026-11-11");
    assert.deepEqual(
      offered.map((d) => d.value),
      [
        "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04",
        "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11",
      ],
    );
  });
});

test("east of UTC the old value was a day early; the local date is right there too", () => {
  inTimeZone("Pacific/Auckland", () => {
    const morning = new Date(2026, 10, 17, 8, 0); // Tue Nov 17, 8 am in Auckland
    assert.equal(utcDate(morning), "2026-11-16");
    assert.equal(localIsoDate(morning), "2026-11-17");
  });
});

test("the booking form builds its date value with localIsoDate and never from the UTC date", () => {
  const dir = new URL("../src/app/booking/", import.meta.url);
  const sources = readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((name) => /\.tsx?$/.test(name))
    .map((name) => ({ name, text: readFileSync(new URL(name, dir), "utf8") }));

  assert.ok(sources.some((file) => /\blocalIsoDate\(/.test(file.text)), "the booking form calls localIsoDate()");
  for (const file of sources) {
    assert.doesNotMatch(file.text, /toISOString|getUTC(?:FullYear|Month|Date)\b/, `src/app/booking/${file.name} reads a UTC date`);
  }
});

test("it agrees with the calendar in every zone tried, at awkward instants", () => {
  const instants = [
    Date.UTC(2026, 10, 18, 2, 30), // evening of Nov 17 in Florida
    Date.UTC(2026, 2, 8, 6, 59), // the minute before US clocks go forward
    Date.UTC(2026, 10, 1, 5, 59), // the hour US clocks go back
    Date.UTC(2026, 11, 31, 23, 59), // one minute before the UTC new year
    Date.UTC(2027, 0, 1, 4, 0), // 11 pm Dec 31 in Florida
    Date.UTC(2028, 1, 29, 12, 0), // leap day
  ];
  const zones = [
    "America/New_York",
    "America/Los_Angeles",
    "UTC",
    "Europe/Berlin",
    "Asia/Kolkata",
    "Pacific/Auckland",
    "Pacific/Kiritimati",
  ];
  for (const zone of zones) {
    inTimeZone(zone, () => {
      for (const instant of instants) {
        const date = new Date(instant);
        assert.equal(localIsoDate(date), calendarDate(zone, date), `${zone} at ${date.toISOString()}`);
      }
    });
  }
});
