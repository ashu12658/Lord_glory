import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaRupeeSign, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Preparing your premium experience...</p>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="error-container">
    <div className="error-icon">!</div>
    <h2>Something went wrong</h2>
    <p className="error-message">{error}</p>
    <button 
      className="retry-button"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </div>
);

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setError("Invalid Order ID");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const orderResponse = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
          }
        );

        const orderData = orderResponse.data;
        setOrderDetails(orderData);

        const userResponse = await axios.get(
          `http://localhost:5000/api/users/${orderData.user}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
          }
        );

        setUserName(userResponse.data.name);

        if (orderData.createdAt) {
          const orderDate = new Date(orderData.createdAt);
          orderDate.setDate(orderDate.getDate() + 8);
          setDeliveryDate(
            orderDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          );
        }
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(
          err.response?.data?.message || 
          "We encountered an issue loading your order details. Please refresh or contact support if the problem persists."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div 
      className="payment-confirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="luxury-pattern"></div>
      
      <div className="confirmation-card">
        <div className="premium-header">
          <motion.img 
            src={logo} 
            alt="Lord Glory Logo" 
            className="brand-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          />
          <motion.div
            className="success-icon-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FaCheckCircle className="success-icon" />
            <div className="sparkle-effect"></div>
          </motion.div>
        </div>

        <div className="confirmation-content">
          <motion.div
            className="confirmation-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h1>Payment Successful!</h1>
            <div className="divider"></div>
            <p className="thank-you-message">
              Thank you, <span className="user-name">{userName}</span>, for choosing Lord Glory
            </p>
            <p className="premium-message">
              Your premium beauty experience begins now
            </p>
            <div className="stars">
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
            </div>
          </motion.div>

          <motion.div 
            className="order-details-section"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2>
              <FaBox className="section-icon" /> Your Order
            </h2>
            
            <div className="detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderDetails._id}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${orderDetails.status.toLowerCase()}`}>
                {orderDetails.status}
              </span>
            </div>
            
            <div className="detail-item">
              <FaRupeeSign className="currency-icon" />
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">
                {orderDetails.totalAmount.toFixed(2)}
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="shipping-section"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2>
              <FaMapMarkerAlt className="section-icon" /> Delivery Information
            </h2>
            
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{orderDetails.phone}</span>
            </div>
            
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <span className="detail-label">Address:</span>
              <span className="detail-value">
                {orderDetails.address}, {orderDetails.pincode}
              </span>
            </div>
            
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <span className="detail-label">Expected Delivery:</span>
              <span className="detail-value">{deliveryDate}</span>
            </div>
          </motion.div>

          <motion.div 
            className="action-buttons"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.button 
              className="primary-button"
              onClick={() => navigate("/orders")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Orders
            </motion.button>
            <motion.button 
              className="secondary-button"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>

          <motion.div 
            className="guarantee-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <p>
              <strong>Lord Glory Promise:</strong> Luxury experience guaranteed or your money back
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Add styles to the document head
const styleElement = document.createElement("style");
styleElement.innerHTML = `
  .payment-confirmation {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    font-family: 'Playfair Display', serif;
    position: relative;
    overflow: hidden;
    background: #f9f5f0;
  }

  .luxury-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f9f5f0;
    background-image: 
      radial-gradient(#d4af37 1px, transparent 1px),
      radial-gradient(#d4af37 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: 0 0, 15px 15px;
    opacity: 0.1;
    z-index: 0;
  }

  .confirmation-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 40px;
    width: 100%;
    max-width: 600px;
    position: relative;
    z-index: 1;
    border: 1px solid #e8e0d5;
    overflow: hidden;
  }

  .confirmation-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #d4af37, #f4e5c2, #d4af37);
  }

  .premium-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
  }

  .brand-logo {
    height: 80px;
    margin-bottom: 20px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  .success-icon-container {
    position: relative;
    font-size: 80px;
    color: #d4af37;
    margin: 10px 0;
  }

  .sparkle-effect {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, #fff 20%, transparent 70%);
    border-radius: 50%;
    animation: sparkle 2s infinite;
  }

  @keyframes sparkle {
    0% { transform: scale(0.8); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.8; }
  }

  .confirmation-content {
    padding: 0 20px;
  }

  .confirmation-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .confirmation-header h1 {
    color: #333;
    margin: 0 0 15px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .divider {
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #d4af37, #f4e5c2, #d4af37);
    margin: 0 auto 20px;
    border-radius: 3px;
  }

  .thank-you-message {
    font-size: 20px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .premium-message {
    font-size: 18px;
    color: #d4af37;
    font-style: italic;
    margin-bottom: 20px;
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 15px;
  }

  .star-icon {
    color: #d4af37;
    font-size: 18px;
  }

  .order-details-section,
  .shipping-section {
    margin-bottom: 30px;
    padding: 25px;
    background: #faf9f7;
    border-radius: 12px;
    border: 1px solid #f0ece4;
    position: relative;
    overflow: hidden;
  }

  .order-details-section::before,
  .shipping-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #d4af37, #f4e5c2);
  }

  .order-details-section h2,
  .shipping-section h2 {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 22px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0ece4;
  }

  .section-icon {
    margin-right: 12px;
    color: #d4af37;
  }

  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 16px;
  }

  .detail-icon {
    margin-right: 12px;
    color: #d4af37;
    min-width: 20px;
  }

  .detail-label {
    font-weight: 600;
    margin-right: 10px;
    color: #666;
    min-width: 140px;
  }

  .detail-value {
    color: #333;
    font-weight: 500;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .status-badge.completed {
    background: #f0f7e6;
    color: #4CAF50;
    border: 1px solid #d8e7c5;
  }

  .status-badge.processing {
    background: #e6f2ff;
    color: #2196F3;
    border: 1px solid #c5d9f2;
  }

  .status-badge.shipped {
    background: #fff8e6;
    color: #FFC107;
    border: 1px solid #f5e8c5;
  }

  .action-buttons {
    display: flex;
    gap: 20px;
    margin-top: 40px;
    justify-content: center;
  }

  .primary-button {
    flex: 1;
    padding: 15px 25px;
    background: linear-gradient(135deg, #d4af37, #f4e5c2);
    color: #333;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }

  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }

  .secondary-button {
    flex: 1;
    padding: 15px 25px;
    background: white;
    color: #333;
    border: 1px solid #d4af37;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
    letter-spacing: 0.5px;
  }

  .secondary-button:hover {
    background: #fdf9f0;
    transform: translateY(-2px);
  }

  .guarantee-message {
    background: #faf9f7;
    padding: 20px;
    border-radius: 12px;
    margin-top: 30px;
    font-size: 15px;
    border-left: 4px solid #d4af37;
    text-align: center;
    border: 1px solid #f0ece4;
  }

  .guarantee-message strong {
    color: #d4af37;
    font-weight: 700;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f9f5f0;
  }

  .loading-spinner {
    border: 4px solid rgba(212, 175, 55, 0.2);
    border-radius: 50%;
    border-top: 4px solid #d4af37;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  .loading-container p {
    color: #666;
    font-size: 18px;
    font-family: 'Playfair Display', serif;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container {
    text-align: center;
    padding: 40px;
    max-width: 500px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #f0ece4;
  }

  .error-icon {
    display: inline-block;
    width: 60px;
    height: 60px;
    background: #ffebee;
    color: #f44336;
    border-radius: 50%;
    font-size: 30px;
    line-height: 60px;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .error-container h2 {
    color: #333;
    margin-bottom: 15px;
    font-family: 'Playfair Display', serif;
  }

  .error-message {
    color: #666;
    margin: 20px 0;
    font-size: 16px;
    line-height: 1.5;
  }

  .retry-button {
    padding: 12px 25px;
    background: #d4af37;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
  }

  .retry-button:hover {
    background: #c19e30;
  }

  @media (max-width: 768px) {
    .confirmation-card {
      padding: 30px 20px;
    }
    
    .action-buttons {
      flex-direction: column;
      gap: 15px;
    }
    
    .detail-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    
    .detail-label {
      min-width: auto;
    }
  }
`;
document.head.appendChild(styleElement);

export default PaymentConfirmation;




// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { 
//   FaBox, 
//   FaCalendarAlt, 
//   FaMapMarkerAlt, 
//   FaPhone, 
//   FaRupeeSign, 
//   FaCheckCircle, 
//   FaStar,
//   FaExclamationTriangle,
//   FaClock,
//   FaSyncAlt
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import logo from "../assets/logo.png";
// import { jwtDecode } from "jwt-decode";

// const LoadingSpinner = () => (
//   <div className="loading-container">
//     <div className="loading-spinner"></div>
//     <p>Preparing your premium experience...</p>
//   </div>
// );

// const ErrorDisplay = ({ error }) => (
//   <div className="error-container">
//     <div className="error-icon">!</div>
//     <h2>Something went wrong</h2>
//     <p className="error-message">{error}</p>
//     <button 
//       className="retry-button"
//       onClick={() => window.location.reload()}
//     >
//       Try Again
//     </button>
//   </div>
// );

// const PaymentConfirmation = () => {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const navigate = useNavigate();
//   const [paymentStatus, setPaymentStatus] = useState(null);

//   useEffect(() => {
//     const verifyAndFetchData = async () => {
//       try {
//         if (!orderId) {
//           throw new Error("Missing order ID in URL parameters");
//         }

//         const urlToken = searchParams.get("token");
//         const sessionToken = sessionStorage.getItem('tempPaymentToken');
//         const token = urlToken || sessionToken || 
//           localStorage.getItem("token") || localStorage.getItem("agentToken");

//         if (!token) throw new Error("Authentication required");

//         if (urlToken) {
//           localStorage.setItem("token", urlToken);
//           sessionStorage.removeItem('tempPaymentToken');
//           searchParams.delete("token");
//         }

//         const decoded = jwtDecode(token);
//         if (decoded.exp * 1000 < Date.now()) {
//           throw new Error("Session expired");
//         }

//         const config = {
//           headers: { 
//             Authorization: `Bearer ${token.trim()}`,
//             "Content-Type": "application/json"
//           }
//         };

//         const statusResponse = await axios.post(
//           `${process.env.REACT_APP_API_URL}/payments/phonepe/checkOrderStatus`,
//           { orderId },
//           config
//         );
      
//         if (!['COMPLETED', 'PENDING', 'FAILED'].includes(statusResponse.data.status)) {
//           throw new Error("Invalid payment status received");
//         }

//         setPaymentStatus(statusResponse.data.status);

//         // For all statuses, we'll fetch basic order details
//         const orderResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
//           config
//         );
        
//         setOrderDetails(orderResponse.data);
        
//         const userResponse = await axios.get(
//           `${process.env.REACT_APP_API_URL}/users/${orderResponse.data.user}`,
//           config
//         );
//         setUserName(userResponse.data.name);

//         if (orderResponse.data.createdAt) {
//           const date = new Date(orderResponse.data.createdAt);
//           date.setDate(date.getDate() + 8);
//           setDeliveryDate(date.toLocaleDateString("en-GB"));
//         }

//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAndFetchData();
//   }, [orderId, searchParams]);

//   const handleRetryPayment = () => {
//     navigate(`/checkout?orderId=${orderId}`);
//   };

//   const handleCheckStatus = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token") || localStorage.getItem("agentToken");
//       const config = {
//         headers: { 
//           Authorization: `Bearer ${token.trim()}`,
//           "Content-Type": "application/json"
//         }
//       };

//       const statusResponse = await axios.post(
//         `${process.env.REACT_APP_API_URL}/payments/phonepe/checkOrderStatus`,
//         { orderId },
//         config
//       );
      
//       setPaymentStatus(statusResponse.data.status);
      
//       if (statusResponse.data.status === 'COMPLETED') {
//         window.location.reload();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorDisplay error={error} />;

//   // Payment Pending UI
//   if (paymentStatus === 'PENDING') {
//     return (
//       <motion.div 
//         className="payment-confirmation"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="luxury-pattern"></div>
        
//         <div className="confirmation-card pending">
//           <div className="premium-header">
//             <motion.img 
//               src={logo} 
//               alt="Lord Glory Logo" 
//               className="brand-logo"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//             />
//             <motion.div
//               className="pending-icon-container"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               <FaClock className="pending-icon" />
//               <div className="pulse-effect"></div>
//             </motion.div>
//           </div>

//           <div className="confirmation-content">
//             <motion.div
//               className="confirmation-header"
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             >
//               <h1>Payment Processing</h1>
//               <div className="divider"></div>
//               <p className="thank-you-message">
//                 Your payment is being processed, <span className="user-name">{userName}</span>
//               </p>
//               <p className="pending-message">
//                 We're verifying your payment details. This may take a few moments.
//               </p>
//             </motion.div>

//             {orderDetails && (
//               <motion.div 
//                 className="order-details-section"
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 1 }}
//               >
//                 <h2>
//                   <FaBox className="section-icon" /> Order Summary
//                 </h2>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Order ID:</span>
//                   <span className="detail-value">{orderDetails._id}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Status:</span>
//                   <span className="status-badge pending">
//                     PENDING
//                   </span>
//                 </div>
                
