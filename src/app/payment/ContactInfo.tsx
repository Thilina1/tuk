"use client";

import React from "react";
import { FaMoneyBillWave, FaTags, FaQuestionCircle } from "react-icons/fa";

export default function PricingDetails() {
  const perDayCharges = [
    { range: "1–4 days", price: 23 },
    { range: "5–8 days", price: 16 },
    { range: "9–15 days", price: 15 },
    { range: "16–19 days", price: 13 },
    { range: "20–35 days", price: 12 },
    { range: "36–90 days", price: 11 },
    { range: "91–120 days", price: 10 },
    { range: "121+ days", price: 8 },
  ];

  const extras = [
    { name: "Train Transfer", price: 30, type: "per unit" },
    { name: "Full-Time Driver", price: 25, type: "per day" },
    { name: "Surf-Board Rack", price: 1, type: "per unit" },
    { name: "Bluetooth Speakers", price: 1, type: "per unit" },
    { name: "Cooler Box", price: 1, type: "per unit" },
    { name: "Dash Cam", price: 1, type: "per unit" },
    { name: "Baby Seat", price: 2, type: "per unit" },
    { name: "Hood Rack", price: 3, type: "per unit" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/hero/coconut-bg.jpg')" }}
    >
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-12">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800">📊 TukTuk Rental Pricing Guide</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Transparent pricing, no hidden charges. Plan your ride with ease.
        </p>

        {/* Per Day Charges */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-orange-50 via-white to-emerald-50">
          <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <FaMoneyBillWave /> Daily Rental Rates
          </h3>
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden">
            <thead className="bg-orange-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Duration</th>
                <th className="px-4 py-2 border-b">Price / Day</th>
              </tr>
            </thead>
            <tbody>
              {perDayCharges.map((item, idx) => (
                <tr key={idx} className="hover:bg-orange-50 transition">
                  <td className="px-4 py-2 border-b">{item.range}</td>
                  <td className="px-4 py-2 border-b font-medium">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 🪪 LICENSE FEE */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-emerald-600 mb-4">🪪 License Fee</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Every driver must hold a valid license. If you are a foreign visitor, we strongly recommend carrying an International Driving Permit (IDP).
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
            <li><strong>$35 per license</strong> is charged to process and validate each license.</li>
            <li>This fee covers digital verification, support, and insurance eligibility.</li>
            <li>All drivers must be 18 years or older and comply with Sri Lankan road regulations.</li>
          </ul>
        </section>

        {/* ➕ OPTIONAL EXTRAS */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-green-50 via-white to-yellow-50">
          <h3 className="text-2xl font-bold text-amber-600 mb-4 flex items-center gap-2">
            <FaTags /> Optional Extras
          </h3>
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden">
            <thead className="bg-amber-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Extra</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {extras.map((extra, idx) => (
                <tr key={idx} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-2 border-b">{extra.name}</td>
                  <td className="px-4 py-2 border-b">${extra.price}</td>
                  <td className="px-4 py-2 border-b">{extra.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 💰 REFUNDABLE DEPOSIT */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Refundable Deposit</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            A one-time <strong>$50 security deposit</strong> will be collected during your booking. This is fully refundable and ensures vehicle protection.
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
            <li>Returned within 3–5 business days after your trip ends.</li>
            <li>No deductions if the tuk-tuk is returned undamaged and on time.</li>
            <li>In case of minor damages or rule violations, partial deductions may apply.</li>
          </ul>
        </section>

        {/* 🏷️ COUPON DISCOUNTS */}
        <section className="rounded-xl border border-amber-300 shadow-sm p-6 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
          <h3 className="text-2xl font-bold text-orange-600 mb-4">🏷️ Discount Coupons</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            We frequently offer promo codes to help you save on your adventures! Apply your coupon during checkout and enjoy automatic savings.
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
            <li><strong>Percentage-based:</strong> e.g., 10% off your total booking.</li>
            <li><strong>Fixed amount:</strong> e.g., $20 off your rental.</li>
            <li>Coupons must be valid, active, and within user limits.</li>
            <li>Only one coupon can be used per transaction.</li>
            <li>Watch out for seasonal deals shared on our homepage or via email.</li>
          </ul>
        </section>

        {/* 💡 COST FORMULA */}
        <section className="rounded-xl border border-dashed border-emerald-400 p-6 bg-emerald-50 text-sm">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">🧮 Cost Calculation Formula</h3>
          <code className="text-gray-700 block">
            Total = (Tuk Count × Days × Per Day Rate) + (License Count × $35) + Pickup/Return + Extras + $50 (Deposit) - Coupon Discount
          </code>
        </section>

        {/* FAQ */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-sky-50 via-white to-lime-50">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaQuestionCircle /> Frequently Asked
          </h3>
          <ul className="text-sm text-gray-700 list-disc pl-6 space-y-2">
            <li><strong>Is insurance included?</strong> – Yes, basic coverage is included.</li>
            <li><strong>Can I rent without a license?</strong> – No, a valid license or IDP is mandatory.</li>
            <li><strong>Are discounts stackable?</strong> – Only one coupon can be used per booking.</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/#book"
            className="inline-block bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
          >
            🚀 Book Your TukTuk Now
          </a>
          <p className="text-sm text-gray-500 mt-2">No upfront payment required to get started.</p>
        </div>
      </div>
    </div>
  );
}
