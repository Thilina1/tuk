"use client";

import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import Link from "next/link";

export default function EsalaPeraheraPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.colorScheme = "light";
  }, []);

  return (
    <>
      <Head>
        <meta name="color-scheme" content="light only" />
        <title>Esala Perahera | Tuk Tuk Drive</title>
      </Head>

      <div className="light bg-white text-gray-800">
        <main className="bg-white text-gray-800 min-h-screen font-sans">
          {/* Hero */}
          <section
            className="relative py-12 px-4 text-center shadow-sm"
            style={{
              background: "linear-gradient(to right, #fef3c7, #fde68a, #fcd34d)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs tracking-widest uppercase text-amber-700">
                🐘 Esala Perahera Festival
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
                Kandy Esala Perahera: Sacred Splendor in Motion
              </h1>
              <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
                Witness Sri Lanka’s most iconic cultural procession — a dazzling fusion of devotion, tradition, elephants, fire dancers, and drummers in the heart of Kandy.
              </p>
            </div>
          </section>

          {/* Layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
            {/* Main content */}
            <article className="prose prose-lg max-w-none text-gray-700">
              <p>
                The Esala Perahera is one of the oldest and grandest religious festivals in Asia, held annually in Kandy to honor the Sacred Tooth Relic of Lord Buddha. It spans over ten nights with ever-growing pageantry, culminating in the awe-inspiring Randoli Perahera.
              </p>

              <Image
                src="/blog/esala perahara.jpg"
                width={1200}
                height={700}
                alt="Esala Perahera Festival in Kandy"
                className="rounded-xl shadow-md my-8"
              />

              <h2>A Procession of Faith & Tradition</h2>
              <p>
                The festival features elaborately dressed elephants, fire dancers, whip crackers, traditional drummers, and Buddhist monks parading through the sacred city streets. At the heart of the procession is the majestic Maligawa Tusker carrying a replica of the Tooth Relic casket.
              </p>

              <h2>Cultural Immersion Like No Other</h2>
              <p>
                Every step, beat, and flickering flame tells a story of devotion passed through generations. The Perahera merges religion, art, and community into a moving spectacle of light, color, and spiritual energy.
              </p>

              <h2>When & Where?</h2>
              <p>
                The Esala Perahera takes place in **July or August** (Esala month in the lunar calendar) in **Kandy**, Sri Lanka. Events span 10 nights, including Kumbal and Randoli processions, each with increasing scale and grandeur.
              </p>

              <h2>What to Expect</h2>
              <ul>
                <li>✨ 100+ traditional dancers and musicians</li>
                <li>🐘 Decorated elephants in shimmering garments</li>
                <li>🔥 Fire jugglers and acrobatic performers</li>
                <li>📿 Spiritual chants and rituals from the Temple of the Tooth</li>
              </ul>

              <h2>Respect & Preparation</h2>
              <p>
                Modest attire is encouraged, and visitors should arrive early to secure viewing spots. Respect local customs and avoid flash photography during processions.
              </p>

              <p className="font-semibold text-xl mt-8 text-amber-700">
                Esala Perahera isn’t just a festival — it’s a spiritual journey under the stars. 🇱🇰✨
              </p>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Share */}
              <div
                className="rounded-2xl shadow p-6 text-center border border-amber-200"
                style={{
                  background:
                    "linear-gradient(to bottom right, #fde68a, #fff7ed, #fde68a)",
                }}
              >
                <h3 className="text-sm font-semibold text-amber-900 mb-4">
                  Share this story
                </h3>
                <div className="flex justify-center gap-4">
                  {[FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      aria-label="Share"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-300 text-amber-900 shadow hover:bg-amber-400 hover:scale-105 transition"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Book Now */}
              <div className="text-center bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl p-6 shadow-lg">
                <Link
                  href="/#book"
                  className="inline-block w-full bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition"
                  style={{
                    backgroundImage: "linear-gradient(to right, #fb923c, #fbbf24)",
                  }}
                >
                  🐘 Book Your Cultural Ride
                </Link>
                <p className="text-sm text-white mt-2">
                  No upfront payment required to witness the tradition.
                </p>
              </div>

              {/* Pro Tips */}
              <div
                className="rounded-xl shadow-sm p-6"
                style={{ backgroundColor: "#fff7ed" }}
              >
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  🌟 Pro Tips
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                  <li>
                    <strong>Book in advance 📅</strong> – The city gets packed early during festival week.
                  </li>
                  <li>
                    <strong>Dress respectfully 👕</strong> – It’s a religious celebration, so modest attire is ideal.
                  </li>
                  <li>
                    <strong>Stay central 🏙️</strong> – Find a spot near Temple Street for best viewing.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
