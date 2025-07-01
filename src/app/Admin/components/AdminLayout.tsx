"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarExpanded ? "w-64" : "w-20"} transition-all duration-300 bg-gray-800 text-white flex flex-col`}>
        <div className="flex justify-between items-center p-4">
          <h2 className={`text-lg font-bold ${!sidebarExpanded && "hidden"}`}>Admin</h2>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            {sidebarExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <ul className="space-y-3 mt-6 px-4">
          {[
            { label: "Dashboard", icon: "📊", href: "/Admin/pages/dashboard" },
            { label: "Bookings", icon: "📅", href: "/Admin/pages/bookings" },
            { label: "TukTuks", icon: "🚖", href: "/Admin/pages/tuktuk" },
            { label: "Locations", icon: "📍", href: "/Admin/pages/Locations" },
            { label: "Train Transfer", icon: "🚂", href: "/Admin/pages/TrainTransfer" },            
            { label: "Persons", icon: "👤", href: "/Admin/pages/persons" },
            // { label: "Settings", icon: "⚙️", href: "/Admin/pages/settings" },
             

          ].map((item) => (
            <li key={item.label}>
              <Link href={item.href} passHref>
                <div className="flex items-center gap-3 text-sm hover:text-orange-400 cursor-pointer">
                  <span>{item.icon}</span>
                  {sidebarExpanded && <span>{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="text-xl font-semibold text-gray-800">TukTukDrive Admin</div>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-100 border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-gray-200 text-sm font-medium"
            >
              Admin ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
