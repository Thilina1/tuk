import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/** ───────── Helpers ───────── **/
const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(Number(n || 0));

function buildHtml({
  name, orderId, mode,
  pickup, pickupDate, pickupTime,
  returnLoc, returnDate, returnTime,
  tukCount, licenseCount,
  billBreakdown = {},
  couponCode,
  extrasCounts,
}) {
  const perDay      = Number(billBreakdown.perDayCharge || 0);
  const days        = Number(billBreakdown.rentalDays || 0);
  const licensePer  = Number(billBreakdown.licenseChargePer || 0);
  const extrasTotal = Number(billBreakdown.extrasTotal || 0);
  const pickupPrice = Number(billBreakdown.pickupPrice || 0);
  const returnPrice = Number(billBreakdown.returnPrice || 0);
  const deposit     = Number(billBreakdown.deposit || 0);

  const rentalSubtotal       = perDay * days * Number(tukCount || 1);
  const licenseSubtotal      = licensePer * Number(licenseCount || 0);
  const pickupReturnSubtotal = pickupPrice + returnPrice;

  const extrasRows = extrasCounts
    ? Object.entries(extrasCounts)
        .filter(([, qty]) => Number(qty) > 0)
        .map(([n, qty]) => `<li>${n}: ${qty}</li>`)
        .join('')
    : '';

  return `
<div style="font-family: Arial, sans-serif; max-width: 640px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
  <div style="padding:24px; background:#f9fafb;">
    <h2 style="margin:0 0 8px; color:#0ea5e9;">Hello ${name || 'Guest'},</h2>
    <p style="margin:0 0 8px;">🎉 <strong>Your TukTuk booking is confirmed!</strong></p>
    <p style="margin:0; color:#374151;">Order ID: <strong>${orderId || '-'}</strong> • Status: <strong>${mode || 'CONFIRMED'}</strong></p>
  </div>

  <div style="padding:24px;">
    <h3 style="margin:0 0 12px; color:#111827;">📅 Booking Details</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <tbody>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Pickup</td><td style="padding:8px; border:1px solid #e5e7eb;">${pickup || '-'}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Pickup Date & Time</td><td style="padding:8px; border:1px solid #e5e7eb;">${pickupDate || '-'} at ${pickupTime || '-'}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Return</td><td style="padding:8px; border:1px solid #e5e7eb;">${returnLoc || '-'}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Return Date & Time</td><td style="padding:8px; border:1px solid #e5e7eb;">${returnDate || '-'} at ${returnTime || '-'}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">No. of TukTuks</td><td style="padding:8px; border:1px solid #e5e7eb;">${tukCount ?? '-'}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">No. of Licenses</td><td style="padding:8px; border:1px solid #e5e7eb;">${licenseCount ?? '-'}</td></tr>
      </tbody>
    </table>

    <h3 style="margin:24px 0 12px; color:#111827;">💸 Pricing Summary</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <tbody>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Rental (${money(perDay)} × ${days} × ${tukCount || 1} tuk-tuk)</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right;">${money(rentalSubtotal)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Licenses (${money(licensePer)} × ${licenseCount || 0})</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right;">${money(licenseSubtotal)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Pickup + Return</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right;">${money(pickupReturnSubtotal)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Extras</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right;">${money(extrasTotal)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e5e7eb;">Refundable Deposit</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right;">${money(deposit)}</td></tr>
        ${couponCode ? `<tr><td style="padding:8px; border:1px solid #e5e7eb; color:#059669;">Discount (Code: ${couponCode})</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:right; color:#059669;">(applied)</td></tr>` : ''}
        <tr><td style="padding:12px; border:1px solid #e5e7eb; font-weight:700;">Total</td><td style="padding:12px; border:1px solid #e5e7eb; text-align:right; font-weight:700;">${money(billBreakdown.total ?? billBreakdown.totalRental ?? 0)}</td></tr>
      </tbody>
    </table>

    ${extrasRows ? `<p style="margin:12px 0 0;"><strong>Extras Selected:</strong></p><ul style="margin:4px 0 0 18px; padding:0; font-size:13px; color:#374151;">${extrasRows}</ul>` : ''}

    <p style="margin:16px 0 0; font-weight:bold; color:#0ea5e9;">💬 We’ll send a secure payment link to you via WhatsApp and email shortly.</p>
    <p style="margin:4px 0 0;">If anything needs tweaking, tell us—we’ll adjust the booking before payment.</p>
    <p style="margin:16px 0 0; font-weight:600; color:#0ea5e9;">– The TukTukDrive Team</p>
  </div>

  <div style="padding:16px; background:#f9fafb; text-align:center; font-size:12px; color:#6b7280;">
    <p style="margin:0 0 6px;">Need help? <a href="mailto:support@tuktukdrive.com" style="color:#0ea5e9; text-decoration:none;">support@tuktukdrive.com</a></p>
    <p style="margin:0 0 6px;">No: 233, Tuk Tuk Drive, Kandy Road, Kandy, Sri Lanka</p>
    <p style="margin:0;">&copy; ${new Date().getFullYear()} TukTukDrive. All rights reserved.</p>
  </div>
</div>
`;
}

/** non-SSL transporter: try 587 (secure:false) → fallback 25 (secure:false) */
async function getTransporterNoSSL() {
  const base = {
    host: 'mail.tuktukdrive.com',
    auth: { user: 'test@tuktukdrive.com', pass: 'F6{X_jks2D[#' },
  };

  // 587 first (STARTTLS optional if server offers; otherwise plaintext)
  try {
    const t587 = nodemailer.createTransport({ ...base, port: 587, secure: false });
    await t587.verify();
    console.log('[smtp] connected on 587 (secure:false)');
    return { t: t587, via: '587 (secure:false)' };
  } catch (e) {
    console.warn('[smtp] 587 failed:', e?.code, e?.message);
  }

  // fallback: 25 plaintext
  const t25 = nodemailer.createTransport({ ...base, port: 25, secure: false });
  await t25.verify();
  console.log('[smtp] connected on 25 (secure:false)');
  return { t: t25, via: '25 (secure:false)' };
}

/** ───────── API Route ───────── **/
export async function POST(request) {
  try {
    const data = await request.json().catch(() => ({}));

    const {
      name,
      email,
      pickup,
      pickupDate,
      pickupTime,
      returnLoc,
      returnDate,
      returnTime,
      tukCount,
      licenseCount,
      orderId,
      totalRental,
      couponCode,
      billBreakdown: bbRaw,
      extrasCounts,
      mode,
    } = data || {};

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const billBreakdown = {
      perDayCharge:      Number(bbRaw?.perDayCharge ?? 0),
      rentalDays:        Number(bbRaw?.rentalDays ?? 0),
      licenseChargePer:  Number(bbRaw?.licenseChargePer ?? 0),
      extrasTotal:       Number(bbRaw?.extrasTotal ?? 0),
      pickupPrice:       Number(bbRaw?.pickupPrice ?? 0),
      returnPrice:       Number(bbRaw?.returnPrice ?? 0),
      deposit:           Number(bbRaw?.deposit ?? 0),
      total:             Number(totalRental ?? bbRaw?.total ?? 0),
      totalRental:       Number(totalRental ?? bbRaw?.totalRental ?? 0),
    };

    const html = buildHtml({
      name, email, orderId, mode,
      pickup, pickupDate, pickupTime,
      returnLoc, returnDate, returnTime,
      tukCount, licenseCount,
      billBreakdown, couponCode, extrasCounts,
    });

    // connect (no-SSL chain)
    let transport, via;
    try {
      const r = await getTransporterNoSSL();
      transport = r.t;
      via = r.via;
    } catch (connErr) {
      return NextResponse.json({
        error: 'SMTP connection failed',
        details: { code: connErr?.code, message: connErr?.message }
      }, { status: 502 });
    }

    // send
    try {
      const info = await transport.sendMail({
        from: '"TukTuk Booking" <test@tuktukdrive.com>',
        to: [email],
        bcc: 'test@tuktukdrive.com',
        subject: '🎉 Booking Confirmed + Pricing – TukTukDrive',
        html,
      });
      return NextResponse.json({
        ok: true,
        via,
        messageId: info?.messageId,
        accepted: info?.accepted,
        rejected: info?.rejected,
      });
    } catch (sendErr) {
      return NextResponse.json({
        error: 'SMTP send failed',
        details: {
          code: sendErr?.code,
          command: sendErr?.command,
          responseCode: sendErr?.responseCode,
          message: sendErr?.message,
          response: sendErr?.response,
        }
      }, { status: 500 });
    }
  } catch (fatal) {
    return NextResponse.json({
      error: 'Server error',
      details: fatal?.message || String(fatal),
    }, { status: 500 });
  }
}
