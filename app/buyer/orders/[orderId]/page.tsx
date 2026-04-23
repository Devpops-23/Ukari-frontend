export default async function BuyerOrderDetails({ params }: { params: { orderId: string } }) {
  const token = "YOUR_BUYER_TOKEN";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/buyer/orders/${params.orderId}?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div style={{ padding: 20 }}>Failed to load order.</div>;
  }

  const data = await res.json();
  const order = data.order;

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Details</h1>

      <div style={card}>
        <p><strong>Item:</strong> {order.item_name}</p>
        <p><strong>Store:</strong> {order.store_name}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Traveler:</strong> {order.traveler_id || "Not assigned yet"}</p>
      </div>

      <a href={`/buyer/orders/${order.id}/track`} style={button}>
        Track Order
      </a>
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
