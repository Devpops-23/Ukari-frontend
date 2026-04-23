import { redirect } from "next/navigation";

export default async function OrderDetails({ params }: { params: { orderId: string } }) {
  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth
  const orderId = params.orderId;

  // Fetch order details
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/traveler/orders/${orderId}?token=${token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Order Details</h1>
        <p>Failed to load order details.</p>
      </div>
    );
  }

  const data = await res.json();
  const order = data.order;

  // SERVER ACTION: Accept Order
  async function acceptOrder() {
    "use server";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/traveler/orders/${orderId}/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to accept order");
    }

    // Redirect traveler to My Deliveries
    redirect("/traveler/deliveries");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Details</h1>

      <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
        <p><strong>Item:</strong> {order.item_name}</p>
        <p><strong>Store:</strong> {order.store_name}</p>
        <p><strong>Price:</strong> ${order.amount}</p>
        <p><strong>Delivery To:</strong> {order.delivery_location}</p>
        <p><strong>Buyer Notes:</strong> {order.buyer_notes || "None"}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      <form action={acceptOrder}>
        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "black",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Accept Order
        </button>
      </form>
    </div>
  );
}
