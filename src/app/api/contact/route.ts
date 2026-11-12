import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { serviceRequestSchema, SERVICE_REQUEST_OPTIONS } from "@/lib/service-request";
import { BUSINESS } from "@/lib/constants";
import { CLAIMS } from "@/lib/claims";
import {
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


export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const json = await request.json();
    const parsed = serviceRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }
    const { name, email, phone, zip, service, message, source, sourcePath, website } = parsed.data;

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
    const serviceLabel = SERVICE_REQUEST_OPTIONS.find(([value]) => value === service)?.[1] ?? service;
    const safe = {
      name: escapeHtml(name),
      email: email ? escapeHtml(email) : "",
      phone: escapeHtml(phone),
      service: escapeHtml(serviceLabel),
      zip: escapeHtml(zip),
      sourcePath: escapeHtml(sourcePath?.startsWith("/") ? sourcePath : "/contact"),
      message: escapeHtml(message),
    };

    const emailId = await sendEmailOrThrow(resend, {
      from: "C&S Plumbing Website <contact@csplumbinglee.com>",
      to: ["office@csplumbinglee.com"],
      ...(email ? { replyTo: email } : {}),
      subject: `New ${source === "chat" ? "Chat Lead" : "Contact"}: ${serviceLabel} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New Contact Form</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Name:</strong> ${safe.name}</p>
            ${safe.email ? `<p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>` : ""}
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Service ZIP:</strong> ${safe.zip}</p>
            <p><strong>Service:</strong> ${safe.service}</p>
            <p><strong>Requested from:</strong> ${safe.sourcePath}</p>
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Message</h3>
            <p style="white-space: pre-wrap;">${safe.message || "No description provided."}</p>
          </div>
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
        text: `New contact from ${name} for ${serviceLabel} in ${zip}. Phone: ${phone}`,
      }, "contact SMS notification");
    }

    // Customer confirmation (best effort — never blocks the lead). The office
    // copy above already went out; this is the only receipt the customer gets.
    if (email) {
      await sendEmailBestEffort(resend, {
        from: "C&S Plumbing of Lee <contact@csplumbinglee.com>",
        to: [email],
        subject: "We received your request — C&S Plumbing of Lee",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Request Received</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${safe.name},</p>
            <p>Thanks for contacting C&S Plumbing of Lee about <strong>${safe.service}</strong>. ${CLAIMS.bookingConfirmation}</p>
            <p>Your appointment is confirmed only once we have spoken with you. For urgent service, call <a href="tel:${BUSINESS.phoneRaw}" style="color: #0099FF;">${BUSINESS.phone}</a> any time.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">${BUSINESS.fullName} · ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}</p>
          </div>
        </div>
      `,
      }, "contact customer confirmation");
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
