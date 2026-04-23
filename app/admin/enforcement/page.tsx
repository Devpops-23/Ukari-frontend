"use client";

import { useEffect, useState } from "react";

export default function AdminEnforcementLogs() {
  const token = "YOUR_ADMIN_TOKEN";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/admin/enforcement/logs?token=${token}`
    );

    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading enforcement logs...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Enforcement Logs</h1>

      {logs.length === 0 && <p>No enforcement actions recorded.</p>}

      {logs.map((log: any, idx: number) => (
        <div key={idx} style={card}>
          <p><strong>Order ID:</strong> {log.order_id}</p>
          <p><strong>Traveler ID:</strong> {log.traveler_id}</p>
          <p><strong>Action:</strong> {log.action}</p>
          <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>

          {log.details && (
            <pre style={detailsBox}>{JSON.stringify(log.details, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  padding: 20,
  borderRadius: 8,
  marginBottom: 20,
};

const detailsBox = {
  background: "#f7f7f7",
  padding: 10,
  borderRadius: 6,
  marginTop: 6,
  fontSize: 13,
};
