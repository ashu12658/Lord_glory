import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { FaBox, FaRupeeSign, FaCalendarAlt, FaTruck, FaStar, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading your premium orders...</p>
  </div>
);

// Error Display Component
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

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const ordersContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders");
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersWithDeliveryDate = response.data.orders.map(order => ({
          ...order,
          calculatedDeliveryDate: calculateDeliveryDate(order.createdAt)
        }));
        setOrders(ordersWithDeliveryDate);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (ordersContainerRef.current) {
        setShowScrollTop(ordersContainerRef.current.scrollTop > 200);
      }
    };

    const container = ordersContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const calculateDeliveryDate = (orderDate) => {
    if (!orderDate) return null;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 8);
    return deliveryDate;
  };

  const formatDate = (date) => {
    if (!date) return "Calculating...";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const scrollToTop = () => {
    if (ordersContainerRef.current) {
      ordersContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return { color: '#4CAF50', bg: '#e6f7e6' };
      case 'processing':
        return { color: '#2196F3', bg: '#e6f2ff' };
      case 'shipped':
        return { color: '#FFC107', bg: '#fff8e6' };
      case 'cancelled':
        return { color: '#f44336', bg: '#ffebee' };
      default:
        return { color: '#666', bg: '#f5f5f5' };
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div 
      className="order-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="order-header">
        <h1>Your Order History</h1>
        <p className="premium-message">
          Relive your premium Lord Glory experiences
        </p>
        <div className="stars">
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="order-list-container" ref={ordersContainerRef}>
          <div className="order-list">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                className="order-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="order-card-header">
                  <h2>
                    <FaBox className="section-icon" /> Order #{order._id.slice(-8).toUpperCase()}
                  </h2>
                  <span 
                    className="status-badge"
                    style={{ 
                      color: getStatusBadge(order.status).color,
                      backgroundColor: getStatusBadge(order.status).bg
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="detail-item">
                    <FaRupeeSign className="detail-icon" />
                    <span>Total:</span>
                    <strong>₹{order.totalAmount.toFixed(2)}</strong>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>Order Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaTruck className="detail-icon" />
                    <span>Delivery Expected By:</span>
                    <span>{formatDate(order.calculatedDeliveryDate)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {showScrollTop && (
            <motion.button
              className="scroll-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <FaChevronUp />
            </motion.button>
          )}
        </div>
      ) : (
        <motion.div 
          className="no-orders"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>Your premium beauty journey begins here</p>
          <button 
            className="shop-now-btn"
            onClick={() => navigate("/")}
          >
            Explore Products
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Add styles to the document head
const styleElement = document.createElement("style");
styleElement.innerHTML = `
  .order-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 30px;
    font-family: 'Playfair Display', serif;
  }

  .order-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .order-header h1 {
    color: #333;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .premium-message {
    font-size: 18px;
    color: #d4af37;
    font-style: italic;
    margin-bottom: 15px;
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .star-icon {
    color: #d4af37;
    font-size: 18px;
  }

  .order-list-container {
    max-height: 65vh;
    overflow-y: auto;
    padding-right: 10px;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: #d4af37 #f0ece4;
  }

  .order-list-container::-webkit-scrollbar {
    width: 8px;
  }

  .order-list-container::-webkit-scrollbar-track {
    background: #f0ece4;
    border-radius: 10px;
  }

  .order-list-container::-webkit-scrollbar-thumb {
    background-color: #d4af37;
    border-radius: 10px;
  }

  .order-list {
    display: grid;
    gap: 20px;
    padding-bottom: 20px;
  }

  .order-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0ece4;
    transition: all 0.3s ease;
  }

  .order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  .order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0ece4;
  }

  .order-card-header h2 {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 20px;
    margin: 0;
  }

  .section-icon {
    margin-right: 10px;
    color: #d4af37;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }

  .order-details {
    display: grid;
    gap: 15px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
  }

  .detail-icon {
    color: #d4af37;
    min-width: 20px;
  }

  .detail-item span {
    color: #666;
    min-width: 140px;
  }

  .detail-item strong {
    color: #333;
    margin-left: auto;
  }

  .scroll-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #d4af37;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 100;
  }

  .no-orders {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .empty-icon {
    font-size: 50px;
    margin-bottom: 20px;
    color: #d4af37;
  }

  .no-orders h3 {
    color: #333;
    margin-bottom: 10px;
  }

  .no-orders p {
    color: #666;
    margin-bottom: 20px;
  }

  .shop-now-btn {
    padding: 12px 30px;
    background: #d4af37;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .shop-now-btn:hover {
    background: #c19e30;
    transform: translateY(-2px);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
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
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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
  }

  .error-message {
    color: #666;
    margin: 20px 0;
    font-size: 16px;
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
  }

  .retry-button:hover {
    background: #c19e30;
  }

  @media (max-width: 768px) {
    .order-container {
      padding: 20px;
    }
    
    .order-card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .status-badge {
      align-self: flex-start;
    }

    .scroll-top-btn {
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
    }
  }
`;
document.head.appendChild(styleElement);

export default OrderPage;