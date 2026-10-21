"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PayoutsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Checking...");
  const [accountId, setAccountId] = useState("");
  const [payoutsEnabled, setPayoutsEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check if redirected back from Stripe onboarding
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("status") === "success" || params.get("complete") === "1") {
        setSuccessMessage("Stripe onboarding completed! Refreshing your account status...");
      }
    }

    refreshStatus();
  }, [router]);

  async function startOnboarding() {
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000";

      const res = await fetch(`${apiBase}/stripe/onboard`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.detail || "Unable to start Stripe onboarding. Please try again.");
      }
    } catch (err: any) {
      console.error("Stripe onboarding error:", err);
      alert(err.message || "Network error starting Stripe onboarding");
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus() {
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000";

      const res = await fetch(`${apiBase}/stripe/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStatus(data.status || "not_connected");
      setAccountId(data.account_id || "");
      setPayoutsEnabled(Boolean(data.payouts_enabled));
    } catch (err) {
      console.error("Payout status check error:", err);
      setStatus("Error checking status");
    } finally {
      setLoading(false);
    }
  }

  const isConnected = accountId && !accountId.startsWith("acct_mock_");
  const isMock = accountId && accountId.startsWith("acct_mock_");

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Payouts & Banking
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up your bank account or debit card via Stripe to receive direct deposits when you complete deliveries.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span>✓</span>
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              S
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Stripe Express Connect
              </h3>
              <p className="text-xs text-slate-500">
                Encrypted bank transfers powered by Stripe
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              payoutsEnabled || status === "active"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : status === "pending"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                payoutsEnabled || status === "active"
                  ? "bg-emerald-500"
                  : status === "pending"
                  ? "bg-amber-500"
                  : "bg-slate-400"
              }`}
            />
            {payoutsEnabled || status === "active"
              ? "Active / Verified"
              : status === "pending"
              ? "Pending Verification"
              : "Not Connected"}
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Connected Account ID:</span>
            <span className="font-mono font-medium text-slate-800">
              {accountId ? (
                <span>{accountId}</span>
              ) : (
                <span className="text-slate-400 italic">No account created yet</span>
              )}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Direct Deposits:</span>
            <span className="font-medium text-slate-800">
              {payoutsEnabled ? "Enabled" : "Awaiting Verification"}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={startOnboarding}
            disabled={loading}
            className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Connecting to Stripe...</span>
              </>
            ) : isConnected ? (
              "Update Stripe Payout Details"
            ) : (
              "Start Stripe Onboarding"
            )}
          </button>

          <button
            onClick={refreshStatus}
            disabled={loading}
            className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
