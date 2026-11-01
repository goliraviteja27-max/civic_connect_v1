import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  portal: 'citizen' | 'department';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, portal }) => {
  const location = useLocation();

  if (portal === 'citizen') {
    const user = authService.getCurrentUser();
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else if (portal === 'department') {
    const officer = authService.getCurrentOfficer();
    if (!officer) {
      return <Navigate to="/department/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
