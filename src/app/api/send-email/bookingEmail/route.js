import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'thilinaweeras@gmail.com',
    //     pass: 'aklxqxdmgjwxrplz', // Use App Passwords, never real one in prod!
    //   },
    // });
    

    const transporter = nodemailer.createTransport({
      host: 'mail.tuktukdrive.com',
      port: 465,
      secure: true, // SSL/TLS
      auth: {
        user: 'test@tuktukdrive.com',
        pass: 'F6{X_jks2D[#',
      },
    });

    const mailOptions = {
      from: '"TukTuk Booking" <test@tuktukdrive.com>',
      to: [data.email],
      bcc: 'test@tuktukdrive.com',
      subject: '🎉 Booking Confirmed! - TukTukDrive 🚖',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #0077b6;">Hello ${data.name},</h2>
          <p>🎉 <strong>Your TukTuk booking is confirmed!</strong> Thank you for choosing <strong>TukTukDrive</strong> — your island adventure awaits!</p>
          
          <h3 style="color: #023e8a; margin-top: 30px;">📅 Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Pickup Location</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.pickup}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Pickup Date & Time</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.pickupDate} at ${data.pickupTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Return Location</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.returnLoc}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">Return Date & Time</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.returnDate} at ${data.returnTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">No. of TukTuks</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.tukCount}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;">No. of Licenses</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${data.licenseCount}</td>
            </tr>
          </table>
    
          <p style="margin-top: 20px;">📱 We’ll reach out to you on WhatsApp & email soon</strong></p>
    
          <p style="margin-top: 30px;">Safe travels and see you soon! 🛺</p>
          <p style="font-weight: bold; color: #0077b6;">– The TukTukDrive Team</p>
    
          <hr style="margin-top: 30px;">
    
          <!-- Footer -->
          <footer style="font-size: 13px; color: #555; text-align: center; margin-top: 20px;">
            <p>Need help? Contact our support team at 
              <a href="mailto:support@tuktukdrive.com" style="color: #0077b6; text-decoration: none;">support@tuktukdrive.com</a>
            </p>
            
        
    
            <p style="margin-top: 5px;">
              <strong>Reference Address:</strong> No: 233, Tuk Tuk Drive, Kandy Road, Kandy, Sri Lanka
            </p>
    
            <div style="margin-top: 10px;">
              <a href="https://tuktukdrive.com" style="color: #0077b6; text-decoration: none;">Visit our website</a> |
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
