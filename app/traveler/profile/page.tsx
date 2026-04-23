export default async function TravelerProfile() {
  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/traveler/profile?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Profile</h1>
        <p>Failed to load profile.</p>
      </div>
    );
  }

  const data = await res.json();
  const profile = data.profile;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Profile</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 20,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        <p><strong>Rating:</strong> {profile.rating?.toFixed(1) || "N/A"} ⭐</p>

        <p>
          <strong>Reliability Score:</strong>{" "}
          <span style={{ fontWeight: "bold" }}>
            {profile.reliability_score || 0} / 100
          </span>
        </p>

        <p><strong>On‑Time Deliveries:</strong> {profile.on_time_deliveries}</p>
        <p><strong>Late Deliveries:</strong> {profile.late_deliveries}</p>
        <p><strong>Cancellations:</strong> {profile.cancellation_count}</p>
        <p><strong>Flight Cancellations:</strong> {profile.flight_cancel_count}</p>

        <p>
          <strong>Stripe Status:</strong>{" "}
          {profile.stripe_account_id ? "Connected" : "Not Connected"}
        </p>
      </div>
    </div>
  );
}
