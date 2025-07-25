
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../pages/style/forgotPassword.css"; // Add CSS for styling

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
//   const navigate = useNavigate();

//   // ✅ Request OTP for Password Reset
//   const requestOtp = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/otp/request-otp", { email });
//       alert(`✅ OTP sent to ${email}!`);
//       setStep(2); // Move to OTP verification and reset step
//     } catch (err) {
//       alert(`⚠️ ${err.response?.data?.message || "Error sending OTP"}`);
//     }
//   };

//   // ✅ Verify OTP and Reset Password
//   const resetPassword = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/otp/reset-password", { email, otp, newPassword });
//       alert("✅ Password reset successful! Please log in.");
//       navigate("/login");
//     } catch (err) {
//       alert(`⚠️ ${err.response?.data?.message || "Invalid OTP or error"}`);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2>🔐 Forgot Password</h2>

//       {step === 1 ? (
//         <div>
//           <label>Email:</label>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             placeholder="Enter your email" 
//           />
//           <button onClick={requestOtp}>Request OTP</button>
//         </div>
//       ) : (
//         <div>
//           <label>OTP:</label>
//           <input 
//             type="text" 
//             value={otp} 
//             onChange={(e) => setOtp(e.target.value)} 
//             placeholder="Enter OTP" 
//           />

//           <label>New Password:</label>
//           <input 
//             type="password" 
//             value={newPassword} 
//             onChange={(e) => setNewPassword(e.target.value)} 
//             placeholder="Enter new password" 
//           />

//           <button onClick={resetPassword}>Reset Password</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiCheckCircle, FiClock } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  const requestOtp = async () => {
    setErrors({});
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/request-otp", { email });
      
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FiCheckCircle style={{ marginRight: '10px', fontSize: '20px', color: '#4BB543' }} />
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Verification Sent</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>A secure OTP has been dispatched to your email</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { 
            background: '#1a1a2e',
            borderLeft: '4px solid #4BB543',
            borderRadius: '4px',
            padding: '15px'
          }
        }
      );

      setStep(2);
      setOtpSent(true);
      startCountdown();
    } catch (err) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FiClock style={{ marginRight: '10px', fontSize: '20px', color: '#ff3333' }} />
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Delivery Failed</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
              {err.response?.data?.message || "Unable to send OTP. Please try again."}
            </p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          style: { 
            background: '#1a1a2e',
            borderLeft: '4px solid #ff3333',
            borderRadius: '4px',
            padding: '15px'
          }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setErrors({});
    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (!newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/reset-password", { 
        email, 
        otp, 
        newPassword 
      });
      
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FiCheckCircle style={{ marginRight: '10px', fontSize: '20px', color: '#4BB543' }} />
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Password Updated</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>Your credentials have been securely updated</p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          onClose: () => navigate("/login"),
          style: { 
            background: '#1a1a2e',
            borderLeft: '4px solid #4BB543',
            borderRadius: '4px',
            padding: '15px'
          }
        }
      );
    } catch (err) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FiClock style={{ marginRight: '10px', fontSize: '20px', color: '#ff3333' }} />
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Update Failed</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
              {err.response?.data?.message || "Invalid OTP or error occurred"}
            </p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          style: { 
            background: '#1a1a2e',
            borderLeft: '4px solid #ff3333',
            borderRadius: '4px',
            padding: '15px'
          }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/request-otp", { email });
      startCountdown();
      toast.success("New OTP has been sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      <ToastContainer />
      <motion.div 
        style={{
          background: '#16213e',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          width: '100%',
          maxWidth: '450px',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '5px'
            }}>LORD GLORY</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>SECURE ACCESS</span>
          </div>
          <h2 style={{ color: '#fff', margin: '0 0 10px 0' }}>Password Recovery</h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            margin: 0
          }}>
            {step === 1 
              ? "Enter your email to receive a verification code" 
              : "Enter the code sent to your email and set a new password"}
          </p>
        </div>

        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ 
              position: 'relative', 
              marginBottom: '25px',
              borderBottom: `1px solid ${errors.email ? '#ff3333' : 'rgba(255,255,255,0.2)'}`
            }}>
              <FiMail style={{ 
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.7)'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your registered email"
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 30px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <label style={{
                position: 'absolute',
                top: '-15px',
                left: '30px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none'
              }}>Email Address</label>
              {errors.email && <span style={{
                position: 'absolute',
                bottom: '-20px',
                left: '0',
                fontSize: '12px',
                color: '#ff3333'
              }}>{errors.email}</span>}
            </div>

            <button 
              onClick={requestOtp}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoading ? (
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
              ) : (
                "Send Verification Code"
              )}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => navigate("/login")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FiArrowLeft /> Back to Login
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ 
              background: 'rgba(255,255,255,0.05)',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                We've sent a 6-digit code to <strong style={{ color: '#fff' }}>{email}</strong>
              </p>
            </div>

            <div style={{ 
              position: 'relative', 
              marginBottom: '25px',
              borderBottom: `1px solid ${errors.otp ? '#ff3333' : 'rgba(255,255,255,0.2)'}`
            }}>
              <FiKey style={{ 
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.7)'
              }} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 30px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
                maxLength="6"
              />
              <label style={{
                position: 'absolute',
                top: '-15px',
                left: '30px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none'
              }}>Verification Code</label>
              {errors.otp && <span style={{
                position: 'absolute',
                bottom: '-20px',
                left: '0',
                fontSize: '12px',
                color: '#ff3333'
              }}>{errors.otp}</span>}
            </div>

            <div style={{ 
              position: 'relative', 
              marginBottom: '25px',
              borderBottom: `1px solid ${errors.newPassword ? '#ff3333' : 'rgba(255,255,255,0.2)'}`
            }}>
              <FiLock style={{ 
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.7)'
              }} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create new password"
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 30px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <label style={{
                position: 'absolute',
                top: '-15px',
                left: '30px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none'
              }}>New Password</label>
              {errors.newPassword && <span style={{
                position: 'absolute',
                bottom: '-20px',
                left: '0',
                fontSize: '12px',
                color: '#ff3333'
              }}>{errors.newPassword}</span>}
            </div>

            <div style={{ 
              position: 'relative', 
              marginBottom: '25px',
              borderBottom: `1px solid ${errors.confirmPassword ? '#ff3333' : 'rgba(255,255,255,0.2)'}`
            }}>
              <FiLock style={{ 
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.7)'
              }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 30px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <label style={{
                position: 'absolute',
                top: '-15px',
                left: '30px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none'
              }}>Confirm Password</label>
              {errors.confirmPassword && (
                <span style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '0',
                  fontSize: '12px',
                  color: '#ff3333'
                }}>{errors.confirmPassword}</span>
              )}
            </div>

            <div style={{ 
              textAlign: 'right', 
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              <button 
                onClick={resendOtp} 
                disabled={countdown > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: countdown > 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>

            <button
              onClick={resetPassword}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoading ? (
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </motion.div>
        )}
      </motion.div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        zIndex: 0
      }}></div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;