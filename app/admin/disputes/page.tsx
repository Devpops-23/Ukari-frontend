"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDisputesPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch all disputes
  useEffect(() => {
    async function loadDisputes() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/disputes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch (err) {
        console.error("Admin disputes load error:", err);
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
        Dispute Center
      </h1>

      {disputes.length === 0 ? (
        <p className="text-gray-600">No disputes found.</p>
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
                <span className="font-semibold text-emerald-600">
                  {d.status}
                </span>
              </p>

              <a
                href={`/admin/disputes/${d.dispute_id}`}
                className="inline-block mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              >
                Review Dispute
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}



