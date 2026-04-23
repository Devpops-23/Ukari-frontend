"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateOrderPage() {
  const router = useRouter();

  const [item, setItem] = useState("");
  const [store, setStore] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [reward, setReward] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Backend integration will go here later
    console.log("Order created:", { item, store, pickup, delivery, reward });

    setLoading(false);
    router.push("/dashboard/orders");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create Order</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            required
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="iPhone 15 Pro"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Store</label>
          <input
            type="text"
            required
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Apple Store, Houston"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Pickup Location</label>
          <input
            type="text"
            required
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Houston, TX"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Delivery Location</label>
          <input
            type="text"
            required
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Lagos, Nigeria"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Reward ($)</label>
          <input
            type="number"
            min={1}
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}

