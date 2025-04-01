const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentcontroller');
const { protect, admin, agent } = require('../middleware/authmiddleware');

// Auth routes - no middleware needed
router.post('/login', agentController.agentLogin); // Make sure this is defined first
router.post('/register', agentController.registerAgent);

// Protected routes below
router.post('/orders/place',agent,agentController.placeOrder);
router.get('/orders',agent, agentController.getAllAgentOrders);
router.get('/orders/:agentId',agent, agentController.getAgentOrders);
router.post('/order/status', admin, agentController.updateOrderStatus);
router.get('/balance/:agentId',agent, agentController.getAgentBalance);
router.post('/withdraw/:agentId',agent, agentController.withdrawEarnings);
router.get('/products',agent, agentController.getProducts);
router.get('/commissions/:agentId',agent, agentController.getAgentCommissions);
router.get("/orders-count", agent, agentController.getAgentcount);


module.exports = router;
