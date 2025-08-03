import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'thilinaweeras@gmail.com',
    //     pass: 'aklxqxdmgjwxrplz', // App Password only
    //   },
    // });
    const transporter = nodemailer.createTransport({
      host: 'mail.tuktukdrive.com',
      port: 465,
      secure: true, // SSL/TLS
      auth: {
        // user: 'test@tuktukdrive.com',
        // pass: 'F6{X_jks2D[#',
       
        user: 'info@tuktukdrive.com',
        pass: 'Rd#RhOyBa^jy',
      },
    });



    const mailOptions = {
      from: '"TukTuk Booking" <test@tuktukdrive.com>',
      to: [data.email],
      subject: '✅ Trip Completed – Thank You for Riding with TukTukDrive!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #38a169;">Hi ${data.name},</h2>
          <p style="font-size: 16px;">We hope you had a fantastic time exploring Sri Lanka with <strong>TukTukDrive</strong>! Thank you for completing your trip with us. 🛺</p>

          <p style="margin-top: 30px;">We truly appreciate your support and would love to hear your feedback. 🌟</p>
          <p>Until next time — stay safe and keep exploring!</p>

          <p style="font-weight: bold; color: #38a169;">– The TukTukDrive Team</p>

          <hr style="margin: 30px 0;">

          <footer style="font-size: 13px; color: #555; text-align: center;">
            <p>Questions? Email us at 
              <a href="mailto:support@tuktukdrive.com" style="color: #0077b6;">support@tuktukdrive.com</a>
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
