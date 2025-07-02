"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import {
  FaFacebookF,
  FaGoogle,
  FaTripadvisor,
  FaInstagram,
} from "react-icons/fa";

export default function Reviews() {
  const ratings = useMemo(
    () => [
      {
        platform: "Facebook",
        score: "5.0",
        reviews: 88,
        icon: "/images/Facebook-Reviews.png",
      },
      {
        platform: "Google",
        score: "4.9",
        reviews: 985,
        icon: "/images/Google-Reviews.png",
      },
      {
        platform: "Tripadvisor",
        score: "5.0",
        reviews: 289,
        icon: "/images/TripAdvisor-Reviews.png",
      },
    ],
    []
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="py-20 px-6 overflow-hidden"
      style={{
        backgroundColor: "#f0bf37",
        colorScheme: "light",
        color: "#1a1a1a",
        filter: "none",
        mixBlendMode: "normal",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16"
        style={{ color: "#1a1a1a" }}
      >
        {/* Text Block */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-2 max-w-xl text-center md:text-left"
          style={{
            color: "#1a1a1a",
            backgroundColor: "transparent",
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            style={{ color: "#0f766e" }}
          >
            Trusted by Travellers 🚩
          </h2>

          <p
            className="text-lg font-medium mb-1"
            style={{ color: "#1f2937" }}
          >
            “TukTukDrive is amazing!”
          </p>
          <p
            className="text-base leading-relaxed mb-4"
            style={{ color: "#1f2937" }}
          >
            Read our recent reviews to discover why our customers adore us.
            We provide unparalleled travel experiences by crafting personalized
            itineraries, tips on how to travel like a local, and 24/7 support...
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            {[FaFacebookF, FaGoogle, FaTripadvisor, FaInstagram].map((Icon, i) => (
              <div
                key={i}
                className="p-3 rounded-full shadow hover:scale-110 transition duration-200 ease-in-out cursor-pointer"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f766e",
                  border: "2px solid rgba(15, 118, 110, 0.2)",
                }}
              >
                <Icon size={20} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ratings Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="order-2 md:order-1 flex flex-col items-center justify-center gap-4 md:gap-6"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {ratings.map((r, i) => (
              <motion.div
                key={r.platform}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="rounded-xl px-5 py-4 w-56 h-[90px] flex items-center justify-center shadow-md"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#171717",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={r.icon}
                  alt={`${r.platform} rating`}
                  width={200}
                  height={50}
                  loading="lazy"
                  className="object-contain"
                  style={{
                    filter: "none",
                    mixBlendMode: "normal",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
