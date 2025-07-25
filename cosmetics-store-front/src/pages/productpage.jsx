import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import productImage from "../assets/product.jpeg";
import styled from "styled-components";
import { 
  FiShoppingCart, 
  FiInfo, 
  FiCheckCircle, 
  FiTruck,
  FiDroplet,
  FiSun,
  FiPhone
} from "react-icons/fi";
import { FaHandsWash, FaRegLightbulb } from "react-icons/fa";

// Mobile-first responsive styling
const PageContainer = styled.div`
  padding: 12px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e6e8 100%);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const ProductCard = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 1100px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImageSection = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eee;
  background: linear-gradient(to bottom, #fff, #f9f9fb);

  @media (min-width: 768px) {
    flex: 1;
    border-bottom: none;
    border-right: 1px solid #eee;
    padding: 30px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 280px;
  height: auto;
  object-fit: contain;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  
  @media (min-width: 768px) {
    margin-bottom: 25px;
  }
`;

const ProductTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff69b4;
  margin-bottom: 16px;
  text-shadow: 0 1px 2px rgba(255, 105, 180, 0.2);

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 25px;
  }
`;

const OrderForm = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0;

  @media (min-width: 768px) {
    max-width: 350px;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
    outline: none;
  }

  @media (min-width: 768px) {
    padding: 14px 16px;
    margin-bottom: 14px;
  }
`;

const BuyButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #ff69b4, #ff8dc7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 105, 180, 0.4);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (min-width: 768px) {
    padding: 16px;
    gap: 10px;
  }
`;

const ProductDetails = styled.div`
  padding: 16px;
  flex: 1;
  background: #ffffff;

  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #ff69b4;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(to right, #ff69b4, #ff8dc7);
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 18px;
    gap: 10px;
    
    &:after {
      bottom: -8px;
      width: 60px;
      height: 3px;
    }
  }
`;

const ProductDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;

  @media (min-width: 768px) {
    line-height: 1.7;
    margin-bottom: 25px;
    font-size: 1.05rem;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 25px;
  }
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  color: #2d3748;
  line-height: 1.5;
  font-size: 0.95rem;

  @media (min-width: 768px) {
    gap: 12px;
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const CheckIcon = styled(FiCheckCircle)`
  color: #ff69b4;
  margin-top: 2px;
  min-width: 18px;

  @media (min-width: 768px) {
    margin-top: C3px;
    min-width: 20px;
  }
`;

const UsageSteps = styled.div`
  background: #f9f9ff;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
  }
`;

const UsageStep = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e2e8f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (min-width: 768px) {
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
`;

const StepNumber = styled.div`
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #ff69b4, #ff8dc7);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(255, 105, 180, 0.3);

  @media (min-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
`;

const StepContent = styled.div``;

const StepTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2d3748;

  @media (min-width: 768px) {
    margin: 0 0 6px 0;
    font-size: 1.1rem;
    gap: 8px;
  }
`;

const StepDescription = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const DeliveryInfo = styled.div`
  background: linear-gradient(to right, #e6f7ff, #f0f8ff);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    padding: 16px;
    gap: 12px;
    margin-top: 20px;
    font-size: 1rem;
  }
