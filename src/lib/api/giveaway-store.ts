/**
 * Private copy of each giveaway entry (no photos), kept so the entries sheet
 * can be filled without anyone copying rows out of the inbox. One small JSON
 * object per entry in the project's private Vercel Blob store, under
 * giveaway/entries/. Nothing here is reachable by URL: reads go through
 * /api/giveaway/export, which checks GIVEAWAY_EXPORT_KEY.
 *
 * The office email stays the record of an entry. Saving here is best effort
 * and never fails a submission; without a connected store it does nothing.
 *
 * Holds names, addresses and phone numbers: delete the giveaway/ folder in
 * the Blob store (Vercel dashboard → Storage) once the giveaway is wrapped up.
 */
import { get, list, put } from "@vercel/blob";
import { ENTRY_COLUMNS, type EntryRow } from "../giveaway-log";

const PREFIX = "giveaway/entries/";

/** The store is connected when Vercel has set its credentials on the project. */
export function entryStoreConnected(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function saveEntry(row: EntryRow): Promise<void> {
  if (!entryStoreConnected()) return;
  try {
    // receivedAt first so a listing is in arrival order; the random suffix keeps two entries in the same millisecond apart.
    const name = `${PREFIX}${row.receivedAt.replace(/[:.]/g, "-")}.json`;
    await put(name, JSON.stringify(row), {
      access: "private",
      addRandomSuffix: true,
      contentType: "application/json",
    });
  } catch (err) {
    console.error("Giveaway entry store save failed (non-fatal):", err);
  }
}

export async function readEntries(): Promise<EntryRow[]> {
  const rows: EntryRow[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    const batch = await Promise.all(
      page.blobs.map(async (blob) => {
        // useCache false: the sheet must see an entry on its next refresh.
        const result = await get(blob.pathname, { access: "private", useCache: false });
        if (!result || result.statusCode !== 200 || !result.stream) return null;
        const parsed = JSON.parse(await new Response(result.stream).text()) as Record<string, unknown>;
        return Object.fromEntries(
          ENTRY_COLUMNS.map((column) => [column, typeof parsed[column] === "string" ? parsed[column] : ""]),
        ) as EntryRow;
      }),
    );
    rows.push(...batch.filter((row): row is EntryRow => row !== null));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return rows;
}
