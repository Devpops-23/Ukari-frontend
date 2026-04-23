"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TravelerEarningsDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  // ---------------------------------------------------------
  // FETCH EARNINGS SUMMARY
  // ---------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    async function fetchSummary() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/earnings/summary?token=${token}`
        );
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching earnings summary:", err);
      }
      setLoading(false);
    }

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading earnings...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Earnings Dashboard
        </h1>
        <p className="text-gray-500">No earnings data available.</p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN UI
  // ---------------------------------------------------------
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Earnings Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-gray-600 text-sm">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${summary.total_earned.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-gray-600 text-sm">Pending Earnings</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${summary.pending_earnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="text-gray-600 text-sm">Available for Payout</h3>
          <p className="text-3xl font-bold text-emerald-600">
            ${summary.available_earnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          href="/dashboard/earnings/trips"
          className="bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700"
        >
          <h3 className="text-xl font-semibold">Trip Earnings Breakdown</h3>
          <p className="text-sm opacity-80 mt-1">
            View earnings per trip and per order.
          </p>
        </Link>

        <Link
          href="/dashboard/earnings/withdrawals"
          className="bg-gray-800 text-white p-6 rounded-xl shadow hover:bg-gray-900"
        >
          <h3 className="text-xl font-semibold">Withdraw Earnings</h3>
          <p className="text-sm opacity-80 mt-1">
            View payout history and request withdrawals.
          </p>
        </Link>
      </div>

      {/* Recent Orders */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Earnings
      </h2>

      <div className="space-y-4">
        {summary.recent_orders.length === 0 && (
          <p className="text-gray-500">No recent earnings.</p>
        )}

        {summary.recent_orders.map((o: any) => (
          <div
            key={o.order_id}
            className="bg-white shadow rounded-xl p-4 border flex justify-between"
          >
            <div>
              <p className="text-gray-800 font-medium">
                Order #{o.order_id}
              </p>
              <p className="text-gray-500 text-sm capitalize">
                {o.status}
              </p>
            </div>

            <p className="text-lg font-bold text-gray-900">
              ${o.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
