"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Disable scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const menus = [
    { title: "Home", path: "/" },
    { title: "Blog", path: "/blog" },
    { title: "Pricing Summary", path: "/payment" },
    { title: "About", path: "/aboutus" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact Us", path: "/contact" },
    //{ title: "Pay", path: "/paymentCopy" },

  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
                  className="relative font-medium text-black hover:text-purple-600 transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-black p-2 rounded hover:bg-gray-100 transition"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mounted && isOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-white text-black flex flex-col">
          {/* Top: Logo + Close */}
          <div className="relative flex items-center justify-center px-6 py-4">
            <img src="/hero/logo.png" alt="Site logo" width={100} height={100} />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 text-black p-2 rounded hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 flex flex-col items-center justify-center space-y-8">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-semibold text-black hover:text-purple-600 transition"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
