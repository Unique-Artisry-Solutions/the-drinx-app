
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { checkAdminBypassStatus } from '@/utils/adminBypass';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { isEnabled: isAdminBypass } = checkAdminBypassStatus();
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user, 
      isAdminBypass,
      path: location.pathname
    });
  }, [isLoading, user, isAdminBypass, location.pathname]);
  
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
  
  // Check if user is trying to access Create Swig Circuit page but is not a promoter
  const isCreatingSwigCircuit = location.pathname === '/create-bar-crawl' || 
                               location.pathname === '/create-swig-circuit';
  
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
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { isEnabled: isAdminBypass, userType } = checkAdminBypassStatus();
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  useEffect(() => {
    console.log("AdminRoute - Auth state:", { 
      isAdminAuthenticated, 
      isAdminBypass,
      userType,
      path: location.pathname,
      isLoading,
      hasUser: !!user
    });
  }, [isAdminAuthenticated, isAdminBypass, userType, location.pathname, isLoading, user]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Allow access if admin authenticated or admin bypass with userType=admin
  if (isAdminAuthenticated || (isAdminBypass && userType === 'admin')) {
    console.log("AdminRoute - Admin authentication verified, allowing access");
    return <>{children}</>;
  }
  
  console.log("AdminRoute - Not authenticated as admin, redirecting");
  // Store the intended destination for after login
  localStorage.setItem('auth_redirect', location.pathname);
  return <Navigate to="/admin" replace />;
};

export const TypedProtectedRoute = ({ 
  userType, 
  children 
}: { 
  userType: 'individual' | 'establishment' | 'promoter', 
  children: React.ReactNode 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { isEnabled: isAdminBypass } = checkAdminBypassStatus();
  const storedUserType = localStorage.getItem('user_type');
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("TypedProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user, 
      isAdminBypass,
      storedUserType,
      requiredType: userType,
      path: location.pathname,
      typesMatch: storedUserType === userType
    });
  }, [isLoading, user, isAdminBypass, storedUserType, userType, location.pathname]);
  
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
  
  if (storedUserType !== userType) {
    console.log("TypedProtectedRoute - User type mismatch, redirecting");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
  }
  
  console.log("TypedProtectedRoute - Access granted");
  return <>{children}</>;
};
