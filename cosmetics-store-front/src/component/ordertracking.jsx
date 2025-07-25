import { useState } from "react";
import axios from "axios";

const OrderTrackingUpdate = ({ orderId }) => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!location || !status) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/tracking`, {
        location,
        status,
      });

      alert("📦 Tracking updated successfully!");
      setLocation("");
      setStatus("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update tracking");
    }
  };

  return (
    <div style={{
      marginTop: 30,
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 10,
      background: "#f4f4f4"
    }}>
      <h3>📍 Update Tracking Info</h3>
      
      <input
        type="text"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 6,
          border: "1px solid #bbb"
        }}
      />

      <input
        type="text"
        placeholder="Enter Status (e.g. Shipped, Out for delivery)"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 6,
          border: "1px solid #bbb"
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Update Tracking
      </button>
    </div>
  );
};

export default OrderTrackingUpdate;
