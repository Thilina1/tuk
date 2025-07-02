"use client";

import { FaShieldAlt, FaIdCard, FaMoneyBillWave } from "react-icons/fa";

export default function FAQSection() {
  return (
    <div
      className="relative shadow-2xl p-10 md:px-20 md:py-16 overflow-hidden mt-0"
      style={{
        backgroundColor: "#ffffff", // hard-coded white bg
        borderRadius: "0", // no rounded corners
        color: "#1f2937", // text-gray-800
      }}
    >
      {/* Gradient Background Blurs */}
      <div
        style={{
          position: "absolute",
          top: "-2.5rem",
          left: "-2.5rem",
          width: "18rem",
          height: "18rem",
          background: "linear-gradient(to top right, #fcd34d, #fde68a, #ffffff)",
          opacity: 0.3,
          filter: "blur(3rem)",
          borderRadius: "9999px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-2.5rem",
          right: "-2.5rem",
          width: "18rem",
          height: "18rem",
          background: "linear-gradient(to bottom right, #fef3c7, #ffffff, #fef08a)",
          opacity: 0.3,
          filter: "blur(3rem)",
          borderRadius: "9999px",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-14">
        {/* Heading */}
        <div className="text-center">
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "#111827", // text-gray-900
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              color: "#4B5563", // text-gray-600
              marginTop: "0.5rem",
              fontSize: "1rem",
              maxWidth: "40rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Everything you need to know about renting and driving a tuk-tuk across Sri Lanka.
          </p>
        </div>

        {/* Category 1: Insurance & Accidents */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold" style={{ color: "#d97706" }}>
            <FaShieldAlt /> Insurance & Accidents
          </h3>
          <div style={{ marginTop: "1rem", paddingLeft: "1.5rem", color: "#374151" }}>
            <p><strong>Is my tuk-tuk fully insured?</strong><br />Yes, except for tent damage and repairs under LKR 5,000 (~$15).</p>
            <p><strong>Who pays for small repairs?</strong><br />You pay. These are deducted from your deposit.</p>
            <p><strong>What about big repairs?</strong><br />Call the insurer (number on card). First $15 is yours — the rest is covered.</p>
            <p><strong>What to do in an accident?</strong><br />1. Call us (+94 770 063 780)<br />2. Contact insurer<br />3. Wait at the location</p>
            <p><strong>Is tent damage covered?</strong><br />No — you’re responsible for this separately.</p>
          </div>
        </div>

        {/* Category 2: Licensing & Requirements */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold" style={{ color: "#d97706" }}>
            <FaIdCard /> Licensing & Requirements
          </h3>
          <div style={{ marginTop: "1rem", paddingLeft: "1.5rem", color: "#374151" }}>
            <p><strong>Do I need a Sri Lankan license?</strong><br />Yes — we help you obtain it easily with your IDP.</p>
            <p><strong>No IDP?</strong><br />We’ll still assist you in getting your local permit without delays.</p>
          </div>
        </div>

        {/* Category 3: Payments & Rentals */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold" style={{ color: "#d97706" }}>
            <FaMoneyBillWave /> Payments & Rentals
          </h3>
          <div style={{ marginTop: "1rem", paddingLeft: "1.5rem", color: "#374151" }}>
            <p><strong>How much does it cost?</strong><br />Pricing depends on your rental length — longer = cheaper/day.</p>
            <p><strong>Is there a maintenance checklist?</strong><br />
              ✅ Check oil every 3 days<br />
              ✅ Rest engine every 100km<br />
              ✅ Drive 40–50 km/h<br />
              ✅ Grease every 10 days
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <p style={{ fontSize: "0.875rem", color: "#6B7280", fontStyle: "italic" }}>
            Still have questions?{" "}
            <a href="/contact" style={{ color: "#d97706", textDecoration: "underline", fontWeight: 500 }}>
              Contact us
            </a>{" "}
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
