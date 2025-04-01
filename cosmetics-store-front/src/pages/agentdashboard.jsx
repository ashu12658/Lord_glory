import React, { useState, useEffect } from "react";
import AgentOrders from "../component/agentOrder";
import AgentDashboardProducts from "../component/agentproduct";
import AgentOrderForm from "../component/orderProduct";
import AgentBalance from "../component/agentBalance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [agentName, setAgentName] = useState("Agent");
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("agentToken");

    if (!token) {
      navigate("/agent/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setAgentName(decoded.name || decoded.email || "Agent");

        // Fetch agent's order count
        fetch("http://localhost:5000/api/agents/orders-count", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setOrderCount(data.orderCount);
            }
          })
          .catch((error) => console.error("Error fetching agent order count", error));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "20px",
        textAlign: "center",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: "#007BFF", fontSize: "28px", marginBottom: "10px" }}
      >
        Welcome, {agentName}! 🎉
      </motion.h1>

      {/* Display Agent's Order Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}
      >
        Total Orders with Your Coupon: <span style={{ color: "#007BFF" }}>{orderCount}</span>
      </motion.p>

      <div style={{ marginBottom: "20px" }}>
        {["products", "orders", "orderForm", "balance"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              margin: "5px",
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background: activeTab === tab ? "#007BFF" : "#ccc",
              color: "#fff",
              fontSize: "16px",
              transition: "background 0.3s",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {activeTab === "products" && <AgentDashboardProducts />}
        {activeTab === "orders" && <AgentOrders />}
        {activeTab === "orderForm" && <AgentOrderForm />}
        {activeTab === "balance" && <AgentBalance />}
      </motion.div>
    </motion.div>
  );
};

export default AgentDashboard;
