"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPayoutsPage() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch all payouts
  useEffect(() => {
    async function loadPayouts() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/payouts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPayouts(data.payouts || []);
      } catch (err) {
        console.error("Admin payouts load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPayouts();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading payouts...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Admin Payouts
      </h1>

      {payouts.length === 0 ? (
        <p className="text-gray-600">No payouts found.</p>
      ) : (
        <div className="space-y-6">
          {payouts.map((p) => (
            <div
              key={p.payout_id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Payout #{p.payout_id}
                  </h3>
                  <p className="text-gray-600">
                    Traveler: {p.traveler_name}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Status: {p.status}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Stripe Transfer ID: {p.stripe_transfer_id || "—"}
                  </p>
                </div>

                <p className="text-lg font-bold text-gray-800">
                  ${Number(p.amount).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => setSelected(p)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Payout Details</h2>

            <p className="text-gray-700 mb-2">
              <strong>Payout ID:</strong> {selected.payout_id}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Traveler:</strong> {selected.traveler_name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Status:</strong> {selected.status}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Stripe Transfer ID:</strong>{" "}
              {selected.stripe_transfer_id || "—"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Amount:</strong> ${Number(selected.amount).toFixed(2)}
            </p>

            <h3 className="text-lg font-semibold mb-2">Orders Included</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {selected.orders.map((o: any) => (
                <li key={o.order_id}>
                  Order #{o.order_id} — ${Number(o.amount).toFixed(2)}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


