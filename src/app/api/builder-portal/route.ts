import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formData = await request.formData();

    // Extract text fields
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const projectType = formData.get("projectType") as string;
    const units = formData.get("units") as string;
    const sqft = formData.get("sqft") as string;
    const startDate = formData.get("startDate") as string;
    const budget = formData.get("budget") as string;
    const description = formData.get("description") as string;

    if (!name || !company || !email || !phone || !address || !projectType || !description) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
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

    const fileCount = attachments.length;

    // Build HTML email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B2B4B; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">
            New Builder Quote Request
          </h1>
          <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">
            ${company} &mdash; ${projectType}
          </p>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Contact Info
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Name</td><td style="padding: 4px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Company</td><td style="padding: 4px 0; font-weight: 600;">${company}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Email</td><td style="padding: 4px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Phone</td><td style="padding: 4px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
          </table>
        </div>

        <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
            Project Details
          </h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #64748b;">Address</td><td style="padding: 4px 0; font-weight: 600;">${address}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Type</td><td style="padding: 4px 0; font-weight: 600;">${projectType}</td></tr>
            ${units ? `<tr><td style="padding: 4px 0; color: #64748b;">Units</td><td style="padding: 4px 0;">${units}</td></tr>` : ""}
            ${sqft ? `<tr><td style="padding: 4px 0; color: #64748b;">Sq Ft</td><td style="padding: 4px 0;">${sqft}</td></tr>` : ""}
            ${startDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Start Date</td><td style="padding: 4px 0;">${startDate}</td></tr>` : ""}
            ${budget ? `<tr><td style="padding: 4px 0; color: #64748b;">Budget</td><td style="padding: 4px 0;">${budget}</td></tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px;">Description</p>
            <p style="font-size: 14px; margin: 0; white-space: pre-wrap;">${description}</p>
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
      to: ["aiden@csplumbinglee.com"],
      replyTo: email,
      subject: `Builder Quote Request: ${company} — ${projectType} at ${address}`,
      html,
      ...(attachments.length > 0 && { attachments }),
    });

    // SMS notification
    const smsText = `New builder quote: ${company} - ${projectType} at ${address}. ${fileCount} files. Phone: ${phone}`;
    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: ["2393146991@vtext.com"],
      subject: "Builder Quote Request",
      text: smsText.slice(0, 160),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Builder portal error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please call 833-PLUMB-IT." },
      { status: 500 }
    );
  }
}
