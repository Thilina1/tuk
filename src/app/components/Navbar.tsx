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
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm transition-all">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-16">
          <Link href="/" className="inline-block flex-1">
            <img
              src="/hero/logo.png"
              alt="Site logo"
              className="w-14 h-auto md:w-30"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  className="relative font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md transition-transform duration-300 transform ${
          isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <img
            src="/hero/logo.png"
            alt="Site logo"
            className="w-14 h-auto md:w-30"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 dark:text-gray-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
                className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
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
