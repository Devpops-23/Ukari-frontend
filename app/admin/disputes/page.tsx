"use client";

import { useEffect, useState } from "react";

export default function AdminDisputeDashboard() {
  const token = "YOUR_ADMIN_TOKEN"; // Replace with real admin token

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDisputes() {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/admin/disputes?token=${token}`
    );

    const data = await res.json();
    setDisputes(data.disputes || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchDisputes();
  }, []);

  async function resolveDispute(orderId: number, action: "traveler" | "buyer") {
    const endpoint =
      action === "traveler"
        ? `/admin/disputes/${orderId}/resolve-traveler`
        : `/admin/disputes/${orderId}/refund-buyer`;

    await fetch(`${process.env.NEXT_PUBLIC_API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    fetchDisputes();
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading disputes...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dispute Dashboard</h1>

      {disputes.length === 0 && <p>No active disputes.</p>}

      {disputes.map((d: any) => (
        <div key={d.order_id} style={card}>
          <h3>Order #{d.order_id}</h3>

          <p><strong>Buyer:</strong> {d.buyer_name}</p>
          <p><strong>Traveler:</strong> {d.traveler_name}</p>
          <p><strong>Reason:</strong> {d.reason}</p>
          <p><strong>Status:</strong> {d.status}</p>

          {d.stripe_dispute_id && (
            <p><strong>Stripe Dispute ID:</strong> {d.stripe_dispute_id}</p>
          )}

          <p><strong>Buyer Comment:</strong> {d.buyer_comment || "None"}</p>

          {/* Delivery Photo */}
          {d.delivery_photo_url && (
            <div style={{ marginTop: 10 }}>
              <strong>Delivery Photo:</strong>
              <br />
              <img
                src={d.delivery_photo_url}
                alt="Delivery Proof"
                style={{ width: 200, marginTop: 8, borderRadius: 6 }}
              />
            </div>
          )}

          {/* Evidence Logs */}
          {d.evidence_logs && d.evidence_logs.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <strong>Evidence Logs:</strong>
              <ul>
                {d.evidence_logs.map((log: string, idx: number) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: 20 }}>
            <button
              style={button}
              onClick={() => resolveDispute(d.order_id, "traveler")}
            >
              Resolve for Traveler
            </button>

            <button
              style={buttonRed}
              onClick={() => resolveDispute(d.order_id, "buyer")}
            >
              Refund Buyer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  padding: 20,
  borderRadius: 8,
  marginBottom: 20,
};

const button = {
  padding: "10px 16px",
  background: "black",
  color: "white",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  marginRight: 10,
};

const buttonRed = {
  padding: "10px 16px",
  background: "#b30000",
  color: "white",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

