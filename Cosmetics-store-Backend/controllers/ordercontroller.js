const Order = require('../models/order'); // Order model
const Product = require('../models/product'); // Product model
const { protect } = require('../middleware/authMiddleware'); 
const mongoose = require('mongoose');
const Coupon = require('../models/coupenCode'); // Coupon model 


exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')  // Populate user information (you can add more fields here if needed)
      .populate('product.product', 'name price image')  // Populate product details (add more fields as required)
      .populate('referencedAgent', 'name')  // Populate agent details if you are tracking the agent
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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

    let discountAmount = 1151;
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

     // discountAmount = (totalAmount * coupon.discount) / 100;
      finalAmount = totalAmount - 1151// Assign `finalAmount` properly
      
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


exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Received order ID:', id);  // Correctly logging the actual order ID

  // Validate if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

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


// Controller: Place Agent Order
exports.placeAgentOrder = async (req, res) => {
  try {
    const { productId, quantity, customerName, customerPhone } = req.body;

    // Agent info comes from agent middleware
    const agentId = req.agent.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock available" });

    const deliveryTime = new Date();
    deliveryTime.setDate(deliveryTime.getDate() + 5); // 5-day delivery time for agents

    const order = new Order({
      user: agentId,
      product: [{ product: productId, quantity }],
      totalAmount: product.price * quantity,
      customerName,
      customerPhone,
      deliveryTime,
      isAgentOrder: true,
      status: "Pending",
    });

    await order.save();

    // Update stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ message: "Order placed successfully", order });

  } catch (error) {
    console.error("Error placing agent order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ❌ Cancel Order (Only if status is "pending")
exports.cancelOrder = async (req, res) => {
const { id } = req.params;

try {
  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({ message: 'Order cancelled successfully', order });
} catch (error) {
  console.error('Error cancelling order:', error);
  res.status(500).json({ message: 'Failed to cancel order' });
}
};


const tempOrders = require('../models/temporder');

exports.createTempOrder = (req, res) => {
  const { user, products, totalAmount, address, phone, pincode } = req.body;

  if (!user || !products || !totalAmount || !address || !phone || !pincode) {
    return res.status(400).json({ message: "Missing required order fields" });
  }

  const tempOrderId = `${Date.now()}_${user}`;
  const orderData = {
    user,
    products,
    totalAmount,
    address,
    phone,
    pincode,
    createdAt: new Date(),
  };

  tempOrders.set(tempOrderId, orderData);

  // Auto-remove after 15 minutes
  setTimeout(() => tempOrders.delete(tempOrderId), 15 * 60 * 1000);

  // Return ID for payment initiation
  res.status(200).json({
    message: "Order saved temporarily. Proceed to payment.",
    tempOrderId,
  });
};
exports.completeOrderAfterPayment = async (req, res) => {
  const { tempOrderId } = req.body;

  const orderData = tempOrders.get(tempOrderId);
  if (!orderData) {
    return res.status(404).json({ message: "Temporary order not found or expired" });
  }

  const newOrder = new Order({
    ...orderData,
    status: 'pending',
    orderStatus: 'payment-success',
  });

  const savedOrder = await newOrder.save();

  tempOrders.delete(tempOrderId); // clean up

  res.status(201).json({ message: "Order confirmed and stored", order: savedOrder });
};
