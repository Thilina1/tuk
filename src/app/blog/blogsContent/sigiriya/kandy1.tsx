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

export default function SigiriyaPage() {
  useEffect(() => {
    // Ensure document root does not apply dark mode
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.colorScheme = "light";
  }, []);

  return (
    <>
      <Head>
        <meta name="color-scheme" content="light only" />
        <title>Sigiriya Rock Fortress | Tuk Tuk Drive</title>
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
      🏰 Sigiriya Rock Fortress
    </p>
    <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
      Sigiriya: The Lion Rock of Sri Lanka
    </h1>
    <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
      Discover the legendary rock fortress of Sigiriya, an ancient engineering marvel,
      royal citadel, and UNESCO World Heritage Site — nestled in the cultural heart of Sri Lanka.
    </p>
  </div>
</section>


          {/* Layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
            {/* Main content */}
            <article className="prose prose-lg max-w-none text-gray-700">
              <p>
                Sigiriya, often dubbed the Eighth Wonder of the World, is a majestic rock
                fortress rising nearly 200 meters above the surrounding plains. This UNESCO
                World Heritage Site is famed for its historical significance and breathtaking
                views.
              </p>

              <Image
                src="/blog/blogPost/sigiriya.jpg"
                width={1200}
                height={700}
                alt="Sigiriya Rock"
                className="rounded-xl shadow-md my-8"
              />

              <p>
                Built in the 5th century by King Kashyapa, Sigiriya includes the Mirror Wall,
                royal gardens, and the iconic frescoes of the Sigiriya Damsels — all showcasing
                the ancient kingdom’s artistry and ambition.
              </p>

              <h2>Architectural Brilliance</h2>
              <p>
                Its symmetrical water gardens, advanced hydraulic systems, and Lion’s Gate
                carved into the rock are marvels of early engineering. At the summit, ruins
                of the palace overlook endless jungle.
              </p>

              <h2>A Living Legacy</h2>
              <p>
                Sigiriya remains a symbol of Sri Lanka’s rich history and attracts explorers
                and history lovers from across the globe.
              </p>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Share */}
              <div
                className="rounded-2xl shadow p-6 text-center border border-amber-200"
                style={{
                  background: "linear-gradient(to bottom right, #fde68a, #fff7ed, #fde68a)",
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
                  🚀 Book Your TukTuk Now
                </Link>
                <p className="text-sm text-white mt-2">
                  No upfront payment required to get started.
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
                    <strong>Arrive early ⏰</strong> – Start your climb before 8 AM to
                    beat the heat and crowds.
                  </li>
                  <li>
                    <strong>Taste local snacks 🍢</strong> – Try fresh king coconut and
                    street food at the base.
                  </li>
                  <li>
                    <strong>Watch the sunset 🌅</strong> – Visit Pidurangala Rock nearby
                    for a panoramic golden hour view.
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
