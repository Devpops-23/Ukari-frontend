"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateOrder() {
  const router = useRouter();

  const token = "YOUR_BUYER_TOKEN"; // Replace with real token

  const [itemName, setItemName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [amount, setAmount] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");

  async function submitOrder(e: any) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/buyer/orders/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          item_name: itemName,
          store_name: storeName,
          amount,
          delivery_location: deliveryLocation,
          buyer_notes: notes,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to create order");
      return;
    }

    const data = await res.json();
    router.push(`/buyer/orders/${data.order_id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Order</h1>

      <form onSubmit={submitOrder} style={{ marginTop: 20 }}>
        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Delivery Location"
          value={deliveryLocation}
          onChange={(e) => setDeliveryLocation(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...inputStyle, height: 80 }}
        />

        <button type="submit" style={buttonStyle}>
          Submit Order
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "12px 20px",
  background: "black",
  color: "white",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
