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

  // Define explicit RGB/RGBA color variables
  const primaryDarkGray = "rgb(45, 55, 72)";       // #2D3748
  const lightTextColor = "rgb(226, 232, 240)";     // #E2E8F0
  const purpleHoverColor = "rgb(139, 92, 246)";    // #8B5CF6
  const underlinePurple = "rgb(167, 139, 250)";   // #A78BFA (from Tailwind purple-400/500 range)
  const greenButtonStart = "rgb(72, 187, 120)";   // #48BB78 (from Tailwind green-400)
  const greenButtonEnd = "rgb(56, 161, 105)";     // #38A169 (from Tailwind green-600)
  const greenButtonHoverStart = "rgb(56, 161, 105)"; // #38A169 (equivalent to green-500 or slightly darker for hover)
  const greenButtonHoverEnd = "rgb(47, 133, 90)"; // #2F855A (equivalent to green-700)
  const whiteColor = "rgb(255, 255, 255)";        // #FFFFFF
  const semiTransparentWhite = "rgba(255, 255, 255, 0.1)"; // For subtle hover backgrounds

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
        style={{ backgroundColor: primaryDarkGray }}
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
                        color: lightTextColor,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = purpleHoverColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = lightTextColor)
                      }
                    >
                      {item.title}
                      <span
                        className="absolute left-0 bottom-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        style={{ backgroundColor: underlinePurple }}
                      ></span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* WhatsApp Button (Desktop) */}
              <button
                onClick={handleWhatsAppClick}
                className="ml-8 px-5 py-2 flex items-center gap-2 rounded-full text-lg font-semibold shadow-md
                           transition-all duration-300 transform hover:scale-105"
                aria-label="Chat on WhatsApp"
                style={{
                  backgroundColor: greenButtonStart, // Fallback for no gradient
                  color: whiteColor,
                  backgroundImage: `linear-gradient(to right, ${greenButtonStart}, ${greenButtonEnd})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${greenButtonHoverStart}, ${greenButtonHoverEnd})`;
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // Equivalent to shadow-lg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${greenButtonStart}, ${greenButtonEnd})`;
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; // Equivalent to shadow-md
                }}
              >
                <MessageCircle className="w-6 h-6" />
                <span>Chat with us</span>
              </button>
            </div>

            {/* Mobile Header: WhatsApp Button & Menu Toggle */}
            <div className="md:hidden flex items-center space-x-4">
                {/* WhatsApp Button (Mobile Header - prominent icon only) */}
                

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 rounded-md transition-colors duration-300"
                    aria-label="Open menu"
                    style={{ color: lightTextColor, backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = semiTransparentWhite)
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
                        bg-opacity-98 transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ backgroundColor: primaryDarkGray, backdropFilter: "blur(8px)", color: whiteColor }}
          >
            {/* Top Section: Close Button & Logo */}
            <div className="relative w-full flex justify-center items-center">
              <img src="/logo/headerLogo.png" alt="Site logo" className="w-40 h-auto" />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-0 p-3 rounded-md transition-colors duration-300"
                aria-label="Close menu"
                style={{ color: lightTextColor, backgroundColor: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = semiTransparentWhite)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X className="w-10 h-10" />
              </button>
            </div>

            {/* Middle Section: Menu Items */}
            <ul className="flex-1 flex flex-col items-center justify-center space-y-10">
              {menus.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-extrabold tracking-wide transition-all duration-300"
                    style={{ color: lightTextColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = purpleHoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = lightTextColor)
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
                className="w-full max-w-xs px-8 py-4 flex items-center justify-center gap-3 rounded-full text-xl font-bold shadow-lg
                           transition-all duration-300 transform hover:scale-105 mt-8"
                aria-label="Chat on WhatsApp"
                style={{
                  backgroundColor: greenButtonStart, // Fallback for no gradient
                  color: whiteColor,
                  backgroundImage: `linear-gradient(to right, ${greenButtonStart}, ${greenButtonEnd})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${greenButtonHoverStart}, ${greenButtonHoverEnd})`;
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // Equivalent to shadow-lg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${greenButtonStart}, ${greenButtonEnd})`;
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; // Equivalent to shadow-md
                }}
            >
                <MessageCircle className="w-8 h-8" />
                <span>Chat with us!</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}