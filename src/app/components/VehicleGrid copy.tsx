"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Image from "next/image";

const vehicles = [
  {
    price: "FROM $18/DAY",
    desc: "Silent, emission-free tuk tuk with 150km range and automatic gearbox.",
    image: "/tukTuk/BlueETX.png",
  },
  {
    name: "CABRIOTUK",
    price: "FROM $16/DAY",
    desc: "Open-roof adventure tuk tuk — perfect for tropical vibes and panoramic views.",
    image: "/tukTuk/convertETuk.png",
  },
  {
    name: "REGULARTUK",
    price: "FROM $12/DAY",
    desc: "The classic. Simple, rugged, and built for local adventures across the island.",
    image: "/tukTuk/RegularTukTuk.png",
  },
];

const extras = [
  { name: "Train Transfer", icon: "/icons/train.png" },
  { name: "Local License", icon: "/icons/License.png" },
  { name: "Full-Time Driver", icon: "/icons/Driver.png" },
  { name: "Surf-Board Rack", icon: "/icons/surfboard.png" },
  { name: "Bluetooth Speakers", icon: "/icons/speaker.png" },
  { name: "Cooler Box", icon: "/icons/cooler.png" },
  { name: "Baby Seat", icon: "/icons/babyseat.png" },
];

export default function Vehicles() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  return (
    <section className="relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 py-24 px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h3 className="text-sm font-semibold text-yellow-600 uppercase">
            Travel Like a Local
          </h3>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-1">
            Our Tuk Tuks
          </h2>
          <p className="text-slate-600 mt-4 max-w-xl mx-auto">
            Pick your ride and pack the extras — we’ve got the ultimate
            adventure combo for you.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 px-2">
            {vehicles.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="min-w-[90%] sm:min-w-[55%] md:min-w-[33%] bg-white/80 backdrop-blur-lg border border-white/30 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={v.image}
                  alt={"v.name"}
                  width={800}
                  height={400}
                  className="w-full h-64 object-contain rounded-t-xl bg-white"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-purple-700">{v.name}</h4>
                  <p className="text-yellow-600 font-semibold mb-1">{v.price}</p>
                  <p className="text-sm text-slate-700">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={scrollPrev}
            className="bg-white text-slate-700 px-4 py-2 rounded shadow hover:bg-slate-100 transition"
          >
            ‹ Prev
          </button>
          <button
            onClick={scrollNext}
            className="bg-white text-slate-700 px-4 py-2 rounded shadow hover:bg-slate-100 transition"
          >
            Next ›
          </button>
        </div>

        {/* Extras */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h4 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              Add More Adventure
            </h4>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Tuk Tuk Extras</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mt-4">
              Customize your tuk tuk rental experience with extras that enhance
              convenience, comfort, and fun — all designed to make your journey
              unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {extras.map((e, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.04 * i }}
                className="bg-white/80 backdrop-blur-md border border-white/30 p-4 rounded-xl shadow hover:shadow-lg text-center w-full max-w-[140px] flex flex-col items-center transition-all"
              >
                <div className="bg-yellow-100 p-3 rounded-full shadow mb-3">
                  <Image src={e.icon} alt={e.name} width={36} height={36} />
                </div>
                <p className="text-sm font-medium text-slate-800">{e.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-20"
        >
          <button className="bg-gradient-to-r from-purple-700 to-yellow-400 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
