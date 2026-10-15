"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TravelerDeliveriesPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch traveler deliveries
  useEffect(() => {
    async function loadDeliveries() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/traveler/deliveries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDeliveries(data.deliveries || []);
      } catch (err) {
        console.error("Deliveries load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDeliveries();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading deliveries...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        My Deliveries
      </h1>

      {deliveries.length === 0 ? (
        <p className="text-gray-600">You have no active deliveries.</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.order_id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Order #{delivery.order_id}
              </h3>

              <p className="text-gray-600 mt-2">
                Item: {delivery.item_name}
              </p>

              <p className="text-gray-600 mt-1">
                Deliver To: {delivery.delivery_location}
              </p>

              <p className="text-gray-600 mt-1">
                Status:{" "}
                <span className="font-semibold text-emerald-600">
                  {delivery.status}
                </span>
              </p>

              {delivery.delivery_deadline && (
                <p className="text-gray-600 mt-1">
                  Deadline:{" "}
                  {new Date(delivery.delivery_deadline).toLocaleString()}
                </p>
              )}

              {/* Delivery Proof Button */}
              {(delivery.status === "accepted" ||
                delivery.status === "in_transit") && (
                <a
                  href={`/traveler/deliveries/${delivery.order_id}/proof`}
                  className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                  Upload Delivery Proof
                </a>
              )}

              {/* Dispute Button */}
              {delivery.dispute_id && (
                <a
                  href={`/traveler/disputes/${delivery.order_id}`}
                  className="inline-block mt-4 ml-3 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Respond to Dispute
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
