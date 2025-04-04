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

const FIXED_COMMISSION_RATE = 50; // Adjust the value as needed
const placeOrder = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        console.log('Decoded user:', req.user);

        const agentId = req.user.id; // From JWT token
        const { customerName, products } = req.body;

        if (!customerName || !products || products.length === 0) {
            return res.status(400).json({ message: 'Customer name and products are required.' });
        }

        // Calculate total commission
        const FIXED_COMMISSION_RATE = 50;
        let totalCommission = products.reduce((acc, product) => {
            return acc + (product.quantity * FIXED_COMMISSION_RATE);
        }, 50);

        // Update product commissions
        const updatedProducts = products.map(product => ({
            ...product,
            commission: product.quantity * FIXED_COMMISSION_RATE
        }));

        // Create a new agent order
        const newOrder = new AgentOrder({
            agentId,
            customerName,
            products: updatedProducts,
            totalCommission,
            status: 'pending', // ensure this matches your schema enum
        });
       
        const savedOrder = await newOrder.save();
        const orderId = savedOrder._id;

        // Save commission record
        const newCommission = new AgentCommission({
            agentId,
            orderId,
            commission: totalCommission,
        });
      


        await newCommission.save();

        res.status(201).json({ message: 'Order placed and commission updated!', orderId, totalCommission });
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

// Get all orders for the authenticated agent
const getAllAgentOrders = async (req, res) => {
    try {
        const agentId = req.user.id; // Get agent ID from authenticated user
        const orders = await AgentOrder.find({ agentId })
            .populate('products.productId', 'name price')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
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
        // Check if the agent's email already exists in the database
        const existingAgent = await Agent.findOne({ email: req.body.email.toLowerCase() });
        if (existingAgent) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Ensure that the required fields for the agent are provided
        if (!req.body.phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the agent
        const agent = new Agent({
            name: req.body.name,
            email: req.body.email.toLowerCase(), // Ensure email is saved in lowercase
            password: hashedPassword,
            phone: req.body.phone,
        });

        // Save the agent
        await agent.save();

        const generateShortCode = (agentId) => {
            return "AG" + String(agentId).substring(0, 6).toUpperCase();  // Convert ObjectId to string
        };
        
        // Create the coupon for the agent
        const coupon = new Coupon({
            code: generateShortCode(agent._id),  // Use shortened coupon code
            discount: req.body.discount || 10,  // Default discount if not provided
            expiryDate: req.body.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),  // Default expiry date (1 year from now)
            agent: agent._id,  // Associate the coupon with the agent
        });
        // Save the coupon
        await coupon.save();

        // Respond with success
        res.status(201).json({
            message: 'Agent and Coupon registered successfully',
            agent: agent,
            coupon: coupon,
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
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        // Find agent by email (ensure email is lowercase)
        const agent = await Agent.findOne({ email: email.toLowerCase() });
        if (!agent) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: "JWT Secret not configured" });
        }

        // Create JWT token
        const token = jwt.sign({ id: agent._id, role: "agent", name: agent.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with success and token
        res.json({ msg: "Login successful", token, agent });
    } catch (err) {
        console.error("Error logging in agent:", err);
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

const getAgentcount= async (req, res) => {
    try {
        const agentCouponCode = req.agent.couponCode; // Assuming agent info is in `req.agent`
        
        // Find orders with the agent's coupon code
        const orderCount = await Order.countDocuments({ couponCode: agentCouponCode });

        res.json({ success: true, orderCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error });
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
    withdrawEarnings,
    registerAgent,
    agentLogin,
    getProducts,
    getAgentcount
};

module.exports = agentcontroller;