"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch traveler trips
  useEffect(() => {
    async function loadTrips() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/trips/traveler`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setTrips(data.trips || []);
      } catch (err) {
        console.error("Trips load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading trips...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Trips
      </h1>

      {trips.length === 0 ? (
        <p className="text-gray-600">No trips found.</p>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.trip_id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Trip #{trip.trip_id}
              </h3>

              <p className="text-gray-600 mt-2">
                From:{" "}
                <span className="font-semibold text-emerald-600">
                  {trip.origin_city}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                To:{" "}
                <span className="font-semibold text-emerald-600">
                  {trip.destination_city}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                Departure: {new Date(trip.departure_date).toLocaleString()}
              </p>

              <p className="text-gray-600 mt-1">
                Status:{" "}
                <span className="font-semibold text-emerald-600">
                  {trip.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}



