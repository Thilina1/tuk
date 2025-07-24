"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

export default function BookingProcess() {
  const steps = useMemo(
    () => [
      {
        number: "01",
        title: "Select Your Location",
        desc: "Choose pickup and return locations, dates, and times for your trip.",
        icon: "/icons/location.png",
      },
      {
        number: "02",
        title: "Choose A TukTuk",
        desc: "Pick a tuk tuk and optional add-ons like speakers or baby seats.",
        icon: "/icons/tuktuk.png",
      },
      {
        number: "03",
        title: "Book Your TukTuk",
        desc: "Confirm online. No sign-up required — just a booking link to manage everything.",
        icon: "/icons/confirm.png",
      },
    ],
    []
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stepFadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="bg-gradient-to-b from-blue-50 to-white pt-8 pb-14 px-6"
      style={{
        colorScheme: "light",
        backgroundColor: "#f0f9ff", // fallback for blue-50
        color: "#1a1a1a",
      }}
    >
      <div
        className="pt-5 max-w-6xl mx-auto text-center"
        style={{ color: "#1a1a1a" }}
      >
        <p className="text-sm text-yellow-500 font-semibold mt-1 uppercase tracking-wide">
          It’s so easy
        </p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold"
          style={{ color: "#1e293b" }} // slate-800
        >
          Booking Process
        </motion.h2>

        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl font-semibold mt-6"
          style={{ color: "#334155" }} // slate-700
        >
          No User Registration Required
        </motion.h3>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base max-w-2xl mx-auto mt-4 leading-relaxed"
          style={{ color: "#4b5563" }} // gray-600
        >
          Booking your tuk tuk with TukTuk Drive is quick and simple — no account needed.
          Just pick your location, select your tuk tuk, add extras if needed, and pay
          securely online. You’ll receive a private link to manage your booking anytime.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-16"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepFadeUp}
              className="flex flex-col items-center text-center rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300"
              style={{
                backgroundColor: "#ffffff",
                color: "#1e293b"
              }}
            >
              <div className="relative mb-5">
                <div
                  className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fef08a" }} // yellow-100
                >
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={44}
                    height={44}
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 animate-ping rounded-full opacity-10"
                  style={{ backgroundColor: "#fde047" }} // yellow-300
                />

                <div
                  className="absolute -top-2 -right-2 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2"
                  style={{
                    backgroundColor: "#facc15", // yellow-400
                    borderColor: "#ffffff",
                  }}
                >
                  {step.number}
                </div>
              </div>

              <h4 className="text-lg font-bold mb-2">{step.title}</h4>
              <p className="text-sm max-w-xs" style={{ color: "#4b5563" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
