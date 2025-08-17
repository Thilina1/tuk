'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Image from 'next/image';

type Admin = {
  userName: string;
  password: string;
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const snapshot = await getDocs(collection(db, 'admin'));
      const admins: Admin[] = snapshot.docs.map((doc) => doc.data() as Admin);

      const matched = admins.find(
        (admin) => admin.userName === email && admin.password === password
      );

      if (matched) {
        localStorage.setItem('admin_logged_in', 'true');
        router.push('../Admin/pages/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errMsg);
      console.error('Login error:', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Background Image */}
      <Image
        src="/hero/hero2.jpg"
        alt="Hero background"
        fill
        sizes="100vw"
        className="object-cover opacity-80"
        priority
        quality={60}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-0" />

      {/* Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl p-10 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Admin Login
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Sign in to manage your TukTuk dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}