"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Rollmal Einen",
    country: "Germany",
    text: "We rented a TukTuk for about one month. Picked it up in Ella and brought it back to Colombo airport. It was fair priced and the people from TukTuk Drive were always helpful. 100% recommended :)",
    image: "/testimonials/2.png",
  },
  {
    name: "Sophie Müller",
    country: "Germany",
    text: "Tuk Tuk Drive made our adventure effortless. The team was super helpful and the experience was unforgettable.",
    image: "/testimonials/1.png",
  },
  {
    name: "Tharindu Perera",
    country: "Sri Lanka",
    text: "Even as a local, it felt incredible to explore my island this way. Highly recommended for travelers!",
    image: "/testimonials/3.png",
  },
];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

export default function Testimonials() {
  return (
    <section
      className="pt-14 py-8 pb-13 px-6"
      style={{
        background: "linear-gradient(to bottom, #fef3c7, #ffffff)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: "#ca8a04" }} // amber-600
          >
            Traveler Voices
          </h3>
          <h2
            className="text-4xl font-extrabold mt-1"
            style={{ color: "#1e293b" }} // slate-800
          >
            Real Stories from the Road
          </h2>
          <p
            className="mt-4 max-w-2xl mx-auto"
            style={{ color: "#4b5563" }} // gray-600
          >
            Hear from travelers who embraced the freedom of the tuk tuk life and discovered Sri Lanka their own way.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative p-6 rounded-2xl shadow-md border hover:shadow-xl transition transform hover:-translate-y-1"
              style={{
                backgroundImage: "url('/testimonials/coconut-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgba(255,255,255,0.9)",
                backgroundBlendMode: "overlay",
                borderColor: "#fef3c7", // border-yellow-100
              }}
            >
              {/* Quote icon */}
              <FaQuoteLeft
                className="absolute top-4 left-4 text-xl opacity-30"
                style={{ color: "#fde68a" }} // yellow-300
              />

              {/* Content */}
              <div className="flex flex-col items-center text-center">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover mb-4 border-4"
                  style={{ borderColor: "#facc15" }} // yellow-400
                />

                {/* Star rating */}
                <div className="flex justify-center gap-1 mb-2" style={{ color: "#facc15" }}>
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <FaStar key={j} size={14} />
                    ))}
                </div>

                <p
                  className="text-sm italic mb-4 leading-relaxed"
                  style={{ color: "#374151" }} // gray-700
                >
                  “{t.text}”
                </p>
                <h4
                  className="font-semibold"
                  style={{ color: "#7e22ce" }} // purple-700
                >
                  {t.name}
                </h4>
                <span className="text-xs" style={{ color: "#6b7280" }}>
                  {t.country}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
