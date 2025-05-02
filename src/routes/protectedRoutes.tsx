
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  // Debug logging for route protection
  useEffect(() => {
    console.log("[PROTECTED ROUTE] Auth check", { 
      path: location.pathname, 
      isLoading, 
      hasUser: !!user, 
      isEmailVerified,
      isAdminBypass,
      userType: localStorage.getItem('user_type')
    });
  }, [isLoading, user, isEmailVerified, isAdminBypass, location.pathname]);
  
  if (isLoading) {
    console.log("[PROTECTED ROUTE] Still loading auth state");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log("[PROTECTED ROUTE] Admin bypass enabled, allowing access");
    // Admin bypass is enabled, allow access
    return <>{children}</>;
  }
  
  if (!user) {
    console.log("[PROTECTED ROUTE] No authenticated user, redirecting to login");
    // Store the path the user was trying to access
    localStorage.setItem('auth_redirect', location.pathname);
    // Non-logged in users should be redirected to the login page
    return <Navigate to="/login" />;
  }
  
  if (!isEmailVerified) {
    console.log("[PROTECTED ROUTE] Email not verified, redirecting to verification page");
    return <Navigate to="/verify-email" />;
  }
  
  // Check if user is trying to access Create Swig Circuit page but is not a promoter
  const isCreatingSwigCircuit = window.location.pathname === '/create-bar-crawl' || 
                               window.location.pathname === '/create-swig-circuit';
  
  if (isCreatingSwigCircuit) {
    const userType = localStorage.getItem('user_type');
    console.log("[PROTECTED ROUTE] Checking swig circuit access, user type:", userType);
    
    if (userType !== 'promoter') {
      console.log("[PROTECTED ROUTE] Non-promoter attempting to access swig circuit creation, redirecting");
      // Redirect non-promoters away from circuit creation
      return <Navigate to="/explore" />;
    }
  }
  
  console.log("[PROTECTED ROUTE] Access granted");
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const userType = localStorage.getItem('user_type');
  
  useEffect(() => {
    console.log("[ADMIN ROUTE] Auth state:", { 
      isAdminAuthenticated, 
      isAdminBypass,
      userType 
    });
  }, [isAdminAuthenticated, isAdminBypass, userType]);
  
  // Allow access if admin authenticated or admin bypass with userType=admin
  if (isAdminAuthenticated || (isAdminBypass && userType === 'admin')) {
    console.log("[ADMIN ROUTE] Admin authentication verified, allowing access");
    return <>{children}</>;
  }
  
  console.log("[ADMIN ROUTE] Not authenticated as admin, redirecting");
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
  
  // Debug logging
  useEffect(() => {
    console.log("[TYPED ROUTE] Auth check", { 
      path: location.pathname,
      isLoading, 
      hasUser: !!user, 
      isEmailVerified,
      isAdminBypass,
      storedUserType,
      requiredType: userType,
      typesMatch: storedUserType === userType
    });
  }, [isLoading, user, isEmailVerified, isAdminBypass, storedUserType, userType, location.pathname]);
  
  if (isLoading) {
    console.log("[TYPED ROUTE] Still loading auth state");
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log("[TYPED ROUTE] Admin bypass active");
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      console.log("[TYPED ROUTE] Admin bypass type mismatch, redirecting");
      // Store the intended destination
      localStorage.setItem('auth_redirect', location.pathname);
      // Redirect if user types don't match
      return <Navigate to="/login" state={{ userType, message: `You need a ${userType} account to access this page` }} />;
    }
    
    console.log("[TYPED ROUTE] Admin bypass type matches, allowing access");
    return <>{children}</>;
  }
  
  if (!user) {
    console.log("[TYPED ROUTE] No authenticated user, redirecting to login");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/login" state={{ userType }} />;
  }
  
  if (!isEmailVerified) {
    console.log("[TYPED ROUTE] Email not verified, redirecting to verification page");
    return <Navigate to="/verify-email" />;
  }
  
  if (storedUserType !== userType) {
    console.log("[TYPED ROUTE] User type mismatch, redirecting");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/login" state={{ userType, message: `You need a ${userType} account to access this page` }} />;
  }
  
  console.log("[TYPED ROUTE] Access granted");
  return <>{children}</>;
};
