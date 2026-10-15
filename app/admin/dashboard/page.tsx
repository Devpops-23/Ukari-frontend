"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch admin dashboard summary
  useEffect(() => {
    async function loadSummary() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          amount={summary?.total_users}
        />
        <DashboardCard
          title="Total Travelers"
          amount={summary?.total_travelers}
        />
        <DashboardCard
          title="Total Buyers"
          amount={summary?.total_buyers}
        />
        <DashboardCard
          title="Total Orders"
          amount={summary?.total_orders}
        />
        <DashboardCard
          title="Total Revenue"
          amount={summary?.total_revenue}
        />
      </div>
    </main>
  );
}

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
        {safeAmount.toLocaleString()}
      </p>
    </div>
  );
}

