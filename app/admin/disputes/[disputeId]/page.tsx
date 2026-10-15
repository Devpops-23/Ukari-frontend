"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDisputeDetailPage({ params }: any) {
  const router = useRouter();
  const { disputeId } = params;

  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch dispute details
  useEffect(() => {
    async function loadDispute() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/disputes/${disputeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDispute(data);
      } catch (err) {
        console.error("Dispute detail load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDispute();
  }, [disputeId]);

  async function updateStatus(newStatus: string) {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/disputes/${disputeId}/status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        router.refresh();
      } else {
        alert("Unable to update dispute status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setActionLoading(false);
    }
  }

  async function issueRefund() {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/disputes/${disputeId}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        router.refresh();
      } else {
        alert("Unable to issue refund");
      }
    } catch (err) {
      alert("Error issuing refund");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading dispute...</p>
      </main>
    );
  }

  if (!dispute) {
    return (
      <main className="p-10">
        <p className="text-gray-600">Dispute not found.</p>
      </main>
    );
  }

  return (
    <main className="p-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Dispute #{dispute.dispute_id}
      </h1>

      {/* Buyer Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Buyer Information
        </h2>

        <p className="text-gray-700">
          <strong>Buyer:</strong> {dispute.buyer_name}
        </p>

        <p className="text-gray-700 mt-2">
          <strong>Reason:</strong> {dispute.dispute_reason}
        </p>
      </section>

      {/* Traveler Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Traveler Response
        </h2>

        {dispute.traveler_response ? (
          <>
            <p className="text-gray-700">
              {dispute.traveler_response.response_text}
            </p>

            {dispute.traveler_response.evidence_url && (
              <img
                src={dispute.traveler_response.evidence_url}
                alt="Evidence"
                className="mt-4 rounded-lg border"
              />
            )}
          </>
        ) : (
          <p className="text-gray-600">No response submitted.</p>
        )}
      </section>

      {/* Order Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Details
        </h2>

        <p className="text-gray-700">
          <strong>Order ID:</strong> {dispute.order_id}
        </p>

        <p className="text-gray-700 mt-2">
          <strong>Amount:</strong> ${Number(dispute.order_amount).toFixed(2)}
        </p>

        <p className="text-gray-700 mt-2">
          <strong>Status:</strong> {dispute.order_status}
        </p>
      </section>

      {/* Admin Actions */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Admin Actions
        </h2>

        <p className="text-gray-700">
          <strong>Current Status:</strong>{" "}
          <span className="font-semibold text-emerald-600">
            {dispute.status}
          </span>
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            disabled={actionLoading}
            onClick={() => updateStatus("approved")}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          >
            Approve Traveler
          </button>

          <button
            disabled={actionLoading}
            onClick={() => updateStatus("rejected")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          >
            Reject Traveler
          </button>

          <button
            disabled={actionLoading}
            onClick={issueRefund}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          >
            Issue Refund
          </button>
        </div>
      </section>
    </main>
  );
}
