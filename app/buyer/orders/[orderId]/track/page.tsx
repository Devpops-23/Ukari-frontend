export default async function TrackOrder({ params }: { params: { orderId: string } }) {
  const token = "YOUR_BUYER_TOKEN";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/buyer/orders/${params.orderId}/track?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div style={{ padding: 20 }}>Failed to load tracking.</div>;
  }

  const data = await res.json();
  const order = data.order;

  return (
    <div style={{ padding: 20 }}>
      <h1>Track Order</h1>

      <div style={card}>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Traveler:</strong> {order.traveler_id || "Not assigned"}</p>

        {order.delivered_at && (
          <p><strong>Delivered At:</strong> {new Date(order.delivered_at).toLocaleString()}</p>
        )}
      </div>

      {order.status === "delivered" && (
        <a href={`/buyer/orders/${order.id}/confirm`} style={button}>
          Confirm Delivery
        </a>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  padding: 16,
  borderRadius: 8,
  marginBottom: 20,
};

const button = {
  display: "inline-block",
  padding: "12px 20px",
  background: "black",
  color: "white",
  borderRadius: 6,
  textDecoration: "none",
};
