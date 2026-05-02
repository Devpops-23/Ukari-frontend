"use client";

import { useState } from "react";

export default function TravelerOnboarding() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function startOnboarding() {
    setLoading(true);

    const token = localStorage.getItem("token");

    // 1. Create Stripe account
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/create-account`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 2. Get onboarding link
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/onboarding-link`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  }

  async function checkStatus() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/account-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setStatus(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Traveler Stripe Onboarding</h1>

      <button onClick={startOnboarding} disabled={loading}>
        {loading ? "Redirecting..." : "Start Stripe Onboarding"}
      </button>

      <hr />

      <button onClick={checkStatus}>Check Verification Status</button>

      {status && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}
