"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TravelerDisputeListPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  useEffect(() => {
    async function loadDisputes() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/traveler/disputes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch (err) {
        console.error("Traveler disputes load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDisputes();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading disputes...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Disputes
      </h1>

      {disputes.length === 0 ? (
        <p className="text-gray-600">You have no disputes.</p>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div
              key={d.dispute_id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Dispute #{d.dispute_id}
              </h3>

              <p className="text-gray-600 mt-2">
                Order ID: {d.order_id}
              </p>

              <p className="text-gray-600 mt-1">
                Buyer Reason: {d.dispute_reason}
              </p>

              <p className="text-gray-600 mt-1">
                Status:{" "}
                <span className="font-semibold capitalize text-emerald-600">
                  {d.status}
                </span>
              </p>

              {d.status === "pending" || d.status === "under_review" ? (
                <a
                  href={`/traveler/disputes/${d.order_id}`}
                  className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Respond to Dispute
                </a>
              ) : (
                <p className="text-gray-500 mt-4 italic">
                  No further action required.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
