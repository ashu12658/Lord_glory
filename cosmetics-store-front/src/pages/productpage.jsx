import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import productImage from "../assets/product.jpeg";
import styled from "styled-components";
import { FiShoppingCart, FiInfo, FiCheckCircle, FiTruck } from "react-icons/fi";

// Styled Components
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #e9f5ff);
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductCard = styled(motion.div)`
  background: white;
  width: 90%;
  max-width: 1000px;
  display: flex;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 100, 255, 0.1);
  border: 1px solid #e0e6ed;
  overflow: hidden;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImageSection = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #e0e6ed;

  @media (min-width: 768px) {
    border-bottom: none;
    border-right: 1px solid #e0e6ed;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  max-width: 350px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.4rem;
  margin: 0.5rem 0;
  text-align: center;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #3498db;
  font-size: 1.5rem;
  margin: 0.5rem 0;
`;

const OrderForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 300px;
`;

const InputField = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e6ed;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const BuyButton = styled.button`
  background: #3498db;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  color: #3498db;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductDescription = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: #4a5568;
`;

const DeliveryInfo = styled.div`
  background: #e3f2fd;
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #2c3e50;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: #555;
  padding-top: 2rem;
`;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded?.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = getToken();
      if (!isTokenValid(token)) {
        setError("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      try {
        const response = await axios.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleOrder = async (productId, amount) => {
    if (!phone || !address || !pincode) {
      setError("Please fill in all required fields: phone, address, and pincode");
      return;
    }

    const token = getToken();
    if (!isTokenValid(token)) {
      setError("Session expired. Please log in again.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.id || decodedToken?.userId;

    if (!userId) {
      setError("User authentication failed. Please log in again.");
      return;
    }

    const deliveryTime = "3-5 business days";
    setProcessing(true);

    try {
      const response = await axios.post(
        "${process.env.REACT_APP_API_URL}/api/payments/phonepe/initiate",
        {
          amount,
          userId,
          phone,
          address,
          pincode,
          couponCode: coupon,
          deliveryTime,
          products: [{ productId, quantity: 1 }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data?.paymentUrl) {
        const orderId = response.data.data.orderId;
        localStorage.setItem("currentOrderId", orderId);
        window.location.href = `http://localhost:3000/payment-confirmation?orderId=${orderId}&amount=${amount}&couponCode=${coupon}&deliveryTime=${deliveryTime}`;
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingMessage>Loading products...</LoadingMessage>;

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product._id}
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductImageSection>
              <ProductImage
                src={product.image || productImage}
                alt={product.name}
              />
              <ProductTitle>{product.name}</ProductTitle>
              <ProductPrice>₹{product.price}</ProductPrice>
              
              <OrderForm>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <InputField
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number *"
                  required
                />
                
                <InputField
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full Address *"
                  required
                />
                
                <InputField
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode *"
                  required
                />
                
                <InputField
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon Code (Optional)"
                />
                
                <BuyButton
                  onClick={() => handleOrder(product._id, product.price)}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart /> Buy Now
                    </>
                  )}
                </BuyButton>
              </OrderForm>
            </ProductImageSection>

            <ProductDetails>
              <SectionTitle>
                <FiInfo /> Product Details
              </SectionTitle>
              <ProductDescription>
                {product.description || "Premium quality product for all your needs."}
              </ProductDescription>
              
              <SectionTitle>
                <FiCheckCircle /> Key Benefits
              </SectionTitle>
              <BenefitsList>
                <BenefitItem>
                  <FiCheckCircle color="#27ae60" /> Clinically tested
                </BenefitItem>
                <BenefitItem>
                  <FiCheckCircle color="#27ae60" /> Natural ingredients
                </BenefitItem>
                <BenefitItem>
                  <FiCheckCircle color="#27ae60" /> Visible results in 4 weeks
                </BenefitItem>
                <BenefitItem>
                  <FiCheckCircle color="#27ae60" /> Suitable for all skin types
                </BenefitItem>
              </BenefitsList>
              
              <DeliveryInfo>
                <FiTruck /> Free delivery on all orders. Expected delivery in 3-5 business days.
              </DeliveryInfo>
            </ProductDetails>
          </ProductCard>
        ))
      ) : (
        <ErrorMessage>No products available at the moment.</ErrorMessage>
      )}
    </PageContainer>
  );
};

export default ProductPage;