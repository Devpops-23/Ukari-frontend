"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TravelerDeliveriesPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch traveler deliveries
  useEffect(() => {
    async function loadDeliveries() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (!token) return;

        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8000";

        const res = await fetch(`${apiBase}/traveler/deliveries`, {
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
        setDeliveries(Array.isArray(data) ? data : data.deliveries || []);
      } catch (err) {
        console.error("Deliveries load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDeliveries();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-500 py-10">
        <svg className="animate-spin h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="text-sm font-medium">Loading deliveries...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Deliveries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track customer packages assigned to your trips and submit delivery proof.
          </p>
        </div>

        <Link
          href="/dashboard/trips"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-xs transition"
        >
          View Scheduled Trips →
        </Link>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No active deliveries yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            When buyers match with your scheduled routes, your package delivery assignments will appear here.
          </p>
          <Link
            href="/dashboard/trips/create"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            + Create a New Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {deliveries.map((delivery) => {
            const orderId = delivery.order_id || delivery.id;
            const status = delivery.status || "pending";
            return (
              <div
                key={orderId}
                className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order #{orderId}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      status === "delivered" || status === "buyer_confirmed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : status === "in_transit"
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {delivery.item_name || "Assigned Package"}
                </h3>

                <p className="text-xs text-slate-500 mb-4">
                  Deliver to: <strong className="text-slate-800">{delivery.delivery_location || "Buyer Address"}</strong>
                </p>

                {delivery.delivery_deadline && (
                  <p className="text-xs text-slate-500 mb-4">
                    Deadline: {new Date(delivery.delivery_deadline).toLocaleString()}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {(status === "accepted" || status === "in_transit") && (
                    <Link
                      href={`/traveler/deliveries/${orderId}/proof`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Upload Delivery Proof
                    </Link>
                  )}

                  {delivery.dispute_id && (
                    <Link
                      href={`/traveler/disputes/${orderId}`}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Respond to Dispute
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
