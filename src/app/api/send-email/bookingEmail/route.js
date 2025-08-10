import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/** Pretty currency formatter */
const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(Number(n || 0));

/** Build the HTML email once */
function buildHtml({
  name, email, orderId, mode,
  pickup, pickupDate, pickupTime,
  returnLoc, returnDate, returnTime,
  tukCount, licenseCount,
  billBreakdown = {},
  couponCode,
  extrasCounts
}) {
  const perDay      = Number(billBreakdown.perDayCharge || 0);
  const days        = Number(billBreakdown.rentalDays || 0);
  const licensePer  = Number(billBreakdown.licenseChargePer || 0);
  const extrasTotal = Number(billBreakdown.extrasTotal || 0);
  const pickupPrice = Number(billBreakdown.pickupPrice || 0);
  const returnPrice = Number(billBreakdown.returnPrice || 0);
  const deposit     = Number(billBreakdown.deposit || 0);

  const rentalSubtotal        = perDay * days * Number(tukCount || 1);
  const licenseSubtotal       = licensePer * Number(licenseCount || 0);
  const pickupReturnSubtotal  = pickupPrice + returnPrice;

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

/** Create a transporter with given options, verify, and return it */
async function makeTransporter(opts) {
  const transporter = nodemailer.createTransport(opts);
  await transporter.verify(); // throws if connection/auth fails
  return transporter;
}

/** Try 465 (implicit TLS) then fall back to 587 (STARTTLS) */
async function getWorkingTransporter() {
  const masked = (s) => s ? `${s.slice(0, 2)}***` : '';
  const base = {
    host: 'mail.tuktukdrive.com',
    auth: {
      user: 'test@tuktukdrive.com',
      pass: 'F6{X_jks2D[#',
    },
  };

  // 1) Try 465 first
  try {
    const t = await makeTransporter({
      ...base,
      port: 465,
      secure: true, // implicit TLS
    });
    console.log('[mail] connected via 465 (implicit TLS) as', base.auth.user, '(pass:', masked(base.auth.pass), ')');
    return t;
  } catch (e) {
    console.warn('[mail] 465 failed, falling back to 587 STARTTLS. Reason:', e?.message || e);
  }

  // 2) Fallback to 587 STARTTLS
  const t587 = await makeTransporter({
    ...base,
    port: 587,
    secure: false,     // STARTTLS
    requireTLS: true,
  });
  console.log('[mail] connected via 587 (STARTTLS) as', base.auth.user);
  return t587;
}

export async function POST(request) {
  try {
    // --- parse & validate payload safely ---
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
      console.error('[bookingEmail] missing "email" in payload');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Normalize billBreakdown
    const billBreakdown = {
      perDayCharge:  Number(bbRaw?.perDayCharge ?? 0),
      rentalDays:    Number(bbRaw?.rentalDays ?? 0),
      licenseChargePer: Number(bbRaw?.licenseChargePer ?? 0),
      extrasTotal:   Number(bbRaw?.extrasTotal ?? 0),
      pickupPrice:   Number(bbRaw?.pickupPrice ?? 0),
      returnPrice:   Number(bbRaw?.returnPrice ?? 0),
      deposit:       Number(bbRaw?.deposit ?? 0),
      total:         Number(totalRental ?? bbRaw?.total ?? 0),
      totalRental:   Number(totalRental ?? bbRaw?.totalRental ?? 0),
    };

    // Build email
    const html = buildHtml({
      name, email, orderId, mode,
      pickup, pickupDate, pickupTime,
      returnLoc, returnDate, returnTime,
      tukCount, licenseCount,
      billBreakdown, couponCode, extrasCounts,
    });

    // Transporter (465 → 587 fallback)
    let transporter;
    try {
      transporter = await getWorkingTransporter();
    } catch (connErr) {
      console.error('[bookingEmail] SMTP connection failed after both attempts:', connErr?.message || connErr);
      return NextResponse.json({ error: 'SMTP connection failed' }, { status: 502 });
    }

    // Send mail with extra logging
    const mailOptions = {
      from: '"TukTuk Booking" <test@tuktukdrive.com>',
      to: [email],
      bcc: 'test@tuktukdrive.com',
      subject: '🎉 Booking Confirmed + Pricing – TukTukDrive',
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('[bookingEmail] sent:', { messageId: info?.messageId, accepted: info?.accepted, rejected: info?.rejected });
    } catch (sendErr) {
      console.error('[bookingEmail] sendMail error:', sendErr?.response || sendErr?.message || sendErr);
      return NextResponse.json({ error: 'Failed to send email (SMTP send error)' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('[bookingEmail] fatal error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to send email (server error)' }, { status: 500 });
  }
}
