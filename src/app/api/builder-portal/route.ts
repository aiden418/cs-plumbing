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

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

const BuilderPortalSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  address: z.string().min(5).max(300),
  projectType: z.string().min(2).max(120),
  units: z.string().max(40).optional().default(""),
  sqft: z.string().max(40).optional().default(""),
  startDate: z.string().max(40).optional().default(""),
  budget: z.string().max(60).optional().default(""),
  description: z.string().min(10).max(5000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(ip);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service unavailable. Please call 833-PLUMB-IT." },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formData = await request.formData();

    const raw = Object.fromEntries(
      [...formData.entries()].filter(([, v]) => typeof v === "string")
    );
    const parsed = BuilderPortalSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const { name, company, email, phone, address, projectType, units, sqft, startDate, budget, description, website } =
      parsed.data;

    if (isHoneypotTripped(website)) {
      return NextResponse.json({ success: true });
    }

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
            <tr><td style="padding: 4px 0; color: #64748b;">Type</td><td style="padding: 4px 0; font-weight: 600;">${safe.projectType}</td></tr>
            ${units ? `<tr><td style="padding: 4px 0; color: #64748b;">Units</td><td style="padding: 4px 0;">${safe.units}</td></tr>` : ""}
            ${sqft ? `<tr><td style="padding: 4px 0; color: #64748b;">Sq Ft</td><td style="padding: 4px 0;">${safe.sqft}</td></tr>` : ""}
            ${startDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Start Date</td><td style="padding: 4px 0;">${safe.startDate}</td></tr>` : ""}
            ${budget ? `<tr><td style="padding: 4px 0; color: #64748b;">Budget</td><td style="padding: 4px 0;">${safe.budget}</td></tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px;">Description</p>
            <p style="font-size: 14px; margin: 0; white-space: pre-wrap;">${safe.description}</p>
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Builder portal error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please call 833-PLUMB-IT." },
      { status: 500 }
    );
  }
}
