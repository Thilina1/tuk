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
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-0" />

      {/* Text Content */}
      <section className="relative min-h-[300px] flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
          🧾 Payment Cost Breakdown
        </h1>

        <p className="mt-4 text-base md:text-lg max-w-2xl text-gray-100 drop-shadow-md">
  Here&rsquo;s a transparent summary of all charges for your tuk-tuk adventure. No hidden fees — just pure travel freedom.
</p>


        {/* Breadcrumb */}
        <div className="mt-4 text-sm text-yellow-300 flex items-center gap-2 drop-shadow-sm">
          <Link href="/" className="hover:underline hover:text-yellow-100 transition">Home</Link>
          <span>&gt;</span>
          <span className="text-yellow-400 font-medium">Payment</span>
        </div>
      </section>
    </header>
  );
}
