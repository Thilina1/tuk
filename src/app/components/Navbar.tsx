"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const menus = [
    { title: "Home", path: "/" },
    { title: "Blog", path: "/blog" },
    { title: "About Us", path: "/aboutus" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact Us", path: "/contact" },
    { title: "Payment", path: "/payment" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-purple-600">
            Logo
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  className="relative font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 p-2 rounded hover:bg-gray-100 transition"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-md shadow-md transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-extrabold tracking-tight text-purple-600"
          >
            Logo
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 p-2 rounded hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="flex flex-col items-center space-y-6 pb-6">
          {menus.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
