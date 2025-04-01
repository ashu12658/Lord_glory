import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SkinCareForm from "../component/SkinCareForm";
import SideMenu from "../component/sideMenu";
import logo from "../assets/logo.png";
import pig from "../assets/pig.jpg";
import acne from "../assets/acne.jpg";
import pimples from "../assets/pimples.jpeg";
import darkcircles from "../assets/darkcircles.jpg";
import skintone from "../assets/skintone.jpg";
import dryskin2 from "../assets/dryskin2.jpg";
import oilyskin from "../assets/oilyskin.jpg";
import glowskin from "../assets/glowskin.jpg";
import { FiSun, FiMoon, FiShoppingCart, FiUser, FiMail, FiMenu, FiCheckCircle, FiShield, FiActivity, FiDroplet } from "react-icons/fi";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const skinConcerns = [
    { 
      title: "Pigmentation", 
      description: "Advanced formula to reduce dark spots and even out skin tone.", 
      image: pig,
      info: "Hyperpigmentation occurs when melanin is overproduced in certain areas of the skin. Our treatment combines clinically-proven brightening agents to target discoloration at its source.",
      causes: "Sun exposure, hormonal changes (melasma), post-inflammatory hyperpigmentation (acne scars), aging, genetic factors",
      symptoms: "Dark spots, uneven skin tone, patches darker than natural skin color",
      solution: "Daily SPF 30+, vitamin C serum, niacinamide treatments, chemical peels, laser therapy",
      keyIngredients: "Niacinamide, Vitamin C, Alpha Arbutin, Licorice Root Extract"
    },
    { 
      title: "Acne and Darkspot", 
      description: "Complete regimen to treat and prevent breakouts effectively.", 
      image: acne,
      info: "Acne vulgaris is a multifactorial condition involving excess oil production, clogged pores, bacteria, and inflammation. Our system treats active breakouts while preventing future ones and fading post-acne marks.",
      causes: "Hormonal fluctuations, stress, comedogenic products, bacteria (C. acnes), excess sebum production",
      symptoms: "Whiteheads, blackheads, papules, pustules, cysts, post-inflammatory erythema/hyperpigmentation",
      solution: "Salicylic acid cleanser, benzoyl peroxide spot treatment, retinoids, oil-free moisturizers, non-comedogenic products",
      keyIngredients: "Salicylic Acid, Benzoyl Peroxide, Retinol, Tea Tree Oil, Zinc PCA"
    },
    { 
      title: "Pimples", 
      description: "Targeted treatment for active breakouts and inflammation.", 
      image: pimples,
      info: "Pimples are inflamed acne lesions that develop when pores become clogged and infected. Our fast-acting formula reduces redness, swelling, and bacteria count within hours.",
      causes: "Clogged hair follicles, bacterial infection (P. acnes), excess oil production, dead skin cell accumulation",
      symptoms: "Tender red bumps, pus-filled lesions, localized swelling, possible scarring if picked",
      solution: "Avoid picking, use anti-inflammatory ingredients, apply ice to reduce swelling, maintain clean skin",
      keyIngredients: "Benzoyl Peroxide, Sulfur, Niacinamide, Allantoin, Centella Asiatica"
    },
    { 
      title: "Skintone and Tanning", 
      description: "Solutions for uneven tone and sun-induced darkening.", 
      image: skintone,
      info: "Uneven skin tone results from irregular melanin distribution often caused by UV exposure. Our brightening system inhibits tyrosinase activity while accelerating cellular turnover.",
      causes: "Sun exposure, pollution, hormonal changes, inflammation, certain medications",
      symptoms: "Patchy discoloration, darker areas than natural skin tone, lack of radiance",
      solution: "Daily broad-spectrum sunscreen, antioxidant serums, exfoliation (AHAs/BHAs), skin-brightening agents",
      keyIngredients: "Vitamin C, Kojic Acid, Tranexamic Acid, Glycolic Acid, Mulberry Extract"
    },
    { 
      title: "Dark Circles & Dullness", 
      description: "Revitalizing treatment for tired-looking eyes.", 
      image: darkcircles,
      info: "Under-eye darkness stems from multiple factors including thin skin revealing blood vessels, pigmentation, and shadowing. Our treatment combines multiple approaches for comprehensive improvement.",
      causes: "Genetics, lack of sleep, allergies, dehydration, aging, iron deficiency, sun exposure",
      symptoms: "Dark purple/blue/brown discoloration under eyes, hollow appearance, fine lines",
      solution: "Adequate sleep, hydration, cold compresses, caffeine serums, vitamin K creams, sunscreen",
      keyIngredients: "Caffeine, Vitamin K, Peptides, Hyaluronic Acid, Haloxyl"
    },
    { 
      title: "Dry Skin", 
      description: "Intensive hydration for parched, flaky skin.", 
      image: dryskin2,
      info: "Xerosis (dry skin) occurs when the skin barrier is compromised and unable to retain moisture. Our ceramide-rich formula repairs while providing immediate and long-lasting hydration.",
      causes: "Cold/dry weather, low humidity, harsh cleansers, hot showers, aging, certain medical conditions",
      symptoms: "Flaking, scaling, redness, tightness, rough texture, increased visibility of fine lines",
      solution: "Gentle cleansers, humidifiers, occlusive moisturizers, shorter showers with lukewarm water",
      keyIngredients: "Ceramides, Hyaluronic Acid, Shea Butter, Squalane, Cholesterol"
    },
    { 
      title: "Glow Skin", 
      description: "Radiance-boosting regimen for luminous skin.", 
      image: glowskin,
      info: "Dull skin results from accumulated dead skin cells and poor microcirculation. Our glow system exfoliates, stimulates cell turnover, and enhances radiance for lit-from-within brightness.",
      causes: "Dead skin accumulation, dehydration, poor circulation, stress, pollution, lack of sleep",
      symptoms: "Lackluster appearance, rough texture, uneven tone, fatigue-looking complexion",
      solution: "Regular exfoliation, facial massage, hydrating masks, antioxidant serums, adequate sleep",
      keyIngredients: "Glycolic Acid, Vitamin C, Niacinamide, Turmeric Extract, Illuminating Mica"
    },
    { 
      title: "Oily Skin", 
      description: "Oil-control solutions for shine-free complexion.", 
      image: oilyskin,
      info: "Seborrhea (oily skin) occurs when sebaceous glands produce excess sebum. Our oil-control system regulates without over-drying, preventing the rebound oiliness caused by harsh products.",
      causes: "Genetics, hormones, humidity, using wrong products (over-stripping), stress",
      symptoms: "Shiny appearance, enlarged pores, frequent breakouts, makeup breakdown",
      solution: "Oil-free products, blotting papers, balanced cleansing (not over-drying), clay masks",
      keyIngredients: "Niacinamide, Zinc PCA, Willow Bark Extract, Kaolin Clay, Mattifying Polymers"
    }
  ];

  return (
    <motion.div 
      className="main-container"
      style={{
        backgroundColor: darkMode ? "#121212" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#333333",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} darkMode={darkMode} />

      {/* Header - Optimized for Mobile */}
      <header style={{
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        boxShadow: darkMode ? "0px 3px 10px rgba(255, 255, 255, 0.05)" : "0px 3px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '5px'
            }}
            aria-label="Menu"
          >
            <FiMenu size={24} color={darkMode ? "#fff" : "#333"} />
          </motion.button>
          
          <motion.div 
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "40px" }}
            />
            <span style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: darkMode ? "#fff" : "#333",
              display: window.innerWidth > 768 ? "block" : "none"
            }}>
              LORD GLORY
            </span>
          </motion.div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <motion.button 
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            style={{
              background: darkMode ? "#333" : "#ddd",
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun color="#ffeb3b" /> : <FiMoon color="#333" />}
          </motion.button>

          {user ? (
            <>
              <motion.button 
                onClick={() => navigate("/orders")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: darkMode ? "#4caf50" : "#28a745",
                  color: "#fff",
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiShoppingCart />
                <span style={{ display: window.innerWidth > 480 ? "inline" : "none" }}>Orders</span>
              </motion.button>
              <motion.button 
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: darkMode ? "#f44336" : "#dc3545",
                  color: "#fff",
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiUser />
                <span style={{ display: window.innerWidth > 480 ? "inline" : "none" }}>Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: darkMode ? "#2196f3" : "#007bff",
                  color: "#fff",
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontSize: '14px'
                }}
              >
                Login
              </motion.button>
              <motion.button 
                onClick={() => navigate("/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#ff9800",
                  color: "#fff",
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  display: window.innerWidth > 480 ? "block" : "none"
                }}
              >
                Register
              </motion.button>
            </>
          )}
        </div>
      </header>

      <main style={{ marginTop: "70px", flex: 1 }}>
        {user ? (
          <div style={{ 
            width: '100%', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '20px' 
          }}>
            {/* Enhanced Trust Building Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '25px'
              }}>
                <FiShield size={32} color={darkMode ? "#bb86fc" : "#007bff"} />
                <h1 style={{
                  color: darkMode ? "#bb86fc" : "#007bff",
                  fontSize: '1.8rem',
                  marginLeft: '15px',
                  textAlign: 'center'
                }}>
                  FDA-Approved Skincare Solutions
                </h1>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '25px',
                marginTop: '30px'
              }}>
                <TrustCard 
                  darkMode={darkMode}
                  title="FDA Certified"
                  content="All our products meet strict FDA standards for safety and efficacy."
                  icon={<FiCheckCircle size={28} color={darkMode ? "#bb86fc" : "#007bff"} />}
                />
                <TrustCard 
                  darkMode={darkMode}
                  title="Clinically Tested"
                  content="Developed with dermatologists to ensure skin compatibility."
                  icon={<FiActivity size={28} color={darkMode ? "#bb86fc" : "#007bff"} />}
                />
                <TrustCard 
                  darkMode={darkMode}
                  title="Natural & Effective"
                  content="95% naturally derived ingredients with proven results."
                  icon={<FiDroplet size={28} color={darkMode ? "#bb86fc" : "#007bff"} />}
                />
              </div>

              <motion.div 
                style={{
                  marginTop: '30px',
                  padding: '20px',
                  backgroundColor: darkMode ? '#1e1e1e' : '#f0f8ff',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${darkMode ? '#bb86fc' : '#007bff'}`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p style={{
                  color: darkMode ? '#ffffff' : '#333333',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  <strong>Note:</strong> Our FDA approval means each product has undergone rigorous testing 
                  to ensure safety and effectiveness for your specific skin concerns.
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Skin Care Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: '12px',
                padding: '30px',
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#bb86fc20' : '#007bff20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <FiUser size={24} color={darkMode ? "#bb86fc" : "#007bff"} />
                </div>
                <div>
                  <h2 style={{
                    color: darkMode ? "#ffffff" : "#333333",
                    fontSize: '1.5rem',
                    marginBottom: '5px'
                  }}>
                    Personalized Skin Analysis
                  </h2>
                  <p style={{
                    color: darkMode ? "#cccccc" : "#666666",
                    fontSize: '0.9rem'
                  }}>
                    Complete this form to get customized recommendations
                  </p>
                </div>
              </div>

              <SkinCareForm darkMode={darkMode} />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <motion.section 
              style={{
                backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                boxShadow: darkMode 
                  ? "0px 5px 15px rgba(255, 255, 255, 0.05)" 
                  : "0px 5px 15px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                padding: "40px 20px",
                margin: "20px",
                borderRadius: "15px"
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                style={{
                  color: darkMode ? "#bb86fc" : "#007bff",
                  fontSize: "2rem",
                  marginBottom: "15px",
                  fontWeight: "700"
                }}
              >
                LORD GLORY
              </motion.h1>
              <motion.h2 
                style={{
                  color: darkMode ? "#ffffff" : "#333333",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  fontWeight: "400"
                }}
              >
                FDA-Approved Skincare
              </motion.h2>
              <motion.p 
                style={{
                  color: darkMode ? "#cccccc" : "#666666",
                  fontSize: "1rem",
                  marginBottom: "30px",
                  lineHeight: "1.6",
                  maxWidth: "600px",
                  margin: "0 auto 30px"
                }}>
                98% of customers saw visible results in just 4 weeks!
              </motion.p>
              <motion.button
                style={{
                  backgroundColor: darkMode ? "#bb86fc" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  margin: "0 auto"
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
            </motion.section>

            {/* Products Section */}
            <section style={{ 
              padding: "40px 20px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <motion.h2 
                  style={{
                    color: darkMode ? "#bb86fc" : "#007bff",
                    fontSize: "1.8rem",
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
                    margin: "0 auto"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Scientifically formulated for your skin concerns
                </motion.p>
              </div>

              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                padding: "0 10px"
              }}>
                {skinConcerns.map((product, index) => (
                  <motion.div
                    key={index}
                    style={{
                      backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                      borderRadius: "12px",
                      overflow: "hidden",
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
                    <div style={{ 
                      height: "200px",
                      overflow: "hidden"
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.title}
                        style={{ 
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    </div>
                    <div style={{ padding: "20px" }}>
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

      {/* Enhanced Footer */}
      <footer style={{
        backgroundColor: darkMode ? "#1e1e1e" : "#007bff",
        color: "#ffffff",
        padding: "40px 20px",
        marginTop: "auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* Developed By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 style={{
              fontSize: "1.2rem",
              marginBottom: "15px",
              fontWeight: "600"
            }}>
              
            </h3>
            <p style={{ marginBottom: "5px" }}></p>
            <p> </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{
              fontSize: "1.2rem",
              marginBottom: "15px",
              fontWeight: "600"
            }}>
              Contact Us
            </h3>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "8px"
            }}>
              <FiMail />
              <a 
                href="mailto:lordglory@gmail.com" 
                style={{ 
                  color: "#ffffff",
                  textDecoration: "none",
                  ":hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                lordgloryindia@gmail.com,
                <br/>
                -8551062783
              </a>
            </div>
          </motion.div>

          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{
              fontSize: "1.2rem",
              marginBottom: "15px",
              fontWeight: "600"
            }}>
              About Us
            </h3>
            <p>
              Lord Glory provides Clinically-approved skincare solutions backed by science and loved by users worldwide.
            </p>
          </motion.div>
        </div>

        <motion.p
          style={{ 
            textAlign: "center",
            marginTop: "40px",
            fontSize: "0.9rem",
            opacity: 0.8
          }}
        >
          © {new Date().getFullYear()} Lord Glory. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  );
};

// Enhanced Trust Card Component
const TrustCard = ({ darkMode, title, content, icon }) => (
  <motion.div
    style={{
      backgroundColor: darkMode ? "#1e1e1e" : "#f8f9fa",
      borderRadius: '10px',
      padding: '25px',
      textAlign: 'center',
      border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}
    whileHover={{ 
      y: -5,
      boxShadow: darkMode 
        ? "0 5px 15px rgba(187, 134, 252, 0.2)" 
        : "0 5px 15px rgba(0, 123, 255, 0.1)"
    }}
  >
    <div style={{ 
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: darkMode ? '#bb86fc20' : '#007bff20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px'
    }}>
      {icon}
    </div>
    <h3 style={{ 
      color: darkMode ? "#bb86fc" : "#007bff",
      marginBottom: '15px',
      fontSize: '1.2rem'
    }}>
      {title}
    </h3>
    <p style={{ 
      color: darkMode ? "#cccccc" : "#666666",
      lineHeight: '1.6',
      flex: 1
    }}>
      {content}
    </p>
  </motion.div>
);

export default Home;