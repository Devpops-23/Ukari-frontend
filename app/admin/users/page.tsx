"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if admin not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");
  }, [router]);

  // Load all users
  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Admin users load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function toggleBan(userId: number, currentStatus: boolean) {
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
        // Update UI
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === userId ? { ...u, banned: !currentStatus } : u
          )
        );
      } else {
        alert(data.error || "Unable to update user status");
      }
    } catch (err) {
      alert("Error updating user status");
    }
  }

  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        All Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.user_id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h3>

              <p className="text-gray-600 mt-2">
                Email: {user.email}
              </p>

              <p className="text-gray-600 mt-1">
                Role:{" "}
                <span className="font-semibold capitalize">
                  {user.role}
                </span>
              </p>

              <p className="text-gray-600 mt-1">
                Stripe Status:{" "}
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

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    router.push(`/admin/users/${user.user_id}`)
                  }
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  View User
                </button>

                <button
                  onClick={() => toggleBan(user.user_id, user.banned)}
                  className={`px-4 py-2 rounded-lg ${
                    user.banned
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {user.banned ? "Unban User" : "Ban User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
