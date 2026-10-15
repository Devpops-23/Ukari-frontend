"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPayoutsPage() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch traveler payouts
  useEffect(() => {
    async function loadPayouts() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payouts/traveler`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPayouts(data.payouts || []);
      } catch (err) {
        console.error("Payouts load error:", err);
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
        Your Payouts
      </h1>

      {payouts.length === 0 ? (
        <p className="text-gray-600">No payouts found.</p>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <div
              key={payout.payout_id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Payout #{payout.payout_id}
              </h3>

              <p className="text-gray-600 mt-2">
                Status:{" "}
                <span className="font-semibold text-emerald-600">
                  {payout.status}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                Amount: ${payout.amount?.toFixed(2)}
              </p>

              <p className="text-gray-600 mt-1">
                Stripe Transfer ID:{" "}
                {payout.stripe_transfer_id || "—"}
              </p>

              <p className="text-gray-600 mt-1">
                Created: {new Date(payout.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


