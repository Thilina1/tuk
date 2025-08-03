"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function Yala() {
  return (
    <main className="bg-white min-h-screen font-sans text-gray-800">
      {/* Hero */}
      <section
        className="relative py-12 px-4 text-center shadow-sm"
        style={{
          background: "linear-gradient(to right, #d1fae5, #a7f3d0, #6ee7b7)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-green-700">
            🐘 Yala National Park
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
            Into the Wild: Sri Lanka’s Untamed Treasure
          </h1>
          <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
            Explore Yala National Park — where leopards roam, elephants thunder,
            and nature speaks in its purest form.
          </p>
        </div>
      </section>

      {/* Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
            Yala, Sri Lanka’s second-largest and most visited national park, is a sprawling wilderness
            of dry forests, grasslands, and lagoons. It’s the ultimate safari destination for anyone
            seeking a close encounter with Sri Lanka’s rich wildlife.
          </p>

          <Image
            src="/blog/yala.jpg"
            width={1200}
            height={700}
            alt="Elephant at Yala National Park"
            className="rounded-xl shadow-md my-8"
          />

          <p>
            Home to one of the highest leopard densities in the world, Yala also shelters sloth bears,
            crocodiles, peacocks, spotted deer, and herds of majestic elephants. Early morning or late
            afternoon safaris increase your chances of spotting these elusive creatures.
          </p>

          <h2>Beyond the Safari</h2>
          <p>
            Yala isn’t just about the big game. Explore its sacred Buddhist ruins like Sithulpawwa
            Rock Temple, or enjoy birdwatching at the coastal lagoons and salt pans that attract
            flamingos and painted storks.
          </p>

          <h2>Unplug & Reconnect</h2>
          <p>
            With limited connectivity, Yala invites you to disconnect from the digital world and
            reconnect with nature. The rustle of the trees, the call of the wild, and the golden
            sunsets over the plains create an experience that stays with you long after the journey ends.
          </p>

          <p>
            Whether you&apos;re a wildlife enthusiast or a curious explorer, Yala offers raw, untamed adventure
            — a glimpse into nature’s majestic rhythm.
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Share */}
          <div
            className="rounded-2xl shadow p-6 text-center border border-green-200"
            style={{
              background: "linear-gradient(to bottom right, #d1fae5, #f0fdf4, #bbf7d0)",
            }}
          >
            <h3 className="text-sm font-semibold text-green-900 mb-4">
              Share this story
            </h3>
            <div className="flex justify-center gap-4">
              {[FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Share"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-green-300 text-green-900 shadow hover:bg-green-400 hover:scale-105 transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Book Now */}
          <div className="text-center bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl p-6 shadow-lg">
            <Link
              href="/#book"
              className="inline-block w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-600 transition"
              style={{
                backgroundImage: "linear-gradient(to right, #34d399, #10b981)",
              }}
            >
              🚀 Book Your TukTuk
            </Link>
            <p className="text-sm text-white mt-2">
              Rent a tuk tuk and ride to explore Yala!
            </p>
          </div>

          {/* Pro Tips */}
          <div
            className="rounded-xl shadow-sm p-6"
            style={{ backgroundColor: "#f0fdf4" }}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              🌟 Pro Tips
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>
                <strong>Book your safari early 🕖</strong> – Morning and evening
                drives offer the best wildlife sightings and cooler temps.
              </li>
              <li>
                <strong>Pack light but smart 🎒</strong> – Bring sunscreen, a hat,
                binoculars, and a camera with zoom.
              </li>
              <li>
                <strong>Respect the wild 🐾</strong> – Stay inside your vehicle,
                follow park rules, and never feed the animals.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
