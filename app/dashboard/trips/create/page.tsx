"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTripPage() {
  const router = useRouter();

  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateTrip(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trips/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            origin_city: originCity,
            destination_city: destinationCity,
            departure_date: departureDate,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/trips");
      } else {
        alert(data.error || "Unable to create trip");
      }
    } catch (err) {
      alert("Error connecting to API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Create a New Trip
      </h1>

      <form
        onSubmit={handleCreateTrip}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Origin City
          </label>
          <input
            type="text"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Example: Houston"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Destination City
          </label>
          <input
            type="text"
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Example: Lagos"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Departure Date
          </label>
          <input
            type="datetime-local"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {loading ? "Creating Trip..." : "Create Trip"}
        </button>
      </form>
    </main>
  );
}


