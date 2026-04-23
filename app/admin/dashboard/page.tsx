"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const token = "YOUR_ADMIN_TOKEN"; // Replace with real admin token

  const [orders, setOrders] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [banned, setBanned] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);

    const [ordersRes, travelersRes, buyersRes, bannedRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API}/admin/orders?token=${token}`),
      fetch(`${process.env.NEXT_PUBLIC_API}/admin/travelers?token=${token}`),
      fetch(`${process.env.NEXT_PUBLIC_API}/admin/buyers?token=${token}`),
      fetch(`${process.env.NEXT_PUBLIC_API}/admin/banned?token=${token}`),
    ]);

    setOrders((await ordersRes.json()).orders || []);
    setTravelers((await travelersRes.json()).travelers || []);
    setBuyers((await buyersRes.json()).buyers || []);
    setBanned((await bannedRes.json()).banned_users || []);

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function adminAction(endpoint: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API}${endpoint}?token=${token}`, {
      method: "POST",
    });
    fetchData();
  }

  if (loading) return <div style={{ padding: 20 }}>Loading admin dashboard...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* ORDERS */}
      <section style={{ marginTop: 30 }}>
        <h2>All Orders</h2>

        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((o: any) => (
          <div key={o.order_id} style={card}>
            <p><strong>Order ID:</strong> {o.order_id}</p>
            <p><strong>Buyer:</strong> {o.buyer_id}</p>
            <p><strong>Traveler:</strong> {o.traveler_id || "Unassigned"}</p>
            <p><strong>Status:</strong> {o.status}</p>
            <p><strong>Delivery:</strong> {o.delivery_location}</p>

            <div style={{ marginTop: 10 }}>
              <button
                style={button}
                onClick={() => adminAction(`/admin/reroute/${o.order_id}`)}
              >
                Reroute
              </button>

              <button
                style={button}
                onClick={() => adminAction(`/admin/repurchase/${o.order_id}`)}
              >
                Repurchase
              </button>

              <button
                style={button}
                onClick={() => adminAction(`/admin/auto-assign/${o.order_id}`)}
              >
                Auto‑Assign
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* TRAVELERS */}
      <section style={{ marginTop: 40 }}>
        <h2>Travelers</h2>

        {travelers.length === 0 && <p>No travelers found.</p>}

        {travelers.map((t: any) => (
          <div key={t.id} style={card}>
            <p><strong>ID:</strong> {t.id}</p>
            <p><strong>Name:</strong> {t.name}</p>
            <p><strong>Rating:</strong> {t.rating}</p>
            <p><strong>Reliability:</strong> {t.reliability_score}</p>
            <p><strong>On‑Time:</strong> {t.on_time}</p>
            <p><strong>Late:</strong> {t.late}</p>
            <p><strong>Cancellations:</strong> {t.cancellations}</p>
            <p><strong>Flight Cancels:</strong> {t.flight_cancels}</p>
          </div>
        ))}
      </section>

      {/* BUYERS */}
      <section style={{ marginTop: 40 }}>
        <h2>Buyers</h2>

        {buyers.length === 0 && <p>No buyers found.</p>}

        {buyers.map((b: any) => (
          <div key={b.id} style={card}>
            <p><strong>ID:</strong> {b.id}</p>
            <p><strong>Name:</strong> {b.name}</p>
            <p><strong>Chargebacks:</strong> {b.chargebacks}</p>
            <p><strong>Returns:</strong> {b.returns}</p>
          </div>
        ))}
      </section>

      {/* BANNED USERS */}
      <section style={{ marginTop: 40 }}>
        <h2>Banned Users</h2>

        {banned.length === 0 && <p>No banned users.</p>}

        {banned.map((u: any) => (
          <div key={u.id} style={card}>
            <p><strong>ID:</strong> {u.id}</p>
            <p><strong>Name:</strong> {u.name}</p>
            <p><strong>Role:</strong> {u.role}</p>
            <p><strong>Chargebacks:</strong> {u.chargebacks}</p>
            <p><strong>Returns:</strong> {u.returns}</p>
          </div>
        ))}
      </section>
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
  padding: "8px 14px",
  background: "black",
  color: "white",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  marginRight: 10,
};
