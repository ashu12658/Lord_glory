
import React, { useState, useEffect } from "react";
import AgentOrders from "../component/agentOrder";
import AgentDashboardProducts from "../component/agentproduct";
import AgentOrderForm from "../component/orderProduct";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  FiBox, 
  FiShoppingCart, 
  FiDollarSign, 
  FiUser, 
  FiPlusCircle,
  FiAlertTriangle,
  FiSun,
  FiMoon,
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiCreditCard,
  FiPieChart
} from "react-icons/fi";

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [agentName, setAgentName] = useState("Agent");
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(0);
  const [couponBalance, setCouponBalance] = useState({
    totalBalance: 0,
    orderCount: 0,
    balancesPerOrder: []
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isGlowing, setIsGlowing] = useState(true);
  const navigate = useNavigate();

  // Enhanced Lord Glory theme colors
  const theme = {
    light: {
      primary: "#3a5af5", // Vibrant blue
      secondary: "#6c5ce7", // Purple accent
      accent: "#fd7e14", // Orange for highlights
      background: "#f8f9fa", // Light gray
      card: "#ffffff",
      text: "#2d3436", // Dark gray
      textSecondary: "#636e72",
      success: "#00b894", // Green
      warning: "#fdcb6e", // Yellow
      danger: "#d63031", // Red
      badge: "#e84393" // Pink
    },
    dark: {
      primary: "#546de5", // Softer blue
      secondary: "#786fa6", // Muted purple
      accent: "#f5cd79", // Gold accent
      background: "#1a1a2e", // Dark navy
      card: "#16213e",
      text: "#e2e8f0",
      textSecondary: "#94a3b8",
      success: "#55efc4", // Teal
      warning: "#ffeaa7",
      danger: "#ff7675",
      badge: "#fd79a8"
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Glow animation for premium feel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Data fetching
  useEffect(() => {
    const token = localStorage.getItem("agentToken");
    if (!token) {
      navigate("/agent/login");
      return;
    }

    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setAgentName(decoded.name || decoded.email || "Agent");

        const responses = await Promise.all([
          fetch("http://localhost:5000/api/agents/orders-count", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/agents/get-coupen-user", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/agents/get-balance", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [countData, orderData, balanceData] = await Promise.all(
          responses.map(res => res.json())
        );

        if (countData?.success) setOrderCount(countData.orderCount);
        if (orderData?.success) setOrders(orderData.orders);
        if (balanceData) {
          setBalance(balanceData.balance);
          setCouponBalance({
            totalBalance: balanceData.totalBalance || 0,
            orderCount: balanceData.orderCount || 0,
            balancesPerOrder: balanceData.balancesPerOrder || []
          });
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/agent/login");
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const tabs = [
    { id: "products", name: "Products", icon: <FiBox /> },
    { id: "orders", name: "Orders", icon: <FiShoppingCart /> },
    { id: "orderForm", name: "New Order", icon: <FiPlusCircle /> },
    { id: "coupons", name: "Commissions", icon: <FiTrendingUp /> }
  ];

  return (
    <div style={{
      background: currentTheme.background,
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      transition: "all 0.3s ease",
      position: "relative"
    }}>
      {/* Premium Brand Header */}
      <div style={{
        background: currentTheme.primary,
        padding: "12px 0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 5
              }}
              style={{
                background: "white",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentTheme.primary,
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              LG
            </motion.div>
            <span style={{
              color: "white",
              fontWeight: "600",
              fontSize: "18px",
              letterSpacing: "0.5px"
            }}>LORD GLORY</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <FiUser size={14} />
              <span>{agentName}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white"
              }}
            >
              {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: "100px 20px 40px", 
        maxWidth: "1400px", 
        margin: "0 auto" 
      }}>
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
            color: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                fontSize: "28px", 
                marginBottom: "8px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              Welcome back, {agentName.split(' ')[0]}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.3 }}
              style={{ 
                fontSize: "16px",
                maxWidth: "600px",
                lineHeight: "1.6"
              }}
            >
              Manage your Lord Glory products, track orders, and monitor your commissions all in one place.
            </motion.p>
          </div>
          
          {/* Decorative elements */}
          <div style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            opacity: "0.1",
            fontSize: "120px",
            zIndex: 1
          }}>
            <FiAward />
          </div>
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              right: "-100px",
              top: "-100px",
              width: "300px",
              height: "300px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%"
            }}
          />
        </motion.div>

        {/* Stats Container */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {[
            {
              title: "Coupon Orders",
              value: orderCount,
              icon: <FiShoppingCart size={24} />,
              color: currentTheme.primary,
              trend: "up",
              change: ""
            },
            {
              title: "Coupon Balance",
              value: `₹${couponBalance.totalBalance.toLocaleString()}`,
              icon: <FiCreditCard size={24} />,
              color: currentTheme.success,
              trend: "up",
              change: ""
            },
            {
              title: "Conversion Rate",
              value: "",
              icon: <FiPieChart size={24} />,
              color: currentTheme.accent,
              trend: "steady",
              change: ""
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              style={{
                background: currentTheme.card,
                padding: "25px",
                borderRadius: "14px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                borderLeft: `5px solid ${stat.color}`,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ 
                position: "absolute",
                top: "15px",
                right: "15px",
                color: stat.color,
                opacity: "0.1",
                fontSize: "60px"
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                fontSize: "16px",
                color: currentTheme.textSecondary,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "500"
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  background: `${stat.color}20`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                {stat.title}
              </div>
              <div style={{ 
                fontSize: "32px",
                fontWeight: "700",
                color: currentTheme.text,
                margin: "15px 0 5px"
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: "13px",
                color: stat.trend === "up" ? currentTheme.success : 
                      stat.trend === "down" ? currentTheme.danger : currentTheme.warning,
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→"} {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
          borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
          paddingBottom: "5px"
        }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * tabs.indexOf(tab) + 0.4 }}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                background: activeTab === tab.id ? currentTheme.primary : "transparent",
                color: activeTab === tab.id ? "white" : currentTheme.textSecondary,
                fontSize: "15px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                position: "relative",
                transition: "all 0.2s ease"
              }}
            >
              {tab.icon}
              {tab.name}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tabIndicator"
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: currentTheme.primary,
                    borderRadius: "3px"
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              background: currentTheme.card,
              padding: "30px",
              borderRadius: "14px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
              minHeight: "400px",
              border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
              transition: "all 0.3s ease"
            }}
          >
            {activeTab === "products" && <AgentDashboardProducts darkMode={darkMode} />}
            {activeTab === "orders" && <AgentOrders orders={orders} darkMode={darkMode} />}
            {activeTab === "orderForm" && <AgentOrderForm darkMode={darkMode} />}
            {activeTab === "coupons" && (
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px"
                }}>
                  <div>
                    <h2 style={{ 
                      fontSize: "22px",
                      fontWeight: "600",
                      color: currentTheme.text,
                      margin: "0 0 5px"
                    }}>
                      Commission Dashboard
                    </h2>
                    <p style={{ 
                      fontSize: "14px",
                      color: currentTheme.textSecondary,
                      margin: 0
                    }}>
                      Track your earnings from Lord Glory coupon sales
                    </p>
                  </div>
                  <div style={{
                    background: darkMode ? '#1e3a8a' : '#f0f5ff',
                    color: currentTheme.primary,
                    padding: "10px 20px",
                    borderRadius: "30px",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FiDollarSign />
                    Total: ₹{couponBalance.totalBalance.toLocaleString()}
                  </div>
                </div>

                {couponBalance.orderCount > 0 ? (
                  <div style={{
                    background: darkMode ? '#1e293b' : '#f9fafb',
                    borderRadius: "12px",
                    padding: "25px",
                    border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "20px",
                      marginBottom: "25px"
                    }}>
                      <div style={{
                        background: darkMode ? '#334155' : '#ffffff',
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      }}>
                        <div style={{ fontSize: "14px", color: currentTheme.textSecondary }}>Total Orders</div>
                        <div style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: currentTheme.text,
                          margin: "5px 0"
                        }}>
                          {couponBalance.orderCount}
                        </div>
                        <div style={{ 
                          fontSize: "12px",
                          color: currentTheme.success,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <FiTrendingUp /> 
                        </div>
                      </div>
                      <div style={{
                        background: darkMode ? '#334155' : '#ffffff',
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      }}>
                        <div style={{ fontSize: "14px", color: currentTheme.textSecondary }}>Commission per Order</div>
                        <div style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: currentTheme.text,
                          margin: "5px 0"
                        }}>
                          ₹250
                        </div>
                        <div style={{ 
                          fontSize: "12px",
                          color: currentTheme.textSecondary
                        }}>
                          Fixed rate for all orders
                        </div>
                      </div>
                      <div style={{
                        background: darkMode ? '#334155' : '#ffffff',
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      }}>
                        <div style={{ fontSize: "14px", color: currentTheme.textSecondary }}>Estimated Monthly</div>
                        <div style={{ 
                          fontSize: "24px", 
                          fontWeight: "700", 
                          color: currentTheme.text,
                          margin: "5px 0"
                        }}>
                          ₹{(couponBalance.orderCount * 50 * 4).toLocaleString()}
                        </div>
                        <div style={{ 
                          fontSize: "12px",
                          color: currentTheme.textSecondary
                        }}>
                          Based on current rate
                        </div>
                      </div>
                    </div>

                    <h3 style={{ 
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: currentTheme.text,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <FiActivity /> Recent Commission History
                    </h3>
                    <div style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      borderRadius: "10px"
                    }}>
                      {couponBalance.balancesPerOrder.map((commission, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 20px",
                            background: darkMode ? '#334155' : 'white',
                            borderRadius: "8px",
                            marginBottom: "12px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            borderLeft: `4px solid ${currentTheme.primary}`
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                              width: "40px",
                              height: "40px",
                              background: `${currentTheme.primary}20`,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: currentTheme.primary,
                              fontWeight: "600"
                            }}>
                              #{index + 1}
                            </div>
                            <div>
                              <div style={{ 
                                fontWeight: "600",
                                color: currentTheme.text,
                                marginBottom: "3px"
                              }}>
                                Order {index + 1}
                              </div>
                              <div style={{ 
                                fontSize: "12px",
                                color: currentTheme.textSecondary
                              }}>
                                {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div style={{ 
                            fontWeight: "700",
                            fontSize: "18px",
                            color: currentTheme.success
                          }}>
                            ₹{commission}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: "12px",
                    border: `1px dashed ${darkMode ? '#334155' : '#e5e7eb'}`
                  }}>
                    <div style={{ 
                      fontSize: "80px",
                      marginBottom: "20px",
                      opacity: "0.2",
                      color: currentTheme.primary
                    }}>
                      <FiDollarSign />
                    </div>
                    <h3 style={{ 
                      fontSize: "20px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: currentTheme.text
                    }}>
                      No commissions yet
                    </h3>
                    <p style={{
                      color: currentTheme.textSecondary,
                      maxWidth: "500px",
                      margin: "0 auto 20px",
                      lineHeight: "1.6"
                    }}>
                      Your commission history will appear here when customers make purchases using your Lord Glory coupon code.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: currentTheme.primary,
                        color: "white",
                        border: "none",
                        padding: "12px 30px",
                        borderRadius: "8px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <FiPlusCircle /> Create New Coupon
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{
        background: darkMode ? '#0f172a' : '#f1f5f9',
        padding: "20px",
        marginTop: "50px",
        borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{
              background: currentTheme.primary,
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}>
              LG
            </div>
            <span style={{
              fontWeight: "600",
              color: currentTheme.text
            }}>LORD GLORY</span>
          </div>
          <div style={{
            display: "flex",
            gap: "15px",
            fontSize: "14px"
          }}>
            <a href="#" style={{ color: currentTheme.textSecondary }}>Terms</a>
            <a href="#" style={{ color: currentTheme.textSecondary }}>Privacy</a>
            <a href="#" style={{ color: currentTheme.textSecondary }}>Support</a>
          </div>
          <div style={{ 
            fontSize: "13px",
            color: currentTheme.textSecondary
          }}>
            © {new Date().getFullYear()} Lord Glory. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;