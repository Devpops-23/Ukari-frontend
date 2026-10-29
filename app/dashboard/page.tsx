

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardMetrics {
  total_orders: number;
  active_orders: number;
  delivered_orders: number;
}

interface DashboardUser {
  full_name?: string;
}

interface ShoppingOrder {
  id?: string | number;
  order_id?: string | number;
  product_title?: string;
  title?: string;
  status?: string;
  created_at?: string;
}

function getOrderTitle(order: ShoppingOrder, index: number) {
  return (
    order.product_title ||
    order.title ||
    `Shopping Request #${order.id ?? order.order_id ?? index + 1}`
  );
}

export default function DashboardHomePage() {
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_orders: 0,
    active_orders: 0,
    delivered_orders: 0,
  });

  const [orders, setOrders] = useState<ShoppingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as DashboardUser);
      } catch {
        setUser(null);
      }
    }

    let cancelled = false;

    async function loadData() {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:8000"
      ).replace(/\/+$/, "");

      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        // Load buyer dashboard metrics.
        const metricsResponse = await fetch(
          `${apiBase}/buyer/dashboard`,
          { headers }
        );

        if (!metricsResponse.ok) {
          throw new Error(
            `Unable to load dashboard (${metricsResponse.status}).`
          );
        }

        const metricsData = await metricsResponse.json();

        // Load recent buyer shopping requests.
        const ordersResponse = await fetch(
          `${apiBase}/buyer/orders`,
          { headers }
        );

        if (!ordersResponse.ok) {
          throw new Error(
            `Unable to load orders (${ordersResponse.status}).`
          );
        }

        const ordersData = await ordersResponse.json();

        if (cancelled) return;

        setMetrics({
          total_orders: Number(metricsData.total_orders ?? 0),
          active_orders: Number(metricsData.active_orders ?? 0),
          delivered_orders: Number(
            metricsData.delivered_orders ?? 0
          ),
        });

        const orderList: unknown = Array.isArray(ordersData)
          ? ordersData
          : ordersData?.orders;

        setOrders(
          Array.isArray(orderList)
            ? (orderList as ShoppingOrder[])
            : []
        );
      } catch (err) {
        if (!cancelled) {
          console.error("Buyer dashboard error:", err);

          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong loading your dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="space-y-8">
      {/* Welcome header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Buyer Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back
            {user?.full_name ? `, ${user.full_name}` : ""}!
            Shop online and arrange delivery through U-KARI.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.amazon.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-500"
          >
            Shop Amazon
          </a>

          <a
            href="https://www.walmart.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Shop Walmart
          </a>
        </div>
      </section>

      {/* Buyer metrics */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Orders
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-900">
              {metrics.total_orders}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              All shopping requests
            </p>
          </div>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            🛒
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Orders
            </p>
            <h2 className="mt-2 text-3xl font-black text-amber-500">
              {metrics.active_orders}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Awaiting fulfillment or delivery
            </p>
          </div>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
            📦
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Delivered Orders
            </p>
            <h2 className="mt-2 text-3xl font-black text-emerald-600">
              {metrics.delivered_orders}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Successfully delivered
            </p>
          </div>

          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
            ✅
          </span>
        </div>
      </section>

      {/* Shopping actions */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <a
          href="https://www.amazon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 transition hover:shadow-md"
        >
          <span className="mb-2 block text-2xl">🛒</span>
          <h3 className="font-bold text-gray-900">
            Shop Amazon
          </h3>
          <p className="mt-1 text-xs text-gray-600">
            Browse products and copy product links for your U-KARI
            shopping request.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-orange-700">
            Browse Amazon →
          </span>
        </a>

        <a
          href="https://www.walmart.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 transition hover:shadow-md"
        >
          <span className="mb-2 block text-2xl">🏬</span>
          <h3 className="font-bold text-gray-900">
            Shop Walmart
          </h3>
          <p className="mt-1 text-xs text-gray-600">
            Find items you want and arrange delivery through a
            U-KARI traveler.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-blue-700">
            Browse Walmart →
          </span>
        </a>

        <Link
          href="/dashboard/orders"
          className="block rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 transition hover:shadow-md"
        >
          <span className="mb-2 block text-2xl">📦</span>
          <h3 className="font-bold text-gray-900">
            Track Shopping Requests
          </h3>
          <p className="mt-1 text-xs text-gray-600">
            Review your requests and check their delivery status.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
            View Orders →
          </span>
        </Link>
      </section>

      {/* Recent shopping requests */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Shopping Requests
          </h2>

          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View All Orders →
          </Link>
        </div>

        {loading ? (
          <p className="py-4 text-sm text-gray-500">
            Loading your shopping requests...
          </p>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
            <p className="mt-1 text-xs text-red-600">
              Verify that your backend is running and the buyer
              API endpoints exist.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-gray-50 py-10 text-center">
            <span className="mb-2 block text-3xl">🛍️</span>
            <p className="text-sm font-semibold text-gray-700">
              No orders created yet
            </p>
            <p className="mb-4 mt-1 text-xs text-gray-500">
              Browse Amazon or Walmart, then create your first
              shopping request.
            </p>

            <Link
              href="/dashboard/orders/create"
              className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              Create Shopping Request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order, index) => (
              <div
                key={
                  order.id ??
                  order.order_id ??
                  `${order.product_title ?? order.title ?? "order"}-${index}`
                }
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {getOrderTitle(order, index)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.created_at &&
                    !Number.isNaN(Date.parse(order.created_at))
                      ? new Date(order.created_at).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {order.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
