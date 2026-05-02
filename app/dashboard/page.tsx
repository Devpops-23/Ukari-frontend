"use client";

import { useEffect, useState } from "react";

function DashboardCard({
  title,
  amount,
}: {
  title: string;
  amount: number | string | null | undefined;
}) {
  const safeAmount = Number(amount || 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-emerald-600 mt-2">
        ${safeAmount.toFixed(2)}
      </p>
    </div>
  );
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/earnings/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Earnings"
          amount={summary?.total_earnings}
        />
        <DashboardCard
          title="Pending Payouts"
          amount={summary?.pending_payouts}
        />
        <DashboardCard
          title="Completed Trips"
          amount={summary?.completed_trips}
        />
      </div>
    </main>
  );
}





