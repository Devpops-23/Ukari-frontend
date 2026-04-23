export default function BuyerHome() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Buyer Dashboard</h1>

      <a
        href="/buyer/orders/new"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        Create New Order
      </a>

      <br /><br />

      <a
        href="/buyer/history"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          background: "#444",
          color: "white",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        View Order History
      </a>
    </div>
  );
}
