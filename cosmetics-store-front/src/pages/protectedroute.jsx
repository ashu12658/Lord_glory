import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, agent, admin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check admin access first
  if (allowedRoles.includes("admin")) {
    if (!admin) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  // Then check agent access
  if (allowedRoles.includes("agent")) {
    if (!agent) {
      return <Navigate to="/agent/login" replace />;
    }
    return children;
  }

  // Finally check regular user access
  if (!user && !agent && !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
