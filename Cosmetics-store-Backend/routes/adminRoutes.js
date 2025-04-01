const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAlluser,
  getAllorder,
  getAllproduct,
  updateOrderStatus,
  createProduct,
  deleteProduct,
  getAgentReferrals,
  updateProduct, // Ensure correct import
} = require("../controllers/admincontroller");


const router = express.Router();

// Admin routes
router.use(admin);

router.get("/users", getAlluser);
router.get("/orders", getAllorder);
router.get("/products", getAllproduct);
router.put("/update", updateOrderStatus);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct); // Ensure only ONE delete route
router.get("/agent-referrals/:agentId", getAgentReferrals);

module.exports = router;
