import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/auth/authSlice.js";

export default function AdminRoute() {
  const { user } = useSelector(selectAuth);
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

