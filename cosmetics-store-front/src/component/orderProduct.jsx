import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const AgentOrderForm = () => {
  const { agent } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);

  // Customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');

  const FIXED_COMMISSION_RATE = 50; // Fixed commission rate per product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${agent.token}` },
        };
        const response = await axios.get('http://localhost:5000/api/agents/products', config);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [agent.token]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentStatus('processing');
      setError(null);
      
      // First verify agent authentication
      if (!agent || !agent.id || !agent.token) {
        throw new Error('Agent not properly authenticated. Please login again.');
      }
  
      // Verify product selection
      const product = products.find(p => p._id === selectedProduct);
      if (!product) {
        throw new Error('Please select a valid product');
      }
  
      // Prepare payment data
      const orderData = {
        transactionId: `txn${Date.now()}`,
        status: "success",
        totalAmount: product.price * quantity,
        products: [{
          productId: selectedProduct,
          quantity: parseInt(quantity),
          commission: FIXED_COMMISSION_RATE,
          price: product.price
        }],
        phone: customerPhone,
        address: customerAddress,
        agentId: agent.id,  // Using verified agent ID
        pincode: customerPincode,
        couponCode: agent.couponCode || "AG000000",
        customerName,
        customerEmail
      };
  
      console.log('Payment data:', orderData);
  
      // 1. Initiate payment
      const paymentResponse = await axios.post(
        'http://localhost:5000/api/agents/initiate',
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${agent.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      // 2. Process callback
      const callbackResponse = await axios.post(
        'http://localhost:5000/api/agents/payment/callback',
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${agent.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      if (!callbackResponse.data?.success) {
        throw new Error(callbackResponse.data?.message || 'Payment verification failed');
      }
  
      setPaymentStatus('success');
      setTimeout(() => navigate('/agent/orders'), 1500);
  
    } catch (error) {
      console.error('Payment error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle specific authentication errors
      if (error.message.includes('authentication')) {
        setError('Session expired. Please login again.');
        // Optionally redirect to login
        setTimeout(() => navigate('/agent/login'), 2000);
      } else {
        setError(error.message || 'Payment processing failed');
      }
      
      setPaymentStatus('failed');
    }
  };

  const calculateTotal = () => {
    const product = products.find(p => p._id === selectedProduct);
    return product ? product.price * quantity : 0;
  };

  // Payment Confirmation Modal
  const PaymentConfirmation = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          {paymentStatus === 'processing' ? (
            <>
              <div style={{
                width: '60px',
                height: '60px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #007BFF',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Processing Payment</h3>
              <p style={{ color: '#666' }}>Please wait while we process your payment</p>
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '30px'
              }}>✓</div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Payment Successful!</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Transaction ID: {transactionId}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
              >
                Place Another Order
              </button>
            </>
          ) : (
            <>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#f44336',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '30px'
              }}>✕</div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Payment Failed</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {error || 'Please try again or contact support'}
              </p>
              <button
                onClick={() => setPaymentStatus(null)}
                style={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handlePayment} style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#333', 
          fontSize: '24px', 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Place an Order
        </h2>

        {/* Product Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#555'
          }}>
            Select Product
          </label>
          <select
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#fff',
              transition: 'border-color 0.3s'
            }}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">-- Choose Product --</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} (₹{product.price})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#555'
          }}>
            Quantity
          </label>
          <input
            type="number"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s'
            }}
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            required
          />
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            marginBottom: '15px', 
            color: '#444', 
            fontSize: '18px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px'
          }}>
            Customer Information
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#555'
              }}>
                Name*
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s'
                }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#555'
              }}>
                Email
              </label>
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s'
                }}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#555'
            }}>
              Phone*
            </label>
            <input
              type="tel"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#555'
            }}>
              Address*
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#555'
            }}>
              Pincode*
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
              value={customerPincode}
              onChange={(e) => setCustomerPincode(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #007BFF'
        }}>
          <h4 style={{ 
            marginBottom: '10px', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Order Summary
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            <span>Commission ({FIXED_COMMISSION_RATE}/item):</span>
            <span>₹{FIXED_COMMISSION_RATE * quantity}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #ddd',
            fontWeight: '600'
          }}>
            <span>Total:</span>
            <span>₹{calculateTotal() + (FIXED_COMMISSION_RATE * quantity)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={paymentStatus === 'processing'}
          style={{
            backgroundColor: paymentStatus === 'processing' ? '#6c757d' : '#007BFF',
            color: 'white',
            border: 'none',
            padding: '14px 25px',
            borderRadius: '6px',
            cursor: paymentStatus === 'processing' ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            width: '100%',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
        >
          {paymentStatus === 'processing' ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                marginRight: '8px',
                animation: 'spin 1s linear infinite'
              }}></span>
              Processing Payment...
            </>
          ) : (
            'Confirm & Pay'
          )}
        </button>
      </form>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Payment Confirmation Modal */}
      {paymentStatus && <PaymentConfirmation />}
    </div>
  );
};

export default AgentOrderForm;