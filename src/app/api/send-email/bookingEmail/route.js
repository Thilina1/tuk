import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

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
      billBreakdown,   // { perDayCharge, rentalDays, licenseChargePer, extrasTotal, pickupPrice, returnPrice, deposit }
      extrasCounts,    // optional: { [extraName]: qty }
      mode,
    } = data;

    const money = (n) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        .format(Number(n || 0));

    // Pull the precomputed values directly
    const perDay = Number(billBreakdown?.perDayCharge || 0);
    const days = Number(billBreakdown?.rentalDays || 0);
    const licensePer = Number(billBreakdown?.licenseChargePer || 0);
    const extrasTotal = Number(billBreakdown?.extrasTotal || 0);
    const pickupPrice = Number(billBreakdown?.pickupPrice || 0);
    const returnPrice = Number(billBreakdown?.returnPrice || 0);
    const deposit = Number(billBreakdown?.deposit || 0);

    // For display only (still not recalculating totals)
    const rentalSubtotal = perDay * days * Number(tukCount || 1);
    const licenseSubtotal = licensePer * Number(licenseCount || 0);
    const pickupReturnSubtotal = pickupPrice + returnPrice;

    const transporter = nodemailer.createTransport({
      host: 'mail.tuktukdrive.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@tuktukdrive.com',       // move to env in prod
        pass: 'DC5OJ7wUuOdo',               // move to env in prod
      },
    });

    // Optional extras rows
    const extrasRows = extrasCounts
      ? Object.entries(extrasCounts)
          .filter(([, qty]) => Number(qty) > 0)
          .map(([name, qty]) => `<li>${name}: ${qty}</li>`)
          .join('')
      : '';

    const html = `
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
        <tr><td style="padding:12px; border:1px solid #e5e7eb; font-weight:700;">Total</td><td style="padding:12px; border:1px solid #e5e7eb; text-align:right; font-weight:700;">${money(totalRental)}</td></tr>
      </tbody>
    </table>

    ${extrasRows ? `<p style="margin:12px 0 0;"><strong>Extras Selected:</strong></p><ul style="margin:4px 0 0 18px; padding:0; font-size:13px; color:#374151;">${extrasRows}</ul>` : ''}

    <p style="margin:16px 0 0; font-weight:bold; color:#0ea5e9;">💬 We’ll send a secure payment link to you via WhatsApp and email shortly.</p>
    <p style="margin:4px 0 0;">If anything needs tweaking, tell us—we’ll adjust the booking before payment.</p>
    <p style="margin:16px 0 0; font-weight:600; color:#0ea5e9;">– The TukTukDrive Team</p>
  </div>

  <div style="padding:16px; background:#f9fafb; text-align:center; font-size:12px; color:#6b7280;">
    <p style="margin:0 0 6px;">Need help? <a href="mailto:info@tuktukdrive.com" style="color:#0ea5e9; text-decoration:none;">info@tuktukdrive.com</a></p>
    <p style="margin:0 0 6px;">No: 233, Tuk Tuk Drive, Kandy Road, Kandy, Sri Lanka</p>
    <p style="margin:0;">&copy; ${new Date().getFullYear()} TukTukDrive. All rights reserved.</p>
  </div>
</div>
    `;

    const mailOptions = {
      from: '"TukTuk Booking" <info@tuktukdrive.com>',
      to: [email],
      bcc: 'info@tuktukdrive.com',
      subject: '🎉 Booking Confirmed + Pricing – TukTukDrive',
      html,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}