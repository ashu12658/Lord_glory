import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import logo from "../assets/logo.png";
import "./style/LoginPage.css"

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL + "/auth/login";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();
    console.log(data)
      if (!response.ok) throw new Error(data.message || "Login failed");

      const { token, user } = data;
      if (!token || typeof user.isAdmin === "undefined") {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login({ token, ...user }, user.isAdmin ? "admin" : "user");
      navigate(user.isAdmin ? "/admin-dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="brand-name">SkinCare</h1>
          <p className="brand-tagline">Your journey to healthier skin starts here.</p>
        </div>
        
        <h2 className="login-heading">Welcome Back</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            className="login-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : "Login"}
          </button>
        </form>
        
        <p className="signup-text">
          Don't have an account? <a href="/register" className="signup-link">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
