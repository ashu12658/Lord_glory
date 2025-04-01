import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PhonePePayment = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Fetch user ID from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    }

    // Fetch products from cart (assuming cart is stored in localStorage)
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(cartItems);

    // Calculate estimated delivery time (2-3 days from now)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2);
    setDeliveryTime(estimatedDate.toLocaleString()); // Converts to readable format
  }, []);

  const handlePayment = async () => {
    if (!amount || !phone || !address || !userId || products.length === 0) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments/phonepe/initiate",
        {
          amount: parseInt(amount),
          userId,
          products,
          phone,
          address,
          couponCode: couponCode.trim() ? couponCode : null, // Ensure valid coupon
        }
      );

      console.log("Payment Initiation Response:", response.data);

      if (response.data.success && response.data.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        setMessage(
          "❌ Payment initiation failed. " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setMessage(
        `❌ Payment initiation failed. Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle order confirmation after successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("status");
    const orderId = urlParams.get("orderId");

    if (paymentStatus === "success" && orderId) {
      const queryString = `orderId=${orderId}&amount=${amount}${
        couponCode.trim() ? `&coupon=${couponCode}` : ""
      }`;

      navigate(`/payment-confirmation?${queryString}`);
    }
  }, [navigate, amount, couponCode]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>PhonePe Payment</h2>

      <label>
        Enter Amount (INR):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Phone Number:
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Coupon Code (Optional):
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </label>
      <br />
      <br />

      {/* Display estimated delivery time */}
      {deliveryTime && (
        <div>
          <p>
            <strong>Estimated Delivery Time: </strong>
            {deliveryTime}
          </p>
        </div>
      )}

      <button
        onClick={handlePayment}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Pay with PhonePe
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default PhonePePayment;
