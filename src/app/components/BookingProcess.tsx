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

  const stepCardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    hover: {
      y: -8, // Lift more on hover
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05)", // More pronounced shadow
      borderColor: "rgba(251, 191, 36, 0.6)", // yellow-400 with some opacity
      transition: { duration: 0.2 },
    },
  };

  return (
    <section
      className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans overflow-hidden" // Brighter, more dynamic gradient
    >
      {/* Subtle background particles/shapes for visual interest */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40"> {/* Increased opacity slightly */}
        <div className="absolute w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl -top-10 -left-10 animate-float-light"></div>
        <div className="absolute w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply blur-3xl bottom-1/4 right-5 animate-float-light animation-delay-2000"></div>
        <div className="absolute w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-light animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <p className="text-sm text-yellow-600 font-bold uppercase tracking-widest mb-3"> {/* Stronger yellow, bolder, more tracking */}
          Effortless Journey
        </p>

        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-gray-900 leading-tight drop-shadow-sm" // Darker text, drop shadow
        >
          Our Simple <span className="text-yellow-500">Booking Process</span>
        </motion.h3>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg max-w-3xl mx-auto mt-6 leading-relaxed text-gray-700" // Larger, darker paragraph text
        >
          Booking your tuk tuk with TukTuk Drive is quick and simple —{" "}
          <span className="font-bold text-gray-900">no account needed</span>.
          Just pick your location, select your tuk tuk, add extras if needed, and pay
          securely online. You’ll receive a private link to manage your booking anytime.
        </motion.p>
        {/* Removed "No User Registration Required" h3 as it's integrated into the paragraph */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Trigger earlier
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20" // Slightly wider gap, always 3 columns on md and up
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepCardVariants}
              whileHover="hover"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center rounded-2xl p-8 bg-white/60 shadow-xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 transform-gpu cursor-pointer"
              style={{
                backdropFilter: 'blur(10px) saturate(180%)', // The "glazy" effect
                WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari support
              }}
            >
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 rounded-full shadow-md flex items-center justify-center bg-yellow-100/70 border border-yellow-200" // Slightly transparent yellow background
                >
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={52} // Larger icon size
                    height={52}
                    loading="lazy"
                  />
                </div>

                {/* No ping animation for a cleaner look */}
                {/* <div className="absolute inset-0 animate-ping rounded-full opacity-10" style={{ backgroundColor: "#fde047" }} /> */}

                <div
                  className="absolute -top-3 -right-3 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white" // Larger badge, more prominent
                  style={{
                    backgroundColor: "#fbbf24", // yellow-400
                  }}
                >
                  {step.number}
                </div>
              </div>

              <h4 className="text-xl font-bold mb-3 text-gray-900 leading-snug">
                {step.title}
              </h4>
              <p className="text-base max-w-sm leading-relaxed text-gray-600"> {/* Larger description text */}
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Embedded CSS for light background animations */}
      <style jsx>{`
        @keyframes float-light {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -40px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 30px) scale(0.98);
          }
        }

        .animate-float-light {
          animation: float-light 18s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}