import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ Added phone number state
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = (password) => password.length >= 6;
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone); // ✅ Validate phone number (10 digits)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!isEmailValid(email)) {
      setMessage("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!isPhoneValid(phone)) {
      setMessage("Phone number must be 10 digits.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }), // ✅ Send phone number
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #f1f8ff)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 0px 20px rgba(0, 162, 255, 0.5)", // Glowing blue effect
          width: "100%",
          maxWidth: "450px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Bouncing Logo Animation */}
        <motion.img
          src={logo}
          alt="Lord Glory"
          style={{ width: "80px", marginBottom: "10px" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Tagline */}
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0077cc", marginBottom: "10px" }}>
          Welcome to <span style={{ color: "#0059b3" }}>Lord Glory</span>
        </h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          🌿 Say goodbye to skin problems! Experience luxury skincare for a 
          <strong> flawless</strong> and <strong> glowing</strong> look.
        </p>

        {/* Message Display */}
        {message && (
          <p
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: message.includes("success") ? "#e0ffe0" : "#ffe0e0",
              color: message.includes("success") ? "#008000" : "#cc0000",
              marginBottom: "15px",
            }}
          >
            {message}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <input
            type="text"
            placeholder="Phone Number" // ✅ Added phone input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#0077cc",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              transition: "0.3s",
              border: "none",
              outline: "none",
              boxShadow: "0px 4px 10px rgba(0, 162, 255, 0.3)",
            }}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        {/* Login Link */}
        <p style={{ fontSize: "13px", color: "#555", marginTop: "15px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#0077cc", fontWeight: "bold", textDecoration: "none" }}>
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
