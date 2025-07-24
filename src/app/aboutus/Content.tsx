"use client";

import {
  FaHandshake,
  FaGlobeAsia,
  FaClock,
  FaLeaf,
} from "react-icons/fa";

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
      desc: "Venture into villages, scenic landscapes, and hidden gems you won t find in a guidebook.",
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
    <section className="bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-yellow-50 via-white to-yellow-100 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className=" md:text-4xl font-extrabold text-gray-900 leading-tight">
            Who Are We?.
          </h3>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
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
          <div className="bg-yellow-50 rounded-xl shadow p-8 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-gray-800 ">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
Our goal is simple: to provide an unforgettable, eco-conscious, and enriching
journey through Sri Lanka, all while boosting the livelihoods of local TukTuk owners.
We offer a self-drive experience that brings you closer to the heart of Sri Lanka, allowing
you to explore the island in a way that is personal, immersive, and adventurous.        
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow p-8 hover:shadow-lg transition">
            <h2 className="text-3xl font-bold text-gray-800 ">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
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
      <div className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-4">
            <h3 className="text-4xl font-bold text-gray-900">Why Choose TukTukDrive?</h3>
            <p className="mt-4 text-gray-600">
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
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-yellow-200 to-yellow-50 text-center">
        <h3 className="text-3xl font-bold text-gray-900">
          Ready to Start Your Journey?
        </h3>
        <p className="mt-4 text-gray-600">
          Book your TukTuk today and explore Sri Lanka your way.
        </p>
        <button className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold shadow hover:bg-yellow-600 transition">
          Book Now
        </button>
      </div>
    </section>
  );
}
