"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardOrdersPage() {
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

  // Fetch traveler orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/traveler`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Orders load error:", err);
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
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Order #{order.id}
              </h3>

              <p className="text-gray-600 mt-2">
                Status:{" "}
                <span className="font-semibold text-emerald-600">
                  {order.status}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                Total: ${order.total_amount?.toFixed(2)}
              </p>

              <p className="text-gray-600 mt-1">
                Created: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
