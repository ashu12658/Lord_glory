const User = require("../models/User");
const Product = require("../models/product");
const Order = require("../models/order");
const AgentOrder = require("../models/agentorderscehma");
const AgentCommission = require("../models/agentCommission");
const Agent = require("../models/agentSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users
exports.getAlluser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all orders
exports.getAllorder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all products
exports.getAllproduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    const newProduct = new Product({ name, description, price, category, image });

    await newProduct.save();
    res.status(201).json({ message: "Product Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product details
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product Updated Successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Agent Orders (Admin)
exports.getAllAgentOrders = async (req, res) => {
  try {
    const orders = await AgentOrder.find().populate("agentId", "name email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Approve or Reject Commission (Admin)
exports.updateCommissionStatus = async (req, res) => {
  try {
    const { commissionId, status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const commission = await AgentCommission.findById(commissionId);
    if (!commission) {
      return res.status(404).json({ msg: "Commission not found" });
    }

    commission.status = status;
    await commission.save();

    res.json({ msg: "Commission status updated successfully", commission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Withdraw Earnings (Admin)
exports.withdrawEarnings = async (req, res) => {
  try {
    const { agentId, amount } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    if (agent.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    agent.balance -= amount;
    await agent.save();

    res.json({ msg: "Withdrawal successful", remainingBalance: agent.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const adminExists = await User.findOne({ email: normalizedEmail, role: "admin" });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    const token = jwt.sign(
      { userId: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email: email.trim().toLowerCase(), role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Agent Referrals
exports.getAgentReferrals = async (req, res) => {
  try {
    const { agentId } = req.params;

    const orders = await Order.find({ referredByAgent: agentId })
      .populate("user", "name email")
      .populate("referredByAgent", "name email")
      .select("user couponCode discountApplied totalAmount createdAt");

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
