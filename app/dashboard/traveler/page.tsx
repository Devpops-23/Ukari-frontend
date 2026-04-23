"use client";

export default function TravelerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Traveler Dashboard</h1>

      <button
        onClick={async () => {
          const token = localStorage.getItem("access_token");
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/connect-link?token=${token}`,
            { method: "POST" }
          );
          const data = await res.json();
          window.location.href = data.url;
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Connect Payout Account
      </button>
    </div>
  );
}