`;

const ConsultationHighlight = styled(motion.div)`
  background: linear-gradient(to right, #fff9f0, #fff4e6);
  border-left: 3px solid #ff69b4;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    border-left: 4px solid #ff69b4;
    padding: 20px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const ConsultationText = styled.p`
  color: #4a5568;
  line-height: 1.5;
  margin: 0;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  @media (min-width: 768px) {
    line-height: 1.7;
    font-size: 1.05rem;
    gap: 12px;
  }
`;

const PhoneNumber = styled.span`
  font-weight: bold;
  color: #ff69b4;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-bottom: 12px;
  text-align: center;
  padding: 8px;
  background-color: #fff5f5;
  border-radius: 6px;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 0.95rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #4a5568;

  @media (min-width: 768px) {
    padding: 60px;
    font-size: 1.2rem;
  }
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #4a5568;
  font-size: 1.1rem;

  @media (min-width: 768px) {
    padding: 60px;
    font-size: 1.2rem;
  }
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
      setError("Please fill in all required fields");
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
      setError("User authentication failed");
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(
        "/payments/phonepe/initiate",
        {
          amount,
          userId,
          phone,
          address,
          pincode,
          couponCode: coupon,
          deliveryTime: "3-5 business days",
          products: [{ productId, quantity: 1 }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        setError("Payment initiation failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const pulseAnimation = {
    scale: [1, 1.01, 1],
    boxShadow: [
      "0 3px 10px rgba(0, 0, 0, 0.05)",
      "0 6px 20px rgba(255, 105, 180, 0.15)",
      "0 3px 10px rgba(0, 0, 0, 0.05)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  };

  if (loading) return <LoadingContainer>Loading your skincare products...</LoadingContainer>;

  if (error) return (
    <ErrorMessage style={{
      padding: '30px',
      margin: '20px',
      fontSize: '1.1rem'
    }}>
      {error}
    </ErrorMessage>
  );

  return (
    <PageContainer>
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductImageSection>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <ProductImage
                  src={product.image || productImage}
                  alt={product.name}
                />
              </motion.div>
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

                <motion.div
                  whileTap={{ scale: 0.98 }}
                >
                  <BuyButton
                    onClick={() => handleOrder(product._id, product.price)}
                    disabled={processing}
                  >
                    <FiShoppingCart size={18} />
                    {processing ? "Processing..." : "Buy Now"}
                  </BuyButton>
                </motion.div>
              </OrderForm>
            </ProductImageSection>

            <ProductDetails>
              <SectionTitle>
                <FiInfo /> Product Details
              </SectionTitle>
              <ProductDescription>
                Our premium 3-step skincare system includes a gentle cleanser, 
                hydrating serum, and protective sunscreen for complete daily care.
                Specially formulated to address multiple skin concerns.
              </ProductDescription>

              <UsageSteps>
                <UsageStep>
                  <StepNumber>1</StepNumber>
                  <StepContent>
                    <StepTitle>
                      <FaHandsWash /> Facewash
                    </StepTitle>
                    <StepDescription>
                      Gently wash your face with our facewash 3 times a day to remove impurities.
                    </StepDescription>
                  </StepContent>
                </UsageStep>

                <UsageStep>
                  <StepNumber>2</StepNumber>
                  <StepContent>
                    <StepTitle>
                      <FiDroplet /> Serum
                    </StepTitle>
                    <StepDescription>
                      Apply serum to hydrate and nourish 2 times a day for best results.
                    </StepDescription>
                  </StepContent>
                </UsageStep>

                <UsageStep>
                  <StepNumber>3</StepNumber>
                  <StepContent>
                    <StepTitle>
                      <FiSun /> MOISTURIZER WITH SPF-50
                    </StepTitle>
                    <StepDescription>
                      Finish with sunscreen to shield from UV damage 4 times a day for protection.
                    </StepDescription>
                  </StepContent>
                </UsageStep>
              </UsageSteps>

              <ConsultationHighlight
                animate={pulseAnimation}
              >
                <ConsultationText>
                  <FaRegLightbulb size={20} color="#ff69b4" />
                  <span>
                    <strong>Personalized skincare consultation:</strong> Share your skin details with our experts at <PhoneNumber>7875889314</PhoneNumber> for a customized skincare regimen tailored to your needs!
                  </span>
                </ConsultationText>
              </ConsultationHighlight>

              <SectionTitle>
                <FiCheckCircle /> Important Information
              </SectionTitle>
              <BenefitsList>
                <BenefitItem>
                  <CheckIcon size={18} />
                  If you wish to cancel your order and receive a fast refund, please cancel it within 24 hours. 
                  If already shipped, refund takes 7-8 business days.
                </BenefitItem>
                <BenefitItem>
                  <CheckIcon size={18} />
                  Our products are formulated with premium ingredients suitable for most skin types.
                </BenefitItem>
                <BenefitItem>
                  <CheckIcon size={18} />
                  Regular use is key to achieving optimal results. Most see improvements within 2-3 weeks.
                </BenefitItem>
              </BenefitsList>

              <DeliveryInfo>
                <FiTruck size={16} /> Delivery in 3-5 business days               </DeliveryInfo>
            </ProductDetails>
          </ProductCard>
        ))
      ) : (
        <EmptyStateContainer>
          No products available at the moment. Please check back later.
        </EmptyStateContainer>
      )}
    </PageContainer>
  );
};

export default ProductPage;