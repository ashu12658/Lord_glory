const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require("../models/order");
const Coupon = require("../models/coupenCode"); // ✅ Import Coupon model
const { protect } = require('../middleware/authMiddleware');
const Agent = require("../models/agentSchema");


// ✅ **Payment Initiation Route**
router.post('/initiate', async (req, res) => {
  const { amount, userId, products, phone, address, couponCode,pincode } = req.body;

  // Basic validation
  if (!amount || !userId || !products || products.length === 0 || !phone || !address) {
    return res.status(400).json({ error: "Amount, User ID, Products, Phone, and Address are required" });
  }

  let discountAmount = 0;
  let finalAmount = parseFloat(amount); // Ensure amount is a number

  // Check if the amount is valid
  if (isNaN(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount value" });
  }

  console.log("Initial amount:", finalAmount);

  // ✅ If a `couponCode` is provided, apply the discount
  if (couponCode) {
    try {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

      if (!coupon) {
        return res.status(400).json({ error: "Invalid or expired coupon" });
      }

      // Calculate discount
      discountAmount = (finalAmount * coupon.discount) / 100;
      finalAmount -= discountAmount;

      console.log("Coupon applied:", coupon);
      console.log("Discount amount:", discountAmount);
      console.log("Final amount after discount:", finalAmount);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch coupon details", message: error.message });
    }
  }

  // Validate `finalAmount` after discount application
  if (isNaN(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ error: "Invalid final amount after applying discount" });
  }

  // ✅ Format the products array
  const formattedProducts = products.map(p => ({
    product: p.productId,
    quantity: p.quantity
  }));

  try {
    // ✅ Create the order
    const newOrder = new Order({
      user: userId,
      product: formattedProducts,
      totalAmount: finalAmount,
      phone,
      address,
      pincode,
      couponCode: couponCode || null,
      discountApplied: discountAmount,
      status: "pending"
    });

    const savedOrder = await newOrder.save();

    // ✅ Generate the payment URL and include `couponCode`
    const mockPaymentUrl = `http://localhost:3000/payment-confirmation?orderId=${savedOrder._id}&amount=${finalAmount}&coupon=${couponCode || ''}`;

    res.json({
      success: true,
      message: "Mock payment initiated",
      data: { paymentUrl: mockPaymentUrl, orderId: savedOrder._id }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// ✅ **Payment Callback Route**
router.post('/callback', async (req, res) => {
  console.log("Payment callback received:", req.body);

  const { status, userId, products, totalAmount, phone, address, couponCode } = req.body;

  // ✅ Basic validation
  if (!userId || !products || !totalAmount || !phone || !address) {
    return res.status(400).json({ message: "Invalid order data, missing required fields" });
  }

  // Ensure `totalAmount` is valid
  let amount = parseFloat(totalAmount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid totalAmount value" });
  }

  let discountAmount = 0;
  let referencedAgent = null;

  // ✅ If a `couponCode` is provided, fetch and validate the coupon
  if (couponCode) {
    try {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      // ✅ Fetch the agent associated with the coupon
      referencedAgent = await Agent.findById(coupon.agent);

      if (!referencedAgent) {
        return res.status(400).json({ message: "Agent associated with the coupon not found" });
      }

      // ✅ Apply the discount
      discountAmount = (amount * coupon.discount) / 100;
      console.log("Discount applied:", discountAmount);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching coupon", error: error.message });
    }
  }

  // ✅ Calculate final amount
  const finalAmount = amount - discountAmount;

  if (isNaN(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ message: "Invalid finalAmount after applying discount" });
  }

  // ✅ Set delivery time (3 days from now)
  const deliveryTime = new Date();
  deliveryTime.setDate(deliveryTime.getDate() + 3);

  // ✅ Format products array
  const formattedProducts = products.map(p => ({
    product: p.productId,
    quantity: p.quantity
  }));

  try {
    // ✅ Save order with applied discount & agent reference
    const newOrder = new Order({
      user: userId,
      product: formattedProducts,
      totalAmount: finalAmount,
      phone,
      address,
      pincode,
      couponCode,
      discountApplied: discountAmount,
      referencedAgent: referencedAgent ? referencedAgent._id : null,
      deliveryTime,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder);

    return res.status(200).json({
      message: "Payment successful, order created",
      order: savedOrder,
      discountApplied: discountAmount,
      referencedAgent: referencedAgent || null
    });

  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// ✅ **Get Order Details**
router.get('/orders/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('product.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
});

module.exports = router;
