import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await request.json();

    const isEstimate = data.requestType === "estimate";
    const typeLabel = isEstimate ? "Estimate Request" : "Booking";

    // Build schedule section (booking only)
    const scheduleHtml = isEstimate
      ? ""
      : `
            <p><strong>Preferred Date:</strong> ${data.date}</p>
            <p><strong>Preferred Time:</strong> ${data.time}</p>
            <p><strong>Urgency:</strong> ${data.urgency}</p>`;

    // Build budget section (estimate only)
    const budgetHtml = isEstimate
      ? `<p><strong>Budget Range:</strong> ${data.budgetRange || "Not specified"}</p>`
      : "";

    // Send full email notification
    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: ["aiden@csplumbinglee.com"],
      subject: `New ${typeLabel}: ${data.service} — ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0F; padding: 20px; text-align: center;">
            <h1 style="color: #0099FF; margin: 0;">New ${typeLabel}</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px;">Service Details</h3>
            <p><strong>Type:</strong> ${typeLabel}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Description:</strong> ${data.description || "N/A"}</p>
            ${scheduleHtml}
            ${budgetHtml}

            <h3 style="color: #333; border-bottom: 2px solid #0099FF; padding-bottom: 8px; margin-top: 20px;">Customer Info</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
            <p><strong>Address:</strong> ${data.address || "N/A"}</p>
          </div>
          <div style="background: #0A0A0F; padding: 12px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 12px;">Sent from csplumbinglee.com</p>
          </div>
        </div>
      `,
    });

    // Send SMS text notification via email-to-SMS gateway
    const smsText = isEstimate
      ? `New estimate request from ${data.name} for ${data.service}. Budget: ${data.budgetRange || "N/A"}. Phone: ${data.phone}`
      : `New booking from ${data.name} for ${data.service} (${data.urgency}). Phone: ${data.phone}. Date: ${data.date}`;

    await resend.emails.send({
      from: "C&S Plumbing Website <bookings@csplumbinglee.com>",
      to: ["2393146991@vtext.com"],
      subject: `New ${typeLabel}`,
      text: smsText,
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
