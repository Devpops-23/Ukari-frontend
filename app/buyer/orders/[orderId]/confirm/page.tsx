"use client";

import { useRouter } from "next/navigation";

export default function ConfirmDelivery({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const token = "YOUR_BUYER_TOKEN";

  async function confirm() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/buyer/orders/${params.orderId}/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );

    router.push(`/buyer/orders/${params.orderId}/rate`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Confirm Delivery</h1>

      <button
        onClick={confirm}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Confirm Delivery
      </button>
    </div>
  );
}
