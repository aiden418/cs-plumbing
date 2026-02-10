import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // TODO: Configure nodemailer with your SMTP credentials
    console.log("Booking submission:", data);

    // Uncomment when ready to send emails:
    /*
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "office@csplumbinglee.com",
      subject: `New Booking: ${data.service} — ${data.name}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Urgency:</strong> ${data.urgency}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <hr />
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
      `,
    });
    */

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
