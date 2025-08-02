"use client";

import {
  FaHandshake,
  FaGlobeAsia,
  FaClock,
  FaLeaf,
} from "react-icons/fa";
import InstagramEmbedSection from "./instaEmbeded";

export default function AboutUs() {
  const features = [
    {
      icon: <FaHandshake className="text-green-500 text-4xl" />,
      title: "Empowering Local Communities",
      desc: "Every ride supports Sri Lanka’s TukTuk owners, sustaining families through tourism.",
    },
    {
      icon: <FaGlobeAsia className="text-blue-500 text-4xl" />,
      title: "Authentic Local Experiences",
      desc: "Venture into villages, scenic landscapes, and hidden gems you won’t find in a guidebook.",
    },
    {
      icon: <FaClock className="text-pink-500 text-4xl" />,
      title: "Safety & Reliability",
      desc: "A rigorously maintained fleet ensures worry-free, high-standard adventures.",
    },
    {
      icon: <FaLeaf className="text-emerald-500 text-4xl" />,
      title: "Eco-Friendly Journeys",
      desc: "Minimize your carbon footprint while exploring consciously.",
    },
  ];

  return (
    <section className="bg-white text-gray-800">
      {/* Hero */}
      <div
        className="relative py-20 text-center"
        style={{
          background: "linear-gradient(to right, #FEF9C3, #ffffff, #FEF3C7)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="md:text-4xl font-extrabold leading-tight">
            Who Are We?
          </h3>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            At TukTukDrive.com, we believe in the power of community-driven tourism. Our
            mission is to empower local TukTuk owners by connecting them with adventurous
            travelers seeking unique, self-drive experiences across the stunning landscapes of Sri
            Lanka. By choosing to ride with us, you are not just getting a fun and eco-friendly way to
            explore; you are contributing to the local economy and supporting communities who call
            this island home.
          </p>
        </div>
      </div>

      {/* Mission & Story */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6">
          <div className="bg-[#FFFBEB] rounded-xl shadow p-8 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our goal is simple: to provide an unforgettable, eco-conscious, and enriching
              journey through Sri Lanka, all while boosting the livelihoods of local TukTuk owners.
              We offer a self-drive experience that brings you closer to the heart of Sri Lanka, allowing
              you to explore the island in a way that is personal, immersive, and adventurous.
            </p>
          </div>
          <div className="bg-[#FFFBEB] rounded-xl shadow p-8 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Born out of a love for adventure and a commitment to sustainable tourism,
              TukTukDrive.com started with a single vision: to empower local TukTuk owners while
              offering travelers the chance to explore Sri Lanka in a truly authentic and fun way. What
              started as a small initiative has grown into a community-driven platform that brings
              travelers and locals together, promoting a more eco-friendly, inclusive, and enriching
              travel experience.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div
        className="py-20"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #FEF9C3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold">Why Choose TukTukDrive?</h3>
            <p className="mt-4 text-gray-700">
              Here is what makes your journey with us truly unforgettable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl p-6 text-center hover:scale-105 transform transition"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InstagramEmbedSection />

      {/* CTA */}
      <div
        className="py-20 text-center"
        style={{
          background: "linear-gradient(to right, #FEF3C7, #FFFBEB)",
        }}
      >
        <h3 className="text-3xl font-bold text-gray-900">
          Ready to Start Your Journey?
        </h3>
        <p className="mt-4 text-gray-700">
          Book your TukTuk today and explore Sri Lanka your way.
        </p>
        <a
          href="/#book"
          className="mt-6 inline-block px-6 py-3 rounded-full font-semibold text-white shadow hover:scale-105 transition"
          style={{
            background: "linear-gradient(to right, #facc15, #fde047)",
          }}
        >
          Book Now
        </a>
      </div>
    </section>
  );
}
