import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'mail.tuktukdrive.com',
      port: 465,
      secure: true, // SSL/TLS
      auth: {
        user: 'info@tuktukdrive.com',
        pass: 'DC5OJ7wUuOdo',
      },
    });

    const mailOptions = {
      from: '"TukTukDrive Booking" <info@tuktukdrive.com>',
      to: [data.email],
      subject: '✅ Booking Confirmed – Tuktukdrive Sri Lanka',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #38a169;">Hi ${data.name},</h2>
          <p style="font-size: 16px;">🎉 Booking Confirmed! Your tuk-tuk adventure is ready to roll 🚐💨</p>
          <p style="font-size: 16px;">Here are your booking details:</p>

          <ul style="font-size: 15px; line-height: 1.6; color: #333;">
            <li><strong>Booking Number:</strong> ${data.orderId}</li>
            <li><strong>📅 Rental Period:</strong> ${data.pickupDate} to ${data.returnDate}</li>
            <li><strong>📍 Pickup Location:</strong> ${data.pickup} – ${data.pickupDate} ${data.pickupTime}</li>
            <li><strong>📍 Drop-off Location:</strong> ${data.returnLoc} – ${data.returnDate} ${data.returnTime}</li>
            <li><strong>🚐 Vehicle Type:</strong> Tuk-Tuk</li>
            <li><strong>💲 Total Price:</strong> $${Number(data.totalRental).toFixed(2)}</li>
          </ul>

          <p style="font-size: 16px; margin-top: 20px;"><strong>Important Notes:</strong></p>
          <ul style="font-size: 15px; line-height: 1.6; color: #333; list-style-type: disc; padding-left: 20px;">
            <li>Please share your valid International Driving Permit (IDP) and passport for license processing.</li>
            <li>If you don’t have an IDP, contact us via WhatsApp and we’ll help you create one.</li>
            <li>Don’t forget to send your required documents to: 
              <a href="mailto:info@tuktukdrive.com" style="color: #0077b6; text-decoration: none;">info@tuktukdrive.com</a> 
              or WhatsApp 
              <a href="https://wa.me/+94770063780" style="color: #0077b6; text-decoration: none;">+94770063780</a>
            </li>
          </ul>

          <p style="font-size: 16px; margin-top: 20px;">We can’t wait to welcome you to Sri Lanka 🌴✨</p>
          <p style="font-size: 16px;">If you have any questions, simply reply to this email or message us on WhatsApp.</p>

          <p style="font-weight: bold; color: #38a169; margin-top: 20px;">Happy Travels,<br>The Tuktukdrive Team 🚐🌴</p>

          <hr style="margin: 30px 0; border-color: #e0e0e0;">

          <footer style="font-size: 13px; color: #555; text-align: center;">
            <p>
              <a href="mailto:info@tuktukdrive.com" style="color: #0077b6; text-decoration: none;">📧 info@tuktukdrive.com</a> | 
              <a href="https://wa.me/+94770063780" style="color: #0077b6; text-decoration: none;">📱 +94770063780</a>
            </p>
            <p style="margin-top: 8px;"><strong>Reference Address:</strong> No. 06, Ambasewanagama, Kengalla (Kandy), Sri Lanka</p>
            <div style="margin-top: 10px;">
              <a href="https://tuktukdrive.com" style="color: #0077b6; text-decoration: none;">Website</a> | 
              <a href="https://instagram.com/tuktukdrive" style="color: #0077b6; text-decoration: none;">Instagram</a> | 
              <a href="https://facebook.com/tuktukdrive" style="color: #0077b6; text-decoration: none;">Facebook</a>
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} TukTukDrive. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}