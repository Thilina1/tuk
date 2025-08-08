"use client";

import React, { useState } from "react";
import { FaMoneyBillWave, FaTags, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";
import { initiateWebXPayPayment } from "../../app/api/payhere/checkout/api2/route"; // Import from apipay.js

export default function PricingDetails() {
  const [cartMessage, setCartMessage] = useState("");

  const handleAddToCart = () => {
    // Sample item: Regular Tuk for 1 day
    const item = {
      name: "Regular Tuk Rental",
      price: 12.0, // From document: $12/day
      quantity: 1,
      currency: "USD",
    };

    // Show confirmation message
    setCartMessage("Regular Tuk added to cart!");
    setTimeout(() => setCartMessage(""), 2000);

    // Prepare WebXPay payment data
    const paymentData = {
      api_username: "ZCjaVcSHYe",
      api_password: "pVb5FOf07y",
      secret_key: "8a0e4a29-194c-454a-926d-ecdcbd46adb2",
      amount: item.price,
      currency: item.currency,
      item_name: item.name,
      response_url: "https://greentechstartups.com/thank-you",
      cancel_url: "https://greentechstartups.com/cancel",
      first_name: "Test",
      last_name: "Customer", // Required, non-empty
      email: "test@tuktukdrive.com",
      payment_gateway_id: "15", // Replace with correct ID from WebXPay docs
    };

    // Initiate WebXPay payment
    initiateWebXPayPayment(paymentData);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/hero/coconut-bg.jpg')" }}
    >
      <div className="max-w-6xl mx-auto bg-white backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-12 text-gray-800">
        <h2 className="text-4xl font-extrabold text-center">📊 TukTuk Rental Pricing Guide</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Transparent pricing, no hidden charges. Plan your ride with ease.
        </p>

        {/* Daily Rental */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-[#FFF7ED] via-white to-[#F0FFF4] !bg-white">
          <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <FaMoneyBillWave /> Daily Rental Rates
          </h3>
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden bg-white">
            <thead className="bg-[#FFEDD5] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Vehicle</th>
                <th className="px-4 py-2 border-b">Price / Day</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Regular Tuk</td>
                <td className="px-4 py-2 border-b">$12</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Electric TukTuk</td>
                <td className="px-4 py-2 border-b">$18</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Cabrio Tuk</td>
                <td className="px-4 py-2 border-b">$16</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Bikes</td>
                <td className="px-4 py-2 border-b">$12</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* License Fee */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-emerald-600 mb-4">🪪 License Fee</h3>
          <p className="text-sm leading-relaxed">
            Every driver must hold a valid license. If you are a foreign visitor, we strongly recommend carrying an International Driving Permit (IDP).
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
            <li><strong>$35 per license</strong> is charged to process and validate each license.</li>
            <li>This fee covers digital verification, support, and insurance eligibility.</li>
            <li>All drivers must be 18 years or older and comply with Sri Lankan road regulations.</li>
          </ul>
        </section>

        {/* Extras */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-[#F0FFF4] via-white to-[#FFFBEB] !bg-white">
          <h3 className="text-2xl font-bold text-amber-600 mb-4 flex items-center gap-2">
            <FaTags /> Optional Extras
          </h3>
          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden bg-white">
            <thead className="bg-[#FEF3C7] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Extra</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Train Transfer</td>
                <td className="px-4 py-2 border-b">Contact us</td>
                <td className="px-4 py-2 border-b">Service</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Full-Time Driver</td>
                <td className="px-4 py-2 border-b">Contact us</td>
                <td className="px-4 py-2 border-b">Service</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Surf-Board Rack</td>
                <td className="px-4 py-2 border-b">$5/day</td>
                <td className="px-4 py-2 border-b">Add-on</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Bluetooth Speakers</td>
                <td className="px-4 py-2 border-b">$3/day</td>
                <td className="px-4 py-2 border-b">Add-on</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Cooler Box</td>
                <td className="px-4 py-2 border-b">$4/day</td>
                <td className="px-4 py-2 border-b">Add-on</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Baby Seat</td>
                <td className="px-4 py-2 border-b">$5/day</td>
                <td className="px-4 py-2 border-b">Add-on</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Dash Cam</td>
                <td className="px-4 py-2 border-b">$6/day</td>
                <td className="px-4 py-2 border-b">Add-on</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Deposit */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Refundable Deposit</h3>
          <p className="text-sm leading-relaxed">
            A one-time <strong>$50 security deposit</strong> will be collected during your booking. This is fully refundable and ensures vehicle protection.
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
            <li>Returned within 3–5 business days after your trip ends.</li>
            <li>No deductions if the tuk-tuk is returned undamaged and on time.</li>
            <li>In case of minor damages or rule violations, partial deductions may apply.</li>
          </ul>
        </section>

        {/* Coupons */}
        <section className="rounded-xl border border-amber-300 shadow-sm p-6 bg-gradient-to-br from-[#FFFBEB] via-white to-[#FFF7ED] !bg-white">
          <h3 className="text-2xl font-bold text-orange-600 mb-4">🏷️ Discount Coupons</h3>
          <p className="text-sm leading-relaxed">
            We frequently offer promo codes to help you save on your adventures! Apply your coupon during checkout and enjoy automatic savings.
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
            <li><strong>Percentage-based:</strong> e.g., 10% off your total booking.</li>
            <li><strong>Fixed amount:</strong> e.g., $20 off your rental.</li>
            <li>Coupons must be valid, active, and within user limits.</li>
            <li>Only one coupon can be used per transaction.</li>
            <li>Watch out for seasonal deals shared on our homepage or via email.</li>
          </ul>
        </section>

        {/* Cost Formula */}
        <section className="rounded-xl border border-dashed border-emerald-400 p-6 bg-[#F0FFF4] text-sm">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">🧮 Cost Calculation Formula</h3>
          <code className="text-gray-700 block">
            Total = (Tuk Count × Days × Per Day Rate) + (License Count × $35) + Pickup/Return + Extras + $50 (Deposit) - Coupon Discount
          </code>
        </section>

        {/* FAQ */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F7FEE7] !bg-white">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaQuestionCircle /> Frequently Asked
          </h3>
          <ul className="text-sm list-disc pl-6 space-y-2">
            <li><strong>Is insurance included?</strong> – Yes, basic coverage is included.</li>
            <li><strong>Can I rent without a license?</strong> – No, a valid license or IDP is mandatory.</li>
            <li><strong>Are discounts stackable?</strong> – Only one coupon can be used per booking.</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            href="/#book"
            className="inline-block bg-gradient-to-r from-orange-400 to-amber-500 !bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            style={{
              backgroundImage: 'linear-gradient(to right, #fb923c, #fbbf24)', // fallback to hardcoded gradient
            }}
          >
            🚀 Book Your TukTuk Now
          </Link>
          <button
            onClick={handleAddToCart}
            className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 !bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            style={{
              backgroundImage: 'linear-gradient(to right, #4ade80, #10b981)', // Green gradient for Add to Cart
            }}
          >
            🛒 Add to Cart
          </button>
          <p className="text-sm text-gray-500 mt-2">No upfront payment required to get started.</p>
          {cartMessage && (
            <p className="text-sm text-green-600 mt-2">{cartMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
