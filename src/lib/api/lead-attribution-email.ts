import { attributionFromRequest, attributionLabel } from "../lead-attribution";
import { escapeHtml } from "./secure";

/** Office-only source receipt. Never include this block in the customer's email. */
export function leadAttributionHtml(request: Request, leadId: string): string {
  const a = attributionFromRequest(request);
  const label = attributionLabel(a);
  const rows = [
    ["Lead ID", leadId], ["Source", label],
    ["Attribution rule", "Last non-direct website source within 30 days"],
    ...(a ? [["Source captured (UTC)", a.capturedAt], ["Landing page", a.landingPath], ["Referrer host", a.referrerHost], ...Object.entries(a.tags)] : []),
  ].filter(([, value]) => value);
  return `<div style="border:1px solid #cbd5e1;padding:16px;margin:20px 0;background:#fff"><h3>Job source tracking — office use</h3>${rows.map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`).join("")}<p>Copy this block to the ServiceM8 job diary. ${label.startsWith("Paid - ") ? `Apply the <strong>${escapeHtml(label)}</strong> badge to this job only.` : "Keep the source unverified unless a matching ad lead or call record confirms it."} Use the Lead ID to avoid counting the same enquiry twice. This is source evidence, not confirmed revenue or profit.</p></div>`;
}
