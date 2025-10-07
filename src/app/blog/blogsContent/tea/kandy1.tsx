"use client";

import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function CeylonTeaHarvestPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.colorScheme = "light";
  }, []);

  return (
    <>
      <Head>
        <meta name="color-scheme" content="light only" />
        <title>Harvest of Ceylon Tea | Tuk Tuk Drive</title>
      </Head>

      <div className="light bg-white text-gray-800">
        <main className="bg-white text-gray-800 min-h-screen font-sans">
          {/* Hero */}
          <section
            className="relative py-12 px-4 text-center shadow-sm"
            style={{
              background: "linear-gradient(to right, #dcfce7, #bbf7d0, #86efac)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs tracking-widest uppercase text-green-700">
                🍃 Ceylon Tea Harvest
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
                Harvesting Ceylon Tea: A Journey Through Sri Lanka’s Lush Hills
              </h1>
              <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
                Discover the story behind Sri Lanka’s world-famous tea — from hand-plucked leaves to your perfect cup.
              </p>
            </div>
          </section>

          {/* Layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
            {/* Main content */}
            <article className="prose prose-lg max-w-none text-gray-700">
              <h2>🏞️ A Landscape Built for Tea</h2>
              <p>
                Ceylon tea flourishes in Sri Lanka’s misty highlands — places like Nuwara Eliya,
                Ella, Haputale, and Hatton. These regions produce high-grown teas known for
                their bright, crisp character.
              </p>

              <Image
                src="/blog/blogPost/tea_land.jpeg"
                width={1200}
                height={700}
                alt="Ceylon tea estate"
                className="rounded-xl shadow-md my-8"
              />

              <h2>👩🏽‍🌾 The Harvesting Ritual</h2>
              <p>
                Tea plucking is done entirely by hand — typically by Tamil women in vibrant saris.
                With baskets on their backs, they carefully pluck the top two leaves and a bud,
                ensuring only the best go into your brew.
              </p>

              <h2>🏡 Visit a Tea Estate</h2>
              <p>
                Visit estates like Pedro, Dambatenne, or Mackwoods to walk through the gardens,
                witness tea processing, and taste a fresh cup of Ceylon’s finest.
              </p>

              <h2>📸 Cultural Vibes & Experiences</h2>
              <p>
                Explore the colonial-era history of tea, try plucking with locals, or take
                scenic train rides through endless green hills. Every step reveals the deep
                cultural connection Sri Lanka shares with tea.
              </p>

              <h2>📅 Best Time for the Harvest</h2>
              <p>
                March–May and August–October are peak harvesting seasons in the central hills.
                Weather’s pleasant, views are epic, and activity is in full swing.
              </p>

              <h2>🌍 More Than a Drink</h2>
              <p>
                Ceylon tea supports over a million Sri Lankans. From pickers to tasters, every
                cup represents generations of skill, hard work, and national pride.
              </p>

              <Link href="/blog/blogsContent/templeOfTooth">
                <button
                  className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
                  style={{
                    backgroundColor: "#facc15",
                    color: "#1f2937",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  Visit Post
                </button>
              </Link>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div
                className="rounded-2xl shadow p-6 text-center border border-green-200"
                style={{
                  background: "linear-gradient(to bottom right, #bbf7d0, #ecfdf5, #d1fae5)",
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

              <div className="text-center bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 shadow-lg">
                <Link
                  href="https://www.tuktukdrive.com/"
                  className="inline-block w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-600 transition"
                  style={{
                    backgroundImage: "linear-gradient(to right, #22c55e, #10b981)",
                  }}
                >
                  🍃 Book Your Tea Trail
                </Link>
                <p className="text-sm text-white mt-2">
                  Taste the legacy with no upfront cost.
                </p>
              </div>

              <div
                className="rounded-xl shadow-sm p-6"
                style={{ backgroundColor: "#ecfdf5" }}
              >
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  🌟 Pro Tips
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                  <li><strong>Travel by train 🚂</strong> – Best views from Kandy to Ella.</li>
                  <li><strong>Pack a light jacket 🧥</strong> – Hill country gets chilly in the evening.</li>
                  <li><strong>Talk to locals 🗣️</strong> – Learn real stories from pickers and estate workers.</li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
