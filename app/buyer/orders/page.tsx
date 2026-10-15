"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch buyer orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/buyer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Buyer orders load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Order #{order.order_id}
              </h3>

              <p className="text-gray-600 mt-2">
                Status:{" "}
                <span className="font-semibold text-emerald-600">
                  {order.status}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                Amount: ${Number(order.amount || 0).toFixed(2)}
              </p>

              <p className="text-gray-600 mt-1">
                Store: {order.store_name || "Unknown Store"}
              </p>

              <p className="text-gray-600 mt-1">
                Created:{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

