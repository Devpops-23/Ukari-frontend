export default async function TravelerHome() {
  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/traveler/orders/available?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div>
        <h1>Available Orders</h1>
        <p>Failed to load orders.</p>
      </div>
    );
  }

  const data = await res.json();
  const orders = data.orders || [];

  return (
    <div>
      <h1>Available Orders</h1>

      {orders.length === 0 && <p>No available orders right now.</p>}

      {orders.map((order: any) => (
        <div key={order.order_id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
          <p><strong>Item:</strong> {order.item_name}</p>
          <p><strong>Delivery To:</strong> {order.delivery_location}</p>
          <p><strong>Price:</strong> ${order.amount}</p>
        </div>
      ))}
    </div>
  );
}

