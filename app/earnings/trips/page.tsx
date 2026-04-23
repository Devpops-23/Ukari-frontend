{/* View Proof Button */}
{order.status !== "pending" && (
  <button
    onClick={() => setViewingImage(order.order_id)}
    className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
  >
    View Proof
  </button>
)}
