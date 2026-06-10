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

const RangeSchema = z.object({ min: z.number(), max: z.number() });

const QuoteSchema = z.object({
  service: z.enum(["water-heater", "repipe"]),
  selections: z.record(z.string(), z.unknown()),
  result: z.object({
    total: RangeSchema,
    lineItems: z
      .array(
        z.object({
          label: z.string().max(200),
          range: RangeSchema,
        })
      )
      .max(50),
    notes: z.array(z.string().max(500)).max(50),
  }),
  lead: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(200),
    phone: z.string().min(7).max(30),
  }),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const json = await request.json();
    const parsed = QuoteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }
    const { service, selections, result, lead, website } = parsed.data;

    if (isHoneypotTripped(website)) {
      return NextResponse.json({ success: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service unavailable" },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const serviceLabel = service === "water-heater" ? "Water Heater" : "Whole-Home Repipe";

    const lineItemsHtml = result.lineItems
      .map(
        (item) =>
          `<tr>
            <td style="padding: 6px 0; color: #666;">${escapeHtml(item.label)}</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">
              ${item.range.min === item.range.max
                ? `$${Math.abs(item.range.min).toLocaleString()}${item.range.min < 0 ? " credit" : ""}`
                : `$${item.range.min.toLocaleString()} – $${item.range.max.toLocaleString()}`}
            </td>
          </tr>`
      )
      .join("");

    const selectionsHtml = Object.entries(selections)
      .filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => {
        const safeKey = escapeHtml(k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()));
        const safeVal = escapeHtml(Array.isArray(v) ? v.join(", ") : String(v));
        return `<p style="margin: 4px 0;"><strong>${safeKey}:</strong> ${safeVal}</p>`;
      })
      .join("");

    const notesHtml = result.notes
      .map((n) => `<li style="margin: 4px 0; color: #666;">${escapeHtml(n)}</li>`)
      .join("");

    const safeLead = {
      name: escapeHtml(lead.name),
      email: escapeHtml(lead.email),
      phone: escapeHtml(lead.phone),
    };

    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: [ADMIN_EMAIL],
      subject: `New Quote: ${serviceLabel} $${result.total.min.toLocaleString()}–$${result.total.max.toLocaleString()} — ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New Quote Request</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px;">Customer Info</h3>
            <p><strong>Name:</strong> ${safeLead.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeLead.email}">${safeLead.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safeLead.phone}">${safeLead.phone}</a></p>

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Quote: ${serviceLabel}</h3>
            <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 12px 0;">
              <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 8px 0;">
                $${result.total.min.toLocaleString()} – $${result.total.max.toLocaleString()}
              </p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                ${lineItemsHtml}
              </table>
            </div>

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Selections</h3>
            ${selectionsHtml}

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Notes</h3>
            <ul style="padding-left: 20px; font-size: 14px;">${notesHtml}</ul>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com quote builder</p>
          </div>
        </div>
      `,
    });

    await resend.emails.send({
      from: "C&S Plumbing of Lee <bookings@csplumbinglee.com>",
      to: [lead.email],
      subject: `Your ${serviceLabel} Estimate — C&S Plumbing`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Your Project Estimate</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${safeLead.name},</p>
            <p>Thanks for using our quote builder! Here's your estimate for a <strong>${serviceLabel.toLowerCase()}</strong> project:</p>

            <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
              <p style="color: #666; margin: 0 0 4px;">Most homeowners pay</p>
              <p style="font-size: 28px; font-weight: bold; margin: 8px 0;">
                $${result.total.min.toLocaleString()} – $${result.total.max.toLocaleString()}
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
              ${lineItemsHtml}
            </table>

            <div style="background: #EFF6FF; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="color: #1D4ED8; margin: 0; font-size: 14px;">
                Every home is different. A licensed C&S plumber will confirm your exact price during a <strong>free, no-obligation visit</strong>. This estimate is based on typical installations in Lee County.
              </p>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="https://www.csplumbinglee.com/booking" style="display: inline-block; background: #0099FF; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Schedule Your Free Visit
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">
              Or call us anytime: <a href="tel:8337586248" style="color: #0099FF;">833-PLUMB-IT</a>
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              C&S Plumbing of Lee · License #CFC1432485 · 951 Pondella Rd, North Fort Myers, FL 33903
            </p>
          </div>
        </div>
      `,
    });

    if (SMS_TO) {
      await resend.emails.send({
        from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
        to: [SMS_TO],
        subject: "New Quote",
        text: `New quote: ${serviceLabel} $${result.total.min.toLocaleString()}-$${result.total.max.toLocaleString()} from ${lead.name}. Phone: ${lead.phone}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote email error:", error);
    return NextResponse.json(
      { error: "Failed to send quote" },
      { status: 500 }
    );
  }
}
