"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";

// ✅ TypeScript fix for Instagram global object
declare global {
  interface Window {
    instgrm: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default function InstagramEmbedSection() {
  const instagramEmbeds = [
    "https://www.instagram.com/p/DEwP1g0o9f1/?utm_source=ig_embed",
    "https://www.instagram.com/p/DHfzvxyoLGJ/?utm_source=ig_embed",
    "https://www.instagram.com/p/DDL6xq8I-qq/?utm_source=ig_embed",
  ];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window?.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
        setLoaded(true); // mark all loaded after embed script processes
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md py-16 px-4 text-center">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">See the Journey on Instagram</h3>
      <p className="text-gray-700 mb-10">Explore real moments shared by travelers like you</p>

      {/* Spinner */}
      {!loaded && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Instagram Cards */}
      <div className={`grid ${loaded ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "hidden"} gap-6 max-w-7xl mx-auto`}>
        {instagramEmbeds.map((url, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden shadow-md bg-white/70 backdrop-blur-sm flex items-center justify-center min-h-[460px]"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="width:100%; min-height:450px; max-width:100%; margin:auto;"></blockquote>
                `,
              }}
            />
          </div>
        ))}
      </div>

      {/* More on Instagram Button */}
      {loaded && (
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.instagram.com/tuktukdrive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-pink-500 to-yellow-500 px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            <FaInstagram size={20} />
            <span className="font-semibold">More on Instagram</span>
          </a>
        </div>
      )}

      <Script async src="//www.instagram.com/embed.js" />
    </section>
  );
}
