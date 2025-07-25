import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
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
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import hero5 from "../assets/hero5.jpg";
import hero6 from "../assets/direction.jpeg";
import {
  FiSun, FiMoon, FiShoppingCart, FiUser, FiMail, 
  FiCheckCircle, FiShield, FiActivity, FiDroplet, FiChevronDown,
  FiChevronUp, FiPhone, FiMapPin, FiHeart, FiStar
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFooterItem, setExpandedFooterItem] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const sentences = [
    "Glow with Confidence",
    "Beauty Meets Science",
    "Purely Natural Care",
    "Radiance Redefined",
    "Your Skin, Our Promise"
  ];

  const skinCareTips = [
    { title: "Acne prone Skin", description: "Reduce darkness and inflammation with our gentle formulas.", image: hero1 },
    { title: "Combined Skin Problem", description: "Clear stubborn acne and prevent future breakouts with our gentle formulas.", image: hero2 },
    { title: "Sensitive Skin", description: "Fast-acting solutions to reduce inflammation and speed up healing.", image: hero3 },
    { title: "Oily Skin", description: "Brighten tired eyes and reduce puffiness with our targeted treatments.", image: hero4 },
    { title: "All Skin Problem", description: "Achieve a balanced, radiant complexion with our brightening serums.", image: hero5 },
    { title: "Direction", description: "Intense hydration to restore your skin's moisture barrier.", image: hero6 },
    
  ];

  const skinConcerns = [
    { image: pig, title: "Pigmentation", description: "The skin's natural pigment, melanin, can become unevenly distributed, leading to pigmentation.", problem: "Pigmentation on the face is when the skin becomes darker than normal, appearing as spots, patches, or freckles." },
    { title: "Acne Treatment", description: "Acne, or pimples on the face, is a common skin condition where hair follicles become clogged with oil (sebum) and dead skin cells.", image: acne, problem: "Acne develops when pores become clogged with oil and dead skin cells, allowing bacteria to grow." },
    { title: "Pimple Spot Treatment", description: "Pimples on the face is a common skin condition where hair follicles become clogged with oil (sebum) and dead skin cells.", image: pimples, problem: "Pimples form when pores become blocked and infected with bacteria." },
    { title: "Dark Circles", description: "Dark circles are darkened areas under the eyes that can appear as shades of blue, purple, brown, or black.", image: darkcircles, problem: "Dark circles can result from thinning skin revealing blood vessels, lack of sleep, allergies, or genetics." },
    { title: "Tanning", description: "Patchy complexion with areas of redness, darkness, or discoloration.", image: skintone, problem: "Uneven tone makes skin look dull and aged." },
    { title: "Dry Skin", description: "Tight, flaky skin that may itch or show fine lines more prominently.", image: dryskin2, problem: "Dry skin lacks proper moisture and oils, often feeling rough or scaly." },
    { title: "Oily Skin", description: "Oily skin occurs when sebaceous glands produce too much sebum.", image: oilyskin, problem: "Oily skin occurs when sebaceous glands produce too much oil, leading to constant shine and clogged pores." },
    { title: "Glow Skin", description: "Dullness on the face refers to a lack of radiance or glow on the skin.", image: glowskin, problem: "Dullness happens when dead skin cells accumulate on the surface." }
  ];

  const beautyTips = [
    { title: "Facewash  Gently", description: "Use a  Facewash Three times daily.", icon: <FiDroplet size={24} /> },
    { title: "Protect Always", description: "Apply SPF-50 ", icon: <FiSun size={24} /> },
    { title: "Hydrate Well", description: "Moisturize and drink water daily.", icon: <FiDroplet size={24} /> },
    { title: "Nourish Inside", description: "Eat antioxidant-rich foods.", icon: <FiHeart size={24} /> }
  ];

  const footerSections = [
    {
      id: 1,
      title: "About Us & Policies",
      content: (
        <div>
    
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/policies"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = darkMode ? '#252525' : '#0077b6';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
              }}
            >
              View Full Policy →
            </Link>
            <Link
              to="/Term"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = darkMode ? '#252525' : '#0077b6';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
              }}
            >
              Terms and Conditions→
            </Link>
  
            <Link
              to="/about-us"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = darkMode ? '#252525' : '#0077b6';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
              }}
            >
              Read About Us →
            </Link>

            <Link
              to="/shipping-return-refund"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = darkMode ? '#252525' : '#0077b6';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
              }}
            >
              Shipping and Return Policy →
            </Link>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sentences.length]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const productId = "67f02a6371af011145853dd2";
        const res = await axios.get(
          `http://localhost:5000/api/reviews/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(res.data.reviews || res.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        // Fallback to dummy reviews if API fails
        const dummyReviews = [
          { _id: "1", certifiedBuyerName: "Priya K.", location: "Bangalore", rating: 5, reviewText: "My skin has never looked better! The pigmentation treatment worked wonders in just 4 weeks." },
          { _id: "2", certifiedBuyerName: "Rahul M.", location: "Mumbai", rating: 4, reviewText: "Finally found a solution for my acne that doesn't dry out my skin. Highly recommend!" },
          { _id: "3", certifiedBuyerName: "Ananya S.", location: "Delhi", rating: 5, reviewText: "The dark circle cream is magical. I look refreshed even after sleepless nights with my baby." },
          { _id: "4", certifiedBuyerName: "Neha G.", location: "Hyderabad", rating: 5, reviewText: "The glow serum gives me such a natural radiance. My colleagues keep asking what I'm using!" },
          { _id: "5", certifiedBuyerName: "Vikram P.", location: "Chennai", rating: 4, reviewText: "Great for oily skin. My face stays matte for much longer now without feeling dry." }
        ];
        setReviews(dummyReviews);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    cssEase: "ease-in-out"
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = !darkMode ? "#1a1a1a" : "#fff9f5";
  };

  const toggleFooterItem = (item) => {
    setExpandedFooterItem(expandedFooterItem === item ? null : item);
  };

  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const TrustIndicators = () => (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: isMobile ? 10 : 20,
      margin: isMobile ? '15px 0' : '25px 0',
      padding: isMobile ? 10 : 20,
      background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,235,230,0.5)',
      borderRadius: 12,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{
        fontSize: isMobile ? 18 : 28,
        fontWeight: "bold",
        color: darkMode ? "#00b4d8" : "#0077b6",
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        margin: "20px 0"
      }}>
        Find Your Skin Concern Solutions
      </h2>
    </div>
  );

  const TrustCard = ({ icon, title, content }) => (
    <motion.div
      style={{
        backgroundColor: darkMode ? "#252525" : "#fff9f5",
        borderRadius: 15,
        padding: isMobile ? 15 : 25,
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: darkMode ? '1px solid #333' : '1px solid #e0f7fa'
      }}
      whileHover={{ y: -5, boxShadow: darkMode ? "0 8px 20px rgba(0, 180, 216, 0.2)" : "0 8px 20px rgba(0, 119, 182, 0.15)" }}
    >
      <div style={{
        width: isMobile ? 40 : 60,
        height: isMobile ? 40 : 60,
        borderRadius: '50%',
        backgroundColor: darkMode ? '#00b4d820' : '#0077b620',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 15px'
      }}>
        {React.cloneElement(icon, { size: isMobile ? 20 : 28, color: darkMode ? "#00b4d8" : "#0077b6" })}
      </div>
      <h3 style={{ color: darkMode ? "#00b4d8" : "#0077b6", marginBottom: 10, fontSize: isMobile ? 16 : 20, fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
      <p style={{ color: darkMode ? "#cccccc" : "#666", fontSize: isMobile ? 12 : 16, fontFamily: 'Lora, serif' }}>{content}</p>
    </motion.div>
  );

  return (
    <motion.div
      style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#fff9f5",
        color: darkMode ? "#ffffff" : "#333",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins, sans-serif',
        overflowX: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} darkMode={darkMode} />

      <header style={{
        backgroundColor: darkMode ? "#252525" : "#ffffff",
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        padding: isMobile ? "10px 15px" : "15px 30px",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 20 }}>
          <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          </motion.button>
          <motion.div style={{ display: "flex", alignItems: "center" , }}>
            <img src={logo} alt="Logo" style={{ height: isMobile ? 30 : 45 }} />
            <span style={{ 
  fontWeight: "bold", 
  fontSize: isMobile ? "1rem" : "1.5rem", 
  color: darkMode ? "#00b4d8" : "#0077b6", 
  marginLeft: 420, 
  fontFamily: 'Helvetica, Arial, sans-serif',
  whiteSpace: 'nowrap' ,
textTransform: 'uppercase',
}}>
  Lord Glory
</span>
          </motion.div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 20 }}>
          <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }} style={{ background: darkMode ? "#333" : "#e0f7fa", border: 'none', borderRadius: '50%', width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {darkMode ? <FiSun color="#00b4d8" size={isMobile ? 16 : 20} /> : <FiMoon color="#0077b6" size={isMobile ? 16 : 20} />}
          </motion.button>

          {user ? (
            <>
              <motion.button onClick={() => navigate("/orders")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: darkMode ? "#00b4d8" : "#0077b6", color: "#fff", border: 'none', borderRadius: 25, padding: isMobile ? '6px 12px' : '10px 20px', fontSize: isMobile ? 12 : 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiShoppingCart size={isMobile ? 16 : 20} />
                {!isMobile && "Orders"}
              </motion.button>
              <motion.button onClick={logout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: darkMode ? "#0077b6" : "#005f8c", color: "#fff", border: 'none', borderRadius: 25, padding: isMobile ? '6px 12px' : '10px 20px', fontSize: isMobile ? 12 : 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiUser size={isMobile ? 16 : 20} />
                {!isMobile && "Logout"}
              </motion.button>
            </>
          ) : (
            <>
              <motion.button onClick={() => navigate("/login")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: darkMode ? "#00b4d8" : "#0077b6", color: "#fff", border: 'none', borderRadius: 25, padding: isMobile ? '6px 12px' : '10px 20px', fontSize: isMobile ? 12 : 16 }}>
                Login
              </motion.button>
              {!isMobile && (
                <motion.button onClick={() => navigate("/register")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: darkMode ? "#0077b6" : "#005f8c", color: "#fff", border: 'none', borderRadius: 25, padding: '10px 20px', fontSize: 16 }}>
                  Sign Up
                </motion.button>
              )}
            </>
          )}
        </div>
      </header>

      <main style={{ marginTop: isMobile ? 60 : 80, padding: isMobile ? "20px 10px" : "40px 20px", flex: 1 }}>
        {user ? (
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ backgroundColor: darkMode ? "#252525" : "#fff9f5", borderRadius: 20, padding: isMobile ? 20 : 40, marginBottom: isMobile ? 20 : 40, boxShadow: '0 8px 25px rgba(0,0,0,0.05)', border: darkMode ? '1px solid #333' : '1px solid #e0f7fa' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 20 : 30 }}>
                <FiActivity size={isMobile ? 28 : 36} color={darkMode ? "#00b4d8" : "#0077b6"} />
                <h1 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "1.5rem" : "2rem", textAlign: 'center', marginLeft: isMobile ? 0 : 20, marginTop: isMobile ? 15 : 0, fontFamily: 'Playfair Display, serif' }}>
                  Real Results, Real Beauty
                </h1>
              </div>
              <TrustIndicators />
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 20 : 30, marginTop: isMobile ? 20 : 40 }}>
                <TrustCard icon={<FiCheckCircle />} title="Visible Results" content="98% saw improvement in 4 weeks" />
                <TrustCard icon={<FiDroplet />} title="Natural Glow" content="95% natural ingredients" />
                <TrustCard icon={<FiShield />} title="Trusted Care" content="Satisfaction in 30 days" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{
              backgroundColor: darkMode ? "#000000" : "#fff9f5",
              borderRadius: 20,
              padding: isMobile ? 20 : 40,
              boxShadow: darkMode ? '0 0 20px rgba(0, 180, 216, 0.7)' : '0 8px 25px rgba(0,0,0,0.05)',
              border: darkMode ? '2px solid #00b4d8' : '1px solid #e0f7fa'
            }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', marginBottom: 30 }}>
                <div style={{ width: isMobile ? 50 : 70, height: isMobile ? 50 : 70, borderRadius: '50%', backgroundColor: darkMode ? '#00b4d820' : '#0077b620', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 15 : 0, marginRight: isMobile ? 0 : 20 }}>
                  <FiUser size={isMobile ? 24 : 32} color={darkMode ? "#00b4d8" : "#0077b6"} />
                </div>
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <h2 style={{ color: darkMode ? "#ffffff" : "#333", fontSize: isMobile ? "1.5rem" : "2rem", marginBottom: 10, fontFamily: 'Playfair Display, serif' }}>
                    Your Skin, Personalized
                  </h2>
                  <p style={{ color: darkMode ? "#cccccc" : "#666", fontSize: isMobile ? 14 : 18, fontFamily: 'Lora, serif' }}>
                    Discover your perfect routine today
                  </p>
                </div>
              </div>
              <SkinCareForm darkMode={darkMode} isMobile={isMobile} />
            </motion.div>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ backgroundColor: darkMode ? "#252525" : "#fff9f5", borderRadius: 20, padding: isMobile ? 20 : 40, marginTop: 40, boxShadow: '0 8px 25px rgba(0,0,0,0.05)', border: darkMode ? '1px solid #333' : '1px solid #e0f7fa' }}>
              <h2 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "1.5rem" : "2rem", textAlign: 'center', marginBottom: 30, fontFamily: 'Playfair Display, serif' }}>
                Beauty Essentials
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 30 }}>
                {beautyTips.map((tip, index) => (
                  <motion.div key={index} style={{ backgroundColor: darkMode ? "#2d2d2d" : "#ffffff", borderRadius: 15, padding: isMobile ? 15 : 25, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} whileHover={{ y: -5, boxShadow: darkMode ? "0 8px 20px rgba(0, 180, 216, 0.2)" : "0 8px 20px rgba(0, 119, 182, 0.15)" }}>
                    <div style={{ width: isMobile ? 40 : 60, height: isMobile ? 40 : 60, borderRadius: '50%', backgroundColor: darkMode ? '#00b4d820' : '#0077b620', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      {React.cloneElement(tip.icon, { size: isMobile ? 20 : 28, color: darkMode ? "#00b4d8" : "#0077b6" })}
                    </div>
                    <h3 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? 16 : 20, marginBottom: 10, fontFamily: 'Poppins, sans-serif' }}>{tip.title}</h3>
                    <p style={{ color: darkMode ? "#cccccc" : "#666", fontSize: isMobile ? 12 : 16, fontFamily: 'Lora, serif' }}>{tip.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        ) : (
          <>
            <motion.section style={{ backgroundColor: darkMode ? "#252525" : "#fff9f5", borderRadius: 20, textAlign: "center", padding: isMobile ? "30px 15px" : "60px 30px", margin: isMobile ? "20px 10px" : "40px 20px", boxShadow: '0 8px 25px rgba(0,0,0,0.05)', border: darkMode ? '1px solid #333' : '1px solid #e0f7fa' }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <motion.h1 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "2rem" : "3rem", marginBottom: 20, fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>
                Lord Glory
              </motion.h1>
              <AnimatePresence mode="wait">
                <motion.h2 key={currentSentence} style={{ color: darkMode ? "#ffffff" : "#333", fontSize: isMobile ? "1.2rem" : "1.8rem", marginBottom: 30, fontFamily: 'Lora, serif', minHeight: isMobile ? "3rem" : "4rem" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
                  {sentences[currentSentence]}
                </motion.h2>
              </AnimatePresence>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 20 : 30, marginBottom: 30 }}>
                {skinCareTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    style={{
                      backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                      borderRadius: 15,
                      padding: 20,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      gap: 20,
                      textAlign: 'left'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <img
                      src={tip.image}
                      alt={tip.title}
                      style={{
                        width: isMobile ? '100%' : 150,
                        height: isMobile ? 200 : 150,
                        objectFit: 'cover',
                        borderRadius: 10
                      }}
                    />
                    <div>
                      <h3 style={{
                        color: darkMode ? "#00b4d8" : "#0077b6",
                        fontSize: isMobile ? "1.2rem" : "1.5rem",
                        marginBottom: 10,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {tip.title}
                      </h3>
                      <p style={{
                        color: darkMode ? "#cccccc" : "#666",
                        fontSize: isMobile ? 14 : 16,
                        lineHeight: 1.6,
                        fontFamily: 'Lora, serif'
                      }}>
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <TrustIndicators />
              <motion.button
                style={{
                  backgroundColor: darkMode ? "#00b4d8" : "#0077b6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 30,
                  padding: isMobile ? "12px 24px" : "15px 40px",
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  fontFamily: 'Poppins, sans-serif',
                  marginTop: 20
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: darkMode ? "0 0 20px rgba(0, 180, 216, 0.7)" : "0 0 20px rgba(0, 119, 182, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
              >
                Begin Your Journey
              </motion.button>
            </motion.section>

            <section style={{ padding: isMobile ? "20px 10px" : "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: isMobile ? 30 : 50 }}>
                <motion.h2 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "1.8rem" : "2.5rem", marginBottom: 15, fontFamily: 'Playfair Display, serif' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                   Skincare Concern Solution
                </motion.h2>
                <motion.p style={{ color: darkMode ? "#cccccc" : "#666", maxWidth: 700, margin: "0 auto", fontSize: isMobile ? 14 : 18, fontFamily: 'Lora, serif' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  Tailored care for your unique skin story
                </motion.p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: isMobile ? 20 : 30, padding: isMobile ? 0 : "0 20px" }}>
                {skinConcerns.map((product, index) => (
                  <motion.div key={index} style={{ backgroundColor: darkMode ? "#252525" : "#ffffff", borderRadius: 20, overflow: "hidden", boxShadow: '0 8px 25px rgba(0,0,0,0.05)', padding: 20, display: 'flex', flexDirection: 'column' }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10, boxShadow: darkMode ? "0 12px 30px rgba(0, 180, 216, 0.3)" : "0 12px 30px rgba(0, 119, 182, 0.2)" }}>
                    <img src={product.image} alt={product.title} style={{ width: "100%", height: isMobile ? 150 : 200, objectFit: 'cover', borderRadius: 15, marginBottom: 15 }} />
                    <h3 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "1.2rem" : "1.5rem", marginBottom: 10, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>{product.title}</h3>
                    <p style={{ color: darkMode ? "#cccccc" : "#666", lineHeight: 1.6, marginBottom: 15, fontSize: isMobile ? 14 : 16, fontFamily: 'Lora, serif' }}>{product.description}</p>
                    <button style={{ background: "none", border: "none", color: darkMode ? "#00b4d8" : "#0077b6", cursor: "pointer", marginTop: 15, display: "flex", alignItems: "center", gap: 5, fontSize: isMobile ? 14 : 16, fontFamily: 'Poppins, sans-serif' }} onClick={() => toggleCardExpand(index)}>
                     
                    </button>
                    <AnimatePresence>
                      {expandedCards[index] && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ color: darkMode ? "#cccccc" : "#666", fontSize: isMobile ? 14 : 16, fontFamily: 'Lora, serif' }}
                        >
                          {product.problem}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: darkMode ? "#252525" : "#0077b6",
                borderRadius: 20,
                padding: isMobile ? 20 : 40,
                margin: isMobile ? "20px 10px" : "40px 20px",
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: darkMode ? '1px solid #333' : '1px solid #005f8c'
              }}
            >
              <h2 style={{
                color: "#fff",
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                textAlign: 'center',
                marginBottom: 30,
                fontFamily: 'Playfair Display, serif'
              }}>
                Glowing Reviews
              </h2>

              <Slider {...sliderSettings}>
                {reviews.map((review) => (
                  <div key={review._id} style={{
                    backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                    borderRadius: 15,
                    padding: isMobile ? 20 : 30,
                    margin: '0 10px',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <p style={{
                      color: "#fff",
                      fontStyle: 'italic',
                      fontSize: isMobile ? 14 : 16,
                      lineHeight: 1.6,
                      marginBottom: 20,
                      fontFamily: 'Lora, serif'
                    }}>
                      "{review.reviewText}"
                    </p>
                    <div>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 10 }}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            color={i < review.rating ? "#ffd700" : "rgba(255,255,255,0.3)"}
                            fill={i < review.rating ? "#ffd700" : "transparent"}
                            size={16}
                          />
                        ))}
                      </div>
                      <p style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: isMobile ? 14 : 16,
                        fontFamily: 'Poppins, sans-serif',
                        textAlign: 'center'
                      }}>
                        {review.certifiedBuyerName} from {review.location}
                      </p>
                    </div>
                  </div>
                ))}
              </Slider>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ backgroundColor: darkMode ? "#252525" : "#fff9f5", borderRadius: 20, padding: isMobile ? 20 : 40, margin: isMobile ? "20px 10px" : "40px 20px", boxShadow: '0 8px 25px rgba(0,0,0,0.05)', border: darkMode ? '1px solid #333' : '1px solid #e0f7fa' }}>
              <h2 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? "1.8rem" : "2.5rem", textAlign: 'center', marginBottom: 30, fontFamily: 'Playfair Display, serif' }}>
                Glow Everyday
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 30 }}>
                {beautyTips.map((tip, index) => (
                  <motion.div key={index} style={{ backgroundColor: darkMode ? "#2d2d2d" : "#ffffff", borderRadius: 15, padding: isMobile ? 15 : 25, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} whileHover={{ y: -5, boxShadow: darkMode ? "0 8px 20px rgba(0, 180, 216, 0.2)" : "0 8px 20px rgba(0, 119, 182, 0.15)" }}>
                    <div style={{ width: isMobile ? 40 : 60, height: isMobile ? 40 : 60, borderRadius: '50%', backgroundColor: darkMode ? '#00b4d820' : '#0077b620', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      {React.cloneElement(tip.icon, { size: isMobile ? 20 : 28, color: darkMode ? "#00b4d8" : "#0077b6" })}
                    </div>
                    <h3 style={{ color: darkMode ? "#00b4d8" : "#0077b6", fontSize: isMobile ? 16 : 20, marginBottom: 10, fontFamily: 'Poppins, sans-serif' }}>{tip.title}</h3>
                    <p style={{ color: darkMode ? "#cccccc" : "#666", fontSize: isMobile ? 12 : 16, fontFamily: 'Lora, serif' }}>{tip.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        )}
      </main>

      <footer
        style={{
          backgroundColor: darkMode ? "#252525" : "#0077b6",
          color: "#fff",
          padding: isMobile ? "40px 15px 20px" : "80px 30px 40px",
          position: "relative",
          marginTop: "auto"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: 0,
            width: "100%",
            height: "50px",
            background: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="${darkMode ? '#252525' : '#0077b6'}" opacity="1"/></svg>')`,
            backgroundSize: "1200px 50px"
          }}
        ></div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr",
            gap: 30
          }}
        >
          {footerSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  paddingBottom: 15,
                  borderBottom: "1px solid rgba(255,255,255,0.2)"
                }}
                onClick={() => toggleFooterItem(section.id)}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                    fontWeight: 600,
                    margin: 0,
                    fontFamily: "Playfair Display, serif"
                  }}
                >
                  {section.title}
                </h3>
                <motion.div
                  animate={{ rotate: expandedFooterItem === section.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown size={isMobile ? 20 : 24} />
                </motion.div>
              </div>
              <AnimatePresence>
                {expandedFooterItem === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ paddingTop: 15 }}
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{
            textAlign: "center",
            marginTop: isMobile ? 30 : 60,
            paddingTop: isMobile ? 20 : 40,
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 10 }}>
            Crafted with <FiHeart color="#fff" /> in India
          </p>
          <p style={{ marginBottom: 10 }}>
            Contact:{" "}
            <a href="mailto:lordgloryindia@gmail.com" style={{ color: "#fff", textDecoration: "underline" }}>
              lordgloryindia@gmail.com
            </a>
          </p>
          <p style={{ opacity: 0.8 }}>© {new Date().getFullYear()} Lord Glory. All Rights Reserved.</p>
        </motion.div>
      </footer>
    </motion.div>
  );
};

export default Home;