
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    // Admin bypass is enabled, allow access
    return <>{children}</>;
  }
  
  if (!user) {
    // Store the path the user was trying to access
    localStorage.setItem('auth_redirect', location.pathname);
    // Non-logged in users should be redirected to the landing page
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  // Check if user is trying to access Create Swig Circuit page but is not a promoter
  const isCreatingSwigCircuit = window.location.pathname === '/create-bar-crawl' || 
                               window.location.pathname === '/create-swig-circuit';
  
  if (isCreatingSwigCircuit) {
    const userType = localStorage.getItem('user_type');
    if (userType !== 'promoter') {
      // Redirect non-promoters away from circuit creation
      return <Navigate to="/explore" replace />;
    }
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
  const location = useLocation();
  const storedUserType = localStorage.getItem('user_type');
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      // Store the intended destination
      localStorage.setItem('auth_redirect', location.pathname);
      // Redirect if user types don't match
      return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
    }
    
    return <>{children}</>;
  }
  
  if (!user) {
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/login" state={{ userType }} replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (storedUserType !== userType) {
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
  }
  
  return <>{children}</>;
};
