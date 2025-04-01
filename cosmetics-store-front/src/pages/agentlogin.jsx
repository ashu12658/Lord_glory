import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { jwtDecode } from "jwt-decode";

const AgentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError("");
    setLoading(true);
  
    try {
      console.log("Sending login request...");
      const response = await axios.post(
        "http://localhost:5000/api/agents/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Login response:", response.data);
  
      if (response.data?.token) {
        const decoded = jwtDecode(response.data.token);
        console.log("Decoded Token:", decoded);
  
        const agentId = decoded?.id;
        const agentName = decoded?.name || "Agent";
  
        if (!agentId) {
          throw new Error("Agent ID missing from token!");
        }
  
        // Store token and agent details
        localStorage.setItem("agentToken", response.data.token);
        localStorage.setItem("agentId", agentId);
        localStorage.setItem("agentName", agentName);
  
        login({ token: response.data.token, agentId, name: agentName });
  
        console.log("Stored Agent Name:", agentName);
  
        // ✅ Navigate programmatically to prevent refresh issues
        setTimeout(() => {
          navigate("/agent-dashboard");
        }, 500);
      } else {
        throw new Error("Invalid credentials or missing token.");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Login failed: ${err.response.data.message || 'Invalid credentials.'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError("Login failed: No response from server. Please check your network.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Login failed: An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Agent Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              Logging in...
              <span className="spinner"></span> {/* Add a spinner or loading indicator */}
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default AgentLogin;
