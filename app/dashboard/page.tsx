"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchSummary() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/earnings/summary?token=${token}`
        );
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard summary error:", err);
      }

      setLoading(false);
    }

    fetchSummary();
  }, [router]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Welcome Back
      </h1>

      {/* Stripe Connect Button */}
      <div className="mb-8">
        <button
          onClick={async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/connect-link?token=${token}`,
              { method: "POST" }
            );
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Connect Payout Account
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <DashboardCard title="Today" amount={summary.today} />
        <DashboardCard title="This Week" amount={summary.week} />
        <DashboardCard title="This Month" amount={summary.month} />
        <DashboardCard title="Lifetime" amount={summary.lifetime} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink
          title="Trips"
          description="View and manage your trips"
          href="/dashboard/trips"
        />
        <QuickLink
          title="Earnings Breakdown"
          description="See earnings per trip and order"
          href="/dashboard/earnings/trips"
        />
        <QuickLink
          title="Withdrawals"
          description="View payout history"
          href="/dashboard/earnings/withdrawals"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, amount }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-emerald-600 mt-2">
        ${amount.toFixed(2)}
      </p>
    </div>
  );
}

function QuickLink({ title, description, href }: any) {
  return (
    <a
      href={href}
      className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
    </a>
  );
}



