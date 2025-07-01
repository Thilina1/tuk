"use client";

export default function AboutUsHeader() {
  return (
    <footer
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/hero/island-life-desk-header.jpg')",
      }}
    >
      {/* Overlay for darker bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>

      {/* Optional Top Message */}
<section className="relative min-h-[270px] flex flex-col items-center justify-center text-center text-white">
  {/* Optional dark transparent overlay if needed */}
  <div className="absolute inset-0 bg-opacity-40 z-0" />

  {/* Text Content */}
  <div className="relative z-10">
  <h1 className="text-3xl font-bold">About Us</h1>
  <p className="mt-2 text-sm drop-shadow-md">
      Discover Sri Lanka at your own pace with TukTuk Drive — your partner in
      adventure, freedom, and unforgettable road trips.
    </p>
    <p className="text-xs text-yellow-400 mt-1 drop-shadow-md">
      Home &gt; About Us
    </p>
  </div>
</section>

    </footer>
  );
}
