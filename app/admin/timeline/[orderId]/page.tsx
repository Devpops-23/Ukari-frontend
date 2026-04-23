"use client";

import { useEffect, useState } from "react";

export default function AdminOrderTimeline({ params }: { params: { orderId: string } }) {
  const token = "YOUR_ADMIN_TOKEN"; // Replace with real admin token
  const orderId = params.orderId;

  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTimeline() {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/admin/orders/${orderId}/timeline?token=${token}`
    );

    const data = await res.json();
    setTimeline(data.timeline || null);
    setLoading(false);
  }

  useEffect(() => {
    fetchTimeline();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading timeline...</div>;
  }

  if (!timeline) {
    return <div style={{ padding: 20 }}>No timeline found.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Timeline #{orderId}</h1>

      {Object.entries(timeline).map(([section, events]: any) => (
        <div key={section} style={card}>
          <h2 style={{ marginBottom: 10 }}>{formatTitle(section)}</h2>

          {events.length === 0 && <p>No events recorded.</p>}

          {events.map((e: any, idx: number) => (
            <div key={idx} style={eventRow}>
              <p><strong>{e.event}</strong></p>
              <p>{new Date(e.timestamp).toLocaleString()}</p>

              {e.details && (
                <pre style={detailsBox}>{JSON.stringify(e.details, null, 2)}</pre>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function formatTitle(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const card = {
  border: "1px solid #ccc",
  padding: 20,
  borderRadius: 8,
  marginBottom: 30,
};

const eventRow = {
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const detailsBox = {
  background: "#f7f7f7",
  padding: 10,
  borderRadius: 6,
  marginTop: 6,
  fontSize: 13,
};
