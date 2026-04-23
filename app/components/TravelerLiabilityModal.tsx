"use client";

import { useState } from "react";

export default function TravelerLiabilityModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Traveler Liability Agreement</h2>

        <p className="mb-4 text-gray-700">
          If you fail to deliver this item within 10 days, you will be charged the full item cost.
          There are no returns. By accepting this delivery, you agree to these terms.
        </p>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>I understand and agree to these terms.</span>
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className={`w-full py-2 rounded text-white ${
            checked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Accept Delivery
        </button>
      </div>
    </div>
  );
}
