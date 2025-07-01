"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/hero/background-footer.png')",
        backgroundColor: "#111827",
        color: "#fff",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>

      {/* Top CTA Message */}
      <div className="relative z-10 text-center pt-20 pb-10">
        <h2
          style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
            letterSpacing: "0.05em",
            fontFamily: "'Pacifico', cursive",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginBottom: "1.5rem",
          }}
        >
          Let us take you on a tropical adventure!
        </h2>

        <button
          className="mt-6 font-semibold px-6 py-3 rounded-md shadow transition-transform"
          style={{
            background: "linear-gradient(to right, #7c3aed, #facc15)",
            color: "white",
            fontWeight: "bold",
            border: "none",
          }}
        >
          Book Your Tuk Tuk
        </button>
      </div>

      {/* Footer Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-amber-400 flex items-center gap-2">
            <span>🚗</span> Tuk Tuk Drive
          </h2>
          <p className="mt-3" style={{ color: "#d1d5db" }}>
            Epic road trips across Sri Lanka — one tuk tuk at a time.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li><Link href="/blog" className="hover:text-amber-400">Blog</Link></li>
            <li><Link href="/about" className="hover:text-amber-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-3" style={{ color: "#d1d5db" }}>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>+94 71 234 5678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>hello@tuktukdrive.com</span>
            </li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-amber-400 hover:text-gray-900"
              style={{ backgroundColor: "#1f2937", color: "white" }}
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-amber-400 hover:text-gray-900"
              style={{ backgroundColor: "#1f2937", color: "white" }}
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="mb-2 text-gray-300">Subscribe to our newsletter</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your Email"
              className="px-3 py-1 rounded-l bg-white text-gray-800 text-sm"
            />
            <button
              className="px-3 py-1 font-bold rounded-r transition"
              style={{ backgroundColor: "#fbbf24", color: "#111827" }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="relative z-10 border-t border-gray-700 text-center text-xs py-4 px-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "#d1d5db" }}>
        © {new Date().getFullYear()} Tuk Tuk Drive. All rights reserved.
      </div>
    </footer>
  );
}
