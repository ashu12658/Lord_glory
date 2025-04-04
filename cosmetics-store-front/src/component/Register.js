import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Ensure correct path

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!isEmailValid(email)) {
      setMessage("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("${process.env.REACT_APP_API_URL}/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Create an Account</h2>

        {message && (
          <p
            className={`text-sm text-center p-2 rounded-md mb-3 ${
              message.includes("success") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