//                 <div className="detail-item">
//                   <FaRupeeSign className="currency-icon" />
//                   <span className="detail-label">Amount:</span>
//                   <span className="detail-value">
//                     {orderDetails.totalAmount.toFixed(2)}
//                   </span>
//                 </div>
//               </motion.div>
//             )}

//             <motion.div 
//               className="pending-actions"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 1.2 }}
//             >
//               <div className="status-check">
//                 <p>Haven't received confirmation yet?</p>
//                 <motion.button 
//                   className="check-status-button"
//                   onClick={handleCheckStatus}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <FaSyncAlt className="spin-icon" /> Check Status Again
//                 </motion.button>
//               </div>
              
//               <div className="pending-note">
//                 <FaExclamationTriangle className="note-icon" />
//                 <p>
//                   <strong>Note:</strong> If your payment was successful but status remains pending, 
//                   please contact our support team at +91 9588407421.
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div 
//               className="guarantee-message"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.4 }}
//             >
//               <p>
//                 <strong>Lord Glory Promise:</strong> Your order will be processed as soon as payment is confirmed
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // Payment Failed UI
//   if (paymentStatus === 'FAILED') {
//     return (
//       <motion.div 
//         className="payment-confirmation"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="luxury-pattern"></div>
        
//         <div className="confirmation-card failed">
//           <div className="premium-header">
//             <motion.img 
//               src={logo} 
//               alt="Lord Glory Logo" 
//               className="brand-logo"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//             />
//             <motion.div
//               className="failed-icon-container"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               <FaExclamationTriangle className="failed-icon" />
//               <div className="shake-effect"></div>
//             </motion.div>
//           </div>

