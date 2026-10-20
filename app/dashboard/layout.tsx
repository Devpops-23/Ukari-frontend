"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id?: number;
  email?: string;
  full_name?: string;
  role?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifySession = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:8000";
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          router.push("/login?expired=true");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        // Network drop or backend temporarily restarting: don't kick user out immediately
      }
    };

    verifySession();
  }, [router]);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Trips", href: "/dashboard/trips", icon: "💼" },
    { name: "Deliveries", href: "/traveler/deliveries", icon: "📦" },
    { name: "Orders", href: user?.role === "buyer" ? "/buyer/orders" : "/dashboard/orders", icon: "🛒" },
    { name: "Earnings", href: "/dashboard/earnings/trips", icon: "💰" },
    { name: "Payouts", href: "/dashboard/payouts", icon: "💳" },
    { name: "Onboarding", href: "/traveler/onboarding", icon: "🚀" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const roleText =
    user?.role === "buyer"
      ? "Buyer Portal"
      : user?.role === "admin"
      ? "Admin Portal"
      : "Traveler Portal";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Mobile Top Navbar */}
      <header
        className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30"
        style={{ padding: "12px 18px" }}
      >
        <div>
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
            <span
              style={{
                width: "28px",
                height: "28px",
                minWidth: "28px",
                minHeight: "28px",
                backgroundColor: "#059669",
                color: "#ffffff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "13px",
              }}
            >
              U
            </span>
            <span style={{ fontSize: "19px", fontWeight: 900, color: "#059669", letterSpacing: "-0.03em" }}>
              U-KARI
            </span>
          </Link>
          <div style={{ marginTop: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "2px 9px",
                borderRadius: "9999px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                backgroundColor:
                  user?.role === "buyer"
                    ? "#eff6ff"
                    : user?.role === "admin"
                    ? "#faf5ff"
                    : "#ecfdf5",
                color:
                  user?.role === "buyer"
                    ? "#0284c7"
                    : user?.role === "admin"
                    ? "#7e22ce"
                    : "#047857",
                border:
                  user?.role === "buyer"
                    ? "1px solid #bfdbfe"
                    : user?.role === "admin"
                    ? "1px solid #e9d5ff"
                    : "1px solid #a7f3d0",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor:
                    user?.role === "buyer"
                      ? "#0284c7"
                      : user?.role === "admin"
                      ? "#9333ea"
                      : "#10b981",
                }}
              />
              <span>{roleText}</span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop persistent, Mobile slide-in drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 w-64 bg-white border-r border-slate-100 p-6 flex flex-col z-50 transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "17px",
                  boxShadow: "0 2px 6px rgba(5, 150, 105, 0.25)",
                }}
              >
                U
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#059669",
                  lineHeight: 1,
                }}
              >
                U-KARI
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Role badge placed cleanly under app name with generous spacing */}
          <div style={{ marginTop: "12px", paddingLeft: "2px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "5px 12px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                backgroundColor:
                  user?.role === "buyer"
                    ? "#eff6ff"
                    : user?.role === "admin"
                    ? "#faf5ff"
                    : "#ecfdf5",
                color:
                  user?.role === "buyer"
                    ? "#0284c7"
                    : user?.role === "admin"
                    ? "#7e22ce"
                    : "#047857",
                border:
                  user?.role === "buyer"
                    ? "1px solid #bfdbfe"
                    : user?.role === "admin"
                    ? "1px solid #e9d5ff"
                    : "1px solid #a7f3d0",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor:
                    user?.role === "buyer"
                      ? "#0284c7"
                      : user?.role === "admin"
                      ? "#9333ea"
                      : "#10b981",
                  boxShadow:
                    user?.role === "buyer"
                      ? "0 0 0 2px #dbeafe"
                      : user?.role === "admin"
                      ? "0 0 0 2px #f3e8ff"
                      : "0 0 0 2px #d1fae5",
                }}
              />
              <span>{roleText}</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 text-slate-600 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold shadow-2xs"
                    : "hover:bg-slate-50 hover:text-slate-900 text-slate-600"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Card & Logout Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          {user && (
            <div className="mb-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs shrink-0 ${
                  user?.role === "buyer"
                    ? "bg-sky-600"
                    : user?.role === "admin"
                    ? "bg-purple-600"
                    : "bg-emerald-600"
                }`}
              >
                {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {user.full_name || "Account"}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user.email || ""}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-[11px] text-slate-400 hover:text-slate-700 transition"
            >
              ← Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
