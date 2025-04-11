
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    // Admin bypass is enabled, allow access
    return <>{children}</>;
  }
  
  if (!user) {
    // Non-logged in users should be redirected to the landing page
    return <Navigate to="/landing" replace />;
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
  userType: 'individual' | 'establishment' | 'promoter', 
  children: React.ReactNode 
}) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const storedUserType = localStorage.getItem('user_type');
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      // Redirect if user types don't match
      return <Navigate to="/landing" replace />;
    }
    
    return <>{children}</>;
  }
  
  if (!user) {
    return <Navigate to="/landing" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (storedUserType !== userType) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
};

// New route specifically for Swig Circuit creation that restricts to promoter users
export const SwigCircuitCreationRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const userType = localStorage.getItem('user_type');
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Allow access only for promoter accounts or admin bypass as promoter
  if ((user && userType === 'promoter') || (isAdminBypass && userType === 'promoter')) {
    return <>{children}</>;
  }
  
  // Redirect individual users to explore page with a message
  localStorage.setItem('redirect_message', 'Only promoter accounts can create Swig Circuits');
  return <Navigate to="/explore" replace />;
};
