"use client";

import { useMemo } from "react";
import Image from "next/image";

export default function Vehicles() {
  const vehicles = useMemo(() => [
    {
      name: "REGULAR TUK",
      price: "FROM $12/DAY",
      desc: "The classic. Simple, rugged, and built for local adventures across the island.",
      image: "/tukTuk/RegularTuk.png",
      bgColor: "#0c4a6e",
      manual: true,
      topOffset: "-160px", // Adjusted for large 800x800 image
      imageWidth: 800,
      imageHeight: 800,
    },
    {
      name: "ELECTRIC TUKTUK",
      price: "FROM $18/DAY",
      desc: "Silent, emission-free tuk tuk with 150km range and automatic gearbox.",
      image: "/tukTuk/BlueETX.png",
      bgColor: "#0c4a6e", // Adjusted for larger 650x650 image
      manual: false,
      topOffset: "-140px",
      imageWidth: 650,
      imageHeight: 650,
    },
    {
      name: "CABRIO TUK",
      price: "FROM $16/DAY",
      desc: "Open-roof adventure tuk tuk — perfect for tropical vibes and panoramic views.",
      image: "/tukTuk/cabrio.png",
      bgColor: "#0c4a6e", // Adjusted for larger 750x750 image
      manual: true,
      topOffset: "-100px", // Adjusted for 550x550 image
      imageWidth: 550,
      imageHeight: 550,
    },
    {
      name: "Bikes",
      price: "FROM $12/DAY",
      desc: "The freedom machine. Auto gear, reliable, and perfect for exploring every corner of the island.",
      image: "/tukTuk/scuter.png", // Adjusted for larger 850x450 image
      bgColor: "#0c4a6e",
      manual: false,
      topOffset: "-120px",
      imageWidth: 650,
      imageHeight: 350,
    },
  ], []);

  return (
    <section
      className="hidden sm:block"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #fef9c3, #fef08a)",
        padding: "2rem 1rem",
      }}
    >
      <div className="max-w-7xl mx-auto pt-12">
     

        {/* Vehicle Display Grid */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((vehicle, i) => (
              <div
                key={i}
                className="relative rounded-2xl shadow-xl overflow-hidden flex flex-col items-center"
                style={{
                  backgroundColor: "transparent",
                  height: "480px", // Fixed total card height
                  width: "350px", // Increased card width
                }}
              >
                {/* Upper Transparent Section */}
                <div
                  className="w-full"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)", // Slightly more visible transparent section
                    backdropFilter: "blur(5px)",
                    borderRadius: "1rem 1rem 0 0",
                    height: "120px", // Small to accommodate larger images
                  }}
                ></div>

                {/* Lower Blue Section */}
                <div
                  className="w-full p-6 text-center relative"
                  style={{
                    backgroundColor: vehicle.bgColor,
                    color: "#ffffff",
                    borderRadius: "0 0 1rem 1rem",
                    height: "360px", // Still large to balance images and content
                  }}
                >
                  {/* Vehicle Image - Starting from Blue Section */}
                  <div
                    className="absolute left-1/2"
                    style={{
                      top: vehicle.topOffset, // Individual top offset
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  >
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      width={vehicle.imageWidth}
                      height={vehicle.imageHeight}
                      className="object-contain drop-shadow-2xl"
                      loading="lazy"
                    />
                  </div>

                  {/* Content below image */}
                  <div className="mt-20 text-center">
                    <h4 className="text-2xl font-bold mb-2">{vehicle.name}</h4>
                    <p style={{ color: "#fde047" }} className="text-lg font-semibold mb-3">
                      {vehicle.price}
                    </p>
                    <div className="flex justify-center items-center my-2 gap-3">
                      <span
                        className="text-sm uppercase px-3 py-1.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          color: "#ffffff",
                        }}
                      >
                        {vehicle.manual ? "MANUAL" : "AUTO"}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      {vehicle.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}