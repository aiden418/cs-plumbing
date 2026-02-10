import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: ["aiden@csplumbinglee.com"],
      subject: `New Booking: ${data.service} — ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New Booking Request</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px;">Service Details</h3>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Urgency:</strong> ${data.urgency}</p>
            <p><strong>Description:</strong> ${data.description || "N/A"}</p>
            <p><strong>Preferred Date:</strong> ${data.date}</p>
            <p><strong>Preferred Time:</strong> ${data.time}</p>

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Customer Info</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
            <p><strong>Address:</strong> ${data.address}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
