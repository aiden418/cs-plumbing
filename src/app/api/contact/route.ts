import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await request.json();
    const { name, email, phone, service, message } = data;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Service:</strong> ${service}</p>
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 16px;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
