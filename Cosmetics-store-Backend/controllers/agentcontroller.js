const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AgentOrder = require('../models/agentorderscehma');
const AgentCommission = require('../models/agentCommission');
const Agent = require('../models/agentSchema');
const Product = require('../models/product');
const AgentBalance = require('../models/agentBalance')
const Order = require('../models/order');
const mongoose = require ("mongoose");
const Coupon = require("../models/coupenCode")

const FIXED_COMMISSION_RATE = 250; // Adjust the value as needed
const placeOrder = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        console.log('Decoded agent:', req.agent);

        const agentId = req.agent.id; // ✅ From agent middleware
        const {
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerPincode,
            products
        } = req.body;

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerPincode || !products || products.length === 0) {
            return res.status(400).json({ message: 'All customer fields and at least one product are required.' });
        }

        const FIXED_COMMISSION_RATE = 250;

        let totalCommission = 0;
        const updatedProducts = products.map(product => {
            const commission = product.quantity * FIXED_COMMISSION_RATE;
            totalCommission += commission;
            return {
                ...product,
                commission
            };
        });

        const newOrder = new AgentOrder({
            agentId,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerPincode,
            products: updatedProducts,
            totalCommission,
            status: 'pending',
        });

        const savedOrder = await newOrder.save();

        const newCommission = new AgentCommission({
            agentId,
            orderId: savedOrder._id,
            commission: totalCommission,
        });

        await newCommission.save();

        res.status(201).json({
            message: 'Order placed and commission updated!',
            orderId: savedOrder._id,
            totalCommission
        });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// 🔹 Get all orders for an agent
