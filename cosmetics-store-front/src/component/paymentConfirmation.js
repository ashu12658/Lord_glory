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
          `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}` 
            },
          }
        );

        const orderData = orderResponse.data;
        setOrderDetails(orderData);

        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${orderData.user}`,
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