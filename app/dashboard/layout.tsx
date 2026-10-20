"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifySession = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8000";
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          router.push("/login?expired=true");
        }
      } catch (err) {
        // Network drop or backend temporarily restarting: don't kick user out immediately
      }
    };

    verifySession();
  }, [router]);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Trips", href: "/dashboard/trips", icon: "💼" },
    { name: "Deliveries", href: "/traveler/deliveries", icon: "📦" },
    { name: "Orders", href: "/dashboard/orders", icon: "🛒" },
    { name: "Earnings", href: "/dashboard/earnings/trips", icon: "💰" },
    { name: "Payouts", href: "/dashboard/payouts", icon: "💳" },
    { name: "Onboarding", href: "/traveler/onboarding", icon: "🚀" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile Top Navbar (Visible only on screens < 768px) */}
      <header className="md:hidden flex items-center justify-between bg-white px-5 py-4 border-b border-gray-200 shadow-xs z-30 sticky top-0">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600">
          <span className="bg-emerald-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold">
            U
          </span>
          <span>U-KARI</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-700 hover:text-emerald-600 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop persistent, Mobile slide-in drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 w-64 bg-white shadow-md p-6 flex flex-col z-50 transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
            <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold">
              U
            </span>
            <span>U-KARI</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-800 p-1"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link
            href="/"
            className="block text-xs text-gray-500 hover:text-emerald-600 mb-3 text-center"
          >
            ← Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
