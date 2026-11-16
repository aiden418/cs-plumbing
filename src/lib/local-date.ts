/**
 * The calendar date of `date` where the visitor is, as YYYY-MM-DD.
 *
 * `date.toISOString()` is UTC. Southwest Florida is four or five hours behind
 * it, so from 7 or 8 pm the UTC date is already tomorrow: a customer who
 * tapped "Tue, Nov 17" in the evening was sending 2026-11-18 to the office.
 * This reads the local year, month and day instead, the same fields the
 * button label is built from, so the value always names the day on the label.
 *
 * Dependency-free: it is imported by a client component.
 */
export function localIsoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
