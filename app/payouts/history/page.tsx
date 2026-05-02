"use client";

import { useEffect, useState } from "react";

export default function PayoutHistoryPage() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payouts/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setHistory(data);
    }

    loadHistory();
  }, []);

  if (!history) return <div>Loading payout history...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Payout History</h1>

      <h2>Stripe Transfers</h2>
      {history.stripe_transfers.length === 0 && <p>No Stripe payouts yet.</p>}
      {history.stripe_transfers.map((t) => (
        <div key={t.transfer_id} style={{ marginBottom: 10 }}>
          <strong>${t.amount_usd}</strong> — {t.created_at}
          <br />
          Transfer ID: {t.transfer_id}
          <br />
          Order: {t.order_id || "N/A"}
        </div>
      ))}

      <hr />

      <h2>Internal Events</h2>
      {history.internal_events.length === 0 && <p>No internal payout events.</p>}
      {history.internal_events.map((e, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <strong>{e.event_type}</strong> — {e.created_at}
          <br />
          {e.message}
          <br />
          Order: {e.order_id || "N/A"}
        </div>
      ))}
    </div>
  );
}
