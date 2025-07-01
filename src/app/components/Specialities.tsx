"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CalendarCheck,
  MapPin,
  ShieldCheck,
  BadgeDollarSign,
  Headphones,
  CreditCard,
} from "lucide-react";

const features = [
  {
    title: "Easy Booking",
    desc: "Book your perfect Sri Lankan ride in seconds – just pick your dates, location, and Tuk Tuk on our user-friendly platform!",
    icon: CalendarCheck,
  },
  {
    title: "Island-Wide Accessibility",
    desc: "Explore Sri Lanka hassle-free with our rentals — accessible island-wide from airports to local hubs.",
    icon: MapPin,
  },
  {
    title: "Safety First",
    desc: "Rigorous maintenance checks and strict hygiene for a secure travel experience.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden costs — what you see is what you get. Honest, clear pricing for all.",
    icon: BadgeDollarSign,
  },
  {
    title: "24/7 Customer Support",
    desc: "Always available for queries or emergencies during your journey.",
    icon: Headphones,
  },
  {
    title: "Secure Payment",
    desc: "Effortless booking through our safe, modern online payment system.",
    icon: CreditCard,
  },
];

export default function Specialities() {
  return (
    <section
      className="py-15 pb-4 px-10 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #fef3c7, #ffffff, #f8fafc)", // from-yellow-50 via-white to-slate-50
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Section: Features List */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold mb-2"
            style={{ color: "#0f172a" }} // text-slate-900
          >
            Our Specialities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm uppercase font-semibold mb-10 tracking-wide"
            style={{ color: "#facc15" }} // text-yellow-500
          >
            The most affordable and reliable tuk tuk rentals in Sri Lanka
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                className="flex items-start gap-4 hover:bg-[#fef3c7] rounded-lg p-3 transition"
              >
                <div
                  className="p-3 rounded-full shadow transition"
                  style={{ backgroundColor: "#fef08a" }} // bg-yellow-100
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{
                      color: "#ca8a04", // amber-600
                    }}
                  />
                </div>
                <div>
                  <h4
                    className="font-semibold text-base mb-1"
                    style={{ color: "#1e293b" }} // text-slate-800
                  >
                    {feature.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#4b5563" }} // text-gray-600
                  >
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Section: Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/hero/hero3.PNG"
              alt="TukTuk travelers"
              width={500}
              height={650}
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
