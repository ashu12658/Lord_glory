import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/authcontext';

const AgentOrderForm = () => {
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderMessage, setOrderMessage] = useState('');
  const [error, setError] = useState('');
  const { agent } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/agents/products', {
          headers: { Authorization: `Bearer ${agent.token}` }
        });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
      }
    };

    if (agent?.token) fetchProducts();
  }, [agent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || !customerName) {
      setError('All fields are required');
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    const commission = product?.commission || 0;
    const totalCommission = commission * quantity;

    const orderData = {
      agentId: agent._id,
      customerName,
      products: [{ productId: selectedProduct, quantity, commission }],
      totalCommission
    };

    try {
      const response = await axios.post('/agents/orders/place', orderData, {
        headers: { Authorization: `Bearer ${agent.token}` }
      });

      if (response.status === 201) {
        setOrderMessage('Order placed successfully!');
        setCustomerName('');
        setSelectedProduct('');
        setQuantity(1);
      } else {
        setError('Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Place an Order</h2>
      {orderMessage && <p style={{ color: 'green' }}>{orderMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Customer Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <label>Product:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <button type="submit" style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default AgentOrderForm; 