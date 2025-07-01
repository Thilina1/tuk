"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (loggedIn) {
      router.push("/Admin/pages/dashboard");
    }
  }, [router]); // ✅ Added 'router' to dependencies

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const snapshot = await getDocs(collection(db, "admin"));
    const admins = snapshot.docs.map((doc) => doc.data());

    const matched = admins.find(
      (admin) => admin.userName === email && admin.password === password
    );

    if (matched) {
      localStorage.setItem("admin_logged_in", "true");
      router.push("/Admin/pages/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-[350px] space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
