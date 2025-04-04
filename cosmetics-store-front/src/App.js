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
          <Route path="/reviews/:productId" element={<ReviewComponent/>}/>
          <Route path="/product/:productId/reviews" element={<ReviewComponent />} />
          <Route path="/orderForm"  element={<OrderForm />} />
          <Route path="/skin-care-form" element={<SkinCareForm />} />

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
