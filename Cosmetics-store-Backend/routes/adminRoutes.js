// const express = require("express");
// const { protect, admin } = require('../middleware/authMiddleware');
// const {
//   getAlluser,
//   getAllorder,
//   getAllproduct,
//   updateOrderStatus,
//   createProduct,
//   deleteProduct,
//   getAgentReferrals,
//   updateProduct,
//   updateTracking,
// } = require("../controllers/admincontroller");

// const router = express.Router();

// // Apply admin middleware to all routes
// router.use(protect,admin);

// router.get("/users", getAlluser);
// router.get("/orders", getAllorder);
// router.get("/products", getAllproduct);
// router.put("/update", updateOrderStatus);
// router.post("/products", createProduct);
// router.put("/products/:id", updateProduct);
// router.delete("/products/:id", deleteProduct);
// router.get("/agent-referrals/:agentId", getAgentReferrals);
// router.put("/orders/:orderId/tracking", updateTracking);

// module.exports = router;
const express = require("express");
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAlluser,
  getAllorder,
  getAllproduct,
  updateOrderStatus,
  createProduct,
  deleteProduct,
  getAgentReferrals,
  updateProduct,
  updateTracking,
  getAllAgentOrders,
  markAgentBalancePaid,
  markCommissionAsPaid

} = require("../controllers/admincontroller");

const router = express.Router();

// Apply protect + admin middleware globally
router.use(protect, admin);

// Users
router.get("/users", getAlluser);

// Products
router.get("/products", getAllproduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.post('/mark-agent-balance-paid', markAgentBalancePaid);

// Orders
router.get("/orders", getAllorder);
router.put("/orders/status", updateOrderStatus);
router.put("/orders/:orderId/tracking", updateTracking);
// Agent Referrals
router.get("/agent-referrals/:agentId", getAgentReferrals);
router.put('/commissions/:commissionId/mark-paid', markCommissionAsPaid);


module.exports = router;


