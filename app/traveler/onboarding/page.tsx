"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TravelerOnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch onboarding status
  useEffect(() => {
    async function loadStatus() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (!token) return;

        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8000";

        const res = await fetch(`${apiBase}/traveler/onboarding`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Onboarding load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [router]);

  async function startStripeOnboarding() {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000";

      const res = await fetch(`${apiBase}/stripe/connect/onboarding-link`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to generate Stripe onboarding link");
      }
    } catch (err: any) {
      alert(err.message || "Error starting onboarding");
    } finally {
      setActionLoading(false);
    }
  }

  async function completeOnboarding() {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000";

      const res = await fetch(`${apiBase}/traveler/onboarding/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Unable to finalize onboarding");
      }
    } catch (err: any) {
      alert(err.message || "Error completing onboarding");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-500 py-10">
        <svg className="animate-spin h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="text-sm font-medium">Loading onboarding requirements...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Traveler Onboarding
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete identity verification and payout setup to unlock traveler delivery assignments.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-100 space-y-6">
        <div className="space-y-4">
          {/* Step 1: Stripe Verification */}
          <div className="flex items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Stripe Payouts Setup</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your banking account for direct deposit transfers.
              </p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                status?.stripe_status === "active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {status?.stripe_status === "active" ? "Connected" : "Action Required"}
            </span>
          </div>

          {/* Step 2: Account Status */}
          <div className="flex items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">2. Profile Verification</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your travel eligibility and compliance terms.
              </p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                status?.onboarding_completed
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {status?.onboarding_completed ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={startStripeOnboarding}
            disabled={actionLoading}
            className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs transition active:scale-98 disabled:opacity-50 cursor-pointer text-center"
          >
            {actionLoading ? "Loading..." : "Open Stripe Onboarding"}
          </button>

          <button
            onClick={completeOnboarding}
            disabled={actionLoading}
            className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
          >
            Finalize & Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
