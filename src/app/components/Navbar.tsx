"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // WhatsApp configuration
  const whatsAppPhoneNumber = "94770063780";
  const whatsAppMessage = "Hello! I'm interested in your services.";

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

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsAppPhoneNumber}?text=${encodeURIComponent(whatsAppMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: "#2D3748" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="inline-block flex-1">
              <img
                src="/logo/headerLogo.png"
                alt="Site logo"
                className="w-28 h-auto md:w-40" // Logo size responsive
              />
            </Link>

            {/* Desktop Menu & WhatsApp Button */}
            <div className="hidden md:flex items-center space-x-8 font-sans">
              <ul className="flex items-center space-x-8">
                {menus.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.path}
                      className="group relative text-lg font-medium transition-all duration-300"
                      style={{
                        color: "#E2E8F0",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#8B5CF6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#E2E8F0")
                      }
                    >
                      {item.title}
                      <span className="absolute left-0 bottom-0 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* WhatsApp Button (Desktop) */}
              <button
                onClick={handleWhatsAppClick}
                className="ml-8 px-5 py-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-semibold shadow-md
                           hover:from-green-500 hover:to-green-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Mobile Header: WhatsApp Button & Menu Toggle */}
            <div className="md:hidden flex items-center space-x-4"> {/* Increased space-x for better separation */}
                {/* WhatsApp Button (Mobile Header - prominent icon only) */}
                <button
                    onClick={handleWhatsAppClick}
                    className="p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle className="w-7 h-7" /> {/* Slightly larger icon */}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 rounded-md transition-colors duration-300"
                    aria-label="Open menu"
                    style={{ color: "#E2E8F0", backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                    }
                >
                    <Menu className="w-8 h-8" />
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        {mounted && isOpen && (
          <div
            className={`fixed inset-0 w-full h-full z-[9999] flex flex-col justify-between items-center py-8 px-6 font-sans
                        bg-opacity-98 transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} // Sliding animation
            style={{ backgroundColor: "#2D3748", backdropFilter: "blur(8px)", color: "#FFFFFF" }}
          >
            {/* Top Section: Close Button & Logo */}
            <div className="relative w-full flex justify-center items-center">
              <img src="/logo/headerLogo.png" alt="Site logo" className="w-40 h-auto" /> {/* Larger logo */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-0 p-3 rounded-md transition-colors duration-300"
                aria-label="Close menu"
                style={{ color: "#E2E8F0", backgroundColor: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X className="w-10 h-10" />
              </button>
            </div>

            {/* Middle Section: Menu Items */}
            <ul className="flex-1 flex flex-col items-center justify-center space-y-10"> {/* Adjusted flex for vertical centering */}
              {menus.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-extrabold tracking-wide transition-all duration-300" // Larger, bolder text
                    style={{ color: "#E2E8F0" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#8B5CF6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#E2E8F0")
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom Section: WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                className="w-full max-w-xs px-8 py-4 flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold shadow-lg
                           hover:from-green-500 hover:to-green-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8" // Added mt-8 for spacing from menu
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-8 h-8" /> {/* Larger icon */}
                <span>Chat with us!</span> {/* More inviting text */}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}