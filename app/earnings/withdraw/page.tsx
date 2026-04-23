"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchPayouts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/payouts?token=${token}`
        );
        const data = await res.json();
        setPayouts(data);
      } catch (err) {
        console.error("Payout history error:", err);
      }

      setLoading(false);
    }

    fetchPayouts();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Withdrawal History
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading payout history...</p>
      ) : payouts.length === 0 ? (
        <p className="text-gray-500">No withdrawals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Arrival</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout: any) => (
                <tr key={payout.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {payout.currency.toUpperCase()} ${payout.amount.toFixed(2)}
                  </td>
                  <td className="p-4 capitalize">{payout.status}</td>
                  <td className="p-4">
                    {new Date(payout.created * 1000).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(payout.arrival_date * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


