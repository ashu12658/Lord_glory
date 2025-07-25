import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

const AgentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currentMotivation, setCurrentMotivation] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const motivationalQuotes = [
    "Your next successful deal starts with this login.",
    "Every login brings you closer to your next big achievement.",
    "Great agents like you make all the difference.",
    "The secret of getting ahead is getting started.",
    "Your dedication transforms prospects into clients.",
    "Today's efforts are tomorrow's success stories.",
    "You're not just logging in, you're unlocking potential.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMotivation((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/agents/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.token) {
        const decoded = jwtDecode(response.data.token);
        const agentId = decoded?.id;
        const agentName = decoded?.name || "Agent";

        if (!agentId) throw new Error("Agent ID missing from token!");

        localStorage.setItem("agentToken", response.data.token);
        localStorage.setItem("agentId", agentId);
        localStorage.setItem("agentName", agentName);

        login({ token: response.data.token, agentId, name: agentName });

        setTimeout(() => navigate("/agent-dashboard"), 500);
      } else {
        throw new Error("Invalid credentials or missing token.");
      }
    } catch (err) {
      setError(
        err.response
          ? `Login failed: ${err.response.data.message || "Invalid credentials."}`
          : "Login failed: An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.logoContainer}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={styles.logo}
        >
          <svg width={isMobile ? "50" : "60"} height={isMobile ? "50" : "60"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 8L21 9L16 14L17 20L12 17L7 20L8 14L3 9L9 8L12 2Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0077cc" />
                <stop offset="1" stopColor="#00aaff" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        <h1 style={{...styles.brand, fontSize: isMobile ? "2rem" : "2.5rem"}}>Lord Glory</h1>
        <p style={{...styles.subText, fontSize: isMobile ? "0.9rem" : "1.1rem"}}>Empowering Excellence in Every Interaction</p>
      </motion.div>

      <div style={styles.motivationContainer}>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMotivation}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{...styles.motivationText, fontSize: isMobile ? "1rem" : "1.2rem"}}
          >
            {motivationalQuotes[currentMotivation]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          ...styles.card,
          width: isMobile ? "90%" : "400px",
          padding: isMobile ? "25px" : "40px"
        }}
      >
        <h2 style={{...styles.cardTitle, fontSize: isMobile ? "1.5rem" : "1.8rem"}}>Agent Portal</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your professional email"
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your secure password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            style={styles.button}
            whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0, 119, 204, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span style={styles.buttonText}>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Authenticating...
                </motion.span>
              </span>
            ) : (
              <span style={styles.buttonText}>Access Your Dashboard</span>
            )}
          </motion.button>
        </form>

        <motion.p 
          style={{
            ...styles.footerText,
            fontSize: isMobile ? "0.8rem" : "0.9rem"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Ready to make an impact today? Your success starts here.
        </motion.p>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f4f7fc 0%, #e3f2fd 100%)",
    padding: "20px",
    overflow: "hidden",
    width: "100%",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    width: "100%",
    textAlign: "center",
  },
  logo: {
    marginBottom: "10px",
    filter: "drop-shadow(0 0 10px rgba(0, 119, 204, 0.5))",
  },
  brand: {
    fontWeight: "bold",
    background: "linear-gradient(135deg, #0077cc, #00aaff)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: "0px 0px 20px rgba(0, 119, 204, 0.3)",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  subText: {
    color: "#555",
    marginBottom: "30px",
    fontStyle: "italic",
  },
  motivationContainer: {
    minHeight: "60px",
    marginBottom: "20px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    maxWidth: "500px",
  },
  motivationText: {
    color: "#0077cc",
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "center",
    padding: "0 10px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    border: "1px solid rgba(0, 119, 204, 0.2)",
    position: "relative",
    overflow: "hidden",
    maxWidth: "100%",
  },
  cardTitle: {
    fontWeight: "bold",
    background: "linear-gradient(135deg, #0077cc, #00aaff)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
    width: "100%",
  },
  label: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#004d99",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    background: "#f9f9f9",
    transition: "all 0.3s",
    boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.05)",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #0077cc, #00aaff)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    marginTop: "10px",
    boxShadow: "0px 5px 15px rgba(0, 119, 204, 0.3)",
    position: "relative",
    overflow: "hidden",
    width: "100%",
  },
  buttonText: {
    position: "relative",
    zIndex: 2,
  },
  error: {
    color: "#ff4444",
    fontSize: "0.9rem",
    marginBottom: "15px",
    padding: "10px",
    background: "#ffeeee",
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box",
  },
  footerText: {
    marginTop: "20px",
    color: "#666",
    fontStyle: "italic",
  },
};

export default AgentLogin;