//           <div className="confirmation-content">
//             <motion.div
//               className="confirmation-header"
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             >
//               <h1>Payment Failed</h1>
//               <div className="divider"></div>
//               <p className="thank-you-message">
//                 We couldn't process your payment, <span className="user-name">{userName}</span>
//               </p>
//               <p className="failed-message">
//                 Your order has been saved but payment was not completed.
//               </p>
//             </motion.div>

//             {orderDetails && (
//               <motion.div 
//                 className="order-details-section"
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 1 }}
//               >
//                 <h2>
//                   <FaBox className="section-icon" /> Order Summary
//                 </h2>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Order ID:</span>
//                   <span className="detail-value">{orderDetails._id}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Status:</span>
//                   <span className="status-badge failed">
//                     PAYMENT FAILED
//                   </span>
//                 </div>
                
//                 <div className="detail-item">
//                   <FaRupeeSign className="currency-icon" />
//                   <span className="detail-label">Amount:</span>
//                   <span className="detail-value">
//                     {orderDetails.totalAmount.toFixed(2)}
//                   </span>
//                 </div>
//               </motion.div>
//             )}

//             <motion.div 
//               className="failed-actions"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 1.2 }}
//             >
//               <div className="retry-payment">
//                 <p>Would you like to try again?</p>
//                 <motion.button 
//                   className="retry-button"
//                   onClick={handleRetryPayment}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Retry Payment
//                 </motion.button>
//               </div>
              
