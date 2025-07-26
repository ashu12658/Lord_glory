const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  console.log("Received role:", role); // Debug role input

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if phone number is unique
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const validRoles = ["user", "admin", "agent"];
    if (role && !validRoles.includes(role.trim())) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(), // ✅ Store phone number
      role: role?.trim() || "user",
    });

    await user.save();
    console.log("Saved user with role:", user.role); // Debug saved user role

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
        phone: user.phone, // ✅ Return phone in response
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Ensure password is fetched from DB
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Debugging logs to check password retrieval
    console.log("📌 Entered Password:", password);
    console.log("📌 Stored Hashed Password in DB:", user.password);

    if (!user.password) {
      console.error("❌ Password is missing in database for:", email);
      return res.status(500).json({ message: "Password field is missing in database" });
    }

    // ✅ Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Password does not match!");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // ✅ Return phone in response
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Fetch User Details by ID
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone, // ✅ Return phone in response
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
