"use client";

export default function BlogHeader() {
  return (
    <footer
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/blog/esala perahara.jpg')",
      }}
    >
      {/* Stronger bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black"></div>

      {/* Content section */}
      <section className="relative min-h-[200px] md:min-h-[270px] flex flex-col items-center justify-center text-center px-4">
        {/* Additional overlay to ensure readability */}
        <div className="absolute inset-0 bg-black opacity-40 z-0" />

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-md">
            Blog
          </h1>
          <p className="mt-2 text-sm md:text-base drop-shadow-md max-w-xl mx-auto">
            Discover Sri Lanka at your own pace with TukTuk Drive — your partner in
            adventure, freedom, and unforgettable road trips.
          </p>
          <p className="text-xs text-yellow-400 mt-2 drop-shadow-md">
            Home &gt; Blog
          </p>
        </div>
      </section>
    </footer>
  );
}
