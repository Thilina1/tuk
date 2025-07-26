"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "admin"));
      const admins = snapshot.docs.map((doc) => doc.data());

      const matched = admins.find(
        (admin: any) => admin.userName === email && admin.password === password
      );

      if (matched) {
        localStorage.setItem("admin_logged_in", "true");
        router.push("../Admin/pages/dashboard");
      } else {
        alert("Invalid email or password.");
      }
    } catch (error: any) {
      console.error("Login error:", error.message || error);
      alert(`Failed to login: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero/hero2.jpg"
        alt="Hero background"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        priority
        quality={60}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-0" />

      {/* Toggle Theme */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Toggle Theme
      </button>

      {/* Glass Card with Text and Form */}
      <div className="relative z-10 max-w-md w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-xl border border-white/40 dark:border-gray-700/40 shadow-lg p-8 space-y-6 text-center text-gray-900 dark:text-gray-100">
        {/* Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome Admin 👋</h1>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Please login to manage your dashboard and keep things running smooth.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
