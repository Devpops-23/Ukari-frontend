"use client";

import { useEffect, useState } from "react";

export default function EarningsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
        console.error("Earnings load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="p-10 text-gray-600">Loading earnings...</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Earnings Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Earnings" amount={summary?.total_earnings} />
        <Card title="Pending Payouts" amount={summary?.pending_payouts} />
        <Card title="Completed Trips" amount={summary?.completed_trips} />
      </div>
    </main>
  );
}

function Card({ title, amount }: any) {
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

