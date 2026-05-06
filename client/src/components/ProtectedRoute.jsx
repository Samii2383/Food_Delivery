import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (Array.isArray(roles) && roles.length > 0) {
    const role = user?.role;
    if (!role || !roles.includes(role)) return <Navigate to="/" replace />;
  }
  return children;
}

