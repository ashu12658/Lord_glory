const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  console.log("🟢 Registering User - Email:", email, "| Role:", role);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      console.log("⚠️ Registration Failed: Email already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if phone number is unique
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      console.log("⚠️ Registration Failed: Phone already in use:", phone);
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const validRoles = ["user", "admin", "agent"];
    if (role && !validRoles.includes(role.trim())) {
      console.log("⚠️ Invalid Role Provided:", role);
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Save user without redundant hashing
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password, // Assuming password is already hashed in frontend
      phone: phone.trim(),
      role: role?.trim() || "user",
    });

    await user.save();
    console.log("✅ User Registered Successfully - ID:", user._id);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error during registration:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Login Attempt - Email:", email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User Not Found");
      return res.status(401).json({ message: "Invalid credentials (User not found)" });
    }

    console.log("🔄 Comparing Passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("🔍 Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Login Failed: Incorrect Password");
      return res.status(401).json({ message: "Invalid credentials (Wrong password)" });
    }

    console.log("✅ Password Matched! Generating Token...");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login Successful!");

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin, // Ensure this field exists

        },
      });
  } catch (error) {
    console.error("🚨 Login Error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Verify if the user is an agent
exports.verifyAgent = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      console.log("⚠️ No token provided");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "agent") {
      console.log("❌ Access Denied: User is not an agent");
      return res.status(403).json({ message: "Access denied. Only agents can perform this action." });
    }

    console.log("✅ Agent Verified - User ID:", user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Agent Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
