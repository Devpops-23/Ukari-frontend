"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardMetrics {
  total_earnings?: number;
  pending_payouts?: number;
  completed_trips?: number;
  active_trips?: number;
}

export default function DashboardHomePage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_earnings: 0,
    pending_payouts: 0,
    completed_trips: 0,
    active_trips: 0,
  });
  const [trips, setTrips] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }

    async function loadData() {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000";

      try {
        // 1. Fetch dashboard metrics
        const earningsRes = await fetch(`${apiBase}/traveler/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (earningsRes.ok) {
          const data = await earningsRes.json();
          setMetrics({
            total_earnings: Number(data.total_earnings || 0),
            pending_payouts: Number(data.pending_payouts || 0),
            completed_trips: Number(data.completed_trips || 0),
            active_trips: Number(data.active_trips || 0),
          });
        }

        // 2. Fetch trips list
        const tripsRes = await fetch(`${apiBase}/traveler/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData.trips || tripsData || []);
        }
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}! Here is what&apos;s happening with your deliveries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/trips/create"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
          >
            + Create New Trip
          </Link>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - Responsive breakpoint fix for tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Earnings
            </p>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">
              ${Number(metrics.total_earnings || 0).toFixed(2)}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Released via Stripe Connect</p>
          </div>
          <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            💰
          </span>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pending Payouts
            </p>
            <h3 className="text-3xl font-black text-amber-500 mt-2">
              ${Number(metrics.pending_payouts || 0).toFixed(2)}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Awaiting delivery confirmation</p>
          </div>
          <span className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
            ⏳
          </span>
        </div>

        {/* Completed Trips */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Completed Trips
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-2">
              {metrics.completed_trips || 0} <span className="text-base font-normal text-gray-500">trips</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Successfully fulfilled</p>
          </div>
          <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            ✈️
          </span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/trips/create"
          className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl hover:shadow-md transition block"
        >
          <span className="text-2xl mb-2 block">💼</span>
          <h4 className="font-bold text-gray-900">Register Upcoming Flight</h4>
          <p className="text-xs text-gray-600 mt-1">
            Add travel origin, destination, and baggage capacity to start receiving matching delivery orders.
          </p>
        </Link>

        <Link
          href="/dashboard/payouts"
          className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl hover:shadow-md transition block"
        >
          <span className="text-2xl mb-2 block">💳</span>
          <h4 className="font-bold text-gray-900">Stripe Connect & Payouts</h4>
          <p className="text-xs text-gray-600 mt-1">
            Complete your Stripe verification to enable automatic direct deposits to your bank.
          </p>
        </Link>

        <Link
          href="/traveler/deliveries"
          className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl hover:shadow-md transition block"
        >
          <span className="text-2xl mb-2 block">📦</span>
          <h4 className="font-bold text-gray-900">Delivery Confirmation & Proof</h4>
          <p className="text-xs text-gray-600 mt-1">
            Upload package receipts and delivery proof photos to trigger payout release.
          </p>
        </Link>
      </div>

      {/* Recent Trips Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Registered Trips</h2>
          <Link
            href="/dashboard/trips"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View All Trips →
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 py-4">Loading your trips...</p>
        ) : trips.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <span className="text-3xl block mb-2">✈️</span>
            <p className="text-sm font-semibold text-gray-700">No trips added yet</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Register your upcoming flight to start receiving package delivery requests.</p>
            <Link
              href="/dashboard/trips/create"
              className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
            >
              + Add Flight Trip
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {trips.slice(0, 5).map((trip: any) => (
              <div key={trip.id || trip.trip_id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      {trip.origin || trip.origin_city} → {trip.destination || trip.destination_city}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      {trip.status || "active"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Departure: {trip.departure_date ? new Date(trip.departure_date).toLocaleDateString() : "Scheduled"}
                  </p>
                </div>
                <Link
                  href="/dashboard/trips"
                  className="text-xs text-gray-500 hover:text-emerald-600 font-medium"
                >
                  Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
