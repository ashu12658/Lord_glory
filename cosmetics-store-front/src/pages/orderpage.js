import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaRupeeSign,
  FaCalendarAlt,
  FaTruck,
  FaStar,
  FaChevronUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Loading Spinner
const LoadingSpinner = () => (
  <div style={{ 
    textAlign: "center", 
    marginTop: "80px", 
    color: "#0077b6", 
    fontFamily: "Poppins, sans-serif" 
  }}>
    <div style={{
      width: "50px", 
      height: "50px", 
      margin: "auto",
      border: "5px solid #e6f7fa", 
      borderTop: "5px solid #0077b6",
      borderRadius: "50%", 
      animation: "spin 1s linear infinite"
    }} />
    <p style={{ marginTop: "20px", fontSize: "18px" }}>Loading your premium orders...</p>
  </div>
);

// Error Component
const ErrorDisplay = ({ error }) => (
  <div style={{ 
    textAlign: "center", 
    marginTop: "60px", 
    color: "#e63946", 
    fontFamily: "Poppins, sans-serif" 
  }}>
    <div style={{ 
      fontSize: "48px", 
      fontWeight: "bold", 
      marginBottom: "10px" 
    }}>⚠️</div>
    <h2 style={{ color: "#1d3557" }}>Something went wrong</h2>
    <p style={{ 
      marginBottom: "20px", 
      fontSize: "16px",
      maxWidth: "500px",
      margin: "0 auto 20px"
    }}>{error}</p>
    <button
      style={{
        background: "#0077b6", 
        color: "#fff", 
        padding: "12px 24px",
        border: "none", 
        borderRadius: "8px", 
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        ":hover": {
          backgroundColor: "#005f8c"
        }
      }}
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
  const [cancelMessage, setCancelMessage] = useState("");
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
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
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
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 8);
    return deliveryDate;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const scrollToTop = () => {
    if (ordersContainerRef.current) {
      ordersContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed": 
        return { 
          color: "#2a9d8f", 
          bg: "#e6f7f6",
          icon: "✓"
        };
      case "processing": 
        return { 
          color: "#0077b6", 
          bg: "#e6f2ff",
          icon: "⏳"
        };
      case "shipped": 
        return { 
          color: "#f77f00", 
          bg: "#fff3e6",
          icon: "🚚"
        };
      case "cancelled": 
        return { 
          color: "#e63946", 
          bg: "#ffebee",
          icon: "✕"
        };
      default: 
        return { 
          color: "#666", 
          bg: "#f5f5f5",
          icon: "ℹ️"
        };
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      setCancelMessage("Your order has been successfully cancelled. A refund will be processed within 24-48 working hours.");
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setCancelMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancelMessage("Failed to cancel order. Please try again later.");
      setTimeout(() => {
        setCancelMessage("");
      }, 3000);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "1000px", 
        margin: "40px auto", 
        padding: "30px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 119, 182, 0.1)"
      }}
    >
      <div style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        paddingBottom: "20px",
        borderBottom: "1px solid #e0f7fa"
      }}>
        <h1 style={{ 
          color: "#0077b6", 
          fontSize: "32px", 
          fontWeight: "700", 
          marginBottom: "10px",
          fontFamily: "'Playfair Display', serif"
        }}>
          Your Order History
        </h1>
        <p style={{ 
          fontSize: "18px", 
          color: "#00b4d8", 
          marginBottom: "15px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          Review your premium Lord Glory purchases and manage your orders
        </p>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "8px",
          marginTop: "15px"
        }}>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} style={{ color: "#00b4d8", fontSize: "18px" }} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {cancelMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: "#e6ffed", 
              color: "#2a9d8f", 
              padding: "15px 20px",
              borderRadius: "8px", 
              marginBottom: "25px", 
              fontSize: "16px",
              textAlign: "center", 
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: "1px solid #a3e9b4"
            }}
          >
            <div style={{ 
              width: "24px", 
              height: "24px", 
              borderRadius: "50%",
              backgroundColor: "#2a9d8f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px"
            }}>✓</div>
            {cancelMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {orders.length > 0 ? (
        <div
          ref={ordersContainerRef}
          style={{
            maxHeight: "65vh", 
            overflowY: "auto", 
            paddingRight: "10px",
            position: "relative", 
            scrollbarWidth: "thin", 
            scrollbarColor: "#0077b6 #e6f7fa",
          }}
        >
          <div style={{ display: "grid", gap: "25px", paddingBottom: "20px" }}>
            {orders.map(order => (
              <motion.div
                key={order._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "#fff", 
                  borderRadius: "12px", 
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0, 119, 182, 0.1)", 
                  border: "1px solid #e0f7fa",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "5px",
                  height: "100%",
                  backgroundColor: getStatusBadge(order.status).color
                }}></div>

                <div style={{
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: "20px", 
                  paddingBottom: "15px",
                  alignItems: "center"
                }}>
                  <h2 style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    fontSize: "20px", 
                    color: "#1d3557",
                    marginLeft: "10px"
                  }}>
                    <FaBox style={{ 
                      marginRight: "12px", 
                      color: "#0077b6",
                      fontSize: "22px"
                    }} />
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>
                  <span style={{
                    padding: "6px 15px", 
                    borderRadius: "20px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    color: getStatusBadge(order.status).color,
                    backgroundColor: getStatusBadge(order.status).bg,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {getStatusBadge(order.status).icon} {order.status}
                  </span>
                </div>

                <div style={{ 
                  display: "grid", 
                  gap: "15px",
                  marginLeft: "10px",
                  marginRight: "10px"
                }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    fontSize: "16px"
                  }}>
                    <FaRupeeSign style={{ color: "#0077b6" }} />
                    <span style={{ color: "#666" }}>Total Amount:</span>
                    <strong style={{ color: "#1d3557" }}>₹{order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    fontSize: "16px"
                  }}>
                    <FaCalendarAlt style={{ color: "#0077b6" }} />
                    <span style={{ color: "#666" }}>Order Date:</span>
                    <span style={{ color: "#1d3557" }}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    fontSize: "16px"
                  }}>
                    <FaTruck style={{ color: "#0077b6" }} />
                    <span style={{ color: "#666" }}>Expected Delivery:</span>
                    <span style={{ color: "#1d3557" }}>{formatDate(order.calculatedDeliveryDate)}</span>
                  </div>

                  {order.status !== "cancelled" && order.status !== "completed" && (
                    <motion.div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        style={{
                          background: "#fff",
                          color: "#e63946",
                          padding: "10px 20px",
                          border: "1px solid #e63946",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "15px",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          ":hover": {
                            backgroundColor: "#ffebee",
                            transform: "translateY(-2px)"
                          }
                        }}
                      >
                        Cancel Order
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "fixed", 
                bottom: "40px", 
                right: "40px",
                backgroundColor: "#0077b6", 
                border: "none",
                borderRadius: "50%", 
                width: "50px",
                height: "50px",
                boxShadow: "0 4px 15px rgba(0, 119, 182, 0.3)",
                cursor: "pointer", 
                color: "#fff", 
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FaChevronUp />
            </motion.button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            textAlign: "center", 
            color: "#666", 
            marginTop: "50px",
            padding: "40px 20px",
            backgroundColor: "#f8fbfe",
            borderRadius: "12px",
            border: "1px dashed #e0f7fa"
          }}
        >
          <div style={{ 
            fontSize: "60px",
            color: "#00b4d8",
            marginBottom: "20px"
          }}>📦</div>
          <h3 style={{
            color: "#1d3557",
            fontSize: "24px",
            marginBottom: "10px",
            fontFamily: "'Playfair Display', serif"
          }}>No Orders Yet</h3>
          <p style={{
            fontSize: "16px",
            maxWidth: "400px",
            margin: "0 auto 25px",
            lineHeight: "1.6"
          }}>Your premium beauty journey with Lord Glory begins here</p>
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#0077b6", 
              color: "#fff", 
              padding: "14px 28px",
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "600",
              cursor: "pointer", 
              fontSize: "16px",
              boxShadow: "0 4px 15px rgba(0, 119, 182, 0.2)"
            }}
          >
            Start Shopping Now
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderPage;