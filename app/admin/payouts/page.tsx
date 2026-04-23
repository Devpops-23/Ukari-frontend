"use client";

import { useEffect, useState } from "react";

export default function AdminPayoutDashboard() {
  const token = "YOUR_ADMIN_TOKEN"; // Replace with real admin token

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayouts() {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/admin/payouts?token=${token}`
    );

    const data = await res.json();
    setPayouts(data.payouts || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPayouts();
  }, []);

  async function adminAction(payoutId: number, action: "freeze" | "release") {
    const endpoint =
      action === "freeze"
        ? `/admin/payouts/${payoutId}/freeze`
        : `/admin/payouts/${payoutId}/release`;

    await fetch(`${process.env.NEXT_PUBLIC_API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    fetchPayouts();
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading payouts...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Payout Dashboard</h1>

      {payouts.length === 0 && <p>No payouts found.</p>}

      {payouts.map((p: any) => (
        <div key={p.payout_id} style={card}>
          <h3>Payout #{p.payout_id}</h3>

          <p><strong>Traveler:</strong> {p.traveler_name}</p>
          <p><strong>Traveler ID:</strong> {p.traveler_id}</p>

          <p><strong>Amount:</strong> ${p.amount}</p>
          <p><strong>Status:</strong> {p.status}</p>

          {p.arrival_date && (
            <p><strong>Arrival Date:</strong> {new Date(p.arrival_date).toLocaleString()}</p>
          )}

          {p.stripe_transfer_id && (
            <p><strong>Stripe Transfer ID:</strong> {p.stripe_transfer_id}</p>
          )}

          {p.stripe_account_id && (
            <p><strong>Stripe Account:</strong> {p.stripe_account_id}</p>
          )}

          <div style={{ marginTop: 20 }}>
            {p.status !== "frozen" && (
              <button
                style={buttonRed}
                onClick={() => adminAction(p.payout_id, "freeze")}
              >
                Freeze Payout
              </button>
            )}

            {p.status === "frozen" && (
              <button
                style={button}
                onClick={() => adminAction(p.payout_id, "release")}
              >
                Release Payout
              </button>
            )}
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

