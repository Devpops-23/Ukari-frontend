"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Not logged in → login
    if (!token) {
      router.replace("/login");
      return;
    }

    // 2. Logged in → check onboarding status
    async function checkStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/connect/account-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        // Not onboarded → go to onboarding
        if (!data.charges_enabled || !data.payouts_enabled) {
          router.replace("/traveler/onboarding");
          return;
        }

        // Fully onboarded → dashboard
        router.replace("/dashboard");
      } catch (err) {
        router.replace("/login");
      }
    }

    checkStatus();
  }, []);

  return null;
}


