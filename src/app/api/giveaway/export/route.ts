import { NextResponse } from "next/server";
import { entriesCsv, exportKeyMatches } from "@/lib/giveaway-log";
import { entryStoreConnected, readEntries } from "@/lib/api/giveaway-store";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/api/secure";

// Read on every request: the entries sheet imports this URL and must see new rows.
export const dynamic = "force-dynamic";

/**
 * The giveaway entries as CSV, oldest water heater first, for the entries
 * sheet (=IMPORTDATA of this URL with ?key=). The key is
 * GIVEAWAY_EXPORT_KEY; a missing or wrong key gets a 404, so the route does
 * not announce itself. Entrant names, addresses and phone numbers: the key
 * lives only in Vercel and in that sheet.
 */
export async function GET(request: Request) {
  const rl = rateLimit(`export:${getClientIp(request)}`, 30);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const key = new URL(request.url).searchParams.get("key");
  if (!exportKeyMatches(key, process.env.GIVEAWAY_EXPORT_KEY) || !entryStoreConnected()) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    return new NextResponse(entriesCsv(await readEntries()), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (err) {
    console.error("Giveaway export failed:", err);
    return new NextResponse("Export unavailable", { status: 503 });
  }
}
