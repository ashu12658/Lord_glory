import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AgentPayment = ({ orderDetails, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('initiating'); // initiating, processing, success, failed
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initiatePayment = async () => {
    try {
      setPaymentStatus('initiating');
      setError(null);
      
      const token = localStorage.getItem('agentToken');
      const agent = JSON.parse(localStorage.getItem('agent'));
      
      const response = await axios.post(
        'http://localhost:5000/api/agents/initiate',
        {
          totalAmount: orderDetails.totalAmount,
          phone: orderDetails.customerPhone,
          address: orderDetails.customerAddress,
          couponCode: agent.couponCode,
          products: orderDetails.products.map(p => ({
            productId: p._id,
            quantity: p.quantity,
            price: p.price,
            commission: p.commission // Added commission field
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTransactionId(response.data.transactionId);
      setPaymentStatus('processing');
      
      // Simulate payment processing (replace with actual payment flow)
      setTimeout(() => {
        handlePaymentSuccess(response.data.transactionId);
      }, 3000);
      
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.message || 'Payment initiation failed');
      setPaymentStatus('failed');
    }
  };

  const handlePaymentSuccess = async (transactionId) => {
    try {
      const token = localStorage.getItem('agentToken');
      const agent = JSON.parse(localStorage.getItem('agent'));
      
      await axios.post(
        'http://localhost:5000/api/agents/payment-callback',
        {
          transactionId,
          status: "success",
          totalAmount: orderDetails.totalAmount,
          products: orderDetails.products,  
          phone: orderDetails.customerPhone,
          address: orderDetails.customerAddress,
          agentId: agent.id,
          pincode: orderDetails.customerPincode,
          couponCode: agent.couponCode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentSuccess();
        navigate('/agent/orders');
      }, 1500);
      
    } catch (err) {
      console.error('Payment callback failed:', err);
      setError('Payment verification failed. Please contact support.');
      setPaymentStatus('failed');
    }
  };

  useEffect(() => {
    initiatePayment();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          width: '100%',
          maxWidth: '450px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        {paymentStatus === 'initiating' && (
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #007BFF',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h3 style={{ 
              marginBottom: '10px', 
              color: '#333',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Preparing Payment
            </h3>
            <p style={{ color: '#666' }}>Setting up your payment details...</p>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #007BFF',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h3 style={{ 
              marginBottom: '10px', 
              color: '#333',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Processing Payment
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Please wait while we process your transaction</p>
            <div style={{
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              overflow: 'hidden',
              margin: '20px 0'
            }}>
              <div style={{
                height: '100%',
                width: '70%',
                backgroundColor: '#007BFF',
                animation: 'progress 2s ease-in-out infinite'
              }}></div>
            </div>
            <p style={{ 
              color: '#999',
              fontSize: '14px',
              marginTop: '20px'
            }}>
              Transaction ID: {transactionId}
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#4BB543',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h3 style={{ 
              marginBottom: '10px', 
              color: '#333',
              fontSize: '22px',
              fontWeight: '600'
            }}>
              Payment Successful!
            </h3>
            <p style={{ color: '#666', marginBottom: '5px' }}>Thank you for your payment</p>
            <p style={{ 
              color: '#007BFF',
              fontWeight: '500',
              marginBottom: '25px'
            }}>
              ₹{orderDetails.totalAmount.toLocaleString()}
            </p>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <p style={{ 
                color: '#666',
                fontSize: '14px',
                marginBottom: '5px'
              }}>
                <strong>Transaction ID:</strong> {transactionId}
              </p>
              <p style={{ 
                color: '#666',
                fontSize: '14px'
              }}>
                <strong>Status:</strong> Completed
              </p>
            </div>
            <button
              onClick={() => {
                onPaymentSuccess();
                navigate('/agent/orders');
              }}
              style={{
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                width: '100%',
                transition: 'background-color 0.3s'
              }}
            >
              View Orders
            </button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <h3 style={{ 
              marginBottom: '10px', 
              color: '#333',
              fontSize: '22px',
              fontWeight: '600'
            }}>
              Payment Failed
            </h3>
            <p style={{ 
              color: '#666', 
              marginBottom: '25px',
              padding: '0 10px'
            }}>
              {error || 'The payment could not be processed. Please try again.'}
            </p>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => navigate('/agent/dashboard')}
                style={{
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #ddd',
                  padding: '12px 25px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  flex: 1,
                  transition: 'background-color 0.3s'
                }}
              >
                Back to Dashboard
              </button>
              <button
                onClick={initiatePayment}
                style={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  flex: 1,
                  transition: 'background-color 0.3s'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(150%); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default AgentPayment;