
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user, 
      isEmailVerified,
      isAdminBypass,
      path: location.pathname
    });
  }, [isLoading, user, isEmailVerified, isAdminBypass, location.pathname]);
  
  if (isLoading) {
    console.log("ProtectedRoute - Still loading auth state");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log("ProtectedRoute - Admin bypass enabled, allowing access");
    // Admin bypass is enabled, allow access
    return <>{children}</>;
  }
  
  if (!user) {
    console.log("ProtectedRoute - No authenticated user, redirecting to login");
    // Store the path the user was trying to access
    localStorage.setItem('auth_redirect', location.pathname);
    // Non-logged in users should be redirected to the landing page
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    console.log("ProtectedRoute - Email not verified, redirecting to verification page");
    return <Navigate to="/verify-email" replace />;
  }
  
  // Check if user is trying to access Create Swig Circuit page but is not a promoter
  const isCreatingSwigCircuit = window.location.pathname === '/create-bar-crawl' || 
                               window.location.pathname === '/create-swig-circuit';
  
  if (isCreatingSwigCircuit) {
    const userType = localStorage.getItem('user_type');
    console.log("ProtectedRoute - Checking swig circuit access, user type:", userType);
    
    if (userType !== 'promoter') {
      console.log("ProtectedRoute - Non-promoter attempting to access swig circuit creation, redirecting");
      // Redirect non-promoters away from circuit creation
      return <Navigate to="/explore" replace />;
    }
  }
  
  console.log("ProtectedRoute - Access granted");
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const userType = localStorage.getItem('user_type');
  
  useEffect(() => {
    console.log("AdminRoute - Auth state:", { 
      isAdminAuthenticated, 
      isAdminBypass,
      userType 
    });
  }, [isAdminAuthenticated, isAdminBypass, userType]);
  
  // Allow access if admin authenticated or admin bypass with userType=admin
  if (isAdminAuthenticated || (isAdminBypass && userType === 'admin')) {
    console.log("AdminRoute - Admin authentication verified, allowing access");
    return <>{children}</>;
  }
  
  console.log("AdminRoute - Not authenticated as admin, redirecting");
  return <Navigate to="/admin" replace />;
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
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("TypedProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user, 
      isEmailVerified,
      isAdminBypass,
      storedUserType,
      requiredType: userType,
      path: location.pathname,
      typesMatch: storedUserType === userType
    });
  }, [isLoading, user, isEmailVerified, isAdminBypass, storedUserType, userType, location.pathname]);
  
  if (isLoading) {
    console.log("TypedProtectedRoute - Still loading auth state");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log("TypedProtectedRoute - Admin bypass active");
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      console.log("TypedProtectedRoute - Admin bypass type mismatch, redirecting");
      // Store the intended destination
      localStorage.setItem('auth_redirect', location.pathname);
      // Redirect if user types don't match
      return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
    }
    
    console.log("TypedProtectedRoute - Admin bypass type matches, allowing access");
    return <>{children}</>;
  }
  
  if (!user) {
    console.log("TypedProtectedRoute - No authenticated user, redirecting to login");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/login" state={{ userType }} replace />;
  }
  
  if (!isEmailVerified) {
    console.log("TypedProtectedRoute - Email not verified, redirecting to verification page");
    return <Navigate to="/verify-email" replace />;
  }
  
  if (storedUserType !== userType) {
    console.log("TypedProtectedRoute - User type mismatch, redirecting");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
  }
  
  console.log("TypedProtectedRoute - Access granted");
  return <>{children}</>;
};
