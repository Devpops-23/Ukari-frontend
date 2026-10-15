"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerOrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { orderId } = params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch buyer order details
  useEffect(() => {
    async function loadOrder() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/buyer/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOrder(data.order || null);
      } catch (err) {
        console.error("Order details load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="p-10">
        <p className="text-gray-600">Order not found.</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Order #{order.order_id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <p className="text-gray-700">
          <span className="font-semibold">Status:</span>{" "}
          <span className="text-emerald-600 font-semibold">
            {order.status}
          </span>
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Amount:</span>{" "}
          ${Number(order.amount || 0).toFixed(2)}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Store:</span>{" "}
          {order.store_name || "Unknown Store"}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Item:</span>{" "}
          {order.item_name}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Created:</span>{" "}
          {order.created_at
            ? new Date(order.created_at).toLocaleString()
            : "—"}
        </p>

        {order.delivery_proof_url && (
          <div className="mt-4">
            <p className="font-semibold text-gray-700 mb-2">
              Delivery Proof:
            </p>
            <a
              href={order.delivery_proof_url}
              target="_blank"
              className="text-emerald-600 underline"
            >
              View Proof
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
