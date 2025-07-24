"use client";

import { useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Vehicles() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const vehicles = useMemo(() => [
    {
      name: "REGULAR TUK",
      price: "FROM $12/DAY",
      desc: "The classic. Simple, rugged, and built for local adventures across the island.",
      image: "/tukTuk/RegularTukTuk.png",
    },
    {
      name: "ELECTRIC TUKTUK",
      price: "FROM $18/DAY",
      desc: "Silent, emission-free tuk tuk with 150km range and automatic gearbox.",
      image: "/tukTuk/BlueETX.png",
    },
    {
      name: "CABRIO TUK",
      price: "FROM $16/DAY",
      desc: "Open-roof adventure tuk tuk — perfect for tropical vibes and panoramic views.",
      image: "/tukTuk/convertETuk.png",
    },
    {
      name: "Bikes",
      price: "FROM $12/DAY",
      desc: "The freedom machine. Auto gear, reliable, and perfect for exploring every corner of the island.",
      image: "/tukTuk/RegularTukTuk.png",
    },
  ], []);

  const leftExtras = [
    { name: "Train Transfer", icon: "/icons/train.png", description:"While you are traveling by train, We drive your tuk tuk with your luggages for you. Enjoy your train ride around Kandy, Ella, Nanuoya, Hatton, Haputale, Galle." },
    { name: "Full-Time Driver", icon: "/icons/Driver.png", description:"You can keep a full-time driver for your tuk tuk tour. No need to worry about driver's accommodation, FnB and also your local driver permit" },
    { name: "Surf-Board Rack", icon: "/icons/surfboard.png", description:"For beach lovers and adventurers. Securely transport your boards to Sri Lanka’s best surf spots." },
    { name: "Bluetooth Speakers", icon: "/icons/speaker.png", description:"Enhance your ride with your favorite tunes. Add fun to your ride with high-quality portable Bluetooth speaker." },
  ];

  const rightExtras = [
    { name: "Cooler Box", icon: "/icons/cooler.png", description: "Keep your drinks, snacks cold and fresh during long trips and sunny beach days." },
    { name: "Baby Seat", icon: "/icons/babyseat.png", description:"Travel safely with little ones on board. Designed to provide maximum protection and meet international safety standards." },
    { name: "Dash Cam", icon: "/icons/License.png", description:"Record your journey with a dash cam, ensuring safety and capturing scenic road trips." },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      style={{
        background: "linear-gradient(to bottom, #ffffff, #fef9c3, #fef08a)", // white to yellow-50/100
        paddingTop: "0.5rem",
        paddingBottom: "3.75rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div className="max-w-7xl mx-auto pt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h3 style={{ color: "#0f766e" }} className="text-sm font-semibold uppercase mb-1">
            Travel Like A Local
          </h3>
          <h2 style={{ color: "#0f172a" }} className="text-4xl font-extrabold mb-3">
            Our Vehicles
          </h2>
          <p style={{ color: "#475569" }}>
            Pick your ride and extras to make your journey unique!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Extras */}
          <div className="hidden md:flex flex-col gap-4">
            {leftExtras.map((extra, i) => (
              <motion.div
                key={extra.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #fef3c7", // border-yellow-200
                  height: "130px", // <-- Set fixed height here
                }}
              >
                <div style={{ backgroundColor: "#fef9c3" }} className="p-3 rounded-full shadow-md">
                  <Image src={extra.icon} alt={extra.name} width={40} height={40} />
                </div>
                <div>
                  <p style={{ color: "#1e293b" }} className="font-semibold">
                    {extra.name}
                  </p>
                  <p style={{ color: "#64748b" }} className="text-sm mt-1">
                    {extra.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Slideshow */}
          <div className="w-full">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {vehicles.map((vehicle, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="min-w-full rounded-xl shadow-xl p-6 text-center"
                    style={{ backgroundColor: "#0c4a6e", color: "#ffffff" 
                      
                    }} // bg-sky-900
                  >
                    <div className="flex justify-center items-center h-80 mb-4">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        width={320}
                        height={320}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="text-2xl font-bold">{vehicle.name}</h4>
                    <p style={{ color: "#fde047" }} className="font-semibold">
                      {vehicle.price}
                    </p>
                    <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                      {vehicle.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={scrollPrev}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#334155",
                }}
                className="px-4 py-2 rounded shadow hover:bg-slate-100 transition"
              >
                ‹ Prev
              </button>
              <button
                onClick={scrollNext}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#334155",
                }}
                className="px-4 py-2 rounded shadow hover:bg-slate-100 transition"
              >
                Next ›
              </button>
            </div>
          </div>

          {/* Right Extras */}
          <div className="hidden md:flex flex-col gap-4 ">
            {rightExtras.map((extra, i) => (
              <motion.div
                key={extra.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #fef3c7",
                  height: "130px"
                }}
              >
                <div style={{ backgroundColor: "#fef9c3" }} className="p-3 rounded-full shadow-md">
                  <Image src={extra.icon} alt={extra.name} width={40} height={40} />
                </div>
                <div>
                  <p style={{ color: "#1e293b" }} className="font-semibold">
                    {extra.name}
                  </p>
                  <p style={{ color: "#64748b" }} className="text-sm mt-1">
                  {extra.description}
                  </p>
                </div>
              </motion.div>
            ))}

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeUp}
  className="relative flex justify-center items-center p-4 rounded-xl shadow-sm"
  style={{
    backgroundImage: "url('/hero/cardBackground.PNG')", // update path
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "130px",
    border: "1px solid #fef3c7",
    overflow: "hidden",
  }}
>
  {/* Dark canvas overlay */}
  <div
    className="absolute inset-0 rounded-xl"
    style={{
      backgroundColor: "rgba(0,0,0,0.4)", // adjust darkness here
      zIndex: 1,
    }}
  />

  {/* Button */}
  <motion.button
    className="relative z-10 px-6 py-3 rounded-lg shadow-md font-semibold text-white flex items-center gap-2"
    style={{
      backgroundImage: "linear-gradient(to right, #fbbf24, #f97316)",
    }}
    onClick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  >
    Reserve Your Tuk
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: [0, 5, 10, 0] }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 1,
        ease: "easeInOut",
      }}
      className="inline-block"
    >
      👉
    </motion.span>
  </motion.button>
</motion.div>



          </div>

          {/* Mobile Extras (below slideshow) */}
          <div className="md:hidden flex flex-col gap-4 col-span-full mt-10">
            {[...leftExtras, ...rightExtras].map((extra,) => (
              <div
                key={extra.name}
                className="flex items-start gap-4 p-4 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #fef3c7",
                }}
              >
                <div style={{ backgroundColor: "#fef9c3" }} className="p-3 rounded-full shadow-md">
                  <Image src={extra.icon} alt={extra.name} width={40} height={40} />
                </div>
                <div>
                  <p style={{ color: "#1e293b" }} className="font-semibold">
                    {extra.name}
                  </p>
                  <p style={{ color: "#64748b" }} className="text-sm mt-1">
                  {extra.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
