import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/style/forgotPassword.css"; // Add CSS for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP/Login or Reset Password
  const [loginMode, setLoginMode] = useState(false); // Track if user is logging in with OTP
  const navigate = useNavigate();

  // ✅ Request OTP for Login or Password Reset
  const requestOtp = async () => {
    try {
      const endpoint = loginMode 
        ? "${process.env.REACT_APP_API_URL}/api/otp/login-otp" // OTP Login
        : "${process.env.REACT_APP_API_URL}/api/otp/request-otp"; // Forgot Password OTP

      await axios.post(endpoint, { email });
      alert(`✅ OTP sent to ${email}!`);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      alert(`⚠️ ${err.response?.data?.message || "Error sending OTP"}`);
    }
  };

  // ✅ Verify OTP for Login or Reset Password
  const verifyOtp = async () => {
    try {
      if (loginMode) {
        // ✅ Login using OTP
        const res = await axios.post("${process.env.REACT_APP_API_URL}/api/otp/verify-login-otp", { email, otp });
  
        if (res.data.token) {
          localStorage.setItem("token", res.data.token); // ✅ Store token
          localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ Store user details
  
          alert("🎉 Login successful!");
          navigate("/products"); // ✅ Redirect to dashboard
        } else {
          alert("⚠️ Login failed, token missing.");
        }
      } else {
        // ✅ Reset Password
        await axios.post("${process.env.REACT_APP_API_URL}/api/otp/reset-password", { email, otp, newPassword });
        alert("✅ Password reset successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      alert(`⚠️ ${err.response?.data?.message || "Invalid OTP or error"}`);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>{loginMode ? "🔑 Login with OTP" : "🔐 Forgot Password"}</h2>

      {step === 1 ? (
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
          />
          <button onClick={requestOtp}>Request OTP</button>

          {/* Toggle Between Login with OTP & Forgot Password */}
          <p onClick={() => setLoginMode(!loginMode)} className="toggle-mode">
            {loginMode ? "Forgot Password?" : "Login with OTP"}
          </p>
        </div>
      ) : (
        <div>
          <label>OTP:</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Enter OTP" 
          />

          {!loginMode && (
            <>
              <label>New Password:</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter new password" 
              />
            </>
          )}

          <button onClick={verifyOtp}>
            {loginMode ? "Login with OTP" : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