const getAgentOrders = async (req, res) => {
    try {
        const { agentId } = req.params;
        const orders = await AgentOrder.find({ agentId }).populate('products.productId', 'name price');

        if (!orders.length) {
            return res.status(404).json({ msg: "No orders found for this agent" });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const getAllAgentOrders = async (req, res) => {
    try {
        const agentId = req.agent.id; // ✅ Correct source from decoded token

        const orders = await AgentOrder.find({ agentId })
            .populate('products.productId', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error("Error fetching agent orders:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

const getAgentCommissions = async (req, res) => {
    try {
      const { agentId } = req.params;
      console.log('Fetching commissions for agent:', agentId); // Debugging
  
      // Fetch all orders made by the agent
      const orders = await AgentOrder.find({ agentId });
      console.log('Orders found:', orders); // Debugging
  
      if (!orders.length) {
        return res.status(404).json({ msg: 'No commissions found for this agent' });
      }
  
      let totalCommission = 0;
      orders.forEach((order) => {
        totalCommission += order.totalCommission;
      });
  
      return res.json({
        agentId,
        totalCommission,
        orders: orders.map((order) => ({
          orderId: order._id,
          customerName: order.customerName,
          totalCommission: order.totalCommission,
          status: order.status,
        })),
      });
    } catch (error) {
      console.error('Error fetching commissions:', error); // Debugging
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  
// 🔹 Approve or Reject Commission for an Order
const updateCommissionStatus = async (req, res) => {
    try {
        const { commissionId, status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const commission = await AgentCommission.findById(commissionId);
        if (!commission) {
            return res.status(404).json({ msg: "Commission not found" });
        }

        commission.status = status;
        await commission.save();

        if (status === 'Approved') {
            const agent = await Agent.findById(commission.agentId);
            agent.balance = (agent.balance || 0) + commission.commission;
            await agent.save();
        }

        res.json({ msg: 'Commission status updated successfully', commission });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// 🔹 Update the status of an order
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const order = await AgentOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({ msg: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const getAgentBalance = async (req, res) => {
    try {
        const { agentId } = req.params;

        // Fetch all commissions for the agent
        const commissions = await AgentCommission.find({ agentId });

        // Calculate total balance and order count
        const totalBalance = commissions.reduce((acc, curr) => acc + curr.commission, 0);
        const orderCount = commissions.length;

        // Find existing balance record or create a new one
        let agentBalance = await AgentBalance.findOne({ agentId });

        if (!agentBalance) {
            // Create a new record if not found
            agentBalance = new AgentBalance({
                agentId,
                totalCommission: totalBalance,
                totalOrders: orderCount,
                balance: totalBalance
            });
        } else {
            // Ensure we're working with a Mongoose document for updating
            agentBalance.totalCommission = totalBalance;
            agentBalance.totalOrders = orderCount;
            agentBalance.balance = totalBalance;
        }

        // Save to database (use .save() method from Mongoose model)
        await agentBalance.save();

        res.json({
            balance: agentBalance.balance,
            orderCount: agentBalance.totalOrders
        });
    } catch (err) {
        console.error("Error fetching agent balance:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};




// 🔹 Withdraw agent's earnings
const withdrawEarnings = async (req, res) => {
    try {
        const { agentId } = req.params;
        const { amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ msg: "Invalid withdrawal amount" });
        }

        const agent = await Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ msg: "Agent not found" });
        }

        if (agent.balance < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        agent.balance -= amount;
        await agent.save();

        res.json({ msg: 'Withdrawal successful', remainingBalance: agent.balance });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

const registerAgent = async (req, res) => {
    try {
        // Check if the agent's email already exists
        const existingAgent = await Agent.findOne({ email: req.body.email.toLowerCase() });
        if (existingAgent) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Ensure phone number is provided
        if (!req.body.phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create and save the agent
        const agent = new Agent({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            phone: req.body.phone
        });

        await agent.save();

        // Generate a short coupon code
        const generateShortCode = (agentId) => {
            return "AG" + String(agentId).substring(0, 6).toUpperCase();
        };

        // Create and save the coupon
        const coupon = new Coupon({
            code: generateShortCode(agent._id),
            discount: req.body.discount || 10,
            expiryDate: req.body.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            agent: agent._id
        });

        await coupon.save();

        // Respond with success
        res.status(201).json({
            message: 'Agent and Coupon registered successfully',
            agent,
            coupon
        });

    } catch (error) {
        console.error('Error registering agent:', error);
        res.status(500).json({ message: 'Error registering agent and coupon', error: error.message });
    }
};


// Agent Login
const agentLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1. Validate input
      if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
      }
  
      // 2. Find agent
      const agent = await Agent.findOne({ email: email.toLowerCase() });
      if (!agent) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }
  
      // 3. Check password
      const isMatch = await bcrypt.compare(password, agent.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }
  
      // 4. Ensure JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ msg: "JWT Secret not configured" });
      }
  
      // 5. Create token
      const tokenPayload = {
        id: agent._id,
        role: "agent",
        name: agent.name,
        couponCode: agent.couponCode,
      };
  
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // 6. Return token & limited agent info
      res.status(200).json({
        msg: "Login successful",
        token,
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          couponCode: agent.couponCode
        }
      });
    } catch (err) {
      console.error("Error logging in agent:", err.message);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

const getAgentcount = async (req, res) => {
    try {
        console.log("Decoded agent info:", req.agent); // 👈 add this

        const agentCouponCode = req.agent?.couponCode;
        if (!agentCouponCode) {
            return res.status(400).json({ success: false, message: "Agent coupon code not found" });
        }

        const orderCount = await Order.countDocuments({ couponCode: agentCouponCode });

        res.json({ success: true, orderCount });
    } catch (error) {
        console.error("Error in getAgentcount:", error); // 👈 add this
        res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
    }
};

const getAgentUserCount = async (req, res) => {
    try {
        // Step 1: Fetch agent ID from token (set in middleware)
        const agentId = req.agent?._id;
        if (!agentId) {
            return res.status(401).json({ success: false, message: "Unauthorized: Agent not found" });
        }

        // Step 2: Fetch the coupon associated with this agent
        const coupon = await Coupon.findOne({ agent: agentId });
        if (!coupon || !coupon.code) {
            return res.status(404).json({ success: false, message: "Coupon code not found for this agent" });
        }

        // Step 3: Find all orders using this coupon
        const orders = await Order.find({ couponCode: coupon.code })
            .populate('user', 'name address'); // Assuming `user` field is ObjectId

        // Step 4: Build the response with customer info
        const orderDetails = orders.map(order => ({
            customerName: order.user?.name,
            address: order.user?.address,
            orderId: order._id,
            totalAmount: order.totalAmount,
            status: order.status,
        }));

        res.json({
            success: true,
            orderCount: orderDetails.length,
            orders: orderDetails,
        });

    } catch (error) {
        console.error("Error in getAgentCount:", error);
        res.status(500).json({ success: false, message: "Error fetching agent orders", error: error.message });
    }
};


const initiateAgentPayment = async (req, res) => {
    try {
      const { totalAmount, phone, address, couponCode, products } = req.body;
      const agentId = req.agent._id;
  
      // Initiate PhonePe payment logic (mock or real)
      const transactionId = 'AGENT_' + Date.now();
      
      // Save this in DB if needed
      const paymentUrl = `https://mock-phonepe.com/pay/${transactionId}`;
  
      res.json({ success: true, paymentUrl, transactionId });
    } catch (error) {
      console.error('Agent Payment Initiation Failed:', error);
      res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
  };
  
  const phonePeCallbackForAgent = async (req, res) => {
    try {
      const { transactionId, status, totalAmount, products, phone, address, agentId, pincode, couponCode } = req.body;
  
      // Validate payment status
      if (status !== "success") {
        return res.status(400).json({ success: false, message: 'Payment status is not successful' });
      }
  
      // Ensure that agentId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return res.status(400).json({ success: false, message: 'Invalid agent ID' });
      }
  
      // Find the agent by ID
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({ success: false, message: 'Agent not found' });
      }
  
      // Create a new agent order
      const newOrder = new AgentOrder({
        agentId: agent._id,
        customerName: "Customer Name",   // Replace with actual customer name
        customerEmail: "customer@example.com", // Replace with actual email
        customerPhone: phone,
        customerAddress: address,
        customerPincode: pincode,
        products: products.map(product => ({
          productId: new mongoose.Types.ObjectId(product.productId), // Correctly create an ObjectId instance
          quantity: product.quantity,
          commission: product.commission,  // Ensure commission is available
        })),
        totalCommission: products.reduce((acc, product) => acc + product.commission, 0),  // Example commission calculation
        status: 'success',  // Set status to SUCCESS
      });
  
      // Save the order
      await newOrder.save();
  
      // Return success response
      res.status(200).json({ success: true, message: 'Order processed successfully' });
    } catch (error) {
      console.error('Payment Callback Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


const getAgentCouponBalance = async (req, res) => {
    try {
      const agentId = req.agent._id;
  
      // Step 1: Get all coupon codes assigned to this agent
      const coupons = await Coupon.find({ agent: agentId });
      const couponCodes = coupons.map(coupon => coupon.code);
  
      // Step 2: Find unpaid orders that used these coupon codes
      const orders = await Order.find({
        couponCode: { $in: couponCodes },
        balancePaid: { $ne: true }
      });
  
      // Step 3: Fixed commission per order
      const fixedCommissionPerOrder = 250; // Example: fixed commission of 50 per order
  
      // Step 4: Calculate total balance and order count
      const totalBalance = orders.length * fixedCommissionPerOrder;
  
      // Step 5: Show balance per order
      const balancesPerOrder = orders.map(() => fixedCommissionPerOrder);
  
      console.log("Agent Coupons:", couponCodes);
      console.log("Matching Orders:", orders.length);
      console.log("Balances per Order:", balancesPerOrder);
  
      res.status(200).json({
        totalBalance, // Total balance (fixed commission per order * number of orders)
        orderCount: orders.length, // Number of orders
        balancesPerOrder // Balance for each individual order
      });
    } catch (error) {
      console.error("Balance fetch error:", error);
      res.status(500).json({ message: 'Failed to fetch balance', error });
    }
  };
  
const agentcontroller = {
    placeOrder,
    getAgentOrders,
    getAllAgentOrders,
    getAgentCommissions,
    updateCommissionStatus,
    updateOrderStatus,
    getAgentBalance,
    phonePeCallbackForAgent,
    withdrawEarnings,
    registerAgent,
    agentLogin,
    getProducts,
    getAgentcount,
    initiateAgentPayment,
    getAgentUserCount,
    getAgentCouponBalance
};

module.exports = agentcontroller;



