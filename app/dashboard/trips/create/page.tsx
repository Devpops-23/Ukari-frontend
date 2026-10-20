"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTripPage() {
  const router = useRouter();

  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [maxWeight, setMaxWeight] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  async function handleCreateTrip(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) {
      setError("You are not logged in. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);
      setLoading(false);
      return;
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000";

    try {
      const res = await fetch(`${apiBase}/trips/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin: originCity.trim(),
          destination: destinationCity.trim(),
          travel_date: departureDate,
          origin_city: originCity.trim(),
          destination_city: destinationCity.trim(),
          departure_date: departureDate,
          max_weight: parseFloat(maxWeight) || 20.0,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push("/dashboard/trips");
        return;
      }

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setError(data.detail || "Your session has expired. Redirecting to login...");
        setTimeout(() => {
          router.push("/login?expired=true");
        }, 1200);
        return;
      }

      if (Array.isArray(data.detail)) {
        const msg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
        setError(msg || "Validation error creating trip");
      } else {
        setError(data.detail || data.error || "Unable to create trip. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 md:p-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/trips"
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          ← Back to Trips
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create a New Trip
        </h1>
        <p className="text-gray-600 mt-1">
          Post your upcoming travel details to accept delivery requests and earn.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form onSubmit={handleCreateTrip} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Origin City / Location
            </label>
            <input
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
              placeholder="e.g. Chennai, India"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Destination City / Location
            </label>
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
              placeholder="e.g. Mumbai, India"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Departure Date & Time
              </label>
              <input
                type="datetime-local"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Available Capacity (kg)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition active:scale-98 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Creating Trip...</span>
                </>
              ) : (
                "Create Trip"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