//               <div className="failed-note">
//                 <FaExclamationTriangle className="note-icon" />
//                 <p>
//                   <strong>Note:</strong> If you believe this is an error, please check your bank 
//                   account before retrying or contact our support team at 9588407421
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div 
//               className="guarantee-message"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.4 }}
//             >
//               <p>
//                 <strong>Lord Glory Promise:</strong> Your card has not been charged for this failed transaction
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // Original Payment Successful UI (only shown if paymentStatus is 'COMPLETED')
//   return (
//     <motion.div 
//       className="payment-confirmation"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="luxury-pattern"></div>
      
//       <div className="confirmation-card">
//         <div className="premium-header">
//           <motion.img 
//             src={logo} 
//             alt="Lord Glory Logo" 
//             className="brand-logo"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2, type: "spring" }}
//           />
//           <motion.div
//             className="success-icon-container"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.4 }}
//           >
//             <FaCheckCircle className="success-icon" />
//             <div className="sparkle-effect"></div>
//           </motion.div>
//         </div>

//         <div className="confirmation-content">
//           <motion.div
//             className="confirmation-header"
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.6 }}
//           >
//             <h1>Payment Successful!</h1>
//             <div className="divider"></div>
//             <p className="thank-you-message">
//               Thank you, <span className="user-name">{userName}</span>, for choosing Lord Glory
//             </p>
//             <p className="premium-message">
//               Your premium beauty experience begins now
//             </p>
//             <div className="stars">
//               <FaStar className="star-icon" />
//               <FaStar className="star-icon" />
//               <FaStar className="star-icon" />
//               <FaStar className="star-icon" />
//               <FaStar className="star-icon" />
//             </div>
//           </motion.div>

//           {orderDetails && (
//             <>
//               <motion.div 
//                 className="order-details-section"
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 1 }}
//               >
//                 <h2>
//                   <FaBox className="section-icon" /> Your Order
//                 </h2>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Order ID:</span>
//                   <span className="detail-value">{orderDetails._id}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <span className="detail-label">Status:</span>
//                   <span className={`status-badge ${orderDetails.status.toLowerCase()}`}>
//                     {orderDetails.status}
//                   </span>
//                 </div>
                
//                 <div className="detail-item">
//                   <FaRupeeSign className="currency-icon" />
//                   <span className="detail-label">Total Amount:</span>
//                   <span className="detail-value">
//                     {orderDetails.totalAmount.toFixed(2)}
//                   </span>
//                 </div>
//               </motion.div>

//               <motion.div 
//                 className="shipping-section"
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 1.2 }}
//               >
//                 <h2>
//                   <FaMapMarkerAlt className="section-icon" /> Delivery Information
//                 </h2>
                
//                 <div className="detail-item">
//                   <FaPhone className="detail-icon" />
//                   <span className="detail-label">Phone:</span>
//                   <span className="detail-value">{orderDetails.phone}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <FaMapMarkerAlt className="detail-icon" />
//                   <span className="detail-label">Address:</span>
//                   <span className="detail-value">
//                     {orderDetails.address}, {orderDetails.pincode}
//                   </span>
//                 </div>
                
//                 <div className="detail-item">
//                   <FaCalendarAlt className="detail-icon" />
//                   <span className="detail-label">Expected Delivery:</span>
//                   <span className="detail-value">{deliveryDate}</span>
//                 </div>
//               </motion.div>
//             </>
//           )}

//           <motion.div 
//             className="action-buttons"
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 1.4 }}
//           >
//             <motion.button 
//               className="primary-button"
//               onClick={() => navigate("/orders")}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               View My Orders
//             </motion.button>
//             <motion.button 
//               className="secondary-button"
//               onClick={() => navigate("/")}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Continue Shopping
//             </motion.button>
//           </motion.div>

