"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || localStorage.getItem("access_token");
    setToken(savedToken);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-emerald-600 tracking-tight">
              <span className="bg-emerald-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-500/20">
                U
              </span>
              <span>U-KARI</span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Cross-Border Delivery
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition">How It Works</a>
            <a href="#for-buyers" className="hover:text-emerald-600 transition">For Buyers</a>
            <a href="#for-travelers" className="hover:text-emerald-600 transition">For Travelers</a>
            <a href="#portals" className="hover:text-emerald-600 transition">Portals</a>
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                >
                  Go to Dashboard →
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs sm:text-sm font-semibold mb-6">
              <span>✈️</span> Peer-to-Peer International Luggage Logistics
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Shop Global Marketplaces.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Delivered by Verified Travelers.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Order items from <strong>Amazon, Walmart, Costco, & Macy&apos;s</strong>. Our platform automatically purchases them via secure Stripe virtual cards and pairs your package with travelers who have extra luggage capacity.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup?role=buyer"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition transform active:scale-98"
              >
                🛍️ Shop as a Buyer
              </Link>
              <Link
                href="/signup?role=traveler"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl shadow-xs transition transform active:scale-98"
              >
                ✈️ Earn as a Traveler
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Existing User Login
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Powered by Stripe Issuing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> 100% Delivery Escrow Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Verified Traveler ID Checks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> 10-Day Liability Protection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 4-Step Operating Model */}
      <section id="how-it-works" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Architectural Blueprint</h2>
            <h3 className="text-3xl font-extrabold text-gray-900">How U-KARI Works</h3>
            <p className="mt-3 text-gray-600">The friction-free 4-step logistics lifecycle defined in our platform specifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-5">
                1
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Integrated Catalog</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Buyer picks items from Walmart or Amazon directly inside U-KARI. Item cost, domestic shipping, traveler fee, and platform charges are computed upfront.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-5">
                2
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Virtual Card Purchase</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                U-KARI provisions a dedicated Stripe Issuing virtual card locked to the retailer, purchases the item, and ships it directly to the traveler without exposing private data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-5">
                3
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Luggage Matching</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Travelers publish upcoming flights with weight allowance. Our matching engine automatically links orders heading to the same destination.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-5">
                4
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Delivery & Payouts</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Traveler delivers the parcel. Once buyer confirms delivery, Stripe releases earnings straight to traveler&apos;s bank account with 10-day liability protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Portals Quick-Switch Navigation */}
      <section id="portals" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Role Navigation</h2>
            <h3 className="text-3xl font-extrabold text-gray-900">Explore Platform Modules</h3>
            <p className="mt-3 text-gray-600">Access every dedicated portal in the U-KARI ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buyer Portal */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">🛍️</span>
                <h4 className="text-xl font-bold text-gray-900">Buyer Portal</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Track cross-border orders, review quotes, inspect package tracking, and confirm receipt.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/buyer/orders"
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                >
                  View Buyer Orders →
                </Link>
                <Link
                  href="/buyer/home"
                  className="w-full text-center py-2 px-4 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Buyer Home Catalog
                </Link>
              </div>
            </div>

            {/* Traveler Dashboard */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">💼</span>
                <h4 className="text-xl font-bold text-gray-900">Traveler Hub</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Manage trips, upload luggage allowance, review matched packages, and request Stripe payouts.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Traveler Dashboard →
                </Link>
                <Link
                  href="/dashboard/trips"
                  className="w-full text-center py-2 px-4 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Create & View Trips
                </Link>
              </div>
            </div>

            {/* Admin Center */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-4 block">🛡️</span>
                <h4 className="text-xl font-bold text-gray-900">Admin Operations</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Oversee dispute resolutions, 10-day liability checks, order timelines, and Stripe escrow status.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/admin/dashboard"
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-black transition"
                >
                  Open Admin Dashboard →
                </Link>
                <Link
                  href="/admin/disputes"
                  className="w-full text-center py-2 px-4 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Admin Disputes & Enforcement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm">
              U
            </span>
            <span className="font-bold text-gray-900">U-KARI Platform</span>
            <span className="text-gray-400 text-sm">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <Link href="/login" className="hover:text-emerald-600 transition">Login</Link>
            <Link href="/signup" className="hover:text-emerald-600 transition">Sign Up</Link>
            <Link href="/dashboard" className="hover:text-emerald-600 transition">Dashboard</Link>
            <a href="https://api.u-kari.com/docs" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
