"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold text-emerald-600 mb-8">U‑KARI</h2>

        <nav className="flex flex-col gap-4 text-gray-700">
          <a href="/dashboard" className="hover:text-emerald-600 cursor-pointer">🏠 Dashboard</a>
          <a href="/dashboard/trips" className="hover:text-emerald-600 cursor-pointer">💼 Trips</a>
          <a href="/dashboard/orders" className="hover:text-emerald-600 cursor-pointer">📦 Orders</a>
          <a href="/dashboard/earnings" className="hover:text-emerald-600 cursor-pointer">💰 Earnings</a>
          <a href="/dashboard/payouts" className="hover:text-emerald-600 cursor-pointer">💳 Payouts</a>
          <a className="hover:text-emerald-600 cursor-pointer">✉️ Messages</a>
          <a className="hover:text-emerald-600 cursor-pointer">⚙️ Settings</a>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            router.push("/login");
          }}
          className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
