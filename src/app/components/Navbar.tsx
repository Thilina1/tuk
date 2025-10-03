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
    { title: "About", path: "/about" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact Us", path: "/contact" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: "#4B5563" }} // custom background
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="inline-block flex-1">
            <img
              src="/logo/headerLogo.png"
              alt="Site logo"
              className="w-24 h-auto md:w-34"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  className="relative font-medium transition-colors duration-200"
                  style={{
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#A855F7") // purple hover
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded transition"
            aria-label="Open menu"
            style={{ color: "#000000", backgroundColor: "transparent" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F3F4F6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mounted && isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-[9999] flex flex-col"
          style={{ backgroundColor: "#374151", color: "#FFFFFF" }} // dark gray bg
        >
          {/* Top: Logo + Close */}
          <div className="relative flex items-center justify-center px-6 py-4">
            <img src="/logo/headerLogo.png" alt="Site logo" width={150} height={150} />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 p-2 rounded transition"
              aria-label="Close menu"
              style={{ color: "#000000", backgroundColor: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F3F4F6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <X className="w-14 h-14" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 flex flex-col items-center justify-center space-y-8">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-semibold transition"
                  style={{ color: "#FFFFFF" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#9333EA") // purple hover
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
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
