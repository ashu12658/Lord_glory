  const Order = require('../models/order'); // Order model
  const Product = require('../models/product'); // Product model
  const { protect } = require('../middleware/authMiddleware'); 
  const mongoose = require('mongoose');
  const Coupon = require('../models/coupenCode'); // Coupon model 

  // 🛒 Get all orders (Admin only)
  exports.getAllOrder = async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };

  // 🛍️ Create a new order with coupon and pincode validation
  exports.createOrder = async (req, res) => {
    try {
      const { user, products, totalAmount, address, phone, pincode, couponCode } = req.body;

      // Validate required fields
      if (!user || !products || products.length === 0 || !totalAmount || !address || !phone || !pincode) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate pincode format (6-digit check)
      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pinRegex.test(pincode)) {
        return res.status(400).json({ message: "Invalid pincode format. Must be a 6-digit number." });
      }

      // Format product data
      const formattedProducts = products.map(p => ({
        product: p.productId,
        quantity: p.quantity
      }));

      // Calculate delivery time (3 days from now)
      const deliveryTime = new Date();
      deliveryTime.setDate(deliveryTime.getDate() + 3);

      let discountAmount = 0;
      let finalAmount = totalAmount; // Define `finalAmount` properly

      // Apply coupon if provided
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

        if (!coupon) {
          return res.status(400).json({ message: "Invalid or expired coupon" });
        }

        // Check if coupon has expired
        if (new Date(coupon.expiryDate) < new Date()) {
          return res.status(400).json({ message: "Coupon has expired" });
        }

        console.log("✅ Applying Coupon:", coupon);
        console.log("Total Amount:", totalAmount);
        console.log("Coupon Discount Percentage:", coupon.discount);

        discountAmount = (totalAmount * coupon.discount) / 100;
        finalAmount = totalAmount - discountAmount; // Assign `finalAmount` properly

        console.log("Calculated Discount Amount:", discountAmount);
        console.log("Final Order Amount:", finalAmount);
      }

      // Create new order
      const newOrder = new Order({
        user,
        product: formattedProducts,
        totalAmount,
        discountApplied: discountAmount,
        finalAmount,
        couponCode,
        pincode, // ✅ Store pincode in the order
        address,
        phone,
        deliveryTime,
        status: "pending",
      });

      const savedOrder = await newOrder.save();

      res.status(201).json({
        message: "Order placed successfully",
        order: savedOrder
      });

    } catch (error) {
      console.error("❌ Error creating order:", error);
      res.status(500).json({ message: "Failed to create order", error: error.message });
    }
  };

  // 🔄 Update order status (Admin only)
  exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  };

  // 📝 Get a specific order by ID (Authenticated users)
  exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  };

  // 👤 Get orders for a specific user (Authenticated users)
  exports.getUserOrders = [protect, async (req, res) => {
    const userId = req.user._id;  

    try {
      const orders = await Order.find({ user: userId }).populate('user'); 
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Failed to fetch user orders' });
    }
  }];

  // 🚀 Place an order for a customer via an agent (Authenticated agents only)
  exports.placeAgentOrder = [protect, async (req, res) => { // ✅ Added `protect`
    try {
      const { productId, quantity, customerName, customerPhone } = req.body;
      const agentId = req.user.id; 

      if (req.user.role !== "agent") {
        return res.status(403).json({ message: "Only agents can place orders" });
      }

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock available" });

      // ✅ Automatically set delivery time (e.g., 5 days for agent orders)
      const deliveryTime = new Date();
      deliveryTime.setDate(deliveryTime.getDate() + 5);

      const order = new Order({
        user: agentId,
        product: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
        customerName,
        customerPhone,
        deliveryTime, // ✅ Now included
        isAgentOrder: true, // ✅ Marked as an agent order
        status: "Pending",
      });

      await order.save();
      product.stock -= quantity;
      await product.save();

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error("Error placing agent order:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }];

  // 📋 Get all orders placed by the agent
  exports.getAgentOrders = [protect, async (req, res) => { // ✅ Added `protect`
    try {
      const agentOrders = await Order.find({ user: req.user._id, isAgentOrder: true });
      res.status(200).json(agentOrders);
    } catch (error) {
      console.error("Error fetching agent orders:", error);
      res.status(500).json({ message: "Failed to fetch agent orders" });
    }
  }];


  const placeOrder = async (req, res) => {
    try {
      const { userId, products, totalAmount, couponCode } = req.body;

      let discount = 0;
      let agentId = null;

      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode });
        if (!coupon) return res.status(400).json({ message: "Invalid Coupon" });

        if (new Date() > new Date(coupon.expiryDate))
          return res.status(400).json({ message: "Coupon Expired" });

        discount = coupon.discountType === "percentage"
          ? (totalAmount * coupon.discountValue) / 100
          : coupon.discountValue;

        if (coupon.agent) agentId = coupon.agent; // Store agent reference
      }

      const finalAmount = Math.max(totalAmount - discount, 0);

      const newOrder = new Order({
        user: userId,
        products,
        totalAmount: finalAmount,
        couponCode,
        discountApplied: discount,
        referredByAgent: agentId, // Store the agent who referred the user
      });

      await newOrder.save();
      res.json({ message: "Order Placed", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };
