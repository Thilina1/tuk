"use client";

import Script from "next/script";
//import { useEffect, useState } from "react";
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


  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (window?.instgrm?.Embeds?.process) {
  //       window.instgrm.Embeds.process();
  //       setLoaded(true);
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <section
      className="py-16 px-4 text-center"
      style={{
        background: "linear-gradient(to bottom right, #ffffff, #fefefe)",
      }}
    >
      <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
        See the Journey on Instagram
      </h3>
      <p className="text-gray-600 mb-10">
        Explore real moments shared by travelers like you
      </p>

      {/* Spinner */}
      {/* {!loaded && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Instagram Cards */}
      <div>
                
            {/* Fallback image or loading spinner */}
            <img
              src="/hero/instagram.png"
              alt="Loading Instagram post..."
              style={{
                display: "block",
                margin: "auto",
                width: "100%",
              }}
            />
        

      </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://www.instagram.com/tuktukdrive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
            style={{
              background: "linear-gradient(to right, #ec4899, #facc15)", // pink to yellow
            }}
          >
            <FaInstagram size={20} />
            <span>More on Instagram</span>
          </a>
        </div>

      <Script async src="//www.instagram.com/embed.js" />
    </section>
  );
}
