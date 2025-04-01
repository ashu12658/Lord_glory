import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SkinCareForm from "../component/SkinCareForm";
import SideMenu from "../component/sideMenu";
import logo from "../assets/logo.png";
import { FiSun, FiMoon, FiShoppingCart, FiUser } from "react-icons/fi";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <motion.div 
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#121212" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#333333"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} darkMode={darkMode} />

      {/* Header */}
      <header style={{
        ...styles.header,
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        boxShadow: darkMode ? "0px 3px 10px rgba(255, 255, 255, 0.05)" : "0px 3px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={styles.logoContainer}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.menuButton}
          >
            <div style={{...styles.menuLine, backgroundColor: darkMode ? "#fff" : "#333"}} />
            <div style={{...styles.menuLine, backgroundColor: darkMode ? "#fff" : "#333"}} />
            <div style={{...styles.menuLine, backgroundColor: darkMode ? "#fff" : "#333"}} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={styles.logoWrapper}
          >
            <motion.img
              src={logo}
              alt="Logo"
              style={styles.logo}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.span 
              style={{...styles.logoText, color: darkMode ? "#fff" : "#333"}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              LORD GLORY
            </motion.span>
          </motion.div>
        </div>

        <nav style={styles.nav}>
          <a href="#about" style={{...styles.link, color: darkMode ? "#bb86fc" : "#007bff"}}>About Us</a>
          
          <motion.button 
            style={{...styles.themeToggle, backgroundColor: darkMode ? "#333" : "#ddd"}}
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <FiSun color="#ffeb3b" /> : <FiMoon color="#333" />}
          </motion.button>

          {user ? (
            <>
              <motion.button 
                style={{...buttonStyles.green, backgroundColor: darkMode ? "#4caf50" : "#28a745"}}
                onClick={() => navigate("/orders")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiShoppingCart style={{ marginRight: 8 }} /> My Orders
              </motion.button>
              <motion.button 
                style={{...buttonStyles.red, backgroundColor: darkMode ? "#f44336" : "#dc3545"}}
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser style={{ marginRight: 8 }} /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                style={{...buttonStyles.blue, backgroundColor: darkMode ? "#2196f3" : "#007bff"}}
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button 
                style={{...buttonStyles.orange, backgroundColor: darkMode ? "#ff9800" : "#ff9800"}}
                onClick={() => navigate("/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register
              </motion.button>
            </>
          )}
        </nav>
      </header>

      <main style={styles.mainContent}>
        {user ? (
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Trust Building Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '40px',
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h1 style={{
                color: darkMode ? "#bb86fc" : "#007bff",
                fontSize: '2rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Why Trust Our Skin Care Treatment?
              </h1>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                <TrustCard 
                  darkMode={darkMode}
                  title="Dermatologist Approved"
                  content="All our products are developed in collaboration with board-certified dermatologists to ensure safety and efficacy."
                  icon="👩‍⚕️"
                />
                <TrustCard 
                  darkMode={darkMode}
                  title="Clinically Proven"
                  content="Our formulas are backed by clinical studies showing visible results in 4-8 weeks of regular use."
                  icon="🔬"
                />
                <TrustCard 
                  darkMode={darkMode}
                  title="Natural Ingredients"
                  content="We use 95% naturally derived ingredients combined with scientifically proven actives for optimal results."
                  icon="🌿"
                />
              </div>
            </motion.div>

            {/* Skin Care Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SkinCareForm darkMode={darkMode} />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Pre-login content remains the same */}
            <motion.section style={{
              ...styles.heroSection,
              backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
              boxShadow: darkMode ? "0px 5px 15px rgba(255, 255, 255, 0.05)" : "0px 5px 15px rgba(0, 0, 0, 0.1)"
            }}>
              <motion.h1 
                style={{
                  ...styles.title,
                  color: darkMode ? "#bb86fc" : "#007bff",
                  textShadow: darkMode ? "0 0 10px rgba(187, 134, 252, 0.5)" : "0 0 10px rgba(0, 123, 255, 0.3)"
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                LORD GLORY
              </motion.h1>
              <motion.h2 
                style={{
                  ...styles.subtitle,
                  color: darkMode ? "#ffffff" : "#333333"
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your Skin Deserves the Best 
              </motion.h2>
              <motion.p 
                style={{
                  ...styles.description,
                  color: darkMode ? "#cccccc" : "#666666"
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Backed by science, loved by thousands. 98% of our customers saw visible results in just 4 weeks!
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  style={{
                    ...buttonStyles.cta,
                    backgroundColor: darkMode ? "#bb86fc" : "#007bff"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: darkMode 
                      ? "0 0 15px rgba(187, 134, 252, 0.7)" 
                      : "0 0 15px rgba(0, 123, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </motion.button>
              </motion.div>
            </motion.section>

            {/* Products Grid Section */}
            <section style={styles.productsSection}>
              <div style={styles.sectionHeader}>
                <motion.h2 
                  style={{
                    color: darkMode ? "#bb86fc" : "#007bff",
                    fontSize: "2rem",
                    marginBottom: "1rem"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Our Premium Solutions
                </motion.h2>
                <motion.p
                  style={{
                    color: darkMode ? "#cccccc" : "#666666",
                    maxWidth: "600px",
                    marginBottom: "2rem"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Scientifically formulated to address your specific skin concerns
                </motion.p>
              </div>

              {/* First row of 4 boxes */}
              <div style={styles.productsRow}>
                {skinConcerns.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={index}
                    style={{
                      ...styles.productCard,
                      backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                      boxShadow: darkMode 
                        ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                        : "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: darkMode 
                        ? "0 10px 25px rgba(187, 134, 252, 0.4)" 
                        : "0 10px 25px rgba(0, 123, 255, 0.3)"
                    }}
                  >
                    <div style={styles.productImageContainer}>
                      <img 
                        src={product.image} 
                        alt={product.title}
                        style={styles.productImage}
                      />
                    </div>
                    <div style={styles.productContent}>
                      <h3 style={{
                        color: darkMode ? "#ffffff" : "#333333",
                        fontSize: "1.3rem",
                        marginBottom: "0.5rem"
                      }}>
                        {product.title}
                      </h3>
                      <p style={{
                        color: darkMode ? "#cccccc" : "#666666",
                        lineHeight: "1.5"
                      }}>
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Second row of 4 boxes */}
              <div style={styles.productsRow}>
                {skinConcerns.slice(4, 8).map((product, index) => (
                  <motion.div
                    key={index + 4}
                    style={{
                      ...styles.productCard,
                      backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                      boxShadow: darkMode 
                        ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                        : "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index + 4) * 0.1 }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: darkMode 
                        ? "0 10px 25px rgba(187, 134, 252, 0.4)" 
                        : "0 10px 25px rgba(0, 123, 255, 0.3)"
                    }}
                  >
                    <div style={styles.productImageContainer}>
                      <img 
                        src={product.image} 
                        alt={product.title}
                        style={styles.productImage}
                      />
                    </div>
                    <div style={styles.productContent}>
                      <h3 style={{
                        color: darkMode ? "#ffffff" : "#333333",
                        fontSize: "1.3rem",
                        marginBottom: "0.5rem"
                      }}>
                        {product.title}
                      </h3>
                      <p style={{
                        color: darkMode ? "#cccccc" : "#666666",
                        lineHeight: "1.5"
                      }}>
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer id="about" style={{
        ...styles.footer,
        backgroundColor: darkMode ? "#1e1e1e" : "#007bff",
        borderTop: darkMode ? "1px solid #333" : "none",
        color: "#ffffff"
      }}>
        <motion.h2 
          style={{ marginBottom: "20px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          About Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Lord Glory is dedicated to providing top-tier skincare solutions,  loved by users . We believe in self-care through science-backed products.
        </motion.p>
      </footer>
    </motion.div>
  );
};

// Trust Card Component
const TrustCard = ({ darkMode, title, content, icon }) => (
  <motion.div
    style={{
      backgroundColor: darkMode ? "#1e1e1e" : "#f8f9fa",
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    }}
    whileHover={{ 
      y: -5,
      boxShadow: darkMode 
        ? "0 5px 15px rgba(187, 134, 252, 0.2)" 
        : "0 5px 15px rgba(0, 123, 255, 0.1)"
    }}
  >
    <div style={{ 
      fontSize: '2.5rem',
      marginBottom: '15px'
    }}>
      {icon}
    </div>
    <h3 style={{ 
      color: darkMode ? "#bb86fc" : "#007bff",
      marginBottom: '10px'
    }}>
      {title}
    </h3>
    <p style={{ 
      color: darkMode ? "#cccccc" : "#666666",
      lineHeight: '1.5'
    }}>
      {content}
    </p>
  </motion.div>
);

// Skin Concerns Data
const skinConcerns = [
  { 
    title: "Pigmentation Solution", 
    description: "Advanced formula to reduce dark spots and even out skin tone.", 
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Acne Control System", 
    description: "Complete regimen to treat and prevent breakouts effectively.", 
    image: "https://images.unsplash.com/photo-1540200049844-17b7a354d6f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Radiance Booster", 
    description: "Brightening treatment that revitalizes dull skin instantly.", 
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Anti-Aging Complex", 
    description: "Powerful ingredients to reduce fine lines and wrinkles.", 
    image: "https://images.unsplash.com/photo-1556228578-9f4d58a4f7a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Hydration Serum", 
    description: "Deep moisturizing formula for dry and dehydrated skin.", 
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Sensitive Skin Relief", 
    description: "Gentle formula to calm and soothe irritated skin.", 
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Pore Minimizer", 
    description: "Specialized treatment to refine pores and smooth texture.", 
    image: "https://images.unsplash.com/photo-1556228578-6cee6429e6b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    title: "Night Repair Cream", 
    description: "Overnight renewal treatment for healthier-looking skin.", 
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
];

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  header: {
    width: "100%",
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 1000,
    padding: "0 20px",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  menuButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "24px",
    width: "30px",
    cursor: "pointer",
    zIndex: 1100
  },
  menuLine: {
    height: "3px",
    width: "100%",
    borderRadius: "3px",
    transition: "all 0.3s ease"
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logoText: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    letterSpacing: "1px"
  },
  mainContent: {
    marginTop: "80px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
  },
  logo: {
    height: "50px",
    cursor: "pointer",
    filter: "drop-shadow(0 0 5px rgba(0,0,0,0.2))",
  },
  nav: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: { 
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s ease",
    padding: "8px 12px",
    borderRadius: "5px",
    ":hover": {
      backgroundColor: "rgba(0,0,0,0.1)"
    }
  },
  themeToggle: {
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin: "0 10px"
  },
  heroSection: {
    textAlign: "center",
    padding: "60px 30px",
    width: "90%",
    maxWidth: "800px",
    borderRadius: "15px",
    margin: "40px 0",
    transition: "all 0.3s ease",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "15px",
    fontWeight: "700",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    fontWeight: "400",
    transition: "all 0.3s ease",
  },
  description: {
    fontSize: "1rem",
    marginBottom: "30px",
    lineHeight: "1.6",
    transition: "all 0.3s ease",
  },
  productsSection: {
    width: "100%",
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px"
  },
  productsRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px"
  },
  productCard: {
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    width: "260px",
    flexShrink: 0
  },
  productImageContainer: {
    width: "100%",
    height: "220px",
    overflow: "hidden"
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.05)"
    }
  },
  productContent: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  footer: {
    marginTop: "auto",
    padding: "60px 30px",
    textAlign: "center",
    width: "100%",
    transition: "background-color 0.3s ease",
  },
};

const buttonStyles = {
  green: { 
    padding: "10px 20px",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  red: { 
    padding: "10px 20px",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  blue: { 
    padding: "10px 20px",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  orange: { 
    padding: "10px 20px",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  cta: {
    padding: "12px 30px",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }
};

export default Home;