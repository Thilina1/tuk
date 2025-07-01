"use client";

import Image from "next/image";
import Destination from "./destination";

export default function BlogContent() {
  return (
    <section className="bg-white py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">

      {/* 🔹 Trending Topics Section */}
      <div>
        <div className="text-center mb-12">
          <h3 className="text-4xl font-extrabold text-gray-900">Trending Topics on Island Life</h3>
          <p className="text-gray-600 mt-1 max-w-2xl mx-auto text-sm md:text-base">
            Discover hidden gems, breathtaking destinations, and cultural treasures across Sri Lanka with our featured articles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 🔸 Left Featured Card */}
          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300">
            <Image
              src="/blog/blogPost/kandy.jpeg"
              alt="Temple"
              width={500}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Sri Lanka Splendors</h3>
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded-full">Culture</span>
                <span className="bg-slate-100 text-gray-600 px-2 py-1 rounded-full">3 min read</span>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Discover the richness of Sri Lanka&rsquo;s landscapes, history, and heritage in one incredible experience.
              </p>
              <button className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition shadow hover:shadow-md">
                Visit Post
              </button>
            </div>
          </div>

          {/* 🔸 Right Cards */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-all duration-300">
              <Image
                src="/blog/blogPost/tea_land.jpeg"
                alt="Tea"
                width={400}
                height={300}
                className="w-full md:w-1/2 h-60 object-cover"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-emerald-600 font-bold mb-2">Tea Country</div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Harvest of Ceylon</h3>
                  <p className="text-sm text-gray-600">
                    Journey into the hills of Sri Lanka where the world&rsquo;s finest tea is born.
                  </p>
                </div>
                <div className="mt-4">
                  <button className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition shadow hover:shadow-md">
                    Visit Post
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-all duration-300">
              <Image
                src="/blog/blogPost/north.jpeg"
                alt="North"
                width={400}
                height={300}
                className="w-full md:w-1/2 h-60 object-cover"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-indigo-600 font-bold mb-2">Hidden</div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Discovering the North</h3>
                  <p className="text-sm text-gray-600">
                    Uncover ancient temples and untouched natural beauty in Sri Lanka&rsquo;s northern provinces.
                  </p>
                </div>
                <div className="mt-4">
                  <button className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition shadow hover:shadow-md">
                    Visit Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 DESTINATIONS SECTION */}
      <Destination />

      {/* 🔹 EXPERIENCES SECTION */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900">EXPERIENCES</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            At Tuk Tuk Drive, we believe in immersing yourself in local culture and nature. Whether it&rsquo;s hiking to ancient ruins or exploring lush rainforests, our experiences offer a deep dive into Sri Lanka&rsquo;s beauty and heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              image: "/blog/blogPost/kandy_lake.jpeg",
              alt: "Kandy",
              title: "A Visit to Kandy City (UNESCO Site)",
              tag: "🏞️ Kandy World Heritage Site",
              subtag: "🌍 Tuk Tuk Ride",
            },
            {
              image: "/blog/blogPost/sigiriya.jpeg",
              alt: "Sigiriya",
              title: "The Sigiriya Rock Fortress (UNESCO Site)",
              tag: "📍 Sigiriya",
              subtag: "🏛️ Culture",
            },
            {
              image: "/blog/blogPost/ella_hike.jpeg",
              alt: "Knuckles",
              title: "Trek in the Knuckles Mountain Range",
              tag: "⛰️ Knuckles Mountain Range",
              subtag: "🧭 Adventure",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Image
                src={card.image}
                alt={card.alt}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <div className="text-sm text-yellow-600 font-medium">{card.tag}</div>
                <div className="text-xs text-gray-500">{card.subtag}</div>
                <div className="mt-4">
                  <button className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition shadow hover:shadow-md">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
