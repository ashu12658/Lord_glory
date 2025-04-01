const Coupon = require("../models/coupenCode");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({ code, discount, expiryDate });
    await newCoupon.save();

    res.status(201).json({ message: "Coupon created successfully", newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Apply coupon to an order
exports.applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code || !totalAmount) {
      return res.status(400).json({ message: "Coupon code and total amount are required" });
    }

    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    const discountAmount = (coupon.discount / 100) * totalAmount;
    const finalAmount = totalAmount - discountAmount;

    res.status(200).json({ message: "Coupon applied", discountAmount, finalAmount });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ message: "Server error" });
  }
};
