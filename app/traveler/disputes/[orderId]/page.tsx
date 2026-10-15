"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TravelerDisputeResponsePage({ params }: any) {
  const router = useRouter();
  const { orderId } = params;

  const [responseText, setResponseText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitResponse(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("response_text", responseText);
      if (file) formData.append("evidence", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/traveler/disputes/${orderId}/response`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/deliveries");
      } else {
        alert(data.error || "Unable to submit response");
      }
    } catch (err) {
      alert("Error submitting response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Respond to Dispute
      </h1>

      <form
        onSubmit={submitResponse}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Your Explanation
          </label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="w-full border rounded-lg p-3 h-32"
            placeholder="Explain your side of the dispute..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Evidence (optional)
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {loading ? "Submitting..." : "Submit Response"}
        </button>
      </form>
    </main>
  );
}

