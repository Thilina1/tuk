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
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "#ffffff",
        color: "#374151", // Tailwind text-gray-700
        colorScheme: "light",
        WebkitAppearance: "none",
        appearance: "none",
        borderBottom: "1px solid #e5e7eb", // Tailwind border-gray-200
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          <Link href="/">
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: "#9333ea" }} // Tailwind text-purple-600
            >
              Logo
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {menus.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className="font-medium"
                    style={{
                      color: "#374151", // text-gray-700
                      textDecoration: "none",
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                color: "#374151",
                backgroundColor: "transparent",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                WebkitAppearance: "none",
                appearance: "none",
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              color: "#374151",
              colorScheme: "light",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4"
              style={{
                color: "#374151",
                backgroundColor: "transparent",
                padding: "0.5rem",
                borderRadius: "0.375rem",
              }}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <span
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: "#9333ea" }}
                >
                  Logo
                </span>
              </Link>
            </div>

            <ul className="flex flex-col items-center space-y-6 mt-20">
              {menus.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 500,
                      color: "#374151",
                      textDecoration: "none",
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
