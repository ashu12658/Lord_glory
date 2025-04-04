// src/components/Order.js
import React, { useState } from 'react';
import axios from '../utils/axios';  // Import the Axios instance

const Order = () => {
  const [order, setOrder] = useState(null);

  const createOrder = async () => {
    try {
      const response = await axios.post('/orders', {
        user: 'user-id-here',
        product: [{ product: 'product-id-here', quantity: 2 }],
      });

      setOrder(response.data);
      console.log('Order created:', response.data);
    } catch (error) {
      console.error('Error creating order:', error.response.data);
    }
  };

  return (
    <div>
      <button onClick={createOrder}>Create Order</button>
      {order && <div>Order ID: {order._id}</div>}
    </div>
  );
};

export default Order;
