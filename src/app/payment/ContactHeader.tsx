"use client";

import Link from "next/link";

export default function ContactHeader() {
  return (
    <header
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/hero/island-life-desk-header.jpg')",
      }}
    >
      {/* Stronger bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black z-0" />

      {/* Extra dark overlay for high contrast */}
      <div className="absolute inset-0 bg-black opacity-40 z-0" />

      {/* Text Section */}
      <section className="relative min-h-[200px] md:min-h-[270px] flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-md">
          🧾 Payment Cost Breakdown
        </h1>

        <p className="mt-2 text-sm md:text-base drop-shadow-md max-w-xl">
          Here&rsquo;s a transparent summary of all charges for your tuk-tuk adventure.
          No hidden fees — just pure travel freedom.
        </p>

        <p className="text-xs text-yellow-400 mt-2 drop-shadow-md">
          <Link href="/" className="hover:underline hover:text-yellow-100 transition">Home</Link> &gt; Payment
        </p>
      </section>
    </header>
  );
}
