import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  ADMIN_EMAIL,
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";

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
    await resend.emails.send({
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
    });

    if (SMS_TO) {
      const smsText = isEstimate
        ? `New estimate from ${data.name} for ${data.service}. Budget: ${data.budgetRange || "N/A"}. Phone: ${data.phone}. #${confirmationId}`
        : `New booking from ${data.name} for ${data.service} (${data.urgency}). Phone: ${data.phone}. Date: ${data.date}. #${confirmationId}`;
      await resend.emails.send({
        from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
        to: [SMS_TO],
        subject: `New ${typeLabel}`,
        text: smsText,
      });
    }

    return NextResponse.json({ success: true, confirmationId });
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
