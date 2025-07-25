import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import AgentLoginPage from "./pages/agentlogin";
import Home from "./pages/home";
import AdminDashboard from "./pages/dashboard";
import AgentDashboard from "./pages/agentdashboard";
import SkinCareForm from "./component/SkinCareForm";
import ProtectedRoute from "./pages/protectedroute";
import ProductPage from "./pages/productpage";
import 'bootstrap/dist/css/bootstrap.min.css';
import AgentBalance from "./component/agentBalance";
import AdminLogin from "./pages/adminLogin";
import Register from "./pages/Register";
import OrderPage from "./pages/orderpage";
import PaymentConfirmation from './component/paymentConfirmation';
import ForgotPassword from "./component/forgotPassword";
import ReviewComponent from "./component/reviewComponent";
import OrderForm from "./component/orderForm";
import AgentOrderForm from "./component/orderProduct";
import OrderTrackingUpdate from "./component/ordertracking";
import Policies from  "../src/pages/style/privacypolics";
import AboutUs from "../src/pages/aboutuspage";
import Term from "./pages/termandcondition";
import ShippingReturnRefund from "./pages/returnrefund";
import HomeReviews from "./component/homeReviews";
import HomeReview from "./component/homeReviews";
import AgentOrders from "./component/agentOrder";
import AgentCoupenOrders from "./component/agentcoupenorder";
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/agent/login" element={<AgentLoginPage />} />
          <Route path="/Products" element={<ProductPage />} />
          <Route path="/agent-balance/:agentId" element={<AgentBalance />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/review-form" element={<ReviewComponent />} />
          <Route path="/home-reviews" element={<HomeReview />} />
          <Route path="/orderForm"  element={<OrderForm />} />
          <Route path="/skin-care-form" element={<SkinCareForm />} />
          <Route path="/agent-form" element={<AgentOrderForm />} />
          <Route path="/order-tracking" element={<OrderTrackingUpdate />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/term" element={<Term />} />
          <Route path="coupen-orders" element={<AgentCoupenOrders />} />
              {/* Protected admin route */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skincare-form"
            element={
              <ProtectedRoute>
                <SkinCareForm />
              </ProtectedRoute>
            }
          />
          <Route path="/reviews/:productId" element={<ProtectedRoute><ReviewComponent /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
