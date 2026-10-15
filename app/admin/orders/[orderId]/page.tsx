"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrderDetailPage({ params }: any) {
  const router = useRouter();
  const { orderId } = params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if admin not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");
  }, [router]);

  // Load order details
  useEffect(() => {
    async function loadOrder() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrder(data.order || null);
      } catch (err) {
        console.error("Admin order detail load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  async function updateStatus(newStatus: string) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        alert(data.error || "Unable to update status");
      }
    } catch (err) {
      alert("Error updating status");
    }
  }

  if (loading || !order) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Order #{order.order_id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Item Details</h2>
          <p className="text-gray-600 mt-2">Item: {order.item_name}</p>
          <p className="text-gray-600 mt-1">
            Delivery Location: {order.delivery_location}
          </p>
          <p className="text-gray-600 mt-1">
            Status:{" "}
            <span className="font-semibold capitalize text-emerald-600">
              {order.status}
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Buyer</h2>
          <a
            href={`/admin/users/${order.buyer_id}`}
            className="text-blue-600 underline"
          >
            {order.buyer_name}
          </a>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Traveler</h2>
          {order.traveler_id ? (
            <a
              href={`/admin/users/${order.traveler_id}`}
              className="text-blue-600 underline"
            >
              {order.traveler_name}
            </a>
          ) : (
            <p className="text-red-600">No traveler assigned</p>
          )}

          {!order.traveler_id && (
            <button
              onClick={() =>
                router.push(`/admin/orders/${order.order_id}/assign`)
              }
              className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Assign Traveler
            </button>
          )}
        </div>

        {order.delivery_proof_url && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Delivery Proof
            </h2>
            <a
              href={order.delivery_proof_url}
              target="_blank"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              View Delivery Proof
            </a>
          </div>
        )}

        {order.dispute_id && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Dispute</h2>
            <a
              href={`/admin/disputes/${order.dispute_id}`}
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              View Dispute
            </a>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Admin Actions
          </h2>

          <div className="flex gap-3 mt-3 flex-wrap">
            <button
              onClick={() => updateStatus("in_transit")}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Mark In Transit
            </button>

            <button
              onClick={() => updateStatus("delivered")}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Mark Delivered
            </button>

            <button
              onClick={() => updateStatus("refunded")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Refund Buyer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
