import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authcontext';

const AgentOrders = () => {
  const { agent } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!agent?.token) {
        console.error('No agent token found');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${agent.token}` },
        };
        const response = await axios.get('${process.env.REACT_APP_API_URL}/api/agents/orders', config);
        console.log('Fetched orders:', response.data); // Debugging
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [agent]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-lg rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      <div className="overflow-x-auto">
        <motion.table 
          className="min-w-full border-collapse bg-gray-50 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <motion.tr 
                  key={order?._id || Math.random()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-indigo-100"
                >
                  <td className="p-3">{order?.customerName || "N/A"}</td>
                  <td className="p-3">
                    {order?.products?.map((p) => p?.productId?.name || "N/A").join(', ')}
                  </td>
                  <td className="p-3">
                    {order?.products?.map((p) => p?.quantity || 0).join(', ')}
                  </td>
                  <td className="p-3">{order?.status || "Pending"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default AgentOrders;
