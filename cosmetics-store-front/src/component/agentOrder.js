import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authcontext';

const AgentOrders = () => {
  const { agent } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!agent?.token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const config = {
          headers: { 
            Authorization: `Bearer ${agent.token}`,
            'Content-Type': 'application/json'
          },
        };
        
        // Corrected API endpoint - note the proper URL structure
        const response = await axios.get(
          'http://localhost:5000/api/agents/get-coupen-user', 
          config
        );
        
        if (response.data.success && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        let errorMessage = 'Failed to fetch orders';
        if (err.response) {
          // Server responded with error status
          errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'Network error - could not connect to server';
        }
        setError(errorMessage);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [agent]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-2xl text-center"
      >
        <p>Loading orders...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-lg rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
        >
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <motion.table 
          className="min-w-full border-collapse bg-gray-50 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <motion.tr 
                  key={order._id || Math.random()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-indigo-100"
                >
                  <td className="p-3">{order._id?.substring(0, 8) || "N/A"}</td>
                  <td className="p-3">{order.customerName || "N/A"}</td>
                  <td className="p-3">${order.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : !error && (
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