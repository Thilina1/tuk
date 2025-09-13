import nodemailer from "nodemailer";

export async function POST() {
  try {
    const transporter = nodemailer.createTransport({
      host: "webhost.dynadot.com",
      port: 587,
      secure: false, // must be false for STARTTLS
      auth: {
        user: "info@tuktukdrive.com",
        pass: "DC5OJ7wUuOdo",
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed / Dynadot certs
      },
    }); 

    const info = await transporter.sendMail({
      from: '"TukTukDrive" <info@tuktukdrive.com>',
      to: "thilinaweerasing@gmail.com", // test recipient
      subject: "TukTukDrive — SMTP Test (Dynadot)",
      html: `
        <h2>Dynadot SMTP is working 🎉</h2>
        <p>This is a test email sent via <b>webhost.dynadot.com</b>.</p>
        <p>✔️ Sent using Dynadot Remote Access SMTP</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true, id: info.messageId }), {
      status: 200,
    });
  } catch (err) {
    console.error("SMTP error:", err);
    return new Response(
      JSON.stringify({ ok: false, code: err.code, message: err.message }),
      { status: 500 }
    );
  }
}
