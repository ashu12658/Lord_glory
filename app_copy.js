  const express = require("express");
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const path = require("path");
 const helmet = require("helmet");

  // Import Routes
  const authRoutes = require("./Cosmetics-store-Backend/routes/autheroutes");
  const productRoutes = require("./Cosmetics-store-Backend/routes/productroute");
  const orderRoutes = require("./Cosmetics-store-Backend/routes/orderoute");
  const userRoutes = require("./Cosmetics-store-Backend/routes/useroute");
  const adminRoutes = require("./Cosmetics-store-Backend/routes/adminRoutes");
  const skincareRoutes = require("./Cosmetics-store-Backend/routes/skincaroutes");
  const reviewRoutes = require("./Cosmetics-store-Backend/routes/reviewroutes");
  const agentRoutes = require("./Cosmetics-store-Backend/routes/agentroute");
  const phonePayRoutes = require("./Cosmetics-store-Backend/routes/phonePayroutes");
  const couponRoutes = require("./Cosmetics-store-Backend/routes/coupenRoutes");
  // Import Middleware

  dotenv.config();
  const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (if needed)
      connectSrc: [
        "'self'",
        "http://localhost:5000",  // Local development
        "https://your-production-api.com"  // Production API
      ],
    },
  })
);


  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable CORS
  app.use(
    cors({
      origin:  ["http://localhost:3000", "http://lordglory.in"],// Adjust according to the frontend address
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // Serve static files
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use(express.static(path.join(__dirname, "public"))); // Serve static frontend files

  // MongoDB connection
  mongoose
    .connect("mongodb+srv://ashishghatol098:ashishghatol098@cluster0.a5c0ocg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });

  // ✅ Root Route: Redirect to Register Page
  app.get("/", (req, res) => {
    res.redirect("/register");
  });

  // Register Page Route (for SSR apps)
  app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
  });

  // ✅ Mount Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin",  adminRoutes);
  app.use("/api/skincare", skincareRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/agents", agentRoutes);  // Add 'protect' middleware for agent routes if needed
  app.use("/api/admin", adminRoutes); // Register admin routes
  app.use("/api/payments/phonepe", phonePayRoutes);
  app.use("/api", couponRoutes);
app.use("/api/otp", require("./Cosmetics-store-Backend/routes/otpRoutes"));


  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });




// Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json());

// Routes
app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
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

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    console.log('Try: sudo kill -9 $(sudo lsof -t -i :${PORT})');
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
    // 6. Connection Monitoring
    server.on('connection', (socket) => {
      const client = `${socket.remoteAddress}:${socket.remotePort}`;
      console.debug(`🔌 New connection from ${client}`);
      socket.on('close', () => {
        console.debug(`❌ Connection closed: ${client}`);
      });
    });

    return server;

   catch (error) {
    console.error('🔥 Critical startup failure:', error);
    process.exit(1);
  }
};

// 7. Start the server
startServer().then(server => {
  /
// 4. Graceful Shutdown Handler
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM. Closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// 5. Real-time Connection Monitoring
server.on('connection', (socket) => {
  const client = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`🔌 New connection from ${client}`);
  socket.on('close', () => {
    console.log(`❌ Connection closed: ${client}`);
  });
});


// Health check endpoint (recommended)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    ipv4: IPV4,
    ipv6: IPV6,
    timestamp: new Date()
  });
});

// Verification steps to run after startup:
console.log(`
After starting, verify connectivity with:
1. ping ${IPV4}
2. ping6 ${IPV6}
3. curl -v http://${IPV4}:${PORT}/health
4. curl -6 -v "http://[${IPV6}]:${PORT}/health"
`);