//           <motion.div 
//             className="guarantee-message"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.6 }}
//           >
//             <p>
//               <strong>Lord Glory Promise:</strong> Luxury experience guaranteed or your money back
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Add styles to the document head
// const styleElement = document.createElement("style");
// styleElement.innerHTML = `
//   .payment-confirmation {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     min-height: 100vh;
//     padding: 20px;
//     font-family: 'Playfair Display', serif;
//     position: relative;
//     overflow: hidden;
//     background: #f9f5f0;
//   }

//   .luxury-pattern {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-color: #f9f5f0;
//     background-image: 
//       radial-gradient(#d4af37 1px, transparent 1px),
//       radial-gradient(#d4af37 1px, transparent 1px);
//     background-size: 30px 30px;
//     background-position: 0 0, 15px 15px;
//     opacity: 0.1;
//     z-index: 0;
//   }

//   .confirmation-card {
//     background: white;
//     border-radius: 16px;
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
//     padding: 40px;
//     width: 100%;
//     max-width: 600px;
//     position: relative;
//     z-index: 1;
//     border: 1px solid #e8e0d5;
//     overflow: hidden;
//   }

//   .confirmation-card.pending {
//     border-top: 8px solid #FFC107;
//   }

//   .confirmation-card.failed {
//     border-top: 8px solid #F44336;
//   }

//   .confirmation-card::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 8px;
//     background: linear-gradient(90deg, #d4af37, #f4e5c2, #d4af37);
//   }

//   .confirmation-card.pending::before {
//     background: linear-gradient(90deg, #FFC107, #FFECB3, #FFC107);
//   }

//   .confirmation-card.failed::before {
//     background: linear-gradient(90deg, #F44336, #FFCDD2, #F44336);
//   }

//   .premium-header {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 30px;
//     position: relative;
//   }

//   .brand-logo {
//     height: 80px;
//     margin-bottom: 20px;
//     filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
//   }

//   .success-icon-container {
//     position: relative;
//     font-size: 80px;
//     color: #d4af37;
//     margin: 10px 0;
//   }

//   .pending-icon-container {
//     position: relative;
//     font-size: 80px;
//     color: #FFC107;
//     margin: 10px 0;
//   }

//   .failed-icon-container {
//     position: relative;
//     font-size: 80px;
//     color: #F44336;
//     margin: 10px 0;
//   }

//   .sparkle-effect {
//     position: absolute;
//     top: -10px;
//     right: -10px;
//     width: 30px;
//     height: 30px;
//     background: radial-gradient(circle, #fff 20%, transparent 70%);
//     border-radius: 50%;
//     animation: sparkle 2s infinite;
//   }

//   .pulse-effect {
//     position: absolute;
//     top: -10px;
//     right: -10px;
//     width: 30px;
//     height: 30px;
//     background: rgba(255, 193, 7, 0.5);
//     border-radius: 50%;
//     animation: pulse 2s infinite;
//   }

//   .shake-effect {
//     position: absolute;
//     top: -10px;
//     right: -10px;
//     width: 30px;
//     height: 30px;
//     background: rgba(244, 67, 54, 0.5);
//     border-radius: 50%;
//     animation: shake 0.5s infinite alternate;
//   }

//   @keyframes sparkle {
//     0% { transform: scale(0.8); opacity: 0.8; }
//     50% { transform: scale(1.2); opacity: 1; }
//     100% { transform: scale(0.8); opacity: 0.8; }
//   }

//   @keyframes pulse {
//     0% { transform: scale(0.8); opacity: 0.8; }
//     50% { transform: scale(1.3); opacity: 0.4; }
//     100% { transform: scale(0.8); opacity: 0.8; }
//   }

//   @keyframes shake {
//     0% { transform: translateX(0); }
//     25% { transform: translateX(-5px); }
//     50% { transform: translateX(5px); }
//     75% { transform: translateX(-5px); }
//     100% { transform: translateX(5px); }
//   }

//   .confirmation-content {
//     padding: 0 20px;
//   }

//   .confirmation-header {
//     text-align: center;
//     margin-bottom: 40px;
//   }

//   .confirmation-header h1 {
//     color: #333;
//     margin: 0 0 15px;
//     font-size: 32px;
//     font-weight: 700;
//     letter-spacing: 1px;
//   }

//   .divider {
//     width: 100px;
//     height: 3px;
//     background: linear-gradient(90deg, #d4af37, #f4e5c2, #d4af37);
//     margin: 0 auto 20px;
//     border-radius: 3px;
//   }

//   .confirmation-card.pending .divider {
//     background: linear-gradient(90deg, #FFC107, #FFECB3, #FFC107);
//   }

//   .confirmation-card.failed .divider {
//     background: linear-gradient(90deg, #F44336, #FFCDD2, #F44336);
//   }

//   .thank-you-message {
//     font-size: 20px;
//     color: #555;
//     line-height: 1.5;
//     margin-bottom: 10px;
//   }

//   .premium-message {
//     font-size: 18px;
//     color: #d4af37;
//     font-style: italic;
//     margin-bottom: 20px;
//   }

//   .pending-message {
//     font-size: 18px;
//     color: #FFC107;
//     font-style: italic;
//     margin-bottom: 20px;
//   }

