import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thilinaweeras@gmail.com',
        pass: 'aklxqxdmgjwxrplz', // Use App Password!
      },
    });

    const extrasHTML = Object.entries(data.extras || {})
      .filter(([val]) => val > 0)
      .map(([key, val]) => `<li>${key}: ${val}</li>`)
      .join('') || '<li>No extras selected</li>';

    const tukList = (data.assignedTuks || []).join(', ') || 'Not Assigned';

    const mailOptions = {
      from: '"TukTuk Booking" <thilinaweeras@gmail.com>',
      to: [data.email, 'thilinaweerasing@gmail.com'],
      subject: '✅ TukTuk Assignment Confirmation – TukTukDrive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2b6cb0;">Hello ${data.name},</h2>
          <p>Your TukTuk booking has been successfully <strong>assigned</strong>! Here are your updated booking details:</p>

          <h3 style="color: #2f855a; margin-top: 25px;">🛺 Booking Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Pickup</td><td style="padding: 8px; border: 1px solid #ccc;">${data.pickupDate} at ${data.pickupTime} – ${data.pickup}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Return</td><td style="padding: 8px; border: 1px solid #ccc;">${data.returnDate} at ${data.returnTime} – ${data.returnLoc}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">TukTuks</td><td style="padding: 8px; border: 1px solid #ccc;">${data.tukCount}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Licenses</td><td style="padding: 8px; border: 1px solid #ccc;">${data.licenseCount}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Assigned TukTuks</td><td style="padding: 8px; border: 1px solid #ccc;">${tukList}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Assigned Person</td><td style="padding: 8px; border: 1px solid #ccc;">${data.assignedPerson}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ccc;">Total Rental Price</td><td style="padding: 8px; border: 1px solid #ccc;">$${data.rentalPrice}</td></tr>
          </table>

          <h4 style="margin-top: 20px; color: #d97706;">📦 Extras Selected:</h4>
          <ul style="padding-left: 20px;">${extrasHTML}</ul>

          <p style="margin-top: 20px;">📱 We’ll be in touch with you shortly via WhatsApp: <strong>+${data.whatsapp}</strong></p>

          <p style="margin-top: 25px;">Thank you again for choosing TukTukDrive!</p>
          <p style="font-weight: bold; color: #2b6cb0;">– The TukTukDrive Team</p>

          <hr style="margin-top: 30px;">

          <footer style="font-size: 13px; color: #555; text-align: center;">
            <p>Need assistance? Email us at 
              <a href="mailto:support@tuktukdrive.com" style="color: #0077b6;">support@tuktukdrive.com</a>
            </p>

            <p style="margin-top: 8px;"><strong>Reference Address:</strong> No: 233, Tuk Tuk Drive, Kandy Road, Kandy, Sri Lanka</p>

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
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
