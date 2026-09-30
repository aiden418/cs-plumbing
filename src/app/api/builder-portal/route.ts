import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { BUSINESS } from "@/lib/constants";
import { randomUUID } from "node:crypto";
import {
  ADMIN_EMAIL,
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

// Shared by the full Builder Portal wizard and the short "Submit plans for a
// bid" form on /builders and the new-construction city pages. The short form
// sends a community instead of a street address and may skip the description,
// so one of address/community is required rather than address alone.
const BuilderPortalSchema = z
  .object({
    name: z.string().min(2).max(100),
    company: z.string().min(2).max(150),
    email: z.string().email().max(200),
    phone: z.string().min(7).max(30),
    address: z.string().max(300).optional().default(""),
    community: z.string().max(150).optional().default(""),
    projectType: z.string().min(2).max(120).optional().default("Residential New Construction"),
    units: z.string().max(40).optional().default(""),
    sqft: z.string().max(40).optional().default(""),
    startDate: z.string().max(40).optional().default(""),
    budget: z.string().max(60).optional().default(""),
    description: z.string().max(5000).optional().default(""),
    // Which form/page sent it (e.g. "builders-hub", "nc-city:cape-coral").
    source: z.string().max(80).optional().default("builder-portal"),
    website: z.string().optional(),
  })
  .refine((d) => d.address.trim().length >= 5 || d.community.trim().length >= 2, {
    message: "address or community required",
  });

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const formData = await request.formData();

    const raw = Object.fromEntries(
      [...formData.entries()].filter(([, v]) => typeof v === "string")
    );
    const parsed = BuilderPortalSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const { name, company, email, phone, community, projectType, units, sqft, startDate, budget, description, source, website } =
      parsed.data;
    const address = parsed.data.address.trim() || `${community} (community)`;

    if (isHoneypotTripped(website)) {
      return NextResponse.json({ success: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service unavailable. Please call 833-PLUMB-IT." },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Extract files
    const fileEntries = formData.getAll("files") as File[];
    const attachments = await Promise.all(
      fileEntries
        .filter((f) => f instanceof File && f.size > 0)
        .map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            filename: file.name,
            content: buffer,
          };
        })
    );

    const totalBytes = attachments.reduce((sum, a) => sum + a.content.length, 0);
    if (totalBytes > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { error: "Attachments too large (25 MB max). Please email plans to office@csplumbinglee.com." },
        { status: 400 }
      );
    }

    const fileCount = attachments.length;

    const safe = {
      name: escapeHtml(name),
      company: escapeHtml(company),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      address: escapeHtml(address),
      community: escapeHtml(community),
      source: escapeHtml(source),
      projectType: escapeHtml(projectType),
      units: escapeHtml(units),
      sqft: escapeHtml(sqft),
      startDate: escapeHtml(startDate),
      budget: escapeHtml(budget),
      description: escapeHtml(description),
    };

    // Build HTML email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2B4B; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">
            New Builder Quote Request
          </h1>
          <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">
            ${safe.company} &mdash; ${safe.projectType}
          </p>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Contact Info
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Name</td><td style="padding: 4px 0; font-weight: 600;">${safe.name}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Company</td><td style="padding: 4px 0; font-weight: 600;">${safe.company}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Email</td><td style="padding: 4px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Phone</td><td style="padding: 4px 0;"><a href="tel:${safe.phone}">${safe.phone}</a></td></tr>
          </table>
        </div>

        <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Project Details
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Address</td><td style="padding: 4px 0; font-weight: 600;">${safe.address}</td></tr>
            ${community ? `<tr><td style="padding: 4px 0; color: #64748b;">Community</td><td style="padding: 4px 0; font-weight: 600;">${safe.community}</td></tr>` : ""}
            <tr><td style="padding: 4px 0; color: #64748b;">Type</td><td style="padding: 4px 0; font-weight: 600;">${safe.projectType}</td></tr>
            ${units ? `<tr><td style="padding: 4px 0; color: #64748b;">Units</td><td style="padding: 4px 0;">${safe.units}</td></tr>` : ""}
            ${sqft ? `<tr><td style="padding: 4px 0; color: #64748b;">Sq Ft</td><td style="padding: 4px 0;">${safe.sqft}</td></tr>` : ""}
            ${startDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Start Date</td><td style="padding: 4px 0;">${safe.startDate}</td></tr>` : ""}
            ${budget ? `<tr><td style="padding: 4px 0; color: #64748b;">Budget</td><td style="padding: 4px 0;">${safe.budget}</td></tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px;">Description</p>
            <p style="font-size: 14px; margin: 0; white-space: pre-wrap;">${safe.description || "—"}</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 12px 0 0;">Source: ${safe.source}</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">
            Attached Files
          </h2>
          <p style="font-size: 14px; margin: 0;">
            ${fileCount > 0 ? `${fileCount} file${fileCount !== 1 ? "s" : ""} attached to this email` : "No files uploaded"}
          </p>
        </div>
      </div>
    `;

    // Send to business
    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `Builder Quote Request: ${company} — ${projectType} at ${address}`,
      html,
      ...(attachments.length > 0 && { attachments }),
    });

    // SMS notification
    if (SMS_TO) {
      const smsText = `New builder quote: ${company} - ${projectType} at ${address}. ${fileCount} files. Phone: ${phone}`;
      await resend.emails.send({
        from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
        to: [SMS_TO],
        subject: "Builder Quote Request",
        text: smsText.slice(0, 160),
      });
    }

    // Submitter confirmation — the portal promises "You'll get a confirmation
    // email immediately", so send one. A failure here must not fail the whole
    // submission (the admin lead email already went through).
    try {
      await resend.emails.send({
        from: "C&S Plumbing of Lee <bookings@csplumbinglee.com>",
        to: [email],
        subject: "We received your quote request — C&S Plumbing",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">Quote Request Received</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thanks for sending your project to C&S Plumbing. Our estimating team will review your plans and get back to you with a detailed quote.</p>
            <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
              <p style="margin: 4px 0;"><strong>Project:</strong> ${escapeHtml(projectType)}</p>
              <p style="margin: 4px 0;"><strong>Address:</strong> ${escapeHtml(address)}</p>
              <p style="margin: 4px 0;"><strong>Files received:</strong> ${fileCount}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Questions? Call us at <a href="tel:${BUSINESS.phoneRaw}" style="color: #0099FF;">${BUSINESS.phone}</a>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              ${BUSINESS.fullName} &middot; ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}
            </p>
          </div>
        </div>`,
      });
    } catch (confirmError) {
      console.error("Builder portal confirmation email error:", confirmError);
    }

    // Id for the browser's builder_lead event (Meta custom event + dataLayer).
    // Builder leads are intentionally not sent to the OpenAI CAPI as
    // lead_created — they'd be counted as homeowner leads.
    return NextResponse.json({ success: true, eventId: randomUUID() });
  } catch (error) {
    console.error("Builder portal error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please call 833-PLUMB-IT." },
      { status: 500 }
    );
  }
}
