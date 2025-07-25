import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { FiRefreshCw, FiAlertCircle, FiUser, FiMapPin, FiDollarSign, FiPackage } from 'react-icons/fi';

const AgentOrdersDashboard = () => {
  const { agent } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!agent?.token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const config = {
        headers: { 
          Authorization: `Bearer ${agent.token}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      };

      // Fetch both endpoints in parallel
      const [countResponse, ordersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/agents/get-coupen-user', config),
        axios.get('http://localhost:5000/api/agents/get-coupen-user', config)
      ]);

      // Validate responses
      if (!countResponse.data.success || !ordersResponse.data.success) {
        throw new Error('Failed to load order data');
      }

      setStats({
        total: countResponse.data.orderCount || 0,
        completed: (ordersResponse.data.orders || []).filter(o => o.status === 'completed').length,
        pending: (ordersResponse.data.orders || []).filter(o => o.status === 'pending').length
      });

      setOrders(ordersResponse.data.orders || []);
      
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    let errorMessage = 'Failed to fetch data';
    
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = 'Session expired - please login again';
      } else if (err.response.status === 404) {
        errorMessage = 'API endpoint not found - check backend routes';
      } else {
        errorMessage = `Server error: ${err.response.status}`;
      }
    } else if (err.code === 'ERR_NETWORK') {
      errorMessage = 'Network error - backend service unavailable';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    console.error('API Error:', err);
  };

  useEffect(() => {
    fetchData();
  }, [agent]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p>Loading agent dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Code Orders Dashboard</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Operation Failed</h3>
              <p className="text-red-700">{error}</p>
              <div className="mt-2 text-sm bg-white p-2 rounded border">
                <p className="font-medium">Verify these endpoints:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>GET /api/agents/orders-count</li>
                  <li>GET /api/agents/get-coupen-user</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FiPackage className="text-indigo-500 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FiAlertCircle className="text-yellow-500 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      #{order.orderId?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUser className="text-indigo-500 mr-2" />
                        <span>{order.customerName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiMapPin className="text-indigo-500 mr-2" />
                        <span className="text-sm">{order.address || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="text-indigo-500 mr-2" />
                        <span>${order.totalAmount?.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {error ? 'Failed to load orders' : 'No orders found with your coupon code'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentOrdersDashboard;