import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!loading && !user) openLogin("user");
  }, [loading, openLogin, user]);

  if (loading) return <div className="page-loader"><img src="/logo.svg" alt="" /><span>Loading properties...</span></div>;
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

