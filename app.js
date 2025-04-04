require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

// Import Routes
const authRoutes = require('./Cosmetics-store-Backend/routes/autheroutes');
const productRoutes = require('./Cosmetics-store-Backend/routes/productroute');
const orderRoutes = require('./Cosmetics-store-Backend/routes/orderoute');
const userRoutes = require('./Cosmetics-store-Backend/routes/useroute');
const adminRoutes = require('./Cosmetics-store-Backend/routes/adminRoutes');
const skincareRoutes = require('./Cosmetics-store-Backend/routes/skincaroutes');
const reviewRoutes = require('./Cosmetics-store-Backend/routes/reviewroutes');
const agentRoutes = require('./Cosmetics-store-Backend/routes/agentroute');
const phonePayRoutes = require('./Cosmetics-store-Backend/routes/phonePayroutes');
const couponRoutes = require('./Cosmetics-store-Backend/routes/coupenRoutes');
const otpRoutes = require('./Cosmetics-store-Backend/routes/otpRoutes');

// Initialize Express
const app = express();


// Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',       // Development
  'https://lordglory.in',        // Production (without www)
  'https://www.lordglory.in',    // Production (with www)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204      // Legacy browser support
}));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect("mongodb+srv://ashishghatol098:ashishghatol098@cluster0.a5c0ocg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => res.redirect("/register"));
app.get("/index", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/skincare", skincareRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/payments/phonepe", phonePayRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/otp", otpRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date()
  });
});

// Error Handlers
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start Server
const server = app.listen(PORT, HOST, () => {
  console.log(`
  ==================================
  🚀 Server running on port ${PORT}
  ==================================
  Access URLs:
  - Local: http://localhost:${PORT}
  - Network: http://${process.env.IPV4 || '69.62.73.88'}:${PORT}
  `);
});

// Connection Monitoring
server.on('connection', (socket) => {
  const client = `${socket.remoteAddress}:${socket.remotePort}`;
  console.debug(`🔌 New connection from ${client}`);
  socket.on('close', () => {
    console.debug(`❌ Connection closed: ${client}`);
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM. Closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
