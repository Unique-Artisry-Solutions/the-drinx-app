
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { PageSuspense } from "@/components/loading/PageSuspense";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  requiredRoles = [] 
}) => {
  const { user, isLoading } = useAuth();
  const userRole = localStorage.getItem('user_type');
  
  if (isLoading) {
    return <PageSuspense fallback={<div>Loading authentication...</div>}>{null}</PageSuspense>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole || '')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{element}</>;
};

export const PublicRoute: React.FC<{ element: React.ReactNode; redirectIfAuthenticated?: boolean }> = ({ 
  element, 
  redirectIfAuthenticated = false 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageSuspense fallback={<div>Loading authentication...</div>}>{null}</PageSuspense>;
  }
  
  if (redirectIfAuthenticated && user) {
    return <Navigate to="/profile" />;
  }
  
  return <>{element}</>;
};