//   .failed-message {
//     font-size: 18px;
//     color: #F44336;
//     font-style: italic;
//     margin-bottom: 20px;
//   }

//   .stars {
//     display: flex;
//     justify-content: center;
//     gap: 8px;
//     margin-top: 15px;
//   }

//   .star-icon {
//     color: #d4af37;
//     font-size: 18px;
//   }

//   .order-details-section,
//   .shipping-section {
//     margin-bottom: 30px;
//     padding: 25px;
//     background: #faf9f7;
//     border-radius: 12px;
//     border: 1px solid #f0ece4;
//     position: relative;
//     overflow: hidden;
//   }

//   .order-details-section::before,
//   .shipping-section::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 4px;
//     height: 100%;
//     background: linear-gradient(to bottom, #d4af37, #f4e5c2);
//   }

//   .confirmation-card.pending .order-details-section::before,
//   .confirmation-card.pending .shipping-section::before {
//     background: linear-gradient(to bottom, #FFC107, #FFECB3);
//   }

//   .confirmation-card.failed .order-details-section::before,
//   .confirmation-card.failed .shipping-section::before {
//     background: linear-gradient(to bottom, #F44336, #FFCDD2);
//   }

//   .order-details-section h2,
//   .shipping-section h2 {
//     display: flex;
//     align-items: center;
//     color: #333;
//     font-size: 22px;
//     margin-bottom: 20px;
//     padding-bottom: 10px;
//     border-bottom: 1px solid #f0ece4;
//   }

//   .section-icon {
//     margin-right: 12px;
//     color: #d4af37;
//   }

//   .confirmation-card.pending .section-icon {
//     color: #FFC107;
//   }

//   .confirmation-card.failed .section-icon {
//     color: #F44336;
//   }

//   .detail-item {
//     display: flex;
//     align-items: center;
//     margin-bottom: 15px;
//     font-size: 16px;
//   }

//   .detail-icon {
//     margin-right: 12px;
//     color: #d4af37;
//     min-width: 20px;
//   }

//   .confirmation-card.pending .detail-icon {
//     color: #FFC107;
//   }

//   .confirmation-card.failed .detail-icon {
//     color: #F44336;
//   }

//   .detail-label {
//     font-weight: 600;
//     margin-right: 10px;
//     color: #666;
//     min-width: 140px;
//   }

//   .detail-value {
//     color: #333;
//     font-weight: 500;
//   }

//   .status-badge {
//     padding: 6px 12px;
//     border-radius: 20px;
//     font-size: 14px;
//     font-weight: 600;
//     letter-spacing: 0.5px;
//   }

//   .status-badge.completed {
//     background: #f0f7e6;
//     color: #4CAF50;
//     border: 1px solid #d8e7c5;
//   }

//   .status-badge.pending {
//     background: #fff8e6;
//     color: #FFC107;
//     border: 1px solid #f5e8c5;
//   }

//   .status-badge.failed {
//     background: #ffebee;
//     color: #F44336;
//     border: 1px solid #ffcdd2;
//   }

//   .status-badge.processing {
//     background: #e6f2ff;
//     color: #2196F3;
//     border: 1px solid #c5d9f2;
//   }

//   .status-badge.shipped {
//     background: #fff8e6;
//     color: #FFC107;
//     border: 1px solid #f5e8c5;
//   }

//   .action-buttons {
//     display: flex;
//     gap: 20px;
//     margin-top: 40px;
//     justify-content: center;
//   }

//   .pending-actions,
//   .failed-actions {
//     margin-top: 40px;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//   }

//   .status-check,
//   .retry-payment {
//     text-align: center;
//     margin-bottom: 15px;
//   }

//   .pending-note,
//   .failed-note {
//     display: flex;
//     align-items: flex-start;
//     gap: 10px;
//     background: #fffaf3;
//     padding: 15px;
//     border-radius: 8px;
//     border-left: 4px solid #FFC107;
//     margin-top: 20px;
//   }

//   .confirmation-card.failed .pending-note,
//   .confirmation-card.failed .failed-note {
//     background: #fff5f5;
//     border-left: 4px solid #F44336;
//   }

//   .note-icon {
//     color: #FFC107;
//     margin-top: 3px;
//     flex-shrink: 0;
//   }

//   .confirmation-card.failed .note-icon {
//     color: #F44336;
//   }

//   .primary-button {
//     flex: 1;
//     padding: 15px 25px;
//     background: linear-gradient(135deg, #d4af37, #f4e5c2);
//     color: #333;
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.3s;
//     font-size: 16px;
//     letter-spacing: 0.5px;
//     box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
//   }

//   .primary-button:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
//   }

//   .secondary-button {
//     flex: 1;
//     padding: 15px 25px;
//     background: white;
//     color: #333;
//     border: 1px solid #d4af37;
//     border-radius: 8px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.3s;
//     font-size: 16px;
//     letter-spacing: 0.5px;
//   }

//   .secondary-button:hover {
//     background: #fdf9f0;
//     transform: translateY(-2px);
//   }

