import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import problem1 from "../assets/problem1.jpg";
import problem2 from "../assets/problem2.jpg";
import problem3 from "../assets/problem3.jpg";
import problem4 from "../assets/problem4.jpg";
import problem5 from "../assets/problem5.jpg";
import problem6 from "../assets/problem6.jpg";
import { 
  FiSun, FiMoon, FiShoppingCart, FiUser, FiMail, FiMenu, 
  FiCheckCircle, FiShield, FiActivity, FiDroplet, FiChevronDown,
  FiChevronUp, FiPhone, FiMapPin, FiHeart, FiAward, FiStar, FiClock
} from "react-icons/fi";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFooterItem, setExpandedFooterItem] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);

  const sentences = [
    "Transform Your Skin Today",
    "Dermatologist Recommended",
    "Science-Backed Formulas",
    "Natural Ingredients",
    "Visible Results Guaranteed"
  ];

  const problemImages = [
    { img: problem1, title: "Acne & Breakouts" },
    { img: problem2, title: "Dark Spots" },
    { img: problem3, title: "Dry Skin" },
    { img: problem4, title: "Wrinkles" },
    { img: problem5, title: "Redness" },
    { img: problem6, title: "Oily Skin" }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = !darkMode ? "#121212" : "#f8f9fa";
  };

  const toggleFooterItem = (item) => {
    setExpandedFooterItem(expandedFooterItem === item ? null : item);
  };

  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const FDABadge = () => (
    <motion.div 
      style={{
        backgroundColor: darkMode ? '#1a5276' : '#2980b9',
        color: 'white',
        padding: isMobile ? '3px 6px' : '5px 10px',
        borderRadius: 4,
        fontSize: isMobile ? 10 : 12,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginLeft: isMobile ? 5 : 10,
        whiteSpace: 'nowrap'
      }}
      whileHover={{ scale: 1.05 }}
    >
      <FiAward size={isMobile ? 10 : 12} />
      <span>FDA Approved</span>
    </motion.div>
  );

  const TrustIndicators = () => (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: isMobile ? 10 : 15,
      margin: isMobile ? '15px 0' : '20px 0',
      padding: isMobile ? 10 : 15,
      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <FiStar color={darkMode ? "#f1c40f" : "#e67e22"} size={isMobile ? 14 : 16} />
        <span style={{ fontSize: isMobile ? 12 : 14 }}>4.9/5 (2,000+ Reviews)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <FiUser color={darkMode ? "#2ecc71" : "#27ae60"} size={isMobile ? 14 : 16} />
        <span style={{ fontSize: isMobile ? 12 : 14 }}>50,000+ Happy Customers</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <FiClock color={darkMode ? "#9b59b6" : "#8e44ad"} size={isMobile ? 14 : 16} />
        <span style={{ fontSize: isMobile ? 12 : 14 }}>Clinically Tested</span>
      </div>
    </div>
  );

  const skinConcerns = [
    { 
      title: "Pigmentation", 
      description: "Advanced treatment to reduce dark spots and even out skin tone.", 
      image: pig,
      info: "Our pigmentation treatment combines niacinamide, vitamin C, and licorice root extract to inhibit melanin production and fade existing dark spots. Suitable for all skin types.",
      causes: "Sun exposure, hormonal changes (melasma), post-inflammatory hyperpigmentation (acne scars), aging, genetic factors",
      symptoms: "Dark spots, uneven skin tone, patches darker than natural skin color",
      benefits: "Brighter complexion, reduced visibility of dark spots, more even skin tone"
    },
    { 
      title: "Acne Treatment System", 
      description: "Complete solution for acne-prone skin with visible results in 2 weeks.", 
      image: acne,
      info: "Our acne treatment system combines salicylic acid (2%), niacinamide (4%), and tea tree oil to target acne at all stages - prevents new breakouts, clears existing pimples, and fades post-acne marks. The formula is non-comedogenic and suitable for sensitive skin.",
      causes: "Excess oil production, clogged pores, bacteria (C. acnes), hormonal changes, stress, certain medications",
      symptoms: "Whiteheads, blackheads, papules, pustules, nodules, cysts, redness, inflammation",
      benefits: "Reduces active breakouts by 78% in 2 weeks, prevents new acne formation, minimizes pores, reduces redness and inflammation, fades acne scars"
    },
    { 
      title: "Pimple Spot Treatment", 
      description: "Fast-acting formula reduces pimple size overnight.", 
      image: pimples,
      info: "Our clinical-strength spot treatment contains 5% benzoyl peroxide microspheres + 1% colloidal sulfur to penetrate deep into pores and eliminate pimple-causing bacteria without excessive dryness. Includes soothing aloe vera and panthenol to calm skin.",
      causes: "Bacterial infection (P. acnes), excess sebum, dead skin cell buildup, hormonal fluctuations, stress",
      symptoms: "Red, inflamed bumps, pus-filled lesions, tenderness, sometimes pain",
      benefits: "Reduces pimple size by 50% overnight, calms inflammation, prevents spreading, minimizes scarring risk, non-comedogenic formula"
    },
    { 
      title: "Dark Circles", 
      description: "Revitalizing treatment to brighten under-eye area.", 
      image: darkcircles,
      info: "Enriched with caffeine, vitamin K, and hyaluronic acid to improve circulation, strengthen capillaries, and hydrate the delicate under-eye area.",
      causes: "Fatigue, aging, genetics, allergies, dehydration, sun exposure",
      symptoms: "Darkened skin under eyes, puffiness, hollow appearance",
      benefits: "Brighter eye area, reduced puffiness, improved hydration"
    },
    { 
      title: "Uneven Skin Tone", 
      description: "Corrective treatment for a more uniform complexion.", 
      image: skintone,
      info: "Our brightening complex combines alpha arbutin, kojic acid, and tranexamic acid to target discoloration without irritation.",
      causes: "Sun damage, inflammation, hormonal changes, aging",
      symptoms: "Patchy coloration, redness, dark spots, dullness",
      benefits: "More even complexion, reduced redness, radiant glow"
    },
    { 
      title: "Dry Skin", 
      description: "Intensive hydration for parched, flaky skin.", 
      image: dryskin2,
      info: "Features ceramides, shea butter, and squalane to restore skin's moisture barrier and prevent transepidermal water loss.",
      causes: "Cold weather, low humidity, harsh cleansers, aging, medical conditions",
      symptoms: "Flakiness, tightness, roughness, redness, itchiness",
      benefits: "Deep hydration, smoother texture, reduced irritation"
    },
    { 
      title: "Oily Skin", 
      description: "Mattifying solution for shine control.", 
      image: oilyskin,
      info: "Contains witch hazel, niacinamide, and clay to regulate sebum production without over-drying the skin.",
      causes: "Genetics, hormones, humidity, harsh products that strip skin",
      symptoms: "Shiny complexion, enlarged pores, frequent breakouts",
      benefits: "Reduced shine, minimized pores, balanced oil production"
    },
    { 
      title: "Dull Skin", 
      description: "Revitalizing treatment for radiant glow.", 
      image: glowskin,
      info: "Our illuminating formula with glycolic acid, vitamin C, and peptides exfoliates dead skin cells while stimulating collagen production.",
      causes: "Dead skin buildup, dehydration, poor circulation, stress",
      symptoms: "Lackluster appearance, rough texture, visible fatigue",
      benefits: "Brighter complexion, smoother texture, youthful glow"
    }
  ];

  const skinCareTips = [
    {
      title: "Daily Cleansing",
      description: "Gently cleanse your face twice daily to remove impurities without stripping natural oils.",
      icon: <FiDroplet size={24} />
    },
    {
      title: "Sun Protection",
      description: "Apply broad-spectrum SPF 30+ every morning, even on cloudy days.",
      icon: <FiSun size={24} />
    },
    {
      title: "Hydration",
      description: "Drink at least 8 glasses of water daily and use a moisturizer suited to your skin type.",
      icon: <FiDroplet size={24} />
    },
    {
      title: "Healthy Diet",
      description: "Eat antioxidant-rich foods like berries, leafy greens, and nuts for skin health.",
      icon: <FiHeart size={24} />
    }
  ];

  const footerSections = [
    {
      id: "about",
      title: "About Us",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>Lord Glory provides clinically-proven skincare solutions backed by science and loved by users worldwide. Our dermatologist-developed formulas combine cutting-edge ingredients with nature's best to deliver visible results.</p>
        </motion.div>
      )
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FiMail />
            <a href="mailto:lordgloryindia@gmail.com" style={{ color: darkMode ? '#bb86fc' : '#ffffff' }}>
              lordgloryindia@gmail.com
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FiPhone />
            <span>+91 8551062783</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiMapPin />
            <span>Bangalore, India</span>
          </div>
        </motion.div>
      )
    },
    {
      id: "resources",
      title: "Skin Care Resources",
      content: (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>Visit our blog for skin care tips, ingredient spotlights, and dermatologist advice on maintaining healthy skin at every age.</p>
        </motion.div>
      )
    }
  ];

  const TrustCard = ({ icon, title, content }) => (
    <motion.div
      style={{
        backgroundColor: darkMode ? "#252525" : "#f8f9fa",
        borderRadius: 10,
        padding: isMobile ? 15 : 20,
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: isMobile ? 120 : 150
      }}
      whileHover={{ 
        y: -5,
        boxShadow: darkMode 
          ? "0 5px 15px rgba(187, 134, 252, 0.2)" 
          : "0 5px 15px rgba(0, 123, 255, 0.1)"
      }}
    >
      <div style={{ 
        width: isMobile ? 40 : 50,
        height: isMobile ? 40 : 50,
        borderRadius: '50%',
        backgroundColor: darkMode ? '#bb86fc20' : '#007bff20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isMobile ? 10 : 15
      }}>
        {React.cloneElement(icon, { size: isMobile ? 18 : 24 })}
      </div>
      <h3 style={{ 
        color: darkMode ? "#bb86fc" : "#007bff",
        marginBottom: isMobile ? 5 : 10,
        fontSize: isMobile ? 14 : 16
      }}>
        {title}
      </h3>
      <p style={{ 
        color: darkMode ? "#cccccc" : "#666666",
        fontSize: isMobile ? 12 : 14
      }}>
        {content}
      </p>
    </motion.div>
  );

  return (
    <motion.div 
      style={{
        backgroundColor: darkMode ? "#121212" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#333333",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        width: '100vw'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} darkMode={darkMode} />

      {/* Header */}
      <header style={{
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        boxShadow: darkMode ? "0px 3px 10px rgba(255, 255, 255, 0.05)" : "0px 3px 10px rgba(0, 0, 0, 0.1)",
        width: "100vw",
        height: isMobile ? 60 : 70,
        padding: isMobile ? "0 15px" : "0 20px",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 15 }}>
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <FiMenu size={isMobile ? 20 : 24} color={darkMode ? "#fff" : "#333"} />
          </motion.button>
          
          <motion.div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ height: isMobile ? 30 : 40 }} />
            <span style={{
              fontWeight: "bold",
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: darkMode ? "#fff" : "#333",
              marginLeft: isMobile ? 5 : 10
            }}>
              LORD GLORY
            </span>
          </motion.div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 15 }}>
          <motion.button 
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            style={{
              background: darkMode ? "#333" : "#ddd",
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? 32 : 36,
              height: isMobile ? 32 : 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun color="#ffeb3b" size={isMobile ? 16 : 18} /> : <FiMoon color="#333" size={isMobile ? 16 : 18} />}
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
                  padding: isMobile ? '6px 10px' : '8px 15px',
                  fontSize: isMobile ? 12 : 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 5 : 8
                }}
              >
                <FiShoppingCart size={isMobile ? 16 : 18} />
                {!isMobile && <span>Orders</span>}
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
                  padding: isMobile ? '6px 10px' : '8px 15px',
                  fontSize: isMobile ? 12 : 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 5 : 8
                }}
              >
                <FiUser size={isMobile ? 16 : 18} />
                {!isMobile && <span>Logout</span>}
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
                  padding: isMobile ? '6px 10px' : '8px 15px',
                  fontSize: isMobile ? 12 : 14
                }}
              >
                Login
              </motion.button>
              {!isMobile && (
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
                    fontSize: '14px'
                  }}
                >
                  Register
                </motion.button>
              )}
            </>
          )}
        </div>
      </header>

      <main style={{ 
        marginTop: isMobile ? 60 : 70,
        padding: isMobile ? "15px 10px" : "20px",
        flex: 1
      }}>
        {user ? (
          <>
            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: 12,
                padding: isMobile ? 15 : 25,
                marginBottom: isMobile ? 20 : 30,
                width: '100%',
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: isMobile ? 15 : 25
              }}>
                <FiActivity size={isMobile ? 24 : 32} color={darkMode ? "#bb86fc" : "#007bff"} />
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginLeft: isMobile ? 0 : 15,
                  marginTop: isMobile ? 10 : 0
                }}>
                  <h1 style={{
                    color: darkMode ? "#bb86fc" : "#007bff",
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    textAlign: 'center',
                    marginRight: 10
                  }}>
                    Proven Results You Can See
                  </h1>
                  <FDABadge />
                </div>
              </div>

              <TrustIndicators />

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: isMobile ? 15 : 25,
                marginTop: isMobile ? 20 : 30
              }}>
                <TrustCard 
                  icon={<FiCheckCircle color={darkMode ? "#bb86fc" : "#007bff"} />}
                  title="Visible Improvement"
                  content="98% of users see noticeable results within the first 4 weeks"
                />
                <TrustCard 
                  icon={<FiDroplet color={darkMode ? "#bb86fc" : "#007bff"} />}
                  title="Natural Ingredients"
                  content="Formulated with 95% naturally derived ingredients"
                />
                <TrustCard 
                  icon={<FiShield color={darkMode ? "#bb86fc" : "#007bff"} />}
                  title="Satisfaction Guarantee"
                  content="100% satisfaction guarantee on all acne treatments"
                />
              </div>
            </motion.div>

            {/* Skin Care Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: 12,
                padding: isMobile ? 15 : 25,
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                marginBottom: isMobile ? 15 : 25
              }}>
                <div style={{
                  width: isMobile ? 40 : 50,
                  height: isMobile ? 40 : 50,
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#bb86fc20' : '#007bff20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: isMobile ? 0 : 15,
                  marginBottom: isMobile ? 10 : 0
                }}>
                  <FiUser size={isMobile ? 18 : 24} color={darkMode ? "#bb86fc" : "#007bff"} />
                </div>
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <h2 style={{
                    color: darkMode ? "#ffffff" : "#333333",
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                    marginBottom: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    Personalized Skin Analysis
                  </h2>
                  <p style={{
                    color: darkMode ? "#cccccc" : "#666666",
                    fontSize: isMobile ? "0.8rem" : "0.9rem"
                  }}>
                    Complete this form to get customized recommendations
                  </p>
                </div>
              </div>

              <SkinCareForm darkMode={darkMode} isMobile={isMobile} />
            </motion.div>

            {/* Skin Care Tips Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: 12,
                padding: isMobile ? 15 : 25,
                marginTop: isMobile ? 20 : 30,
                boxShadow: darkMode 
                  ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
              }}
            >
              <h2 style={{
                color: darkMode ? "#bb86fc" : "#007bff",
                fontSize: isMobile ? "1.3rem" : "1.6rem",
                textAlign: 'center',
                marginBottom: isMobile ? 15 : 25
              }}>
                Daily Skin Care Tips
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? 15 : 20
              }}>
                {skinCareTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    style={{
                      backgroundColor: darkMode ? "#252525" : "#f8f9fa",
                      borderRadius: 10,
                      padding: isMobile ? 15 : 20,
                      textAlign: 'center'
                    }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: darkMode 
                        ? "0 5px 15px rgba(187, 134, 252, 0.2)" 
                        : "0 5px 15px rgba(0, 123, 255, 0.1)"
                    }}
                  >
                    <div style={{ 
                      width: isMobile ? 40 : 50,
                      height: isMobile ? 40 : 50,
                      borderRadius: '50%',
                      backgroundColor: darkMode ? '#bb86fc20' : '#007bff20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px'
                    }}>
                      {React.cloneElement(tip.icon, { 
                        size: isMobile ? 18 : 24,
                        color: darkMode ? "#bb86fc" : "#007bff"
                      })}
                    </div>
                    <h3 style={{ 
                      color: darkMode ? "#bb86fc" : "#007bff",
                      fontSize: isMobile ? 14 : 16,
                      marginBottom: 10
                    }}>
                      {tip.title}
                    </h3>
                    <p style={{ 
                      color: darkMode ? "#cccccc" : "#666666",
                      fontSize: isMobile ? 12 : 14
                    }}>
                      {tip.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
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
                padding: isMobile ? "25px 15px" : "40px 20px",
                margin: isMobile ? "10px 0" : "20px",
                borderRadius: 15
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                style={{
                  color: darkMode ? "#bb86fc" : "#007bff",
                  fontSize: isMobile ? "1.6rem" : "2rem",
                  marginBottom: isMobile ? 10 : 15,
                  fontWeight: "700"
                }}
              >
                LORD GLORY
              </motion.h1>
              
              <motion.div
                style={{
                  maxWidth: 800,
                  margin: "0 auto",
                  padding: isMobile ? "0 10px" : "0 20px"
                }}
              >
                <h2 style={{
                  color: darkMode ? "#ffffff" : "#333333",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  marginBottom: isMobile ? 15 : 20,
                  fontWeight: 600
                }}>
                  Advanced Skin Care Treatments Tailored to Your Needs
                </h2>
                <p style={{
                  color: darkMode ? "#cccccc" : "#666666",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  marginBottom: isMobile ? 15 : 20,
                  lineHeight: 1.6
                }}>
                  Our dermatologist-developed formulas combine cutting-edge science with nature's best ingredients to effectively treat all skin concerns.
                </p>
              </motion.div>
              
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentSentence}
                  style={{
                    color: darkMode ? "#ffffff" : "#333333",
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                    marginBottom: isMobile ? 15 : 20,
                    fontWeight: "400",
                    minHeight: isMobile ? "3rem" : "4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {sentences[currentSentence]}
                </motion.h2>
              </AnimatePresence>
              
              {/* Problem Images Grid */}
              <motion.div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: isMobile ? 10 : 15,
                  margin: isMobile ? '15px 0' : '25px 0',
                  maxWidth: 800,
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {problemImages.map((item, index) => (
                  <motion.div 
                    key={index}
                    style={{
                      position: 'relative',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: darkMode 
                        ? '0 4px 8px rgba(0,0,0,0.3)' 
                        : '0 4px 8px rgba(0,0,0,0.1)',
                      aspectRatio: '1/1'
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img 
                      src={item.img} 
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: darkMode ? 'brightness(0.8)' : 'none'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      padding: '10px',
                      color: '#fff'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        fontWeight: 500
                      }}>
                        {item.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <TrustIndicators />

              <motion.button
                style={{
                  backgroundColor: darkMode ? "#bb86fc" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 30,
                  padding: isMobile ? "10px 20px" : "12px 30px",
                  fontSize: isMobile ? 14 : 16,
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
            <