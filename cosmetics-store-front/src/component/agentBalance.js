import React, { useState, useEffect } from "react";
import axios from "axios";

const AgentBalance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const agentId = localStorage.getItem("agentId"); // ✅ Fetch agentId correctly
        const token = localStorage.getItem("agentToken"); // ✅ Include token

        if (!agentId || !token) {
          throw new Error("Agent ID or token missing!");
        }

        const response = await axios.get(
          `http://localhost:5000/api/agents/balance/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setBalance(response.data.balance);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Error fetching balance. Please try again.");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <h2>Agent Balance</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Your balance: ₹{balance || "0.00"}</p>
      )}
    </div>
  );
};

export default AgentBalance;