//   .check-status-button {
//     padding: 15px 25px;
//     background: linear-gradient(135deg, #FFC107, #FFECB3);
//     color: #333;
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.3s;
//     font-size: 16px;
//     letter-spacing: 0.5px;
//     box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 10px;
//     margin: 0 auto;
//   }

//   .check-status-button:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
//   }

//   .retry-button {
//     padding: 15px 25px;
//     background: linear-gradient(135deg, #F44336, #FFCDD2);
//     color: white;
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.3s;
//     font-size: 16px;
//     letter-spacing: 0.5px;
//     box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
//     margin: 0 auto;
//   }

//   .retry-button:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
//   }

//   .spin-icon {
//     animation: spin 1s infinite linear;
//   }

//   @keyframes spin {
//     from { transform: rotate(0deg); }
//     to { transform: rotate(360deg); }
//   }

//   .guarantee-message {
//     background: #faf9f7;
//     padding: 20px;
//     border-radius: 12px;
//     margin-top: 30px;
//     font-size: 15px;
//     border-left: 4px solid #d4af37;
//     text-align: center;
//     border: 1px solid #f0ece4;
//   }

//   .confirmation-card.pending .guarantee-message {
//     border-left: 4px solid #FFC107;
//   }

//   .confirmation-card.failed .guarantee-message {
//     border-left: 4px solid #F44336;
//   }

//   .guarantee-message strong {
//     color: #d4af37;
//     font-weight: 700;
//   }

//   .confirmation-card.pending .guarantee-message strong {
//     color: #FFC107;
//   }

//   .confirmation-card.failed .guarantee-message strong {
//     color: #F44336;
//   }

//   .loading-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100vh;
//     background: #f9f5f0;
//   }

//   .loading-spinner {
//     border: 4px solid rgba(212, 175, 55, 0.2);
//     border-radius: 50%;
//     border-top: 4px solid #d4af37;
//     width: 50px;
//     height: 50px;
//     animation: spin 1s linear infinite;
//     margin-bottom: 20px;
//   }

//   .loading-container p {
//     color: #666;
//     font-size: 18px;
//     font-family: 'Playfair Display', serif;
//   }

//   .error-container {
//     text-align: center;
//     padding: 40px;
//     max-width: 500px;
//     margin: 0 auto;
//     background: white;
//     border-radius: 12px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//     border: 1px solid #f0ece4;
//   }

//   .error-icon {
//     display: inline-block;
//     width: 60px;
//     height: 60px;
//     background: #ffebee;
//     color: #f44336;
//     border-radius: 50%;
//     font-size: 30px;
//     line-height: 60px;
//     margin-bottom: 20px;
//     font-weight: bold;
//   }

//   .error-container h2 {
//     color: #333;
//     margin-bottom: 15px;
//     font-family: 'Playfair Display', serif;
//   }

//   .error-message {
//     color: #666;
//     margin: 20px 0;
//     font-size: 16px;
//     line-height: 1.5;
//   }

//   @media (@media (max-width: 768px) {
//   .payment-confirmation {
//     padding: 15px;
//   }

//   .confirmation-card {
//     padding: 20px;
//     border-radius: 12px;
//     max-width: 100%;
//   }

//   .premium-header {
//     margin-bottom: 20px;
//   }

//   .brand-logo {
//     height: 60px;
//   }

//   .success-icon-container,
//   .pending-icon-container,
//   .failed-icon-container {
//     font-size: 60px;
//   }

//   .confirmation-header h1 {
//     font-size: 24px;
//   }

//   .thank-you-message {
//     font-size: 16px;
//   }

//   .premium-message,
//   .pending-message,
//   .failed-message {
//     font-size: 14px;
//   }

//   .stars {
//     gap: 6px;
//   }

//   .star-icon {
//     font-size: 14px;
//   }

//   .order-details-section,
//   .shipping-section {
//     padding: 15px;
//     margin-bottom: 20px;
//   }

//   .order-details-section h2,
//   .shipping-section h2 {
//     font-size: 18px;
//     margin-bottom: 15px;
//   }

//   .detail-item {
//     font-size: 14px;
//     flex-wrap: wrap;
//   }

//   .detail-label {
//     min-width: 100px;
//     margin-bottom: 5px;
//   }

//   .detail-value {
//     flex: 1;
//   }

//   .status-badge {
//     font-size: 12px;
//     padding: 4px 8px;
//   }

//   .action-buttons {
//     flex-direction: column;
//     gap: 15px;
//     margin-top: 20px;
//   }

//   .pending-actions,
//   .failed-actions {
//     margin-top: 20px;
//     gap: 15px;
//   }

//   .primary-button,
//   .secondary-button,
//   .check-status-button,
//   .retry-button {
//     padding: 12px;
//     font-size: 14px;
//   }

//   .guarantee-message {
//     padding: 15px;
//     font-size: 13px;
//     margin-top: 20px;
//   }

//   .loading-spinner {
//     width: 40px;
//     height: 40px;
//   }

//   .loading-container p {
//     font-size: 16px;
//   }

//   .error-container {
//     padding: 20px;
//   }

//   .error-icon {
//     width: 50px;
//     height: 50px;
//     line-height: 50px;
//     font-size: 24px;
//   }

