"use client";

import Image from "next/image";
import Destination from "./destination";

export default function BlogContent() {
  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 px-4 md:px-8 space-y-6"
      style={{
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        colorScheme: "light",
      }}
    >
      {/* Trending Topics */}
      <div>
        <div className="text-center mb-12">
          <h3 className="text-4xl font-extrabold" style={{ color: "#1a1a1a" }}>
            Trending Topics on Island Life
          </h3>
          <p
            className="mt-1 max-w-2xl mx-auto text-sm md:text-base"
            style={{ color: "#4b5563" }} // gray-600
          >
            Discover hidden gems, breathtaking destinations, and cultural treasures across Sri Lanka with our featured articles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Featured */}
          <div
            className="rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: "#ffffff", color: "#1a1a1a" }}
          >
            <Image
              src="/blog/blogPost/kandy.jpeg"
              alt="Temple"
              width={500}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1f2937" }}>
                Sri Lanka Splendors
              </h3>
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded-full">
                  Culture
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">3 min read</span>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Discover the richness of Sri Lanka’s landscapes, history, and heritage in one incredible experience.
              </p>
              <button
  className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
  style={{
    backgroundColor: "#facc15", // yellow-400
    color: "#1f2937", // slate-800
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>
  Visit Post
</button>

            </div>
          </div>

          {/* Right Cards */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {[
              {
                img: "/blog/blogPost/tea_land.jpeg",
                alt: "Tea",
                tag: "Tea Country",
                title: "Harvest of Ceylon",
                desc: "Journey into the hills of Sri Lanka where the world’s finest tea is born.",
              },
              {
                img: "/blog/blogPost/north.jpeg",
                alt: "North",
                tag: "Hidden",
                title: "Discovering the North",
                desc: "Uncover ancient temples and untouched natural beauty in Sri Lanka’s northern provinces.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl shadow-lg border flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#ffffff", color: "#1a1a1a" }}
              >
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full md:w-1/2 h-60 object-cover"
                />
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold mb-2" style={{ color: i === 0 ? "#059669" : "#4f46e5" }}>
                      {item.tag}
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <div className="mt-4">
                  <button
  className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
  style={{
    backgroundColor: "#facc15", // yellow-400
    color: "#1f2937", // slate-800
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>
  Visit Post
</button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS Section */}
      <Destination />

      {/* EXPERIENCES Section */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold" style={{ color: "#1a1a1a" }}>
            EXPERIENCES
          </h2>
          <p
            className="mt-3 max-w-2xl mx-auto text-sm md:text-base"
            style={{ color: "#4b5563" }}
          >
            At Tuk Tuk Drive, we believe in immersing yourself in local culture and nature. Whether it’s hiking to ancient ruins or exploring lush rainforests, our experiences offer a deep dive into Sri Lanka’s beauty and heritage.
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
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border"
              style={{ backgroundColor: "#ffffff", color: "#1a1a1a" }}
            >
              <Image
                src={card.image}
                alt={card.alt}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1f2937" }}>
                  {card.title}
                </h3>
                <div className="text-sm font-medium" style={{ color: "#b45309" }}>{card.tag}</div>
                <div className="text-xs" style={{ color: "#6b7280" }}>{card.subtag}</div>
                <div className="mt-4">
                <button
  className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
  style={{
    backgroundColor: "#facc15", // yellow-400
    color: "#1f2937", // slate-800
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>
Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
