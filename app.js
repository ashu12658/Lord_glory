  const express = require("express");
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const path = require("path");


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
    .connect("mongodb://127.0.0.1/cosmetics-store")
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
app.use("/api/otp", require("./Cosmetics-store-Backend/routes/otproutes"));


  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  // Start Server
  const PORT = process.env.PORT || 5000 ;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
