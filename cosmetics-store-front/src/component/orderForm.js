import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderForm = () => {
  const [products, setProducts] = useState([]); // ✅ Default to an empty array
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("${process.env.REACT_APP_API_URL}/api/products");

        console.log("API Response:", response.data); // ✅ Debugging log

        // ✅ Ensure data is an array before setting state
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          throw new Error("Invalid product data format");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("❌ Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Update Total Amount on Product or Quantity Change
  useEffect(() => {
    if (selectedProduct && quantity > 0) {
      const product = products.find((p) => p._id === selectedProduct);
      if (product) {
        setTotalAmount(product.price * quantity);
      }
    }
  }, [selectedProduct, quantity, products]);

  // 🔹 Handle Order Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !address || !phone) {
      setMessage("❌ All fields are required");
      return;
    }

    const orderData = {
      products: [{ productId: selectedProduct, quantity }],
      totalAmount,
      address,
      phone,
      couponCode,
    };

    try {
      const response = await axios.post("${process.env.REACT_APP_API_URL}/api/orders", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(`✅ Order placed successfully! Order ID: ${response.data.order._id}`);
    } catch (error) {
      setMessage("❌ Failed to place order. Please try again.");
      console.error("Order error:", error);
    }
  };

  return (
    <div className="order-form">
      <h2>🛍️ Place an Order</h2>

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading products...</p>}

      <form onSubmit={handleSubmit}>
        {/* 🔹 Product Dropdown */}
        <label>Product:</label>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="">Select a Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ₹{product.price}
            </option>
          ))}
        </select>

        {/* 🔹 Quantity Input */}
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, e.target.value))}
        />

        {/* 🔹 Address Input */}
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

        {/* 🔹 Phone Input */}
        <label>Phone:</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        {/* 🔹 Coupon Code Input */}
        <label>Coupon Code (Optional):</label>
        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

        {/* 🔹 Total Amount */}
        <p><strong>Total Amount: ₹{totalAmount}</strong></p>

        {/* 🔹 Submit Button */}
        <button type="submit" disabled={loading}>Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
