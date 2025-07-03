"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/Admin/pages/dashboard" },
  { label: "Bookings", icon: "📅", href: "/Admin/pages/bookings" },
  { label: "TukTuks", icon: "🚖", href: "/Admin/pages/tuktuk" },
  { label: "Locations", icon: "📍", href: "/Admin/pages/Locations" },
  { label: "Train Transfer", icon: "🚂", href: "/Admin/pages/TrainTransfer" },
  { label: "Persons", icon: "👤", href: "/Admin/pages/persons" },
  { label: "Discounts", icon: "💲", href: "/Admin/pages/discount" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${sidebarExpanded ? "w-60" : "w-16"} 
          bg-gray-900 text-white flex flex-col transition-all duration-300`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <h2 className={`text-lg font-semibold transition-opacity ${!sidebarExpanded ? "opacity-0" : "opacity-100"}`}>
            Admin
          </h2>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            {sidebarExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <ul className="space-y-1 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.label}>
                <Link href={item.href} passHref>
                  <div
                    className={`group flex items-center gap-3 px-3 py-2 mx-2 rounded-lg cursor-pointer text-sm transition
                      ${isActive ? "bg-orange-600 text-white" : "hover:bg-gray-800 text-gray-300"}`}
                    title={!sidebarExpanded ? item.label : ""}
                  >
                    <span>{item.icon}</span>
                    {sidebarExpanded && <span>{item.label}</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
          <div className="text-lg font-medium">TukTukDrive Admin</div>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm shadow-sm"
            >
              Admin ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
