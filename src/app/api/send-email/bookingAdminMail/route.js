// app/api/send-email/adminNotify/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/config/firebase"; // make sure this works in your API route
import { doc, getDoc } from "firebase/firestore";

export const runtime = "nodejs"; // nodemailer requires Node runtime

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(Number(n || 0));

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      orderId,
      name,
      email,
      whatsapp,
      pickup,
      pickupDate,
      pickupTime,
      returnLoc,
      returnDate,
      returnTime,
      tukCount,
      licenseCount,
      totalRental,
      couponCode,
      status = "PENDING_PAYMENT",
    } = data;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // ✅ Fetch admin email from Firestore (settings/contact)
    const settingsSnap = await getDoc(doc(db, "settings", "contact"));
    if (!settingsSnap.exists()) {
      return NextResponse.json({ error: "Admin settings not found" }, { status: 404 });
    }
    const { email: adminEmail } = settingsSnap.data();
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email not configured" }, { status: 400 });
    }

    // Transport
    const transporter = nodemailer.createTransport({
      host: "mail.tuktukdrive.com",
      port: 465,
      secure: true,
      auth: {
        user: "test@tuktukdrive.com",
        pass: "F6{X_jks2D[#",
      },
    });




    const html = `
      <div style="font-family:Arial,sans-serif;max-width:660px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="padding:16px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0;font-size:18px;">🔔 New booking — please complete it</h2>
          <p style="margin:6px 0 0;color:#6b7280;">Order <strong>${orderId}</strong> • Status: <strong>${status}</strong></p>
        </div>
        <div style="padding:20px;">
          <h3 style="margin:0 0 10px;">Customer</h3>
          <p><strong>Name:</strong> ${name || "-"}<br/>
          <strong>Email:</strong> ${email || "-"}<br/>
          <strong>WhatsApp:</strong> ${whatsapp || "-"}</p>
          <h3 style="margin:14px 0 10px;">Booking</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>
              <tr><td>Pickup</td><td>${pickup || "-"}</td></tr>
              <tr><td>Pickup Date & Time</td><td>${pickupDate || "-"} ${pickupTime || "-"}</td></tr>
              <tr><td>Return</td><td>${returnLoc || "-"}</td></tr>
              <tr><td>Return Date & Time</td><td>${returnDate || "-"} ${returnTime || "-"}</td></tr>
              <tr><td>Tuk Tuks</td><td>${tukCount ?? "-"}</td></tr>
              <tr><td>Licenses</td><td>${licenseCount ?? "-"}</td></tr>
            </tbody>
          </table>
          <h3>Total</h3>
          <p><strong>${money(totalRental)}</strong> ${couponCode ? `(coupon: ${couponCode})` : ""}</p>
          <p><strong>Action:</strong> Please complete this booking.</p>
        </div>
          <p style="margin:16px 0 0;">
    <a href="https://www.tuktukdrive.com/Admin"
       target="_blank"
       style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;
              text-decoration:none;border-radius:8px;font-weight:600;line-height:1;">
      Open Admin
    </a>
  </p>
      </div>
    `;

    const mailOptions = {
      from: '"TukTuk Booking" <test@tuktukdrive.com>',
      to: adminEmail, // ✅ fetched from Firestore
      subject: `✅ New Booking Received – Please Complete (Order ${orderId})`,
      html,
      replyTo: email || undefined,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
