"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TravelerOnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // Fetch onboarding status
  useEffect(() => {
    async function loadStatus() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/traveler/onboarding`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Onboarding load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  async function startStripeOnboarding() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/onboarding-link`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start onboarding");
      }
    } catch (err) {
      alert("Error starting onboarding");
    }
  }

  async function completeOnboarding() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/traveler/onboarding/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        router.push("/traveller/dashboard");
      } else {
        alert("Unable to complete onboarding");
      }
    } catch (err) {
      alert("Error completing onboarding");
    }
  }

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading onboarding...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Traveler Onboarding
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-xl">
        <p className="text-gray-700">
          <span className="font-semibold">Stripe Status:</span>{" "}
          {status?.stripe_status || "Unknown"}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Verification:</span>{" "}
          {status?.verification || "Pending"}
        </p>

        {status?.needs_stripe_onboarding && (
          <button
            onClick={startStripeOnboarding}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Continue Stripe Onboarding
          </button>
        )}

        {status?.can_complete && (
          <button
            onClick={completeOnboarding}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Complete Onboarding
          </button>
        )}

        {status?.is_complete && (
          <button
            onClick={() => router.push("/traveller/dashboard")}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </main>
  );
}