//   .error-container h2 {
//     font-size: 20px;
//   }

//   .error-message {
//     font-size: 14px;
//   }
// }

// @media (max-width: 480px) {
//   .payment-confirmation {
//     padding: 10px;
//   }

//   .confirmation-card {
//     padding: 15px;
//     border-radius: 8px;
//   }

//   .brand-logo {
//     height: 50px;
//   }

//   .success-icon-container,
//   .pending-icon-container,
//   .failed-icon-container {
//     font-size: 50px;
//   }

//   .confirmation-header h1 {
//     font-size: 20px;
//   }

//   .divider {
//     width: 80px;
//   }

//   .thank-you-message {
//     font-size: 14px;
//   }

//   .premium-message,
//   .pending-message,
//   .failed-message {
//     font-size: 12px;
//   }

//   .stars {
//     gap: 4px;
//   }

//   .star-icon {
//     font-size: 12px;
//   }

//   .order-details-section,
//   .shipping-section {
//     padding: 10px;
//   }

//   .order-details-section h2,
//   .shipping-section h2 {
//     font-size: 16px;
//   }

//   .section-icon {
//     margin-right: 8px;
//     font-size: 16px;
//   }

//   .detail-item {
//     flex-direction: column;
//     align-items: flex-start;
//     font-size: 12px;
//   }

//   .detail-label {
//     min-width: auto;
//     margin-bottom: 3px;
//   }

//   .detail-icon {
//     margin-right: 8px;
//     font-size: 14px;
//   }

//   .status-badge {
//     font-size: 10px;
//     padding: 3px 6px;
//   }

//   .action-buttons {
//     gap: 10px;
//   }

//   .pending-actions,
//   .failed-actions {
//     gap: 10px;
//   }

//   .status-check p,
//   .retry-payment p {
//     font-size: 12px;
//   }

//   .pending-note,
//   .failed-note {
//     padding: 10px;
//     font-size: 12px;
//   }

//   .note-icon {
//     font-size  .note-icon {
//     font-size: 14px;
//   }

//   .primary-button,
//   .secondary-button,
//   .check-status-button,
//   .retry-button {
//     padding: 10px;
//     font-size: 12px;
//     border-radius: 6px;
//   }

//   .guarantee-message {
//     padding: 10px;
//     font-size: 12px;
//     margin-top: 15px;
//   }

//   .guarantee-message strong {
//     font-size: 13px;
//   }

//   .loading-container {
//     padding: 10px;
//   }

//   .loading-spinner {
//     width: 30px;
//     height: 30px;
//     border-width: 3px;
//   }

//   .loading-container p {
//     font-size: 14px;
//   }

//   .error-container {
//     padding: 15px;
//     margin: 10px;
//     border-radius: 8px;
//   }

//   .error-icon {
//     width: 40px;
//     height: 40px;
//     line-height: 40px;
//     font-size: 20px;
//   }

//   .error-container h2 {
//     font-size: 18px;
//     margin-bottom: 10px;
//   }

//   .error-message {
//     font-size: 12px;
//     margin: 15px 0;
//   }

//   .retry-button {
//     padding: 10px;
//     font-size: 12px;
//   }
// }

// /* Additional media query for very small screens (below 360px) */
// @media (max-width: 360px) {
//   .confirmation-card {
//     padding: 10px;
//   }

//   .brand-logo {
//     height: 40px;
//   }

//   .success-icon-container,
//   .pending-icon-container,
//   .failed-icon-container {
//     font-size: 40px;
//   }

//   .confirmation-header h1 {
//     font-size: 18px;
//   }

//   .divider {
//     width: 60px;
//     height: 2px;
//   }

//   .thank-you-message {
//     font-size: 12px;
//   }

//   .premium-message,
//   .pending-message,
//   .failed-message {
//     font-size: 11px;
//   }

//   .order-details-section h2,
//   .shipping-section h2 {
//     font-size: 14px;
//   }

//   .section-icon {
//     font-size: 14px;
//     margin-right: 6px;
//   }

//   .detail-item {
//     font-size: 11px;
//   }

//   .detail-label {
//     font-size: 12px;
//   }

//   .detail-value {
//     font-size: 12px;
//   }

//   .status-badge {
//     font-size: 9px;
//     padding: 2px 5px;
//   }

//   .primary-button,
//   .secondary-button,
//   .check-status-button,
//   .retry-button {
//     padding: 8px;
//     font-size: 11px;
//   }

//   .guarantee-message {
//     padding: 8px;
//     font-size: 11px;
//   }

//   .pending-note,
//   .failed-note {
//     padding: 8px;
//     font-size: 11px;
//   }

//   .note-icon {
//     font-size: 12px;
//   }

//   .loading-spinner {
//     width: 25px;
//     height: 25px;
//     border-width: 2px;
//   }

//   .loading-container p {
//     font-size: 12px;
//   }

//   .error-container h2 {
//     font-size: 16px;
//   }

//   .error-message {
//     font-size: 11px;
//   }
// }
// `;

// document.head.appendChild(styleElement);

// export default PaymentConfirmation;