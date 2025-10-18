"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Image from "next/image";
import { db } from "@/config/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";

interface VehicleStatus {
  isActive: boolean;
  deactivateUntil: Timestamp | null;
  basePrice: number | null;
  updatedAt?: Timestamp;
}

type VehicleType = "regularTukTuk" | "eTukTuk" | "cambioTukTuks" | "scooterBikes";

const COLLECTION = "vehicleStatus";

export default function Vehicles() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [vehicleStatuses, setVehicleStatuses] = useState<Record<VehicleType, VehicleStatus>>({
    regularTukTuk: { isActive: true, deactivateUntil: null, basePrice: null },
    eTukTuk: { isActive: false, deactivateUntil: null, basePrice: null },
    cambioTukTuks: { isActive: false, deactivateUntil: null, basePrice: null },
    scooterBikes: { isActive: false, deactivateUntil: null, basePrice: null },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vehicle statuses from Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const newStatuses: Record<VehicleType, VehicleStatus> = { ...vehicleStatuses };
        const vehicleTypes: VehicleType[] = ["regularTukTuk", "eTukTuk", "cambioTukTuks", "scooterBikes"];

        for (const id of vehicleTypes) {
          const docRef = doc(db, COLLECTION, id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as VehicleStatus;
            newStatuses[id] = {
              isActive: data.isActive ?? true,
              deactivateUntil: data.deactivateUntil ?? null,
              basePrice: data.basePrice ?? null,
              updatedAt: data.updatedAt,
            };
          }
        }

        setVehicleStatuses(newStatuses);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load vehicle statuses from Firestore.";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  // Map vehicle types to UI names and integrate Firestore data
  const vehicles = useMemo(
    () => [
      {
        name: "REGULAR TUK",
        type: "regularTukTuk" as VehicleType,
        defaultPrice: "FROM $12/DAY",
        desc: "The classic. Simple, rugged, and built for local adventures across the island.",
        image: "/tukTuk/RegularTuk.png",
      },
      {
        name: "ELECTRIC TUKTUK",
        type: "eTukTuk" as VehicleType,
        defaultPrice: "FROM $18/DAY",
        desc: "Silent, emission-free tuk tuk with 150km range and automatic gearbox.",
        image: "/tukTuk/BlueETX.png",
      },
      {
        name: "CABRIO TUK",
        type: "cambioTukTuks" as VehicleType,
        defaultPrice: "FROM $16/DAY",
        desc: "Open-roof adventure tuk tuk — perfect for tropical vibes and panoramic views.",
        image: "/tukTuk/cabrio.png",
      },
      {
        name: "BIKES",
        type: "scooterBikes" as VehicleType,
        defaultPrice: "FROM $12/DAY",
        desc: "The freedom machine. Auto gear, reliable, and perfect for exploring every corner of the island.",
        image: "/tukTuk/scuter.png",
      },
    ],
    []
  );

  // Function to check if vehicle is active
  const isVehicleActive = (vehicleType: VehicleType) => {
    const status = vehicleStatuses[vehicleType];
    if (!status.isActive) return false;
    if (!status.deactivateUntil) return true;
    const now = new Date();
    const deactivateDate = status.deactivateUntil.toDate();
    return now > deactivateDate;
  };

  // Function to get price or "Coming Soon"
  const getPriceDisplay = (vehicleType: VehicleType, defaultPrice: string) => {
    if (!isVehicleActive(vehicleType)) {
      return "Coming Soon";
    }
    const basePrice = vehicleStatuses[vehicleType].basePrice;
    return basePrice !== null ? `FROM $${basePrice}/DAY` : defaultPrice;
  };

  const leftExtras = [
    {
      name: "Train Transfer",
      icon: "/icons/train.png",
      description:
        "While you are traveling by train, We drive your tuk tuk with your luggages for you. Enjoy your train ride around Kandy, Ella, Nanuoya, Hatton, Haputale, Galle.",
    },
    {
      name: "Full-Time Driver",
      icon: "/icons/Driver.png",
      description:
        "You can keep a full-time driver for your tuk tuk tour. No need to worry about driver's accommodation, FnB and also your local driver permit.",
    },
    {
      name: "Surf-Board Rack",
      icon: "/icons/surfboard.png",
      description: "For beach lovers and adventurers. Securely transport your boards to Sri Lanka’s best surf spots.",
    },
    {
      name: "Bluetooth Speakers",
      icon: "/icons/speaker.png",
      description: "Enhance your ride with your favorite tunes. Add fun to your ride with high-quality portable Bluetooth speaker.",
    },
  ];

  const rightExtras = [
    {
      name: "Cooler Box",
      icon: "/icons/cooler.png",
      description: "Keep your drinks, snacks cold and fresh during long trips and sunny beach days.",
    },
    {
      name: "Baby Seat",
      icon: "/icons/babyseat.png",
      description:
        "Travel safely with little ones on board. Designed to provide maximum protection and meet international safety standards.",
    },
    {
      name: "Dash Cam",
      icon: "/icons/License.png",
      description: "Record your journey with a dash cam, ensuring safety and capturing scenic road trips.",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };



  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg text-gray-600 flex items-center gap-2 animate-pulse">
          <svg
            className="h-5 w-5 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Loading vehicle statuses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg text-red-600 flex items-center gap-2">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <section
      style={{
        background: "linear-gradient(to bottom, #ffffff, #fef9c3, #fef08a)",
        paddingTop: "4rem",
        paddingBottom: "6rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h3 style={{ color: "#0f766e" }} className="text-base font-semibold uppercase mb-2 tracking-wide">
            Travel Like A Local
          </h3>
          <h2 style={{ color: "#0f172a" }} className="text-5xl font-extrabold mb-4 leading-tight">
            Our Vehicles
          </h2>
          <p style={{ color: "#475569" }} className="text-lg">
            Pick your ride and <span className="font-medium text-teal-700">exciting extras</span> to make your journey truly unique!
          </p>
        </motion.div>

        {/* Vehicle Cards Section */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.6 }}
              whileHover="hover"
              className="rounded-3xl shadow-xl overflow-hidden bg-white flex flex-col transform transition-all duration-300 ease-in-out"
            >
              <div className="relative h-60 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-7 flex flex-col flex-grow text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h4>
                <p
                  style={{ color: isVehicleActive(vehicle.type) ? "#0f766e" : "#dc2626" }}
                  className="font-extrabold text-lg mb-3"
                >
                  {getPriceDisplay(vehicle.type, vehicle.defaultPrice)}
                </p>
                <p style={{ color: "#64748b" }} className="text-base flex-grow leading-relaxed">
                  {vehicle.desc}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(20, 184, 166, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-7 py-3 rounded-xl font-bold text-white tracking-wide shadow-lg"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    background: isVehicleActive(vehicle.type)
                      ? "linear-gradient(to right, #fbbf24, #f97316)"
                      : "linear-gradient(to right, #9ca3af, #6b7280)", // Gray gradient for inactive
                    border: "none",
                    pointerEvents: isVehicleActive(vehicle.type) ? "auto" : "none", // Disable button for inactive
                  }}
                >
                  {isVehicleActive(vehicle.type) ? "Book Now" : "Unavailable"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slideshow and Extras */}
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
                  border: "1px solid #fef3c7",
                  height: "130px",
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
                    style={{ backgroundColor: "#0c4a6e", color: "#ffffff" }}
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
                    <p
                      style={{ color: isVehicleActive(vehicle.type) ? "#fde047" : "#dc2626" }}
                      className="font-semibold"
                    >
                      {getPriceDisplay(vehicle.type, vehicle.defaultPrice)}
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
          <div className="hidden md:flex flex-col gap-4">
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
                  height: "130px",
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
                backgroundImage: "url('/hero/cardBackground.PNG')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "130px",
                border: "1px solid #fef3c7",
                overflow: "hidden",
              }}
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  zIndex: 1,
                }}
              />
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

          {/* Mobile Extras */}
          <div className="md:hidden flex flex-col gap-4 col-span-full mt-10">
            {[...leftExtras, ...rightExtras].map((extra) => (
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