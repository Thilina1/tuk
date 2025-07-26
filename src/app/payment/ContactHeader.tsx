"use client";

export default function ContactHeader() {
  return (
    <header
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/hero/island-life-desk-header.jpg')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-0"></div>

      {/* Text Section */}
      <section className="relative min-h-[270px] flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">Contact Us</h1>
        <p className="mt-2 text-sm md:text-base drop-shadow-md max-w-xl">
          Discover Sri Lanka at your own pace with TukTuk Drive — your partner in
          adventure, freedom, and unforgettable road trips.
        </p>
        <p className="text-xs text-yellow-400 mt-1 drop-shadow-md">Home &gt; Contact Us</p>
      </section>
    </header>
  );
}
