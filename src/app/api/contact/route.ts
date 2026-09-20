import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
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
import { AttributionSchema, renderAttributionHtml } from "@/lib/api/attribution";
import {
  captureRequestContext,
  newConversionId,
  reportConversion,
} from "@/lib/openai-ads-capi";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  // Optional so quick-capture sources (chat widget) can submit phone-only leads
  email: z.string().email().max(200).optional(),
  phone: z.string().min(7).max(30),
  service: z.string().min(2).max(120),
  message: z.string().min(5).max(5000),
  source: z.string().max(40).optional(),
  /** Pathname of the page the form was on; validated server-side before use. */
  sourcePath: z.string().max(200).optional(),
  attribution: AttributionSchema,
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const json = await request.json();
    const parsed = ContactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }
    const { name, email, phone, service, message, source, sourcePath, attribution, website } = parsed.data;

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
    const safe = {
      name: escapeHtml(name),
      email: email ? escapeHtml(email) : "",
      phone: escapeHtml(phone),
      service: escapeHtml(service),
      message: escapeHtml(message),
    };

    const emailId = await sendEmailOrThrow(resend, {
      from: "C&S Plumbing Website <contact@csplumbinglee.com>",
      to: [ADMIN_EMAIL],
      ...(email ? { replyTo: email } : {}),
      subject: `New ${source === "chat" ? "Chat Lead" : "Contact"}: ${service} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New Contact Form</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Name:</strong> ${safe.name}</p>
            ${safe.email ? `<p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>` : ""}
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Service:</strong> ${safe.service}</p>
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Message</h3>
            <p style="white-space: pre-wrap;">${safe.message}</p>
          </div>
          ${renderAttributionHtml(attribution, sourcePath)}
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    }, "contact admin email");

    if (SMS_TO) {
      await sendEmailBestEffort(resend, {
        from: "C&S Plumbing Website <contact@csplumbinglee.com>",
        to: [SMS_TO],
        subject: `New Lead`,
        text: `New contact from ${name} for ${service}. Phone: ${phone}`,
      }, "contact SMS notification");
    }

    // No PII in logs; the Resend id is enough to trace a lead in the Resend dashboard.
    console.log(`Contact lead accepted (source=${source ?? "form"}, resend id ${emailId})`);

    // Server-side copy of the conversion, sent after the response so it can
    // never delay or fail the lead. The browser pixel reuses eventId.
    const eventId = newConversionId();
    const context = captureRequestContext(request);
    after(() =>
      reportConversion({ type: "lead_created", id: eventId, context, sourcePath, email })
    );

    return NextResponse.json({ success: true, id: emailId, eventId });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
