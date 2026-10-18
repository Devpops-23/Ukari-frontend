"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "buyer" ? "buyer" : "traveler";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"traveler" | "buyer">(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000";

    try {
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          const messages = data.detail.map((d: any) => d.msg || `${d.loc?.join(".")}: invalid`).join(", ");
          throw new Error(messages || "Invalid signup parameters");
        }
        throw new Error(data.detail || "Signup failed. Please try again.");
      }

      // Auto-login to obtain access token
      const loginRes = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem("token", loginData.access_token);
        localStorage.setItem("access_token", loginData.access_token);
        localStorage.setItem("user", JSON.stringify(loginData));

        if (role === "traveler") {
          window.location.href = "/traveler/onboarding";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        router.push("/login?signup=success");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

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
            Create your account
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Join the peer-to-peer delivery network
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("traveler")}
                className={`py-2 text-sm font-semibold rounded-lg transition ${
                  role === "traveler"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ✈️ Traveler
              </button>
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`py-2 text-sm font-semibold rounded-lg transition ${
                  role === "buyer"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🛍️ Buyer
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {role === "traveler"
                ? "Deliver items during your flights and earn cash payouts."
                : "Shop US & global stores and have items delivered to your hands."}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="Jane Doe"
              />
            </div>

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
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="At least 6 characters"
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
              {loading ? "Creating your account..." : `Sign Up as ${role === "traveler" ? "Traveler" : "Buyer"}`}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
          Loading signup...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
