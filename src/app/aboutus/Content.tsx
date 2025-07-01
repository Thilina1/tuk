"use client";

import {
  FaRegSmile,
  FaGlobeAsia,
  FaClock,
  FaMoneyBillWave,
  FaRoute,
  FaHandshake,
} from "react-icons/fa";

export default function Content() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-2xl p-10 md:p-16 text-gray-800 space-y-16 animate-fade-in">
      
      {/* About Description */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-4xl font-extrabold text-gray-900">About TukTuk Drive</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>TukTuk Drive</strong> isn&apos;t just about transportation — it&apos;s about transformation.
        </p>
        <p className="text-gray-600 text-base">
          From sandy coasts to misty hills, we provide more than just a vehicle. We offer training, curated routes, real-time support, and a warm welcome that makes every mile unforgettable.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: <FaRegSmile className="text-yellow-500 text-4xl mx-auto mb-4" />,
            title: "Friendly Support",
            desc: "24/7 human help, in your language. We&apos;re locals, and we care.",
          },
          {
            icon: <FaRoute className="text-emerald-600 text-4xl mx-auto mb-4" />,
            title: "Custom Routes",
            desc: "Pre-mapped scenic drives or off-the-grid adventures — your choice.",
          },
          {
            icon: <FaGlobeAsia className="text-blue-500 text-4xl mx-auto mb-4" />,
            title: "Authentic Exploration",
            desc: "Experience Sri Lanka beyond tourist spots. Connect with real culture.",
          },
          {
            icon: <FaMoneyBillWave className="text-purple-600 text-4xl mx-auto mb-4" />,
            title: "Transparent Pricing",
            desc: "All-inclusive, no hidden fees. What you see is what you pay.",
          },
          {
            icon: <FaClock className="text-pink-500 text-4xl mx-auto mb-4" />,
            title: "Instant Booking",
            desc: "Get on the road in minutes with a few simple steps.",
          },
          {
            icon: <FaHandshake className="text-green-600 text-4xl mx-auto mb-4" />,
            title: "Built on Trust",
            desc: "Thousands of happy explorers, 5-star reviews, and growing.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border shadow hover:shadow-xl transition duration-300 text-center"
          >
            {item.icon}
            <h4 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Vision/Quote */}
      <div className="text-center mt-12">
        <blockquote className="italic text-slate-600 text-lg max-w-xl mx-auto">
          &ldquo;Not all those who wander are lost.&rdquo; – <span className="font-semibold">J.R.R. Tolkien</span>
        </blockquote>
        <p className="mt-2 text-sm text-gray-500">...and with TukTuk Drive, you&apos;ll always find adventure.</p>
      </div>
    </div>
  );
}
