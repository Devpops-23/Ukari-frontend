"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerDisputePage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { orderId } = params;

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitDispute(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/buyer/${orderId}/dispute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dispute_reason: reason,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        router.push(`/buyer/orders/${orderId}`);
      } else {
        alert(data.error || "Unable to submit dispute");
      }
    } catch (err) {
      alert("Error submitting dispute");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Submit a Dispute
      </h1>

      <form
        onSubmit={submitDispute}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Dispute Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg p-3 h-32"
            placeholder="Explain the issue with your order..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {loading ? "Submitting..." : "Submit Dispute"}
        </button>
      </form>
    </main>
  );
}
