const express = require("express");
const { protect, admin } = require("../middleware/authmiddleware");
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

router.get("/users",admin, getAlluser);
router.get("/orders",admin, getAllorder);
router.get("/products",admin, getAllproduct);
router.put("/update",admin, updateOrderStatus);
router.post("/products",admin, createProduct);
router.put("/products/:id",admin, updateProduct);
router.delete("/products/:id",admin, deleteProduct); // Ensure only ONE delete route
router.get("/agent-referrals/:agentId",admin, getAgentReferrals);

module.exports = router;
