"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ Added to fix navigation
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function TempleOfTheTooth() {
  return (
    <main className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 min-h-screen font-sans text-amber-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200 py-12 px-4 text-center shadow-sm">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-amber-700">
            🛕 Sacred Temple of the Tooth
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-amber-900">
            Discover Sri Lanka’s Holiest Buddhist Shrine
          </h1>
          <p className="mt-4 text-amber-800 text-sm md:text-base leading-relaxed">
            The Temple of the Sacred Tooth Relic, nestled in the heart of Kandy,
            is a spiritual beacon for Buddhists worldwide and a symbol of
            Sri Lanka’s cultural heritage.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-amber-900">
          <p>
            Known as &quot;Sri Dalada Maligawa,&quot; this revered temple enshrines the
            relic of the tooth of the Buddha — a sacred symbol of sovereignty
            and spiritual significance. The temple is not just a site of worship,
            but a cornerstone of Sri Lankan identity.
          </p>

          <Image
            src="/blog/kandyTemple.jpg"
            width={1200}
            height={700}
            alt="Kandy Lake"
            className="rounded-xl shadow-md my-8"
          />

          <p>
            As you step inside, you’re greeted by drummers, flickering oil lamps,
            and the scent of jasmine and incense. Devotees dressed in white offer
            lotus flowers and prayers, creating a peaceful and moving atmosphere.
          </p>

          <h2 className="text-amber-900">Cultural Legacy</h2>
          <p>
            The temple complex also houses the Royal Palace and Museum, offering
            visitors a glimpse into ancient Kandyan architecture, rituals, and
            artistry. Be sure to witness the daily Thevava ceremony — a
            rhythmic devotional offering that brings the temple to life.
          </p>

          <h2 className="text-amber-900">Esala Perahera Festival</h2>
          <p>
            If you visit during July or August, you’ll witness the spectacular
            Esala Perahera procession, where the tooth relic is paraded on a
            tusker’s back through candle-lit streets with dancers, drummers,
            and fire performers.
          </p>

          <p>
            A visit to the Temple of the Tooth is not just a sightseeing
            experience — it’s a spiritual journey into Sri Lanka’s heart and soul.
          </p>
        </article>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Share */}
          <div className="rounded-xl bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200 shadow p-6 text-center border border-amber-300">
            <h3 className="text-sm font-semibold text-amber-900 mb-4">
              Share this story
            </h3>

            <div className="flex justify-center gap-4">
              {[
                { icon: <FaXTwitter />, label: "Twitter" },
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaLinkedinIn />, label: "LinkedIn" },
                { icon: <FaWhatsapp />, label: "WhatsApp" },
              ].map(({ icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-300 text-amber-900 shadow hover:bg-amber-400 hover:scale-105 transition"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Booking promo */}
          <div className="rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-900">
                🛺 Visiting Kandy?
              </h3>
              <p className="mt-2 text-sm text-amber-800">
                Rent a tuk tuk and explore Kandy’s rich heritage and nearby
                sights at your own pace — flexible, fun, and local!
              </p>
            </div>
            <Link
              href="/#book"
              className="inline-block w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-600 transition"
              style={{
                backgroundImage: "linear-gradient(to right, #34d399, #10b981)",
              }}
            >
              🚀 Book Your TukTuk
            </Link>
          </div>

          {/* Pro Tips */}
          <div className="rounded-xl bg-white shadow-sm p-6">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">
              🌟 Pro Tips
            </h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc pl-5">
              <li>
                <strong>Arrive early ⏰</strong> – Beat the morning crowd and catch
                the Thevava ceremony for an authentic spiritual moment.
              </li>
              <li>
                <strong>Dress respectfully 🕊️</strong> – White attire is ideal.
                Shoulders and knees must be covered to enter the temple.
              </li>
              <li>
                <strong>Explore nearby 🏞️</strong> – After the temple, stroll
                around Kandy Lake or visit the nearby Royal Palace Museum.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
