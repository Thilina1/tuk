"use client";

import { MapPin } from "lucide-react";

const locations = [
  "Airport", "Mount Lavinia", "Unawatuna", "Dickwella", "Mirissa", "Arugam Bay",
  "Negombo", "Galle", "Bentota", "Hiriketiya", "Kalpitiya", "Tangalle",
  "Ella", "Anuradhapura", "Polonnaruwa", "Kataragama", "Jaffna", "Trincomalee",
  "Colombo", "Hikkaduwa", "Sigiriya / Dambulla", "Kandy", "Nuwara Eliya"
];

export default function Locations() {
  return (
    <section
      className="relative pb-6 px-6 md:px-20 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #fef9c3, #ffffff)",
        colorScheme: "light",
        color: "#1e293b", // enforce text color
      }}
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/map-overlay.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Tagline */}
        <p
          className="text-sm font-semibold mt-1 uppercase tracking-wide"
          style={{ color: "#eab308" }} // yellow-500
        >
          Wherever You Land — We’re There
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-extrabold mt-2"
          style={{ color: "#1e293b" }} // slate-800
        >
          Island-Wide Pick-Up & Drop-Off Locations
        </h2>

        {/* Location Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto text-left">
          {locations.map((loc, i) => (
            <div
              key={i}
              className="flex items-center text-sm gap-2 p-2 rounded-md shadow-sm hover:shadow-md transition"
              style={{
                backgroundColor: "#ffffff",
                color: "#374151", // slate-700
                border: "1px solid #e5e7eb", // light border for contrast if needed
              }}
            >
              <MapPin className="w-4 h-4" style={{ color: "#eab308" }} />
              {loc}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
