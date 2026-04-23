export default async function MyDeliveries() {
  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth

  // Fetch deliveries
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/traveler/deliveries?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 20 }}>
        <h1>My Deliveries</h1>
        <p>Failed to load deliveries.</p>
      </div>
    );
  }

  const data = await res.json();
  const deliveries = data.deliveries || [];

  return (
    <div style={{ padding: 20 }}>
      <h1>My Deliveries</h1>

      {deliveries.length === 0 && (
        <p>You have no active deliveries right now.</p>
      )}

      {deliveries.map((order: any) => (
        <div
          key={order.order_id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <p><strong>Item:</strong> {order.item_name}</p>
          <p><strong>Delivery To:</strong> {order.delivery_location}</p>
          <p><strong>Status:</strong> {order.status}</p>

          {order.delivery_deadline && (
            <p><strong>Deadline:</strong> {new Date(order.delivery_deadline).toLocaleString()}</p>
          )}

          {/* Show Upload Proof button only if order is accepted or in-transit */}
          {(order.status === "accepted" || order.status === "in_transit") && (
            <a
              href={`/traveler/deliveries/${order.order_id}/proof`}
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "10px 16px",
                background: "black",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Upload Delivery Proof
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
