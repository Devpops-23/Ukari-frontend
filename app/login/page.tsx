"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000";

    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          const msg = data.detail.map((d: any) => d.msg).join(", ");
          throw new Error(msg || "Login failed");
        }
        throw new Error(data.detail || "Login failed. Please check your credentials.");
      }

      // Save token under both keys to ensure full compatibility across all platform pages
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Network error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-emerald-600">
            <span className="bg-emerald-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-500/20">
              U
            </span>
            <span>U-KARI</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-4">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sign in to manage your trips and deliveries
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition active:scale-98 disabled:opacity-50 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
