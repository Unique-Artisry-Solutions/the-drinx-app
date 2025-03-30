
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

export const TypedProtectedRoute = ({ 
  userType, 
  children 
}: { 
  userType: 'individual' | 'establishment', 
  children: React.ReactNode 
}) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const storedUserType = localStorage.getItem('user_type');
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (storedUserType !== userType) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
