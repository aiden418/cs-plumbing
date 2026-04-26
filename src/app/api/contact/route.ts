import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  escapeHtml,
  getClientIp,
  isHoneypotTripped,
  rateLimit,
  SMS_TO,
  tooManyRequests,
} from "@/lib/api/secure";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  service: z.string().min(2).max(120),
  message: z.string().min(5).max(5000),
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
    const { name, email, phone, service, message, website } = parsed.data;

    if (isHoneypotTripped(website)) {
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
      message: escapeHtml(message),
    };

    await resend.emails.send({
      from: "C&S Plumbing Website <contact@csplumbinglee.com>",
      to: ["aiden@csplumbinglee.com"],
      replyTo: email,
      subject: `New Contact: ${service} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New Contact Form</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Service:</strong> ${safe.service}</p>
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Message</h3>
            <p style="white-space: pre-wrap;">${safe.message}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    });

    if (SMS_TO) {
      await resend.emails.send({
        from: "C&S Plumbing Website <contact@csplumbinglee.com>",
        to: [SMS_TO],
        subject: `New Lead`,
        text: `New contact from ${name} for ${service}. Phone: ${phone}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
