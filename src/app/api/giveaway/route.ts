import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "node:crypto";
import { BUSINESS } from "@/lib/constants";
import {
  GIVEAWAY,
  giveawayEntrySchema,
  heaterAge,
  heaterYearLabel,
  isGiveawayOpen,
} from "@/lib/giveaway";
import { readSubmission } from "@/lib/api/attachments";
import {
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  sendEmailBestEffort,
  sendEmailOrThrow,
  tooManyRequests,
} from "@/lib/api/secure";

/**
 * Water heater giveaway entry. Same delivery model as the contact form: the
 * entry and its photos go to the office inbox as one email (nothing is
 * stored on our side) and the entrant gets a receipt. The office inbox is
 * the entry list: every subject starts with "Giveaway Entry".
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    if (!isGiveawayOpen()) {
      return NextResponse.json(
        { error: `This giveaway closed on ${GIVEAWAY.endsLabel}.`, code: "closed" },
        { status: 403 },
      );
    }

    const submission = await readSubmission(request);
    if ("error" in submission) {
      return NextResponse.json({ error: submission.error, code: "attachments" }, { status: 400 });
    }
    const { attachments } = submission;
    const parsed = giveawayEntrySchema.safeParse(submission.fields);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const entry = parsed.data;

    if (isHoneypotTripped(entry.website)) {
      return NextResponse.json({ success: true });
    }

    if (attachments.length === 0) {
      return NextResponse.json(
        { error: "Please add a photo of your water heater.", code: "attachments" },
        { status: 400 },
      );
    }
    if (attachments.length > GIVEAWAY.maxPhotos) {
      return NextResponse.json(
        { error: `Please attach at most ${GIVEAWAY.maxPhotos} photos.`, code: "attachments" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const yearLabel = heaterYearLabel(entry.heaterYear);
    const age = heaterAge(entry.heaterYear);
    const ageNote =
      age === null ? "" : age >= 10 ? ` (${age} years old: replacement candidate)` : ` (${age} years old)`;
    const fullName = `${entry.firstName} ${entry.lastName}`;
    const safe = {
      firstName: escapeHtml(entry.firstName),
      name: escapeHtml(fullName),
      email: escapeHtml(entry.email),
      phone: escapeHtml(entry.phone),
      address: escapeHtml(`${entry.address}, ${entry.city}, FL ${entry.zip}`),
      year: escapeHtml(yearLabel + ageNote),
    };

    const emailId = await sendEmailOrThrow(resend, {
      from: "C&S Plumbing Website <contact@csplumbinglee.com>",
      to: ["office@csplumbinglee.com"],
      replyTo: entry.email,
      subject: `Giveaway Entry: ${fullName} — ${yearLabel} water heater, ${entry.city}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Water Heater Giveaway Entry</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
            <p><strong>Address:</strong> ${safe.address}</p>
            <p><strong>Water heater made:</strong> ${safe.year}</p>
            <p><strong>OK to contact about replacement:</strong> ${entry.contactOk ? "YES" : "No (giveaway contact only)"}</p>
            <p><strong>Agreed to official rules:</strong> Yes</p>
            <p><strong>Photos attached:</strong> ${attachments.length}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com${GIVEAWAY.path} · closes ${GIVEAWAY.endsLabel}</p>
          </div>
        </div>
      `,
      attachments,
    }, "giveaway admin email");

    // Entrant's receipt (best effort: the entry above is already delivered).
    await sendEmailBestEffort(resend, {
      from: "C&S Plumbing of Lee <contact@csplumbinglee.com>",
      to: [entry.email],
      subject: "You're entered — C&S Plumbing Water Heater Giveaway",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">You're Entered</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${safe.firstName},</p>
            <p>Thanks for entering the C&S Plumbing of Lee Water Heater Giveaway. We received your entry for <strong>${safe.address}</strong> with ${attachments.length} photo${attachments.length === 1 ? "" : "s"}.</p>
            <p>Entries close at ${GIVEAWAY.endsLabelLong}. One winner is drawn at random on or about ${GIVEAWAY.drawOn}, and we contact the winner by phone and email. The official rules are at <a href="https://www.csplumbinglee.com${GIVEAWAY.path}#rules" style="color: #0099FF;">csplumbinglee.com${GIVEAWAY.path}</a>.</p>
            <p>Water heater acting up before then? Call <a href="tel:${BUSINESS.phoneRaw}" style="color: #0099FF;">${BUSINESS.phone}</a>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">${BUSINESS.fullName} · ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}</p>
          </div>
        </div>
      `,
    }, "giveaway entrant confirmation");

    // No PII in logs; the Resend id traces the entry in the Resend dashboard.
    console.log(`Giveaway entry accepted (resend id ${emailId})`);

    // eventId lets the browser report the entry once; a giveaway entry is
    // deliberately not sent to the ad platforms as a service lead.
    return NextResponse.json({ success: true, id: emailId, eventId: randomUUID() });
  } catch (error) {
    console.error("Giveaway entry error:", error);
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
