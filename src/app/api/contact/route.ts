import { leadAttributionHtml } from "@/lib/api/lead-attribution-email";
import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { serviceRequestSchema, SERVICE_REQUEST_OPTIONS } from "@/lib/service-request";
import { BUSINESS } from "@/lib/constants";
import { CLAIMS } from "@/lib/claims";
import { readSubmission } from "@/lib/api/attachments";
import {
  escapeHtml,
  forbiddenOrigin,
  getClientIp,
  isHoneypotTripped,
  isTrustedOrigin,
  rateLimit,
  sendEmailBestEffort,
  sendEmailOrThrow,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";
import { captureRequestContext, reportConversion } from "@/lib/openai-ads-capi";
import { acceptedLead, acceptOnce, isTestFlag, leadHeaderHtml, leadIdFor, logAccepted, subjectFor } from "@/lib/api/lead";
import { homeownerLeadType, type LeadForm } from "@/lib/lead";


export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);
    if (!isTrustedOrigin(request)) return forbiddenOrigin();

    // JSON from the chat widget and the plain form; multipart when the
    // customer attached photos (see src/lib/api/attachments.ts).
    const submission = await readSubmission(request);
    if ("error" in submission) {
      // code lets the form show this message verbatim (it is written for the customer).
      return NextResponse.json({ error: submission.error, code: "attachments" }, { status: 400 });
    }
    const { attachments } = submission;
    const parsed = serviceRequestSchema.safeParse(submission.fields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }
    const { name, email, phone, zip, service, message, source, sourcePath, website } = parsed.data;
    const { address, noticeDate, utilities, connectionStatus, submissionKey } = parsed.data;

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
    const resendKey = process.env.RESEND_API_KEY;
    const test = isTestFlag(parsed.data.test);
    const leadType = homeownerLeadType(service);
    const isUtility = leadType === "utility_estimate";
    const form: LeadForm = isUtility ? "utility_estimate" : source === "chat" ? "chat" : "contact";
    // One ID for this inquiry: office email, customer email and tracking.
    const leadId = leadIdFor(submissionKey);
    const lead = { leadId, leadType, form, test };
    const context = captureRequestContext(request);
    const attributionHtml = leadAttributionHtml(request, leadId);

    // The office email for one submission goes out once: a double tap or a
    // retry of a request the office already has gets the first answer back.
    const answer = await acceptOnce(submissionKey, async () => {
      const resend = new Resend(resendKey);
      const serviceLabel = SERVICE_REQUEST_OPTIONS.find(([value]) => value === service)?.[1] ?? service;
      const safe = {
        name: escapeHtml(name),
        email: email ? escapeHtml(email) : "",
        phone: escapeHtml(phone),
        service: escapeHtml(serviceLabel),
        zip: escapeHtml(zip),
        sourcePath: escapeHtml(sourcePath?.startsWith("/") ? sourcePath : "/contact"),
        message: escapeHtml(message),
        address: escapeHtml(address ?? ""),
        noticeDate: escapeHtml(noticeDate ?? ""),
        utilities: escapeHtml(utilities ?? ""),
        connectionStatus: escapeHtml(connectionStatus ?? ""),
      };
      const kind = isUtility ? "Utility connection estimate" : source === "chat" ? "Service request (site button)" : "Service request";
      const utilityHtml = isUtility
        ? `<h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Connection details</h3>
            <p><strong>Property address:</strong> ${safe.address || "Not given"}</p>
            <p><strong>Date on the Notice of Availability:</strong> ${safe.noticeDate || "Not given"}</p>
            <p><strong>Utilities involved:</strong> ${safe.utilities || "Not given"}</p>
            <p><strong>Already connected to anything:</strong> ${safe.connectionStatus || "Not given"}</p>
            <p style="color:#555;">Verify the parcel and the notice date before scheduling an on-site estimate.</p>`
        : "";

      const emailId = await sendEmailOrThrow(resend, {
        from: "C&S Plumbing Website <contact@csplumbinglee.com>",
        to: ["office@csplumbinglee.com"],
        ...(email ? { replyTo: email } : {}),
        subject: subjectFor(`${kind}: ${serviceLabel} — ${name}`, leadId, test),
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">${escapeHtml(kind)}</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${leadHeaderHtml(lead)}
            ${attributionHtml}
            <p><strong>Name:</strong> ${safe.name}</p>
            ${safe.email ? `<p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>` : ""}
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Service ZIP:</strong> ${safe.zip}</p>
            <p><strong>Service:</strong> ${safe.service}</p>
            <p><strong>Requested from:</strong> ${safe.sourcePath}</p>
            ${utilityHtml}
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Message</h3>
            <p style="white-space: pre-wrap;">${safe.message || "No description provided."}</p>
            <p><strong>Photos attached:</strong> ${attachments.length}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
        ...(attachments.length > 0 && { attachments }),
      }, "contact admin email");

      if (SMS_TO && !test) {
        await sendEmailBestEffort(resend, {
          from: "C&S Plumbing Website <contact@csplumbinglee.com>",
          to: [SMS_TO],
          subject: `New Lead`,
          text: `New ${isUtility ? "utility estimate request" : "service request"} from ${name} for ${serviceLabel} in ${zip}. Phone: ${phone}. ${leadId}`,
        }, "contact SMS notification");
      }

      // Customer confirmation (best effort — never blocks the lead). The office
      // copy above already went out; this is the only receipt the customer gets.
      if (email) {
        await sendEmailBestEffort(resend, {
          from: "C&S Plumbing of Lee <contact@csplumbinglee.com>",
          to: [email],
          subject: `We received your request — C&S Plumbing of Lee [${leadId}]`,
          html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Request Received</h1>
            <p style="color: #999; margin: 8px 0 0; font-size: 13px;">Request ID ${leadId}</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${safe.name},</p>
            <p>Thanks for contacting C&S Plumbing of Lee about <strong>${safe.service}</strong>. ${CLAIMS.bookingConfirmation}</p>${attachments.length > 0 ? `<p>We received ${attachments.length} photo${attachments.length === 1 ? "" : "s"} with your request.</p>` : ""}
            <p>This is a request, not a scheduled appointment: a visit is confirmed only once our office has spoken with you. For urgent service, call <a href="${BUSINESS.phoneHref}" style="color: #0099FF;">${BUSINESS.phone}</a> any time.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">${BUSINESS.fullName} · ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}</p>
          </div>
        </div>
      `,
        }, "contact customer confirmation");
      }

      // No PII in logs; the Lead ID and the Resend id are enough to trace it.
      logAccepted(lead, emailId);
      return acceptedLead(leadId, leadType, test);
    });

    // Server-side copy of the conversion, sent after the response so it can
    // never delay or fail the lead. The browser pixel reuses the Lead ID. A
    // repeat of a submission the office already has, and a test, report nothing.
    if (!answer.duplicate && !test) {
      after(() =>
        reportConversion({ type: "lead_created", id: leadId, context, sourcePath, email })
      );
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
