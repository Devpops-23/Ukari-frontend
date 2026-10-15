"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Admin orders load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{order.order_id}
              </h3>

              <p className="text-gray-600 mt-2">
                Item: {order.item_name}
              </p>

              <p className="text-gray-600 mt-1">
                Buyer:{" "}
                <a
                  href={`/admin/users/${order.buyer_id}`}
                  className="text-blue-600 underline"
                >
                  {order.buyer_name}
                </a>
              </p>

              <p className="text-gray-600 mt-1">
                Traveler:{" "}
                {order.traveler_id ? (
                  <a
                    href={`/admin/users/${order.traveler_id}`}
                    className="text-blue-600 underline"
                  >
                    {order.traveler_name}
                  </a>
                ) : (
                  <span className="text-red-600">Unassigned</span>
                )}
              </p>

              <p className="text-gray-600 mt-1">
                Status:{" "}
                <span className="font-semibold capitalize text-emerald-600">
                  {order.status}
                </span>
              </p>

              {order.dispute_id && (
                <p className="mt-2">
                  <a
                    href={`/admin/disputes/${order.dispute_id}`}
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    View Dispute
                  </a>
                </p>
              )}

              {order.delivery_proof_url && (
                <p className="mt-2">
                  <a
                    href={order.delivery_proof_url}
                    target="_blank"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    View Delivery Proof
                  </a>
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    router.push(`/admin/orders/${order.order_id}`)
                  }
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  Manage Order
                </button>

                {!order.traveler_id && (
                  <button
                    onClick={() =>
                      router.push(`/admin/orders/${order.order_id}/assign`)
                    }
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                  >
                    Assign Traveler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
