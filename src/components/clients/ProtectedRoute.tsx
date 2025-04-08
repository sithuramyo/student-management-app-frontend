import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isLoggedIn = !!Cookies.get("authToken");
  const userRole = user?.typ || "";

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const isAllowUser = allowedRoles.includes(userRole)
  return isAllowUser ? (
    <>{children}</>
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default ProtectedRoute;
