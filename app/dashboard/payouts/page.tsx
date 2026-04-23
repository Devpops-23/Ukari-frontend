"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PayoutsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Not Connected");
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  async function startOnboarding() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/onboard`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function refreshStatus() {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await res.json();

      setStatus(data.status || "Unknown");
      setAccountId(data.account_id || "");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Payouts</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <p className="text-gray-700">
          <strong>Status:</strong> {status}
        </p>

        {accountId && (
          <p className="text-gray-700">
            <strong>Stripe Account ID:</strong> {accountId}
          </p>
        )}

        <button
          onClick={startOnboarding}
          disabled={loading}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Start Stripe Onboarding"}
        </button>

        <button
          onClick={refreshStatus}
          disabled={loading}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
