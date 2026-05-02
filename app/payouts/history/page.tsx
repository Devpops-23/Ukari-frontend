"use client";

import { useEffect, useState } from "react";

interface StripeTransfer {
  transfer_id: string;
  amount_usd: number;
  created_at: string;
}

interface PayoutHistory {
  stripe_transfers: StripeTransfer[];
}

export default function PayoutHistoryPage() {
  const [history, setHistory] = useState<PayoutHistory>({
    stripe_transfers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payouts/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setHistory({
          stripe_transfers: data.stripe_transfers || [],
        });
      } catch (err) {
        console.error("Failed to load payout history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading payout history...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Payout History</h1>

      <h2>Stripe Transfers</h2>

      {history.stripe_transfers.length === 0 && (
        <p>No Stripe payouts yet.</p>
      )}

      {history.stripe_transfers.map((t) => (
        <div
          key={t.transfer_id}
          style={{
            marginBottom: 12,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <strong>${t.amount_usd}</strong>
          <div>Transfer ID: {t.transfer_id}</div>
          <div>Date: {t.created_at}</div>
        </div>
      ))}
    </div>
  );
}

