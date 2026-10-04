import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const currentUser = authApi.getCurrentUser();

  // 1. If not authenticated at all -> redirect to dedicated Admin Login
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // 2. If authenticated as Customer -> route to Customer Dashboard
  if (currentUser.role === 'customer') {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // 3. If authenticated as Freelancer -> route to Freelancer Dashboard
  if (currentUser.role === 'freelancer') {
    return <Navigate to="/freelancer/dashboard" replace />;
  }

  // 4. If authenticated as Admin -> render protected console
  if (currentUser.role === 'admin') {
    return <>{children}</>;
  }

  return <Navigate to="/admin/login" replace />;
};
