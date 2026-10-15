"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserDetailPage({ params }: any) {
  const router = useRouter();
  const { userId } = params;

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if admin not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");
  }, [router]);

  // Load user details + orders + disputes
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setUser(data.user || null);
        setOrders(data.orders || []);
        setDisputes(data.disputes || []);
      } catch (err) {
        console.error("Admin user detail load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  async function toggleBan(currentStatus: boolean) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/ban`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ banned: !currentStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser((prev: any) => ({ ...prev, banned: !currentStatus }));
      } else {
        alert(data.error || "Unable to update user status");
      }
    } catch (err) {
      alert("Error updating user status");
    }
  }

  if (loading || !user) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading user details...</p>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {user.name}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* User Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700">User Info</h2>
          <p className="text-gray-600 mt-2">Email: {user.email}</p>
          <p className="text-gray-600 mt-1">Role: {user.role}</p>
          <p className="text-gray-600 mt-1">
            Stripe Onboarding:{" "}
            <span className="font-semibold">
              {user.stripe_onboarded ? "Completed" : "Pending"}
            </span>
          </p>
          <p className="text-gray-600 mt-1">
            Verification:{" "}
            <span className="font-semibold">
              {user.verified ? "Verified" : "Not Verified"}
            </span>
          </p>

          {user.banned && (
            <p className="text-red-600 font-semibold mt-1">
              Account Banned
            </p>
          )}

          <button
            onClick={() => toggleBan(user.banned)}
            className={`mt-4 px-4 py-2 rounded-lg ${
              user.banned
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {user.banned ? "Unban User" : "Ban User"}
          </button>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Orders by User
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600 mt-2">No orders found.</p>
          ) : (
            <div className="space-y-3 mt-3">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="border p-4 rounded-lg bg-gray-50"
                >
                  <p className="text-gray-700 font-semibold">
                    Order #{order.order_id}
                  </p>
                  <p className="text-gray-600">Item: {order.item_name}</p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-semibold text-emerald-600">
                      {order.status}
                    </span>
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/admin/orders/${order.order_id}`)
                    }
                    className="mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg"
                  >
                    View Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disputes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700">
            Disputes by User
          </h2>

          {disputes.length === 0 ? (
            <p className="text-gray-600 mt-2">No disputes found.</p>
          ) : (
            <div className="space-y-3 mt-3">
              {disputes.map((d) => (
                <div
                  key={d.dispute_id}
                  className="border p-4 rounded-lg bg-gray-50"
                >
                  <p className="text-gray-700 font-semibold">
                    Dispute #{d.dispute_id}
                  </p>
                  <p className="text-gray-600">
                    Order ID: {d.order_id}
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-semibold capitalize text-red-600">
                      {d.status}
                    </span>
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/admin/disputes/${d.dispute_id}`)
                    }
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    View Dispute
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
