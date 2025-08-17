'use client';

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronLeft, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/Admin/pages/dashboard" },
  { label: "Bookings", icon: "📅", href: "/Admin/pages/bookings" },
  { label: "TukTuks", icon: "🚖", href: "/Admin/pages/tuktuk" },
  { label: "Locations", icon: "📍", href: "/Admin/pages/Locations" },
  { label: "Trainers", icon: "👤", href: "/Admin/pages/persons" },
  { label: "Discounts", icon: "💲", href: "/Admin/pages/discount" },
  { label: "Master Prices", icon: "💵", href: "/Admin/pages/masterPrices" },
  { label: "Settings", icon: "⚙️", href: "/Admin/pages/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeItem = useMemo(
    () => NAV_ITEMS.find((n) => pathname === n.href || pathname.startsWith(n.href + "/")) ?? NAV_ITEMS[0],
    [pathname]
  );

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/Admin/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.title = `TukTukDrive • ${activeItem.label}`;
  }, [activeItem]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 ${
          sidebarExpanded ? "w-64" : "w-16"
        } bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚖</span>
            {sidebarExpanded && (
              <h2 className="text-xl font-bold tracking-tight">TukTukDrive</h2>
            )}
          </div>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 bg-blue-700 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.label}>
                  <Link href={item.href} passHref>
                    <div
                      className={`group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-blue-200 hover:bg-blue-800 hover:text-white"
                      }`}
                      title={!sidebarExpanded ? item.label : ""}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {sidebarExpanded && <span>{item.label}</span>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? "16rem" : "4rem" }}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xl">{activeItem.icon}</span>
            <h1 className="text-xl font-semibold text-gray-900">{activeItem.label}</h1>
          </div>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Admin <span className="text-xs">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fade-in">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Tailwind Animation for Dropdown */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}