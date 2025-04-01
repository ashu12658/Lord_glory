import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authcontext';
import './agentproduct.css';

const AgentDashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { agent } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!agent?.token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('/agents/products', {
          headers: { Authorization: `Bearer ${agent.token}` }
        });

        if (response.status === 200) {
          setProducts(response.data);
        } else {
          setError(response.data.message || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [agent]);

  return (
    <div className="agent-dashboard">
      <h2>Available Products</h2>

      <div className="product-list">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          products.map((product) => (
            <motion.div
              key={product._id}
              className="product-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentDashboardProducts;
