// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/authcontext";
// import logo from "../assets/logo.png"; // Import logo
// import "./style/LoginPage.css"

// const LoginPage = () => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const apiUrl = "http://localhost:5000/api/auth/login";
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Invalid email or password.");

//       const { token, user } = data;
//       if (!token || typeof user.isAdmin === "undefined") throw new Error("Invalid response from server.");

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       login({ token, ...user }, user.isAdmin ? "admin" : "user");
//       navigate(user.isAdmin ? "/admin-dashboard" : "/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes bounce {
//             0%, 100% { transform: translateY(0); }
//             50% { transform: translateY(-10px); }
//           }
//         `}
//       </style>

//       <div style={styles.card}>
//         <div style={styles.logoContainer}>
//           <img src={logo} alt="Logo" style={styles.logo} />
//           <h1 style={styles.brandName}>SkinCare</h1>
//           <p style={styles.brandTagline}>Your journey to healthier skin starts here.</p>
//         </div>
//         <h2 style={styles.heading}>Welcome Back</h2>
//         {error && <p style={styles.errorMessage}>{error}</p>}
//         <form onSubmit={handleLogin} style={styles.form}>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={loading}
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             disabled={loading}
//             style={styles.input}
//           />
//           <button type="submit" disabled={loading} style={styles.button}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <p style={styles.linkText}>
//           Don't have an account? <a href="/register" style={styles.link}>Sign Up</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     background: "linear-gradient(135deg, #ffffff, #e0f7ff)", // Light background
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     padding: "40px",
//     borderRadius: "12px",
//     boxShadow: "0px 0px 20px rgba(0, 162, 255, 0.8)", // Glowing blue border effect
//     width: "350px",
//     textAlign: "center",
//     transition: "0.3s",
//   },
//   logoContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: "20px",
//   },
//   logo: {
//     width: "60px",
//     height: "60px",
//     animation: "bounce 1.5s infinite ease-in-out", // Smooth bounce effect
//   },
//   brandName: {
//     color: "#007bff",
//     fontSize: "22px",
//     fontWeight: "bold",
//     marginTop: "5px",
//   },
//   brandTagline: {
//     color: "#606060",
//     fontSize: "14px",
//   },
//   heading: {
//     color: "#333333",
//     fontSize: "24px",
//     marginBottom: "15px",
//   },
//   errorMessage: {
//     color: "#ff4d4d",
//     fontSize: "14px",
//     marginBottom: "10px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     width: "100%",
//     padding: "12px",
//     marginBottom: "10px",
//     borderRadius: "5px",
//     border: "2px solid #007bff",
//     backgroundColor: "#f8f9fa",
//     color: "#333",
//     fontSize: "14px",
//     outline: "none",
//     transition: "0.3s",
//   },
//   button: {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "5px",
//     border: "none",
//     backgroundColor: "#007bff",
//     color: "#ffffff",
//     fontSize: "16px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "0.3s",
//   },
//   linkText: {
//     marginTop: "15px",
//     color: "#606060",
//     fontSize: "14px",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//   },
// };

// export default LoginPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import logo from "../assets/logo.png"; // Import logo
import "./style/LoginPage.css"

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = "http://localhost:5000/api/auth/login";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");

      const { token, user } = data;
      if (!token || typeof user.isAdmin === "undefined") throw new Error("Invalid response from server.");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login({ token, ...user }, user.isAdmin ? "admin" : "user");
      navigate(user.isAdmin ? "/admin-dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.brandName}>SkinCare</h1>
          <p style={styles.brandTagline}>Your journey to healthier skin starts here.</p>
        </div>
        <h2 style={styles.heading}>Welcome Back</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.linkText}>
          <a href="/reset-password" style={styles.link}>Forgot Password?</a>
        </p>
        <p style={styles.linkText}>
          Don't have an account? <a href="/register" style={styles.link}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #ffffff, #e0f7ff)",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 0px 20px rgba(0, 162, 255, 0.8)",
    width: "350px",
    textAlign: "center",
    transition: "0.3s",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "60px",
    height: "60px",
    animation: "bounce 1.5s infinite ease-in-out",
  },
  brandName: {
    color: "#007bff",
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "5px",
  },
  brandTagline: {
    color: "#606060",
    fontSize: "14px",
  },
  heading: {
    color: "#333333",
    fontSize: "24px",
    marginBottom: "15px",
  },
  errorMessage: {
    color: "#ff4d4d",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "2px solid #007bff",
    backgroundColor: "#f8f9fa",
    color: "#333",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  linkText: {
    marginTop: "10px",
    color: "#606060",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default LoginPage;
