"use client";

import Image from "next/image";
import Link from "next/link";
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
            A surfer&rsquo;s paradise and a peaceful beachside retreat — Arugam Bay is where the rhythm of the ocean meets Sri Lanka&rsquo;s east coast charm.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
            Arugam Bay isn&rsquo;t just about surfing — it&rsquo;s an adventure basecamp surrounded by raw beauty, rich biodiversity, and hidden cultural gems waiting to be explored.
          </p>

          <h2>🏄‍♀️ Surf All Day</h2>
          <p>
            Whether you&rsquo;re a beginner or a pro, the waves at Arugam Bay cater to all levels. Surf hotspots like <strong>Main Point</strong>, <strong>Peanut Farm</strong>, and <strong>Whiskey Point</strong> offer different styles of breaks and crowd levels. Sunrise sessions are especially magical with soft light and glassy waves.
          </p>

          <Image
            src="/blog/arugambay.jpg"
            width={1200}
            height={700}
            alt="Surfing in Arugam Bay"
            className="rounded-xl shadow-md my-8"
          />

          <h2>🌿 Explore the Wild Side</h2>
          <p>
            Just a short tuk-tuk ride away, <strong>Kumana National Park</strong> (Yala East) offers a quieter safari experience. Home to elephants, leopards, crocs, and hundreds of bird species, it&rsquo;s ideal for wildlife lovers seeking an off-the-beaten-path adventure.
          </p>
          <p>
            Nearby, the <strong>Lahugala Kitulana National Park</strong> is a hidden gem where herds of elephants gather around the tank during dry season evenings — a sight few tourists get to see.
          </p>

          <h2>🛶 Pottuvil Lagoon Safari</h2>
          <p>
            Drift through a maze of mangroves at golden hour. With calm waters reflecting the sky and monkeys swinging overhead, a <strong>canoe safari on Pottuvil Lagoon</strong> is serene, surreal, and unforgettable. Keep your eyes open for water monitors, eagles, and even elephants near the edge.
          </p>

          <Image
            src="/blog/blogPost/arugambay (1).jpg"
            width={1200}
            height={700}
            alt="Lagoon Safari"
            className="rounded-xl shadow-md my-8"
          />

          <h2>⛰️ Elephant Rock Cliff Hike</h2>
          <p>
            This one&rsquo;s for the explorers. Take a short hike up <strong>Elephant Rock</strong>, especially around sunrise or sunset. The 360° coastal view is jaw-dropping. It&rsquo;s also a good spot to watch surfers from above or chill in solitude with a breeze.
          </p>

          <h2>🛕 Hidden History at Muhudu Maha Viharaya</h2>
          <p>
            Just outside Pottuvil lies <strong>Muhudu Maha Viharaya</strong>, a coastal Buddhist temple partially buried in sand dunes. Ancient ruins, weathered statues, and coastal legends make it a peaceful yet powerful stop for cultural explorers.
          </p>

          <Image
            src="/blog/blogPost/arugambay (2).jpg"
            width={1200}
            height={700}
            alt="Muhudu Maha Viharaya"
            className="rounded-xl shadow-md my-8"
          />

          <h2>🧘‍♀️ Start Slow, Stay Present</h2>
          <p>
            Begin your mornings with <strong>beachside yoga</strong>, then explore local village roads by bicycle or tuk-tuk. You&rsquo;ll find scenic rice fields, wild peacocks, and genuine smiles from the local community. Arugam Bay is where you slow down, breathe deep, and reconnect.
          </p>

          <p className="font-semibold text-xl mt-8 text-sky-800">
            Arugam Bay isn&rsquo;t just a beach — it&rsquo;s a lifestyle. 🌴
          </p>
        </article>

        {/* Sidebar */}
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
              href="https://www.tuktukdrive.com/"
              className="inline-block w-full bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-sky-600 transition"
              style={{
                backgroundImage: "linear-gradient(to right, #0ea5e9, #06b6d4)",
              }}
            >
              🏃‍♀️ Book Your Arugam Ride
            </Link>
         
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
                <strong>Watch the sunrise from the water:</strong> Take your board out before 7 AM.
              </li>
              <li>
                <strong>Bring binoculars:</strong> For spotting eagles and elephants during lagoon safaris.
              </li>
              <li>
                <strong>Respect local customs:</strong> Especially near temples and villages.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
