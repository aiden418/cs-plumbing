import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { BUSINESS } from "@/lib/constants";
import {
  ADMIN_EMAIL,
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  sendEmailBestEffort,
  sendEmailOrThrow,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";
import {
  captureRequestContext,
  newConversionId,
  reportConversion,
} from "@/lib/openai-ads-capi";

const BookingSchema = z.object({
  requestType: z.enum(["booking", "estimate"]).default("booking"),
  service: z.string().min(2).max(120),
  description: z.string().max(5000).optional().default(""),
  date: z.string().max(40).optional().default(""),
  time: z.string().max(40).optional().default(""),
  urgency: z.string().max(40).optional().default(""),
  budgetRange: z.string().max(60).optional().default(""),
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  address: z.string().min(5).max(300),
  sourcePath: z.string().max(200).optional(),
  website: z.string().optional(),
});

function makeConfirmationId() {
  return `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const json = await request.json();
    const parsed = BookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", issues: parsed.error.issues.map((i) => i.path.join(".")) },
        { status: 400 }
      );
    }
    const data = parsed.data;

    if (isHoneypotTripped(data.website)) {
      return NextResponse.json({ success: true, confirmationId: makeConfirmationId() });
    }

    const isEstimate = data.requestType === "estimate";
    const typeLabel = isEstimate ? "Estimate Request" : "Booking";
    const confirmationId = makeConfirmationId();

    const safe = {
      service: escapeHtml(data.service),
      description: escapeHtml(data.description || "N/A"),
      date: escapeHtml(data.date),
      time: escapeHtml(data.time),
      urgency: escapeHtml(data.urgency),
      budgetRange: escapeHtml(data.budgetRange || "Not specified"),
      name: escapeHtml(data.name),
      email: escapeHtml(data.email),
      phone: escapeHtml(data.phone),
      address: escapeHtml(data.address),
    };

    const scheduleHtml = isEstimate
      ? ""
      : `
            <p><strong>Preferred Date:</strong> ${safe.date}</p>
            <p><strong>Preferred Time:</strong> ${safe.time}</p>
            <p><strong>Urgency:</strong> ${safe.urgency}</p>`;

    const budgetHtml = isEstimate
      ? `<p><strong>Budget Range:</strong> ${safe.budgetRange}</p>`
      : "";

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service unavailable" },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await sendEmailOrThrow(resend, {
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: [ADMIN_EMAIL],
      subject: `New ${typeLabel}: ${data.service} — ${data.name} [${confirmationId}]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New ${typeLabel}</h1>
            <p style="color: #999; margin: 8px 0 0; font-size: 13px;">Confirmation #${confirmationId}</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px;">Service Details</h3>
            <p><strong>Type:</strong> ${typeLabel}</p>
            <p><strong>Service:</strong> ${safe.service}</p>
            <p><strong>Description:</strong> ${safe.description}</p>
            ${scheduleHtml}
            ${budgetHtml}

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Customer Info</h3>
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Address:</strong> ${safe.address}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    }, "booking admin email");

    if (SMS_TO) {
      const smsText = isEstimate
        ? `New estimate from ${data.name} for ${data.service}. Budget: ${data.budgetRange || "N/A"}. Phone: ${data.phone}. #${confirmationId}`
        : `New booking from ${data.name} for ${data.service} (${data.urgency}). Phone: ${data.phone}. Date: ${data.date}. #${confirmationId}`;
      await sendEmailBestEffort(resend, {
        from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
        to: [SMS_TO],
        subject: `New ${typeLabel}`,
        text: smsText,
      }, "booking SMS notification");
    }

    // Customer confirmation — the confirmation screen tells the customer a copy
    // was sent to their email, so this must actually happen. A failure here must
    // not fail the whole submission (the admin lead email already went through).
    const scheduleConfirmHtml = isEstimate
      ? ""
      : `
              <p style="margin: 4px 0;"><strong>Preferred date:</strong> ${safe.date}</p>
              <p style="margin: 4px 0;"><strong>Preferred time:</strong> ${safe.time}</p>`;
    try {
      await resend.emails.send({
        from: "C&S Plumbing of Lee <bookings@csplumbinglee.com>",
        to: [data.email],
        subject: isEstimate
          ? `Your Estimate Request — C&S Plumbing [${confirmationId}]`
          : `Your Booking Request — C&S Plumbing [${confirmationId}]`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Request Received</h1>
            <p style="color: #999; margin: 8px 0 0; font-size: 13px;">Confirmation #${confirmationId}</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${safe.name},</p>
            <p>Thanks for choosing C&S Plumbing. We&rsquo;ve received your ${isEstimate ? "estimate request" : "booking request"} and our team will call you to confirm the details.</p>
            <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Service:</strong> ${safe.service}</p>${scheduleConfirmHtml}
              <p style="margin: 4px 0;"><strong>Address:</strong> ${safe.address}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Need anything in the meantime? Call us at <a href="tel:${BUSINESS.phoneRaw}" style="color: #0099FF;">${BUSINESS.phone}</a>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              ${BUSINESS.fullName} &middot; ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}
            </p>
          </div>
        </div>`,
      });
    } catch (confirmError) {
      console.error("Booking customer confirmation email error:", confirmError);
    }

    // Mirrors the browser pixel so the two copies dedupe on eventId:
    // a booking is appointment_scheduled, an estimate request is a lead.
    const eventId = newConversionId();
    const context = captureRequestContext(request);
    after(() =>
      reportConversion({
        type: isEstimate ? "lead_created" : "appointment_scheduled",
        id: eventId,
        context,
        sourcePath: data.sourcePath,
        email: data.email,
      })
    );

    return NextResponse.json({ success: true, confirmationId, eventId });
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
