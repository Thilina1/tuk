"use client";

import { FaShieldAlt, FaIdCard, FaMoneyBillWave } from "react-icons/fa";

export default function FAQSection() {
  return (
    <div className="relative bg-white rounded-[2rem] shadow-2xl p-10 md:px-20 md:py-16 overflow-hidden mt-0">
      {/* Gradient Background Blurs */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-tr from-yellow-300 via-amber-200 to-white rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-amber-100 via-white to-yellow-200 rounded-full opacity-30 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-14">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2 text-base max-w-xl mx-auto">
            Everything you need to know about renting and driving a tuk-tuk across Sri Lanka.
          </p>
        </div>

        {/* Category 1: Insurance & Accidents */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-amber-600">
            <FaShieldAlt /> Insurance & Accidents
          </h3>
          <div className="mt-4 space-y-4 text-gray-700 pl-6">
            <p><strong>Is my tuk-tuk fully insured?</strong><br />Yes, except for tent damage and repairs under LKR 5,000 (~$15).</p>
            <p><strong>Who pays for small repairs?</strong><br />You pay. These are deducted from your deposit.</p>
            <p><strong>What about big repairs?</strong><br />Call the insurer (number on card). First $15 is yours — the rest is covered.</p>
            <p><strong>What to do in an accident?</strong><br />1. Call us (+94 770 063 780)<br />2. Contact insurer<br />3. Wait at the location</p>
            <p><strong>Is tent damage covered?</strong><br />No — you’re responsible for this separately.</p>
          </div>
        </div>

        {/* Category 2: Licensing & Requirements */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-amber-600">
            <FaIdCard /> Licensing & Requirements
          </h3>
          <div className="mt-4 space-y-4 text-gray-700 pl-6">
            <p><strong>Do I need a Sri Lankan license?</strong><br />Yes — we help you obtain it easily with your IDP.</p>
            <p><strong>No IDP?</strong><br />We’ll still assist you in getting your local permit without delays.</p>
          </div>
        </div>

        {/* Category 3: Payments & Rentals */}
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-amber-600">
            <FaMoneyBillWave /> Payments & Rentals
          </h3>
          <div className="mt-4 space-y-4 text-gray-700 pl-6">
            <p><strong>How much does it cost?</strong><br />Pricing depends on your rental length — longer = cheaper/day.</p>
            <p><strong>Is there a maintenance checklist?</strong><br />
              ✅ Check oil every 3 days<br />
              ✅ Rest engine every 100km<br />
              ✅ Drive 40–50 km/h<br />
              ✅ Grease every 10 days
            </p>
          </div>
        </div>

        {/* Optional CTA */}
        <div className="text-center pt-6">
          <p className="text-sm text-gray-500 italic">Still have questions? <a href="/contact" className="text-amber-600 underline font-medium">Contact us</a> anytime.</p>
        </div>
      </div>
    </div>
  );
}
