import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOST = "mail.dynadot.com";
const USER = "info@tuktukdrive.com";
const PASS = "DC5OJ7wUuOdo"; // put your Dynadot email password in .env.local

const transporter = nodemailer.createTransport({
  host: "mail.dynadot.com",
  port: 587,       // STARTTLS
  secure: false,
  requireTLS: true,
  auth: { user: USER, pass: PASS },
});


export async function GET() {
  return new Response(JSON.stringify({ ok: true, msg: "email API alive ✅" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const to = body.to || "thilinaweerasing@gmail.com";
    const subject = body.subject || "Dynadot SMTP test";
    const text = body.text || "If you see this, SMTP works.";
    const html = body.html || "<b>SMTP works 🎉</b>";

    await transporter.verify(); // verify connection

    const info = await transporter.sendMail({
      from: `"TukTukDrive" <${USER}>`,
      to,
      subject,
      text,
      html,
      envelope: { from: USER, to },
    });

    return new Response(
      JSON.stringify({ ok: true, id: info.messageId, response: info.response }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ SMTP error:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        code: err?.code || null,
        message: err?.message || "Failed to send email",
        response: err?.response ? String(err.response) : null,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
