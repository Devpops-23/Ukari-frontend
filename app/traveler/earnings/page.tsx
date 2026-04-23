export default async function TravelerEarnings() {
  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/traveler/earnings?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Earnings</h1>
        <p>Failed to load earnings.</p>
      </div>
    );
  }

  const data = await res.json();

  const total = data.total_earnings || 0;
  const pending = data.pending_payout || 0;
  const available = data.available_balance || 0;
  const payouts = data.payout_history || [];

  return (
    <div style={{ padding: 20 }}>
      <h1>Earnings & Payouts</h1>

      {/* Earnings Summary */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          marginBottom: 30,
        }}
      >
        <div style={cardStyle}>
          <h3>Total Earnings</h3>
          <p style={amountStyle}>${total.toFixed(2)}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Payout</h3>
          <p style={amountStyle}>${pending.toFixed(2)}</p>
        </div>

        <div style={cardStyle}>
          <h3>Available Balance</h3>
          <p style={amountStyle}>${available.toFixed(2)}</p>
        </div>
      </div>

      {/* Payout History */}
      <h2>Payout History</h2>

      {payouts.length === 0 && <p>No payouts yet.</p>}

      {payouts.map((payout: any) => (
        <div
          key={payout.payout_id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <p><strong>Amount:</strong> ${payout.amount}</p>
          <p><strong>Status:</strong> {payout.status}</p>
          <p><strong>Created:</strong> {new Date(payout.created_at).toLocaleString()}</p>

          {payout.arrival_date && (
            <p><strong>Arrival:</strong> {new Date(payout.arrival_date).toLocaleString()}</p>
          )}

          <p><strong>Payout ID:</strong> {payout.payout_id}</p>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  flex: 1,
  border: "1px solid #ccc",
  padding: 16,
  borderRadius: 8,
  textAlign: "center" as const,
};

const amountStyle = {
  fontSize: 24,
  fontWeight: "bold",
  marginTop: 10,
};
