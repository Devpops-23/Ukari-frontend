"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadDeliveryProof({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const orderId = params.orderId;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = "YOUR_TRAVELER_TOKEN"; // Replace with real token from auth

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a photo first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/traveler/order/${orderId}/delivered`,
      {
        method: "POST",
        body: formData,
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.detail || "Upload failed.");
      return;
    }

    // Redirect to My Deliveries after success
    router.push("/traveler/deliveries");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload Delivery Proof</h1>

      <form onSubmit={handleUpload} style={{ marginTop: 20 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: 12 }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: loading ? "#555" : "black",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </form>
    </div>
  );
}

