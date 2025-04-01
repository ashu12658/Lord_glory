const express = require("express");
const { protect, admin } = require("../middleware/authmiddleware");
const {
  getAllOrder,
  createOrder,
  updateOrderStatus,
  getOrderById,
  getUserOrders,
  placeAgentOrder,
  getAgentOrders,
} = require("../controllers/ordercontroller");
const { agent } = require("../middleware/authmiddleware");
const Admin = require("../models/admin");

const router = express.Router();

// Admin: Get all orders
router.get("/",admin, getAllOrder);  

// Get all orders of a logged-in user (This must come before "/:id")
router.get("/user", protect, getUserOrders);

// Create a new order
router.post("/", protect, createOrder);

// Update order status (Admin only)
router.put("/:id", updateOrderStatus);

// Get a specific order by ID
router.get("/:id", protect, getOrderById);

// Agent: Place an order for a customer
router.post("/agent", protect, placeAgentOrder);

// Agent: Get all orders placed by the agent
router.get("/agent/orders", protect, getAgentOrders);

module.exports = router;
