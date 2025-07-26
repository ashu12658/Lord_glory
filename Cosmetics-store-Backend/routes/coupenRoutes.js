const express = require("express");
const router = express.Router();
const { createCoupon, getAllCoupons, applyCoupon } = require("../controllers/coupenController");

router.post("/admin/coupons", createCoupon);  // Create a new coupon
router.get("/admin/coupons", getAllCoupons);  // Fetch all coupons
router.post("/orders/apply-coupon", applyCoupon);  // Apply a coupon

module.exports = router;
