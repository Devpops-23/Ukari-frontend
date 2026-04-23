"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RateTraveler({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const token = "YOUR_BUYER_TOKEN";

  const [rating, setRating] = useState(5);

  async function submitRating() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API}/buyer/orders/${params.orderId}/rate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating }),
      }
    );

    router.push("/buyer/history");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Rate Traveler</h1>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={{ padding: 12, marginBottom: 20 }}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r} Stars</option>
        ))}
      </select>

      <button
        onClick={submitRating}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit Rating
      </button>
    </div>
  );
}
