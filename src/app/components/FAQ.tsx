'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Image from 'next/image';

const faqSections = [
  {
    title: '🛡️ Insurance & Accident',
    items: [
      {
        question: 'Is my tuk-tuk fully insured?',
        answer: (
          <div>
            Yes, all tuk-tuks come with full insurance coverage, including rental protection. However:
            <ul className="list-disc ml-6 mt-2">
              <li>Tent cover damage is not included.</li>
              <li>Repairs under LKR 5,000 (~$15) are not claimable through insurance.</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Who pays for small repairs (under $15)?',
        answer: 'If the repair cost is below $15, it will be deducted from your deposit. No need to involve insurance or delay your journey.',
      },
      {
        question: 'What happens if the repair is over $15?',
        answer: (
          <div>
            Contact the insurance company using the number on your insurance card and wait for their assessment.
            <ul className="list-disc ml-6 mt-2">
              <li>First $15 will still be deducted from your deposit.</li>
              <li>The remaining cost will be covered by insurance.</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'What do I do in case of an accident?',
        answer: (
          <div>
            <ol className="list-decimal ml-6 mt-2">
              <li>Call us immediately at +94 770 063 780</li>
              <li>Contact the insurance company (number on your insurance card)</li>
              <li>Stay at the location until instructions are given</li>
            </ol>
            <p className="mt-2">These steps ensure the process goes smoothly and quickly.</p>
          </div>
        ),
      },
      {
        question: 'Is tent damage covered?',
        answer: 'No, tent cover damage is not covered by insurance. Any related costs must be paid by the client.',
      },
    ],
  },
  {
    title: '🪪 Licensing & Requirements',
    items: [
      {
        question: 'Do I need a special license to drive a tuk-tuk in Sri Lanka?',
        answer: (
          <ul className="list-disc ml-6">
            <li>A Sri Lankan local license, which we help you obtain</li>
            <li>A valid International Driving Permit (IDP) from your home country</li>
          </ul>
        ),
      },
      {
        question: 'What if I don’t have an IDP?',
        answer: 'Let us know! We can help arrange a local permit for you even if you don’t have an IDP yet.',
      },
    ],
  },
  {
    title: '💳 Payments & Rental Information',
    items: [
      {
        question: 'How much does it cost to rent a tuk-tuk?',
        answer: 'Our rates depend on the number of days you book. The longer you rent, the better the rate! Contact us directly or check the pricing section for details.',
      },
      {
        question: 'Is there a checklist for taking care of the tuk-tuk?',
        answer: (
          <div>
            Yes! Follow this simple maintenance guide:
            <ul className="list-disc ml-6 mt-2">
              <li>✅ Check oil every 3 days</li>
              <li>✅ Rest engine 30 mins after every 100km</li>
              <li>✅ Drive between 40–50 km/h</li>
              <li>✅ Grease the tuk-tuk every 10 days</li>
            </ul>
            <p className="mt-2">Following this checklist helps prevent issues and ensures a safe ride!</p>
          </div>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section
      className="min-h-screen pt-15 pb-15 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(to bottom, #FEF3C7, #ffffff, #f8fafc)",
        color: "#1f2937", // slate-800
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p style={{ color: '#eab308' }} className="text-sm text-center font-semibold mt-1 uppercase tracking-wide">
          Need To Know
        </p>
        <h3 className="text-4xl font-extrabold text-center mb-14" style={{ color: '#1e293b' }}>
          Frequently Asked Questions ❓
        </h3>

        {faqSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-10">
            <button
              onClick={() => toggleSection(sectionIdx)}
              className="w-full flex justify-between items-center text-left text-2xl font-bold mb-4 border-b pb-1 hover:text-yellow-600"
              style={{ color: '#334155', borderColor: '#facc15' }}
            >
              {section.title}
              {expandedSections[sectionIdx] ? <FaChevronUp className="text-yellow-500" /> : <FaChevronDown className="text-slate-400" />}
            </button>
            <div className={`${expandedSections[sectionIdx] ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
              <div className="space-y-4">
                {section.items.map((faq, idx) => {
                  const id = `${sectionIdx}-${idx}`;
                  const isOpen = activeIndex === id;
                  return (
                    <div
                      key={id}
                      className="rounded-xl shadow border"
                      style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                    >
                      <button
                        onClick={() => setActiveIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left text-base font-medium hover:bg-yellow-50 transition"
                        style={{ color: '#1e293b' }}
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <FaChevronUp className="text-yellow-500" /> : <FaChevronDown className="text-slate-400" />}
                      </button>
                      <div
                        className={`transition-all overflow-hidden text-sm px-6 ${
                          isOpen ? 'pb-5 max-h-[500px]' : 'max-h-0'
                        }`}
                        style={{ color: '#475569' }}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        <div
          className="mt-20 max-w-2xl mx-auto rounded-2xl shadow-lg px-8 py-10 text-center border"
          style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', colorScheme: 'light' }}
        >
          <div className="flex justify-center mb-4">
            <Image
              src="/logo/TukTukDrive-Logo-Footer.png"
              alt="TukTuk Drive Logo"
              width={80}
              height={80}
              className="drop-shadow-sm"
            />
          </div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#1e293b' }}>
            Embark on a Memorable Tour with <span style={{ color: '#facc15' }}>TukTukDrive.com</span>
          </h3>
          <p className="text-base" style={{ color: '#475569' }}>
            Book your tuk-tuk now and explore Sri Lanka your way — with full insurance and no mileage limits.
          </p>
        </div>
      </div>
    </section>
  );
}