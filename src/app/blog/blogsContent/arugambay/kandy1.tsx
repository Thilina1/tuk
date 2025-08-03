"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ Added for Next.js navigation
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function ArugamBay() {
  return (
    <main className="bg-white min-h-screen font-sans text-gray-800">
      {/* Hero */}
      <section
        className="relative py-12 px-4 text-center shadow-sm"
        style={{
          background: "linear-gradient(to right, #bae6fd, #7dd3fc, #38bdf8)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-sky-800">
            🏄‍♂️ Arugam Bay Escape
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
            Ride the Waves &amp; Embrace the Coastal Vibes
          </h1>
          <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
            A surfer&#39;s paradise and a peaceful beachside retreat — Arugam Bay is where the rhythm of the ocean meets Sri Lanka&#39;s east coast charm.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
            Arugam Bay, located on the southeast coast, is world-renowned for its perfect right-hand point breaks. Whether you&#39;re a pro surfer or a curious beginner, the waves here welcome everyone.
          </p>

          <Image
            src="/blog/blogPost/sigiriya.jpg"
            width={1200}
            height={700}
            alt="Surfing in Arugam Bay"
            className="rounded-xl shadow-md my-8"
          />

          <p>
            Beyond the surf, the village atmosphere offers laid-back cafés, colorful guesthouses, and a welcoming community of locals and travelers. It&#39;s the perfect blend of adventure and relaxation.
          </p>

          <h2>Chill &amp; Explore</h2>
          <p>
            Don’t miss sunrise yoga sessions, scenic lagoon safaris, and a ride to Elephant Rock for breathtaking coastal views. Arugam Bay is also a gateway to untouched wildlife and mangrove ecosystems.
          </p>

          <h2>Nightlife &amp; Culture</h2>
          <p>
            As the sun sets, beach bonfires light up and reggae beats take over. It&#39;s a place where strangers become friends over seafood BBQ and coconut cocktails under the stars.
          </p>

          <p>
            Arugam Bay isn&#39;t just a destination — it&#39;s a vibe. A barefoot journey of freedom, connection, and unforgettable tropical experiences.
          </p>
        </article>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Share */}
          <div
            className="rounded-2xl shadow p-6 text-center border border-sky-200"
            style={{
              background:
                "linear-gradient(to bottom right, #bae6fd, #e0f2fe, #7dd3fc)",
            }}
          >
            <h3 className="text-sm font-semibold text-sky-900 mb-4">
              Share this story
            </h3>
            <div className="flex justify-center gap-4">
              {[FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Share"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-300 text-sky-900 shadow hover:bg-sky-400 hover:scale-105 transition"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Book Now */}
          <div className="text-center bg-gradient-to-r from-sky-400 to-cyan-500 rounded-xl p-6 shadow-lg">
            <Link
              href="/#book"
              className="inline-block w-full bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-sky-600 transition"
              style={{
                backgroundImage: "linear-gradient(to right, #0ea5e9, #06b6d4)",
              }}
            >
              🏃‍♀️ Book Your Arugam Ride
            </Link>
            <p className="text-sm text-white mt-2">
              No upfront payment needed to start the adventure.
            </p>
          </div>

          {/* Pro Tips */}
          <div
            className="rounded-xl shadow-sm p-6"
            style={{ backgroundColor: "#e0f2fe" }}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              🌟 Pro Tips
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>
                <strong>Catch the early waves 🌊</strong> – The best surf is
                before 9 AM, with fewer crowds and smooth rides.
              </li>
              <li>
                <strong>Try roti &amp; kottu 🌮</strong> – Don’t miss local
                beachside eateries for fresh, spicy Sri Lankan food.
              </li>
              <li>
                <strong>Explore by tuk tuk 🚙</strong> – Visit Peanut Farm,
                Whisky Point, and Panama Beach at your own pace.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
