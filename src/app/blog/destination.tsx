"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const destinations = [
  {
    name: "ELLA",
    description:
      "Located in Sri Lanka’s hill country, Ella is a scenic town offering breathtaking outdoor experiences.",
    image: "/blog/blogPost/demodara.jpeg",
  },
  {
    name: "MIRISSA",
    description:
      "A beautiful beach town perfect for surfing and whale watching on Sri Lanka’s southern coast.",
    image: "/blog/blogPost/mirissa.jpg",
  },
  {
    name: "KANDY",
    description:
      "Famous for the Temple of the Tooth, Kandy is a cultural capital surrounded by mountains.",
    image: "/blog/blogPost/kandy.jpeg",
  },
];

export default function DestinationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const current = destinations[currentIndex];

  return (
    <div className="light w-full flex flex-col md:flex-row gap-6 items-stretch px-4 py-12 bg-gradient-to-b from-white via-yellow-50 to-white text-gray-900">

      {/* Image FIRST on mobile, SECOND on desktop */}
      <div className="order-1 md:order-2 flex-1 relative rounded-2xl overflow-hidden shadow-lg border border-yellow-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.image}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={current.image}
              alt={current.name}
              width={800}
              height={400}
              className="object-cover w-full h-72 rounded-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-4 flex gap-3">
          <button
            onClick={goPrev}
            className="px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={goNext}
            className="px-3 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-md hover:shadow-lg transition duration-300 transform hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="Next"
          >
            →
          </button>
        </div>

        {/* Page Indicator */}
        <div className="absolute top-2 right-2 text-sm font-bold text-white bg-yellow-500 px-2 py-1 rounded-full shadow">
          {String(currentIndex + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Text SECOND on mobile, FIRST on desktop */}
      <div className="order-2 md:order-1 flex-1 flex flex-col justify-center bg-white/70 backdrop-blur-md border border-yellow-100 rounded-2xl p-6 shadow-md text-gray-800">
        <h3 className="text-xs font-semibold text-yellow-600 uppercase mb-1 tracking-wider">
          Featured Destination
        </h3>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">
          Explore Sri Lanka’s Hidden Gems
        </h2>
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          From lush highlands to ancient cities and pristine coasts, discover unique experiences
          across the island.
        </p>

        <div className="bg-white p-4 rounded-xl shadow-inner border border-yellow-200">
          <div className="flex items-center gap-2 mb-2 text-yellow-600">
            <MapPin className="w-5 h-5" />
            <h4 className="font-bold text-lg">{current.name}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">{current.description}</p>
          <button
  className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
  style={{
    backgroundColor: "#facc15", // yellow-400
    color: "#1f2937", // slate-800
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>
Read Details
</button>
        </div>
      </div>
    </div>
  );
}
