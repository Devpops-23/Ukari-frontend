"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TravelerDashboardPage() {
  const router = useRouter();
  const [traveler, setTraveler] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch traveler dashboard summary
  useEffect(() => {
    async function loadTraveler() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/traveler/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setTraveler(data);
      } catch (err) {
        console.error("Traveler dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTraveler();
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Traveler Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700">
          {traveler?.name || "Traveler"}
        </h2>
        <p className="text-gray-600 mt-2">
          Traveler ID: {traveler?.traveler_id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Trips"
          amount={traveler?.active_trips}
        />
        <DashboardCard
          title="Delivered Orders"
          amount={traveler?.delivered_orders}
        />
        <DashboardCard
          title="Total Earned"
          amount={traveler?.total_earned}
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



