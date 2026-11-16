/**
 * Small project helpers with no data behind them, safe for client
 * components (src/lib/projects.ts carries every project and its photos).
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2025-05-02" -> "May 2025". Deterministic on server and client. */
export function formatCompletedOn(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const month = MONTHS[(m ?? 1) - 1] ?? "";
  return month ? `${month} ${y}` : String(y);
}
