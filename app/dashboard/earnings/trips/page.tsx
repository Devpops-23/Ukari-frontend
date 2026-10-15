"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EarningsTripsPage() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState<number | null>(null);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch earnings per trip
  useEffect(() => {
    async function loadEarnings() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/traveler/earnings/trips`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setEarnings(data);
      } catch (err) {
        console.error("Earnings trips load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEarnings();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading trip earnings...</p>
      </main>
    );
  }

  if (!earnings || !earnings.trips || earnings.trips.length === 0) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Trip Earnings
        </h1>
        <p className="text-gray-600">No earnings data available.</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Trip Earnings Breakdown
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Earnings" amount={earnings.total} />
        <SummaryCard title="Completed" amount={earnings.completed} />
        <SummaryCard title="Pending" amount={earnings.pending} />
      </div>

      {/* Trip List */}
      <div className="space-y-6">
        {earnings.trips.map((trip: any) => (
          <div
            key={trip.trip_id}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Trip #{trip.trip_id}
                </h3>
                <p className="text-gray-600">
                  {trip.origin} → {trip.destination}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(trip.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  ${trip.total_earned.toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    setExpandedTrip(
                      expandedTrip === trip.trip_id ? null : trip.trip_id
                    )
                  }
                  className="mt-2 text-emerald-600 underline hover:text-emerald-700"
                >
                  {expandedTrip === trip.trip_id
                    ? "Hide Orders"
                    : "View Orders"}
                </button>
              </div>
            </div>

            {/* Orders List */}
            {expandedTrip === trip.trip_id && (
              <div className="mt-6 border-t pt-4">
                {trip.orders.length === 0 ? (
                  <p className="text-gray-500">No orders for this trip.</p>
                ) : (
                  <div className="space-y-3">
                    {trip.orders.map((order: any) => (
                      <div
                        key={order.order_id}
                        className="flex justify-between bg-gray-50 p-4 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">
                            Order #{order.order_id}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {order.status}
                          </p>
                        </div>

                        <p className="font-bold text-gray-800">
                          ${order.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function SummaryCard({ title, amount }: any) {
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


