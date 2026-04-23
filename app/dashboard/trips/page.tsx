"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TripsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Your Trips</h1>

        <button
          onClick={() => router.push("/dashboard/trips/create")}
          className="py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          + Add Trip
        </button>
      </div>

      {/* Trip List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder Trip Card */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">No trips yet</h3>
          <p className="text-gray-500 mt-2">Create your first trip to start earning.</p>
        </div>
      </div>
    </div>
  );
}
