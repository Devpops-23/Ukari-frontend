"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeliveryProofUploadPage({ params }: any) {
  const router = useRouter();
  const { orderId } = params;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitProof(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      if (file) formData.append("proof", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/traveler/deliveries/${orderId}/proof`,
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
        router.push("/traveler/deliveries");
      } else {
        alert(data.error || "Unable to upload delivery proof");
      }
    } catch (err) {
      alert("Error uploading proof");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Upload Delivery Proof
      </h1>

      <form
        onSubmit={submitProof}
        className="bg-white p-6 rounded-xl shadow-md space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Photo or PDF
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </form>
    </main>
  );
}
