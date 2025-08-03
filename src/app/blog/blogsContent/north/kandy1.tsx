"use client";

import Image from "next/image";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function NorthernSriLanka() {
  return (
    <main className="bg-white min-h-screen font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-yellow-50 py-12 px-4 text-center shadow-sm">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-orange-700">
            🌾 Northern Sri Lanka
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
            Discover Northern Sri Lanka – Culture, Resilience &amp; Untouched Beauty
          </h1>
          <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
            Explore a region rich in Tamil heritage, historic spirit, and peaceful coastal charm.
          </p>
        </div>
      </section>

      {/* Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
            Northern Sri Lanka feels like a world apart — a soulful region shaped by Tamil culture,
            layered history, and quiet strength. Far from the bustling south and hill country,
            the North moves to its own rhythm. It&rsquo;s where ancient temples echo with devotion,
            colonial forts whisper stories of the past, and long stretches of coastline invite peaceful reflection.
          </p>

          <Image
            src="/blog/blogPost/north.jpeg"
            width={1200}
            height={700}
            alt="Nallur Kandaswamy Temple in Jaffna"
            className="rounded-xl shadow-md my-8"
          />

          <p>
            At the heart of it all is Jaffna, the cultural capital of the Northern Province.
            With its vibrant markets, warm community, and deeply rooted Hindu traditions,
            it&rsquo;s the perfect starting point to experience Tamil heritage firsthand.
            The iconic Nallur Kandaswamy Temple, with its towering golden gopuram,
            stands as a spiritual and architectural marvel — a symbol of pride and devotion.
            Around it, the city pulses with life: fragrant dosas sizzling on street corners,
            young dancers practicing Bharatanatyam, and families gathering for festivals like Thai Pongal and Deepavali.
          </p>

          <p>
            Travel beyond Jaffna and you&rsquo;ll uncover even more layers. Kilinochchi and Mullaitivu,
            once shaped by conflict, now offer stories of survival and healing. Vavuniya blends traditions
            at the edge of the North, while Mannar surprises with colonial forts, Catholic churches, and sweeping salt flats.
            The nearby Delft Island is a time capsule of its own — home to coral walls, wild ponies, and windswept silence.
          </p>

          <p>
            Northern cuisine is bold and unforgettable. From spicy Jaffna crab curry to the traditional
            seafood stew Odiyal Kool, the flavors are as rich as the region&rsquo;s history.
            And while Tamil is the language of the land, you&rsquo;ll find that smiles and hospitality
            cross all borders here.
          </p>

          <p>
            Must-visit spots include the serene Casuarina Beach, the mystical Keerimalai Springs,
            and Point Pedro, the northernmost tip of the island. A ferry ride to Nagadeepa or Delft Island
            reveals a peaceful, spiritual world — far from tourist crowds, yet deeply rewarding.
          </p>

          <p className="text-amber-700 font-semibold text-xl mt-6">
            The North isn&rsquo;t just a destination — it&rsquo;s an awakening.
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Share Section */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 shadow p-6 text-center border border-orange-200">
            <h3 className="text-sm font-semibold text-orange-900 mb-4">Share this story</h3>
            <div className="flex justify-center gap-4">
              {[FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Share"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-200/40 text-orange-800 shadow hover:bg-orange-300/60 hover:scale-105 transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Booking Promo */}
          <div className="rounded-xl bg-orange-50 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-orange-800">🧭 Explore with Ease</h3>
              <p className="mt-2 text-sm text-gray-600">
                Ready to explore Sri Lanka&rsquo;s untouched North? Discover life off the beaten path
                with a tuk tuk at your side.
              </p>
            </div>
            <a
              href="/book"
              className="mt-4 inline-block text-center font-semibold bg-orange-400 text-orange-900 px-4 py-2 rounded-full shadow hover:bg-orange-300 transition"
            >
              Book Now →
            </a>
          </div>

          {/* Pro Tips */}
          <div className="rounded-xl bg-white shadow-sm p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🌟 Pro Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Respect temple dress codes (cover shoulders &amp; knees).</li>
              <li>Learn a few Tamil phrases — it goes a long way.</li>
              <li>Try local dishes — they&rsquo;re unforgettable.</li>
              <li>Keep cash on hand for island ferry rides and local markets.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
