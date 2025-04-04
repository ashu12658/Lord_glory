import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, agent, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Show loading while checking auth
  }

  // Redirect to the correct login page if neither user nor agent is logged in
  if (!user && !agent) {
    const loginPath = allowedRoles.includes("admin")
      ? "/admin-login"
      : allowedRoles.includes("agent")
      ? "/agents/login"
      : "/login"; // fallback for normal users
    return <Navigate to={loginPath} replace />;
  }

  // Check if logged-in user's role is allowed
  const userRole = user?.role || agent?.role;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to the correct dashboard based on role
    const redirectPath = userRole === "admin"
      ? "/admin-dashboard"
      : userRole === "agent"
      ? "/agent-dashboard"
      : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
