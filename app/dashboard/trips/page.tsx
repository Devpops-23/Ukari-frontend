"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch traveler trips
  useEffect(() => {
    async function loadTrips() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (!token) return;

        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8000";

        const res = await fetch(`${apiBase}/traveler/trips`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          router.push("/login?expired=true");
          return;
        }

        const data = await res.json();
        setTrips(Array.isArray(data) ? data : data.trips || []);
      } catch (err) {
        console.error("Trips load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [router]);

  if (loading) {
    return (
      <main className="p-6 md:p-10">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="text-base font-medium">Loading your trips...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Trips
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your scheduled travels and carry capacity
          </p>
        </div>

        <Link
          href="/dashboard/trips/create"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-98 text-sm"
        >
          <span>+</span>
          <span>Create Trip</span>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
          <div className="text-4xl mb-3">✈️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No trips scheduled yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Create your first travel route to start accepting package delivery requests and earning money.
          </p>
          <Link
            href="/dashboard/trips/create"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trips.map((trip) => {
            const tripId = trip.id ?? trip.trip_id;
            const origin = trip.origin || trip.origin_city;
            const destination = trip.destination || trip.destination_city;
            const depDate = trip.departure_date || trip.travel_date;
            const status = trip.status || "active";
            const maxWeight = trip.max_weight ?? 20;

            return (
              <div
                key={tripId}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Trip #{tripId}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-4">
                  <span>{origin}</span>
                  <span className="text-emerald-500">→</span>
                  <span>{destination}</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Departure:</span>
                    <span className="font-medium text-gray-800">
                      {depDate ? new Date(depDate).toLocaleString() : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Available Capacity:</span>
                    <span className="font-medium text-gray-800">{maxWeight} kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
